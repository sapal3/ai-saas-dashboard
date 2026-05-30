"use client";

import { useState } from "react";

export default function BlogPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generateBlog() {
    setLoading(true);
    setError(null);
    setReply(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Unknown error');
      } else {
        setReply(data.reply);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  async function copyReply() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      // simple feedback - could be improved with a toast
      alert('Copied to clipboard');
    } catch (e) {
      alert('Failed to copy');
    }
  }

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1 className="text-2xl font-bold">Blog</h1>
        <p className="muted">Use the AI assistant to help write your blog post.</p>
      </header>

      <section className="card">
        <label className="label">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-textarea"
          placeholder="Write your blog post idea or prompt here..."
        />

        <div className="controls">
          <div className="char-count">{prompt.length} characters</div>
          <button
            className="btn primary"
            onClick={generateBlog}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <span className="spinner" aria-hidden />
            ) : (
              'Generate Post'
            )}
          </button>
        </div>

        {error && <div className="error">Error: {error}</div>}
      </section>

      {reply && (
        <section className="card mt-4">
          <div className="reply-header">
            <h2 className="font-semibold">AI-generated post</h2>
            <div className="reply-actions">
              <button className="btn" onClick={copyReply}>Copy</button>
            </div>
          </div>
          <div className="reply-body whitespace-pre-wrap">{reply}</div>
        </section>
      )}
    </div>
  );
}
