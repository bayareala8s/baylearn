'use client';

import { useEffect, useState } from 'react';
import { clientData } from '@/lib/dataClient';
import { publishCourseVersion } from '@/server-actions/publish';

export function AdminCourseEditor() {
  const client = clientData();

  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [level, setLevel] = useState<'BEGINNER'|'INTERMEDIATE'|'ADVANCED'>('BEGINNER');
  const [platform, setPlatform] = useState<'AWS'|'AZURE'|'GCP'|'DEVOPS'|'SOFTWARE'|'DATA'>('AWS');

  const [version, setVersion] = useState('1.0');
  const [hours, setHours] = useState(8);
  const [msg, setMsg] = useState('');

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonKind, setLessonKind] = useState<'TEXT'|'VIDEO'|'LAB'>('TEXT');
  const [lessonContent, setLessonContent] = useState('## Lesson content\n\nWrite markdown here.');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://example.com');
  const [lessons, setLessons] = useState<any[]>([]);

  async function refresh() {
    const res = await client.models.Course.list();
    setCourses(res.data ?? []);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="card">
      <h3>Create / Manage</h3>

      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="small">Existing courses</div>
          <select className="input" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">(Select)</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title} ({c.isPublished ? 'Published' : 'Draft'})</option>)}
          </select>
          <button className="btn secondary" onClick={refresh} style={{ marginTop: 8 }}>Refresh</button>
        </div>

        <div style={{ flex: 2, minWidth: 300 }}>
          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="small">Title</div>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="small">Slug</div>
              <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="aws-solution-architect" />
            </div>
          </div>

          <div className="small" style={{ marginTop: 8 }}>Summary</div>
          <textarea className="input" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />

          <div className="row" style={{ marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <div className="small">Level</div>
              <select className="input" value={level} onChange={(e) => setLevel(e.target.value as any)}>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div className="small">Platform</div>
              <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                <option value="AWS">AWS</option>
                <option value="AZURE">AZURE</option>
                <option value="GCP">GCP</option>
                <option value="DEVOPS">DEVOPS</option>
                <option value="SOFTWARE">SOFTWARE</option>
                <option value="DATA">DATA</option>
              </select>
            </div>
          </div>

          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn"
              onClick={async () => {
                setMsg('Saving…');
                const res = await client.models.Course.create({
                  title, slug, summary, level, platform,
                  isPublished: false,
                  createdBy: 'admin',
                  publishedVersionId: null,
                });
                setMsg(res.data ? 'Saved' : 'Error');
                await refresh();
              }}>
              Create Course
            </button>
          </div>

          <hr />

          <h4>New Version</h4>
          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="small">Version</div>
              <input className="input" value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="small">Hours</div>
              <input className="input" type="number" value={hours} onChange={(e) => setHours(parseInt(e.target.value || '0', 10))} />
            </div>
          </div>

          <h4 style={{ marginTop: 12 }}>Lessons (draft list)</h4>
          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="small">Lesson title</div>
              <input className="input" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="small">Kind</div>
              <select className="input" value={lessonKind} onChange={(e) => setLessonKind(e.target.value as any)}>
                <option value="TEXT">TEXT</option>
                <option value="VIDEO">VIDEO</option>
                <option value="LAB">LAB</option>
              </select>
            </div>
          </div>

          {lessonKind === 'VIDEO' ? (
            <>
              <div className="small" style={{ marginTop: 8 }}>Video URL</div>
              <input className="input" value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} />
            </>
          ) : (
            <>
              <div className="small" style={{ marginTop: 8 }}>Markdown</div>
              <textarea className="input" rows={6} value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />
            </>
          )}

          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn secondary" onClick={() => {
              const nextOrder = lessons.length + 1;
              setLessons([...lessons, {
                order: nextOrder,
                title: lessonTitle || `Lesson ${nextOrder}`,
                kind: lessonKind,
                contentMd: lessonKind === 'VIDEO' ? null : lessonContent,
                videoUrl: lessonKind === 'VIDEO' ? lessonVideoUrl : null,
                estimatedMinutes: 10
              }]);
              setLessonTitle('');
            }}>Add lesson</button>
            <button className="btn secondary" onClick={() => setLessons([])}>Clear lessons</button>
          </div>

          {lessons.length > 0 && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(lessons, null, 2)}</pre>
          )}

          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn"
              onClick={async () => {
                if (!selectedCourseId) { setMsg('Select a course first.'); return; }
                setMsg('Creating version…');
                const v = await client.models.CourseVersion.create({
                  courseId: selectedCourseId,
                  version,
                  isPublished: false,
                  changelog: 'Initial version',
                  hours,
                });

                if (!v.data) { setMsg('Failed creating version'); return; }

                for (const l of lessons) {
                  await client.models.Lesson.create({
                    courseVersionId: v.data.id,
                    order: l.order,
                    title: l.title,
                    kind: l.kind,
                    contentMd: l.contentMd,
                    videoUrl: l.videoUrl,
                    estimatedMinutes: l.estimatedMinutes,
                  });
                }
                setMsg(`Created version ${version} with ${lessons.length} lessons.`);
              }}>
              Save version + lessons
            </button>

            <button className="btn"
              onClick={async () => {
                if (!selectedCourseId) { setMsg('Select a course first.'); return; }
                setMsg('Publishing…');
                const res = await publishCourseVersion({ courseId: selectedCourseId, version });
                setMsg(res.ok ? 'Published!' : `Error: ${res.error}`);
                await refresh();
              }}>
              Publish version
            </button>
          </div>

          <div className="small">{msg}</div>
        </div>
      </div>
    </div>
  );
}
