import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const grok = new OpenAI({
  apiKey: process.env.XBEN_AI,
  baseURL: "https://api.x.ai/v1",
});

app.post("/api/Ben-AI", async (req, res) => {
  try {
    const { userQuestion } = req.body;

    const filePath = path.join(process.cwd(), "documents", "legal-reference.txt");
    const referenceText = fs.readFileSync(filePath, "utf-8");
    
    const completion = await grok.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content: "You are a strict legal advisor. Answer the user's question using ONLY the provided reference text below. If the answer cannot be found in the text, reply strictly with: 'I cannot answer this based on the provided documents.'"
        },
        {
          role: "user",
          content: `Reference Documents:\n${referenceText}\n\nUser Question: ${userQuestion}`
        }
      ],
    });

    const aiAnswer = completion.choices[0].message.content;
    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("Communication Issue:", error);
    res.status(500).json({ error: "Backend Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend live on http://localhost:${PORT}`);
});