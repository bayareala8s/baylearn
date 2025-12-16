'use client';

import { useState } from 'react';

export function AiAssistant({ contextTitle }: { contextTitle: string }) {
  const [q, setQ] = useState('');
  const [a, setA] = useState<string>('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="card">
      <div className="small">Ask questions about: {contextTitle}</div>
      <textarea className="input" rows={4} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question…" />
      <div className="row" style={{ marginTop: 8 }}>
        <button
          className="btn"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setA('');
            const resp = await fetch('/api/ai/ask', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ question: q, contextTitle }),
            });
            const j = await resp.json();
            setA(j.answer ?? JSON.stringify(j, null, 2));
            setBusy(false);
          }}
        >
          Ask
        </button>
      </div>
      {a && <pre style={{ whiteSpace: 'pre-wrap' }}>{a}</pre>}
    </div>
  );
}
