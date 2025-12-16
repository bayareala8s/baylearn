import Link from 'next/link';
import { cookiesClient } from '@/utils/amplify-utils';

export default async function Home() {
  const client = cookiesClient;
  const { data: courses } = await client.models.Course.list({ filter: { isPublished: { eq: true } } });

  return (
    <div>
      <h1>Course Catalog</h1>
      <p className="small">Published courses available to browse (login required only for enroll/progress).</p>

      {(!courses || courses.length === 0) && <div className="card">No courses published yet. Go to Admin to publish.</div>}

      {courses?.map((c) => (
        <div key={c.id} className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              <div className="small">{c.platform} · {c.level}</div>
              <p>{c.summary}</p>
            </div>
            <div style={{ minWidth: 160, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Link className="btn" href={`/course/${c.id}`}>View</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
