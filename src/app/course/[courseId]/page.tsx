import Link from 'next/link';
import { cookiesClient } from '@/utils/amplify-utils';
import { EnrollButton } from '@/components/EnrollButton';
import { LessonList } from '@/components/LessonList';
import { AiAssistant } from '@/components/AiAssistant';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const client = cookiesClient;
  const { data: course } = await client.models.Course.get({ id: params.courseId });
  if (!course || !course.isPublished) {
    return <div className="card">Course not found or not published.</div>;
  }

  const versionId = course.publishedVersionId;
  const version = versionId ? (await client.models.CourseVersion.get({ id: versionId })).data : null;
  const lessons = versionId
    ? (await client.models.Lesson.list({ filter: { courseVersionId: { eq: versionId } }, sortDirection: 'ASC' })).data
    : [];

  return (
    <div>
      <Link href="/">← Back</Link>
      <h1>{course.title}</h1>
      <div className="small">{course.platform} · {course.level}</div>
      <p>{course.summary}</p>

      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="small">Published version: {version?.version ?? 'N/A'} · Hours: {version?.hours ?? 0}</div>
        <EnrollButton courseId={course.id} courseVersionId={versionId ?? ''} />
      </div>

      <h2>Lessons</h2>
      <LessonList courseVersionId={versionId ?? ''} lessons={lessons ?? []} />

      <h2>AI Assistant</h2>
      <AiAssistant contextTitle={course.title} />
    </div>
  );
}
