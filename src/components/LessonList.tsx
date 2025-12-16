'use client';

import Link from 'next/link';
import { useState } from 'react';
import { markLessonComplete, issueCertificateIfEligible } from '@/server-actions/progress';

type Lesson = {
  id: string;
  order: number;
  title: string;
  kind: 'TEXT' | 'VIDEO' | 'LAB';
  contentMd?: string | null;
  videoUrl?: string | null;
};

export function LessonList({ courseVersionId, lessons }: { courseVersionId: string; lessons: Lesson[] }) {
  const [activeId, setActiveId] = useState<string>(lessons[0]?.id ?? '');
  const active = lessons.find((l) => l.id === activeId);

  return (
    <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 280 }}>
        <h3>Lessons</h3>
        {lessons.map((l) => (
          <div key={l.id} style={{ margin: '8px 0' }}>
            <button className="btn secondary" onClick={() => setActiveId(l.id)}>
              {l.order}. {l.title} ({l.kind})
            </button>
          </div>
        ))}
        <button
          className="btn"
          onClick={async () => {
            const res = await issueCertificateIfEligible({ courseVersionId });
            alert(res.ok ? (res.certUrl ? `Issued: ${res.certUrl}` : 'Not eligible yet') : res.error);
          }}
        >
          Issue certificate (if eligible)
        </button>
      </div>

      <div className="card" style={{ flex: 2, minWidth: 320 }}>
        {!active ? (
          <div>No lesson selected.</div>
        ) : (
          <>
            <h3>{active.title}</h3>
            {active.kind === 'VIDEO' && active.videoUrl && (
              <div className="card">
                <a href={active.videoUrl} target="_blank" rel="noreferrer">Open video</a>
              </div>
            )}
            {active.kind !== 'VIDEO' && (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{active.contentMd ?? ''}</pre>
            )}
            <button
              className="btn"
              onClick={async () => {
                const res = await markLessonComplete({ courseVersionId, lessonId: active.id });
                alert(res.ok ? 'Marked complete' : res.error);
              }}
            >
              Mark complete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
