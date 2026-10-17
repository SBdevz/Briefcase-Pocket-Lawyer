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

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/Ben-AI", async (req, res) => {
  try {
    const { userQuestion, state } = req.body;

    const fileName = state ? `${state}.txt` : "National.txt";
    const filePath = path.join(process.cwd(), "Legal_Database", fileName);
    
    let referenceText = "";
    if (fs.existsSync(filePath)) {
      referenceText = fs.readFileSync(filePath, "utf-8");
    } else {
      referenceText = fs.readFileSync(path.join(process.cwd(), "Legal_Database", "National.txt"), "utf-8");
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a strict legal advisor. Answer the user's question using ONLY reference from the provided text below. If the answer cannot be found in the text, reply strictly with: 'I cannot answer this based on the provided documents.'"
        },
        {
          role: "user",
          content: `Reference Law Documents:\n${referenceText}\n\nUser Question: ${userQuestion}`
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