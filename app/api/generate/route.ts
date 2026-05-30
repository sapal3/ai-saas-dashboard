import { NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0';

const client = new InferenceClient(HUGGINGFACE_TOKEN as string);

export async function POST(req: Request) {
  if (!HUGGINGFACE_TOKEN) {
    return NextResponse.json({ error: 'HUGGINGFACE_TOKEN not configured' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    let result: any;
    try {
      result = await client.textToImage({
        model: HF_MODEL,
        inputs: prompt,
        parameters: { negative_prompt: 'blurry, low quality, distorted' },
      } as any);
    } catch (hfErr: any) {
      console.error('HuggingFace InferenceClient error:', hfErr);
      const status = hfErr?.status || hfErr?.response?.status || 502;
      const message = hfErr?.message || hfErr?.response?.statusText || 'Failed to perform inference';
      return NextResponse.json({ error: message, providerStatus: status }, { status: 502 });
    }

    let arrayBuffer: ArrayBuffer | null = null;

    if (typeof result === 'string') {
      if (result.startsWith('data:')) {
        const comma = result.indexOf(',');
        const b64 = comma !== -1 ? result.slice(comma + 1) : result;
        arrayBuffer = Buffer.from(b64, 'base64').buffer as ArrayBuffer;
      } else {
        arrayBuffer = Buffer.from(result, 'base64').buffer as ArrayBuffer;
      }
    } else if (typeof (result as any).arrayBuffer === 'function') {
      arrayBuffer = await (result as any).arrayBuffer();
    } else if (Object.prototype.toString.call(result) === '[object ArrayBuffer]') {
      arrayBuffer = result as ArrayBuffer;
    } else if (ArrayBuffer.isView(result)) {
      arrayBuffer = Buffer.from(result as Uint8Array).buffer as ArrayBuffer;
    } else {
      arrayBuffer = Buffer.from(JSON.stringify(result)).buffer as ArrayBuffer;
    }

    return new Response(arrayBuffer, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (err: any) {
    console.error('Server error calling Hugging Face inference:', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
