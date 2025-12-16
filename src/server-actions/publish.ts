'use server';

import { z } from 'zod';
import { getServerUser } from '@/lib/serverAuth';
import { cookiesClient } from '@/utils/amplify-utils';

const Input = z.object({
  courseId: z.string().min(1),
  version: z.string().min(1),
});

export async function publishCourseVersion(input: z.infer<typeof Input>) {
  const parsed = Input.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' as const };

  const user = await getServerUser();
  if (!user.isAdmin) return { ok: false, error: 'Admin required' as const };

  const client = cookiesClient;
  const versions = await client.models.CourseVersion.list({
    filter: { courseId: { eq: parsed.data.courseId }, version: { eq: parsed.data.version } },
  });
  const v = versions.data?.[0];
  if (!v) return { ok: false, error: 'Version not found' as const };

  await client.models.CourseVersion.update({ id: v.id, isPublished: true });

  await client.models.Course.update({
    id: parsed.data.courseId,
    isPublished: true,
    publishedVersionId: v.id,
  });

  return { ok: true as const };
}
