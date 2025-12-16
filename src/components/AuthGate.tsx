'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator((c) => [c.user]);
  if (!user) {
    return (
      <div className="card">
        <h2>Sign in required</h2>
        <p className="small">Use the sign-in widget in the header to continue.</p>
      </div>
    );
  }
  return <>{children}</>;
}
