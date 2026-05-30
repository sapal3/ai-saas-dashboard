"use client";

import { useState } from 'react';

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-image-1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  async function generate() {
    if (!prompt.trim()) return setError('Please enter a prompt');
    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || 'Failed to generate image');
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImages([url]);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Text to Image</h1>
      <p className="mt-2">Generate images from text prompts using OpenAI.</p>

      <section className="card mt-4">
        <label className="label">Prompt</label>
        <textarea
          className="input-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cute corgi wearing sunglasses, photorealistic"
        />

        <div className="controls">
          <div>
            <button className="btn primary" onClick={generate} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Generate'}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
      </section>

      {images.length > 0 && (
        <section className="mt-4">
          <h2 className="font-semibold">Generated images</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12, marginTop: 12 }}>
            {images.map((img, idx) => (
              <div key={idx} className="card">
                <img src={img.startsWith('data:') ? img : img} alt={`Generated ${idx + 1}`} style={{ width: '100%', borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
