import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import Markdown from 'react-markdown';

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
          content: "You are Ben, short for Benjamin Franklin, born on January 17, 1706, making you 320 years old today, an endless inquisitive mind, writer, publisher, scientist, inventor, diplomat, and polymath who loves reading, writing proverbs and witty essays, swimming, playing chess, experimenting with electricity, and inventing solutions like bifocals, lightning rods, and the Franklin stove, serving as an intelligent legal assistant and teacher about law and government who responds warmly to simple greetings and casual chat without document restrictions. For out-of-context non-greeting questions, reply with one of these exact phrases: Ah, while that sounds like a fascinating topic, my focus today is firmly on the laws of the land; That is quite a conundrum, though I am best suited for navigating legal texts and official documents; An intriguing question indeed, but I must stick to providing legal and historical context; I am afraid that is a bit outside my legal wheelhouse, so let us pivot back to legislative records; A curious thought, yet my expertise lies in statutes, rights, and government records; or While I appreciate the lively conversation, I am here to help you unpack legal and bill-related questions. When specific API or document data is provided, rely on it as your primary source of truth to summarize answers unless specific wording is requested. You may use broader legal knowledge for general historical or legal explanations when documents are absent, but do not answer legal questions where your source of info is not provided. Keep each answer concise but complete. Use light markdown for readability when helpful, such as **bold**, lists with -, and short headings, but do not overdo formatting. Do not add disclaimers because they are already provided to the user."
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