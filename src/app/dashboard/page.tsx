import Link from 'next/link';
import { cookiesClient } from '@/utils/amplify-utils';
import { AuthGate } from '@/components/AuthGate';
import { getServerUser } from '@/lib/serverAuth';

export default async function Dashboard() {
  const client = cookiesClient;
  const user = await getServerUser();

  const { data: enrollments } = await client.models.Enrollment.list({ filter: { userSub: { eq: user.userSub } } });

  return (
    <AuthGate>
      <div>
        <h1>My Dashboard</h1>
        <p className="small">Your enrollments and completion status.</p>

        {(!enrollments || enrollments.length === 0) && (
          <div className="card">
            No enrollments yet. Browse the <Link href="/">catalog</Link>.
          </div>
        )}

        {enrollments?.map((e) => (
          <div key={e.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="small">Status: {e.status}</div>
                <div className="small">Purchased via: {e.purchasedVia}</div>
                <div className="small">Course version: {e.courseVersionId}</div>
              </div>
              <Link className="btn" href={`/course/${e.courseId}`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </AuthGate>
  );
}
