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

app.post("/api/Ben-AI", async (req, res) => {
  try {
    const { userQuestion } = req.body;
    const asksAboutLegislation = /\b(bill|congress|legislation|hr\s*\d+|s\.\s*\d+|public law|act of congress)\b/i.test(userQuestion);

    let officialGovernmentData = "";
    if (asksAboutLegislation) {
      const congressUrl = `https://api.congress.gov/v3/bill/119/hr/1?api_key=${process.env.CONGRESS_GOV}&format=json`;
      const congressRes = await axios.get(congressUrl).catch(() => ({ data: { note: "Congress data unavailable." } }));

      const govInfoUrl = `https://api.govinfo.gov/published/2026-01-01/2026-10-17?collection=BILLS&pageSize=3&api_key=${process.env.GOV_INFO}`;
      const govInfoRes = await axios.get(govInfoUrl).catch(() => ({ data: { note: "GovInfo data unavailable." } }));

      officialGovernmentData = `
--- REFERENCE DATA ---
${JSON.stringify(congressRes.data, null, 2)}

--- GOVINFO OFFICIAL DATA ---
${JSON.stringify(govInfoRes.data, null, 2)}
      `;
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are Ben, a friendly legal-information assistant who helps users understand law, government, legislation, and legal concepts. Answer questions about legal topics directly using your general knowledge when the supplied official records do not contain the answer. Use official government data as the primary source only when it is relevant to the question; the included bill records are not necessarily related to the user's question. Never say a legal question is outside your expertise merely because the supplied records do not cover it. When the answer depends on jurisdiction, ask which jurisdiction applies or clearly state the jurisdiction you are discussing. Explain uncertainty and distinguish general legal information from advice about a person's specific circumstances. For clearly unrelated questions, respond randomly with one of the following: I'd love to chat about that, but I specialize in law and government! Got any legal or policy questions I can help with?, That's a bit outside my wheelhouse—I focus on law and government. What legal concepts can I break down for you today?, Sounds interesting, but I'm built to help with law, government, and legislation. Is there a legal topic you'd like to explore?, Wish I could help, but my expertise is strictly in law and government. What legal or government questions do you have for me?, I have to stick to my strengths, which are law and public policy! Feel free to ask if you have a legal question., That's outside my playground! I focus on helping people understand the law. What legal or government topic can I look up for you?. Respond warmly to greetings and casual chat. Keep answers concise but complete, and use readable plain text with bullets when helpful. Keep your responses as most possibly short as possible while also providing the user with all the info they need or asked for."
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