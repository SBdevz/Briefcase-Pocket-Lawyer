import express from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';

export default function createSimplifyRouter(openai) {
  const router = express.Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
  });

  router.post('/', upload.single('uploadedFiles'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No document found in request.' });
      }

      let extractedText = '';

      if (req.file.mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: req.file.buffer });
        try {
          const pdfData = await parser.getText();
          extractedText = pdfData.text;
        } finally {
          await parser.destroy();
        }
      } else if (req.file.mimetype === 'text/plain') {
        extractedText = req.file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({
          error: 'Unsupported file type. Please upload a PDF or .txt file.',
        });
      }

      if (!extractedText.trim()) {
        return res.status(400).json({ error: 'Could not extract text content from the file.' });
      }

      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert document simplifier. Analyze the following document text. Provide a clear, bulleted summary, translate any complex jargon into simple terms, and extract the key takeaways.',
          },
          { role: 'user', content: `DOCUMENT TEXT:\n${extractedText}` },
        ],
      });

      res.status(200).json({
        fileName: req.file.originalname,
        simplifiedText: aiResponse.choices[0].message.content,
      });
    } catch (error) {
      console.error('Simplification Pipeline Failed:', error);
      res.status(500).json({ error: 'Internal server error during document processing.' });
    }
  });

  return router;
}
