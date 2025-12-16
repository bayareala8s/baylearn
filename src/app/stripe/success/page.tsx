'use client';

import { useEffect, useState } from 'react';

export default function StripeSuccess() {
  const [msg, setMsg] = useState('Verifying payment…');

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      if (!sessionId) { setMsg('Missing session_id'); return; }
      const resp = await fetch('/api/stripe/verify?session_id=' + encodeURIComponent(sessionId));
      const j = await resp.json();
      setMsg(j.ok ? 'Payment verified. You can now enroll in courses.' : (j.error ?? 'Verification failed'));
    })();
  }, []);

  return (
    <div className="card">
      <h1>Payment Success</h1>
      <p className="small">{msg}</p>
      <a className="btn" href="/">Go to catalog</a>
    </div>
  );
}
