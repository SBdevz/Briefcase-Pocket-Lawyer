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
          content: "You are Ben, a friendly legal-information assistant who helps users understand law, government, legislation, and legal concepts. Answer questions about legal topics directly using your general knowledge when the supplied official records do not contain the answer. Use official government data as the primary source only when it is relevant to the question; the included bill records are not necessarily related to the user's question. Never say a legal question is outside your expertise merely because the supplied records do not cover it. When the answer depends on jurisdiction, ask which jurisdiction applies or clearly state the jurisdiction you are discussing. Explain uncertainty and distinguish general legal information from advice about a person's specific circumstances. For clearly unrelated questions, briefly say you focus on law and government, then invite a legal question. Respond warmly to greetings and casual chat. Keep answers concise but complete, and use readable plain text with bullets when helpful."
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