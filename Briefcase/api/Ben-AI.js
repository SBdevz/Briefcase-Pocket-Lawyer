import OpenAI from 'openai';

const openai = process.env.BEN_AI
  ? new OpenAI({ apiKey: process.env.BEN_AI, timeout: 25000, maxRetries: 1 })
  : null;

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Use POST to ask Ben a question.' });
  }

  if (!openai) {
    return response.status(503).json({
      error: 'Ben AI is not configured on this deployment. Add BEN_AI in Vercel Project Settings > Environment Variables, then redeploy.',
    });
  }

  const userQuestion = request.body?.userQuestion;
  if (typeof userQuestion !== 'string' || !userQuestion.trim()) {
    return response.status(400).json({ error: 'Enter a question for Ben.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are Ben, a friendly legal-information assistant. Explain law and government topics clearly and directly. When an answer depends on jurisdiction, ask which jurisdiction applies or state the jurisdiction you are discussing. Distinguish general legal information from advice about a person\'s specific circumstances. Do not claim to be a lawyer or provide definitive advice for an individual case. For questions unrelated to law or government, politely explain your focus and invite a relevant question.',
        },
        { role: 'user', content: userQuestion.trim().slice(0, 12000) },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) {
      return response.status(502).json({ error: 'The AI returned an empty answer. Please try again.' });
    }

    return response.status(200).json({ answer });
  } catch (error) {
    const errorName = typeof error.name === 'string' ? error.name : 'Error';
    const errorCode = typeof error.code === 'string' ? error.code : undefined;
    console.error('Ben AI request failed:', {
      name: errorName,
      code: errorCode,
      status: error.status,
      message: error.message,
      requestId: error.request_id,
    });

    const upstreamStatus = Number(error.status);
    if (upstreamStatus === 401 || upstreamStatus === 403) {
      return response.status(503).json({ error: 'The AI service rejected BEN_AI. Verify the key in Vercel Environment Variables, then redeploy.' });
    }
    if (upstreamStatus === 429) {
      return response.status(503).json({ error: 'The AI service is rate-limited or out of quota. Check the AI account and try again later.' });
    }
    if (upstreamStatus >= 500 && upstreamStatus <= 599) {
      return response.status(502).json({ error: 'The AI service is temporarily unavailable. Please try again later.' });
    }
    if (!Number.isFinite(upstreamStatus)) {
      const detail = errorCode || errorName;
      return response.status(502).json({ error: `Vercel could not connect to the hosted AI service (${detail}). Check the BEN_AI value and Vercel function logs.` });
    }
    return response.status(502).json({ error: `The hosted AI service rejected Ben's request (HTTP ${upstreamStatus}). Check the model and Vercel function logs.` });
  }
}