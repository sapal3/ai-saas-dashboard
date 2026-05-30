import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type ReqBody = {
  prompt?: string;
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as ReqBody;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 500,
      temperature: 0.8,
    });

    const reply = completion.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

