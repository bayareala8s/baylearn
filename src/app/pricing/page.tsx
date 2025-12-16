'use client';

import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Pricing() {
  const { user } = useAuthenticator((c) => [c.user]);
  const [msg, setMsg] = useState('');

  return (
    <div className="card">
      <h1>Pricing</h1>
      <p className="small">Stripe starter checkout for BayLearn All-Access (config via env vars).</p>
      {!user && <p className="small">Sign in first to purchase (required to enroll after payment).</p>}
      <button
        className="btn"
        disabled={!user}
        onClick={async () => {
          setMsg('Creating checkout…');
          const resp = await fetch('/api/stripe/checkout', { method: 'POST' });
          const j = await resp.json();
          if (j.url) window.location.href = j.url;
          else setMsg(j.error ?? 'Unknown error');
        }}
      >
        Buy All-Access
      </button>
      <div className="small">{msg}</div>
    </div>
  );
}
