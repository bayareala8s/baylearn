'use server';

import { z } from 'zod';
import { getServerUser } from '@/lib/serverAuth';
import { cookiesClient } from '@/utils/amplify-utils';
import { randomUUID } from 'crypto';

const Mark = z.object({
  courseVersionId: z.string().min(1),
  lessonId: z.string().min(1),
});

export async function markLessonComplete(input: z.infer<typeof Mark>) {
  const parsed = Mark.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' as const };
  const user = await getServerUser();
  const client = cookiesClient;

  // upsert-like: check existing
  const existing = await client.models.Progress.list({
    filter: {
      userSub: { eq: user.userSub },
      courseVersionId: { eq: parsed.data.courseVersionId },
      lessonId: { eq: parsed.data.lessonId },
    },
  });

  if ((existing.data?.length ?? 0) > 0) return { ok: true as const };

  const created = await client.models.Progress.create({
    userSub: user.userSub,
    courseVersionId: parsed.data.courseVersionId,
    lessonId: parsed.data.lessonId,
    completedAt: new Date().toISOString(),
  });

  if (!created.data) return { ok: false, error: 'Failed to record progress' as const };
  return { ok: true as const };
}

const Issue = z.object({
  courseVersionId: z.string().min(1),
});

function certNumber() {
  const t = new Date();
  const stamp = `${t.getUTCFullYear()}${String(t.getUTCMonth()+1).padStart(2,'0')}${String(t.getUTCDate()).padStart(2,'0')}`;
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BL-${stamp}-${suffix}`;
}

export async function issueCertificateIfEligible(input: z.infer<typeof Issue>) {
  const parsed = Issue.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' as const };
  const user = await getServerUser();
  const client = cookiesClient;

  // Find enrollment by courseVersionId
  const enrollments = await client.models.Enrollment.list({
    filter: { userSub: { eq: user.userSub }, courseVersionId: { eq: parsed.data.courseVersionId } },
  });
  const enrollment = enrollments.data?.[0];
  if (!enrollment) return { ok: true as const, certUrl: null as string | null };

  // Count lessons
  const lessons = await client.models.Lesson.list({ filter: { courseVersionId: { eq: parsed.data.courseVersionId } } });
  const total = lessons.data?.length ?? 0;

  // Count progress
  const prog = await client.models.Progress.list({ filter: { userSub: { eq: user.userSub }, courseVersionId: { eq: parsed.data.courseVersionId } } });
  const completed = prog.data?.length ?? 0;

  if (total === 0 || completed < total) {
    return { ok: true as const, certUrl: null as string | null };
  }

  // Already issued?
  const existing = await client.models.Certificate.list({
    filter: { userSub: { eq: user.userSub }, courseVersionId: { eq: parsed.data.courseVersionId } },
  });
  if ((existing.data?.length ?? 0) > 0) {
    return { ok: true as const, certUrl: `/cert/${existing.data![0].id}` };
  }

  const created = await client.models.Certificate.create({
    userSub: user.userSub,
    courseId: enrollment.courseId,
    courseVersionId: enrollment.courseVersionId,
    issuedAt: new Date().toISOString(),
    certNumber: certNumber(),
  });

  if (!created.data) return { ok: false, error: 'Failed to issue certificate' as const };
  return { ok: true as const, certUrl: `/cert/${created.data.id}` };
}
