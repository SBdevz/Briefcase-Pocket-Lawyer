import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function requireUser(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Supabase server credentials are not configured.' });
  }

  try {
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: { user }, error } = await userSupabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Your session is invalid or expired.' });

    req.user = user;
    req.userSupabase = userSupabase;
    next();
  } catch {
    res.status(401).json({ error: 'Unable to verify your session.' });
  }
}

app.get('/api/chat-histories', requireUser, async (req, res) => {
  const { data, error } = await req.userSupabase
    .from('chat_histories')
    .select('id, title, messages, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Unable to load saved chats.' });
  res.json({ chats: data });
});

app.post('/api/chat-histories', requireUser, async (req, res) => {
  const { title, messages } = req.body;
  if (typeof title !== 'string' || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'A title and at least one message are required.' });
  }

  const { data, error } = await req.userSupabase
    .from('chat_histories')
    .insert({ user_id: req.user.id, title: title.slice(0, 60), messages })
    .select('id, title, messages, created_at')
    .single();

  if (error) return res.status(500).json({ error: 'Unable to save this chat.' });
  res.status(201).json({ chat: data });
});

app.patch('/api/chat-histories/:id', requireUser, async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'At least one message is required.' });
  }

  const { data, error } = await req.userSupabase
    .from('chat_histories')
    .update({ messages })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select('id, title, messages, created_at')
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Unable to update this chat.' });
  if (!data) return res.status(404).json({ error: 'Saved chat not found.' });
  res.json({ chat: data });
});

const openai = process.env.BEN_AI
  ? new OpenAI({ apiKey: process.env.BEN_AI })
  : null;

const stateNames = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};
function getStateFromQuestion(question) {
  const state = Object.values(stateNames)
    .sort((left, right) => right.length - left.length)
    .find((name) => new RegExp(`\\b${name}\\b`, "i").test(question));
  if (state) return state;

  const abbreviation = question.match(/\b(?:in|of|for|from)\s+([A-Z]{2})\b/);
  return abbreviation ? stateNames[abbreviation[1]] : undefined;
}

function getPassageActions(bill) {
  return (bill.actions || [])
    .filter((action) => {
      const classifications = Array.isArray(action.classification) ? action.classification : [];
      return classifications.some((item) => /passage/i.test(item))
        && /pass(?:ed|age)/i.test(action.description || "");
    })
    .map((action) => ({ ...action, bill }));
}


app.post("/api/Ben-AI", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'Ben AI is not configured on the server.' });
    }

    const { userQuestion } = req.body;
    const asksAboutLegislation = /\b(bill|congress|legislation|hr\s*\d+|s\.\s*\d+|public law|act of congress)\b/i.test(userQuestion);
    const asksForLatestPassedBill = /\b(latest|most recent|newest|last)\b[\s\(\S\)]{0,60}\b(bill|legislation)\b[\s\(\S\)]{0,60}\b(pass(?:ed|age))\b|\b(pass(?:ed|age))\b[\s\(\S\)]{0,60}\b(latest|most recent|newest|last)\b[\s\(\S\)]{0,60}\b(bill|legislation)\b/i.test(userQuestion);

    if (asksForLatestPassedBill) {
      const state = getStateFromQuestion(userQuestion);
      if (!state) return res.json({ answer: "Which state should I check?" });
      if (!process.env.OPEN_STATE) {
        return res.json({ answer: "I can't look up state bills right now because the OpenStates API key is not configured." });
      }

      try {
        const passageActions = [];
        for (let page = 1; page <= 5; page += 1) {
          const openStatesRes = await axios.get("https://v3.openstates.org/bills", {
            params: { jurisdiction: state, page, per_page: 20, sort: "latest_action_desc", include: ["actions", "sources"] },
            headers: { "X-API-KEY": process.env.OPEN_STATE },
          });
          const bills = openStatesRes.data.results || [];
          passageActions.push(...bills.flatMap(getPassageActions));
          if (bills.length < 20) break;
        }

        passageActions.sort((left, right) => new Date(right.date) - new Date(left.date));
        const latest = passageActions[0];
        if (!latest) {
          return res.json({ answer: `I couldn't find a bill with a recorded passage action in the recent OpenStates results for ${state}.` });
        }

        const bill = latest.bill;
        const sourceUrl = bill.sources?.[0]?.url;
        const answer = `The latest bill I found passed in ${state} is ${bill.identifier}: ${bill.title}. Its recorded passage action was on ${latest.date}: ${latest.description}.${sourceUrl ? `\n\nSource: \${sourceUrl}` : ""}`;
        return res.json({ answer });
      } catch (error) {
        console.error("OpenStates lookup error:", error.response?.data || error.message);
        return res.json({ answer: `I couldn't retrieve current bill records for ${state} from OpenStates just now.` });
      }
    }

    let officialGovernmentData = "";
    if (asksAboutLegislation) {
      const congressUrl = "https://api.congress.gov/v3/bill";
      const congressRes = await axios.get(congressUrl, {
        params: { api_key: process.env.CONGRESS_GOV, format: "json" },
      }).catch(() => ({ data: { note: "Congress data unavailable." } }));

      const govInfoUrl = "https://api.govinfo.gov/search";
      const govInfoRes = await axios.post(govInfoUrl, {
        query: `collection:BILLS ${userQuestion}`,
        pageSize: "5",
        offsetMark: "*",
        sorts: [{ field: "score", sortOrder: "DESC" }],
      }, {
        params: { api_key: process.env.GOV_INFO },
      }).catch(() => ({ data: { note: "GovInfo data unavailable." } }));

      const state = getStateFromQuestion(userQuestion);
      const openStateRes = state && process.env.OPEN_STATE
        ? await axios.get("https://v3.openstates.org/bills", {
          params: { jurisdiction: state, per_page: 5, sort: "latest_action_desc", include: ["actions", "sources"] },
          headers: { "X-API-KEY": process.env.OPEN_STATE },
        }).catch(() => ({ data: { note: "Open States data unavailable." } }))
        : { data: { note: state ? "Open States API key is not configured." : "No state specified." } };

      officialGovernmentData = `
--- CONGRESS INFO ---
${JSON.stringify(congressRes.data, null, 2)}

--- GOVINFO OFFICIAL DATA ---
${JSON.stringify(govInfoRes.data, null, 2)}

--- OPEN STATES DATA ---
${JSON.stringify(openStateRes.data, null, 2)}
      `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Ben, a friendly legal-information assistant who helps users understand law, government, legislation, and legal concepts. Your full name is Benjamin Franklin, a founding father of the United States. You were born in January 15, 1706. Answer questions about legal topics directly using your general knowledge when the supplied official records do not contain the answer. Use official government data as the primary source only when it is relevant to the question; the included bill records are not necessarily related to the user's question. Never say a legal question is outside your expertise merely because the supplied records do not cover it. When the answer depends on jurisdiction, ask which jurisdiction applies or clearly state the jurisdiction you are discussing. If the user requests info for a specific jurisdiction, instesd of guiding them into finding it, provide the information directly. The only exception from this is that if they request local city or district information, mention that local city info is not avalible at this time. Explain uncertainty and distinguish general legal information from advice about a person's specific circumstances. For clearly unrelated questions, respond randomly with one of the following: I'd love to chat about that, but I specialize in law and government! Got any legal or policy questions I can help with?, That's a bit outside my wheelhouse—I focus on law and government. What legal concepts can I break down for you today?, Sounds interesting, but I'm built to help with law, government, and legislation. Is there a legal topic you'd like to explore?, Wish I could help, but my expertise is strictly in law and government. What legal or government questions do you have for me?, I have to stick to my strengths, which are law and public policy! Feel free to ask if you have a legal question., That's outside my playground! I focus on helping people understand the law. What legal or government topic can I look up for you?. Respond warmly to greetings and casual chat. Keep answers concise but complete, and use readable plain text with bullets when helpful. Keep your responses as most possibly short as possible while also providing the user with all the info they need or asked for."
        },
        {
          role: "user",
          content: officialGovernmentData
            ? `User question: ${userQuestion}\n\nSupplementary official government records:\n${officialGovernmentData}`
            : userQuestion
        }
      ],
    });

    const aiAnswer = completion.choices[0].message.content;
    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("Backend Runtime Error:", error);
    res.status(500).json({ error: "Processing Error" });
  }
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend live on http://localhost:${PORT}`);
  });
}
