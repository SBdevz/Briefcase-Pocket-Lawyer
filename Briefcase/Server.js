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

    const congressUrl = `https://api.congress.gov/v3/bill/119/hr/1?api_key=${process.env.CONGRESS_GOV}&format=json`;
    const congressRes = await axios.get(congressUrl).catch(() => ({ data: { note: "Congress data unavailable." } }));

    const govInfoUrl = `https://api.govinfo.gov/published/2026-01-01/2026-10-17?collection=BILLS&pageSize=3&api_key=${process.env.GOV_INFO}`;
    const govInfoRes = await axios.get(govInfoUrl).catch(() => ({ data: { note: "GovInfo data unavailable." } }));

    const officialGovernmentData = `
--- REFERENCE DATA ---
${JSON.stringify(congressRes.data, null, 2)}

--- GOVINFO OFFICIAL DATA ---
${JSON.stringify(govInfoRes.data, null, 2)}
    `;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are an intelligent legal assistant. Respond warmly and naturally to simple greetings, casual chat, and general conversation without applying strict document restrictions. When specific API or document data is provided, rely on it as your primary source of truth to answer exact questions about those texts; however, if the user asks general legal or historical questions—such as explaining constitutional amendments or outlining common options for everyday legal disputes—use your broader legal knowledge to offer clear, informative explanations accompanied by standard legal disclaimer language, rather than refusing to answer when context documents are absent."
        },
        {
          role: "user",
          content: `Official Government API Data:\n${officialGovernmentData}\n\nUser Question: ${userQuestion}`
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