import { AuthGate } from '@/components/AuthGate';
import { AdminGate } from '@/components/AdminGate';
import { AdminCourseEditor } from '@/components/AdminCourseEditor';

export default async function Admin() {
  return (
    <AuthGate>
      <AdminGate>
        <div>
          <h1>Admin</h1>
          <p className="small">Create, version, and publish courses.</p>
          <AdminCourseEditor />
        </div>
      </AdminGate>
    </AuthGate>
  );
}
