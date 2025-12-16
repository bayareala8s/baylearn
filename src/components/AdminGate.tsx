'use client';

import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const session = await fetchAuthSession();
      const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[] | undefined) ?? [];
      setAllowed(groups.includes('Admin'));
    })().catch(() => setAllowed(false));
  }, []);

  if (allowed === null) return <div className="card">Checking permissions…</div>;
  if (!allowed) return <div className="card">Admin access required (Cognito group: Admin).</div>;
  return <>{children}</>;
}
