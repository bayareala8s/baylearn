'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { enrollInCourse } from '@/server-actions/enroll';
import Link from 'next/link';

export function EnrollButton({ courseId, courseVersionId }: { courseId: string; courseVersionId: string }) {
  const { user } = useAuthenticator((c) => [c.user]);
  const [msg, setMsg] = useState<string>('');

  if (!courseVersionId) return <span className="small">No published version.</span>;

  if (!user) {
    return <span className="small">Sign in to enroll.</span>;
  }

  return (
    <div className="row" style={{ alignItems: 'center' }}>
      <button
        className="btn"
        onClick={async () => {
          setMsg('Enrolling…');
          const res = await enrollInCourse({ courseId, courseVersionId, purchasedVia: 'FREE' });
          setMsg(res.ok ? 'Enrolled!' : `Error: ${res.error}`);
        }}
      >
        Enroll (Free)
      </button>
      <Link className="btn secondary" href="/pricing">Buy (Stripe)</Link>
      <span className="small">{msg}</span>
    </div>
  );
}
