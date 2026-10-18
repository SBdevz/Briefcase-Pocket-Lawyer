import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const groq = new OpenAI({
  apiKey: process.env.BEN_AI,
  baseURL: "https://api.groq.com/openai/v1",
});

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
    const { userQuestion } = req.body;
    const asksAboutLegislation = /\b(bill|congress|legislation|hr\s*\d+|s\.\s*\d+|public law|act of congress)\b/i.test(userQuestion);
    const asksForLatestPassedBill = /\b(latest|most recent|newest|last)\b[\s\S]{0,60}\b(bill|legislation)\b[\s\S]{0,60}\b(pass(?:ed|age))\b|\b(pass(?:ed|age))\b[\s\S]{0,60}\b(latest|most recent|newest|last)\b[\s\S]{0,60}\b(bill|legislation)\b/i.test(userQuestion);

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
            params: { jurisdiction: state, page, per_page: 20, sort: "updated_at", order: "desc" },
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
        const answer = `The latest bill I found passed in ${state} is ${bill.identifier}: ${bill.title}. Its recorded passage action was on ${latest.date}: ${latest.description}.${sourceUrl ? `\n\nSource: ${sourceUrl}` : ""}`;
        return res.json({ answer });
      } catch (error) {
        console.error("OpenStates lookup error:", error.response?.data || error.message);
        return res.json({ answer: `I couldn't retrieve current bill records for ${state} from OpenStates just now. Please try again shortly.` });
      }
    }

    let officialGovernmentData = "";
    if (asksAboutLegislation) {
      const congressUrl = `https://api.congress.gov/v3/bill/119/hr/1?api_key=${process.env.CONGRESS_GOV}&format=json`;
      const congressRes = await axios.get(congressUrl).catch(() => ({ data: { note: "Congress data unavailable." } }));

      const govInfoUrl = `https://api.govinfo.gov/published/2026-01-01/2026-10-17?collection=BILLS&pageSize=3&api_key=${process.env.GOV_INFO}`;
      const govInfoRes = await axios.get(govInfoUrl).catch(() => ({ data: { note: "GovInfo data unavailable." } }));

      const openStateUrl = `https://api.openstates.org/v1/bills?jurisdiction=us&search_window=session&search_window=session&apikey=${process.env.OPEN_STATE}`;
      const openStateRes = await axios.get(openStateUrl).catch(() => ({ data: { note: "Open States data unavailable." } }));

      officialGovernmentData = `
--- CONGRESS INFO ---
${JSON.stringify(congressRes.data, null, 2)}

--- GOVINFO OFFICIAL DATA ---
${JSON.stringify(govInfoRes.data, null, 2)}

--- OPEN STATES DATA ---
${JSON.stringify(openStateRes.data, null, 2)}
      `;
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are Ben, a friendly legal-information assistant who helps users understand law, government, legislation, and legal concepts. Answer questions about legal topics directly using your general knowledge when the supplied official records do not contain the answer. Use official government data as the primary source only when it is relevant to the question; the included bill records are not necessarily related to the user's question. Never say a legal question is outside your expertise merely because the supplied records do not cover it. When the answer depends on jurisdiction, ask which jurisdiction applies or clearly state the jurisdiction you are discussing. If the user requests info for a specific jurisdiction, instesd of guiding them into finding it, provide the information directly. The only exception from this is that if they request local city or district information, mention that local city info is not avalible at this time. Explain uncertainty and distinguish general legal information from advice about a person's specific circumstances. For clearly unrelated questions, respond randomly with one of the following: I'd love to chat about that, but I specialize in law and government! Got any legal or policy questions I can help with?, That's a bit outside my wheelhouse—I focus on law and government. What legal concepts can I break down for you today?, Sounds interesting, but I'm built to help with law, government, and legislation. Is there a legal topic you'd like to explore?, Wish I could help, but my expertise is strictly in law and government. What legal or government questions do you have for me?, I have to stick to my strengths, which are law and public policy! Feel free to ask if you have a legal question., That's outside my playground! I focus on helping people understand the law. What legal or government topic can I look up for you?. Respond warmly to greetings and casual chat. Keep answers concise but complete, and use readable plain text with bullets when helpful. Keep your responses as most possibly short as possible while also providing the user with all the info they need or asked for."
        },
        {
          role: "user",
          content: officialGovernmentData
            ? `User question: ${userQuestion}\n\nSupplementary official government records (use only if relevant):\n${officialGovernmentData}`
            : userQuestion
        }
      ],
    });

    const aiAnswer = completion.choices[0].message.content;
    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Processing Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend live on http://localhost:${PORT}`);
});