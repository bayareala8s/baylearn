'use server';

import { z } from 'zod';
import { getServerUser } from '@/lib/serverAuth';
import { cookiesClient } from '@/utils/amplify-utils';

const Input = z.object({
  courseId: z.string().min(1),
  courseVersionId: z.string().min(1),
  purchasedVia: z.enum(['FREE', 'STRIPE']).default('FREE'),
});

export async function enrollInCourse(input: z.infer<typeof Input>) {
  const parsed = Input.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' as const };

  const user = await getServerUser();
  const client = cookiesClient;

  // idempotent: if already enrolled, do nothing
  const existing = await client.models.Enrollment.list({
    filter: { userSub: { eq: user.userSub }, courseId: { eq: parsed.data.courseId } },
  });

  if ((existing.data?.length ?? 0) > 0) return { ok: true as const };

  const created = await client.models.Enrollment.create({
    userSub: user.userSub,
    courseId: parsed.data.courseId,
    courseVersionId: parsed.data.courseVersionId,
    status: 'ACTIVE',
    purchasedVia: parsed.data.purchasedVia,
  });

  if (!created.data) return { ok: false, error: 'Failed to create enrollment' as const };
  return { ok: true as const };
}
