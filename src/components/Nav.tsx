'use client';

import Link from 'next/link';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function Nav() {
  const { user, signOut } = useAuthenticator((c) => [c.user]);
  return (
    <div style={{ borderBottom: '1px solid #ddd' }}>
      <div className="container row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', fontWeight: 700 }}>BayLearn</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <div className="row" style={{ alignItems: 'center' }}>
          {user ? (
            <>
              <span className="small">Signed in</span>
              <button className="btn secondary" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <span className="small">Sign in to track progress</span>
          )}
        </div>
      </div>
    </div>
  );
}
