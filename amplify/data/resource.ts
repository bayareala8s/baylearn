import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Organization: a
    .model({
      name: a.string().required(),
      createdBy: a.string().required(),
    })
    .authorization((allow) => [
      allow.authenticated(), // app-level checks recommended for org isolation
      allow.group('Admin'),
    ]),

  Membership: a
    .model({
      orgId: a.string().required(),
      userSub: a.string().required(),
      role: a.enum(['ORG_ADMIN', 'LEARNER']),
    })
    .authorization((allow) => [
      allow.authenticated(),
      allow.group('Admin'),
    ]),

  Course: a
    .model({
      // Public catalog record
      title: a.string().required(),
      slug: a.string().required(),
      summary: a.string().required(),
      level: a.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
      platform: a.enum(['AWS', 'AZURE', 'GCP', 'DEVOPS', 'SOFTWARE', 'DATA']),
      isPublished: a.boolean().required().default(false),
      createdBy: a.string().required(),
      // denormalized
      publishedVersionId: a.string(),
    })
    .secondaryIndexes((index) => [index('slug')])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('Admin'),
    ]),

  CourseVersion: a
    .model({
      courseId: a.string().required(),
      version: a.string().required(), // e.g. "1.0", "1.1"
      changelog: a.string(),
      isPublished: a.boolean().required().default(false),
      hours: a.integer().required().default(0),
    })
    .secondaryIndexes((index) => [index('courseId').sortKeys(['version'])])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('Admin'),
    ]),

  Lesson: a
    .model({
      courseVersionId: a.string().required(),
      order: a.integer().required(),
      title: a.string().required(),
      kind: a.enum(['TEXT', 'VIDEO', 'LAB']),
      contentMd: a.string(),  // markdown for TEXT/LAB
      videoUrl: a.url(),      // for VIDEO
      estimatedMinutes: a.integer().required().default(10),
    })
    .secondaryIndexes((index) => [index('courseVersionId').sortKeys(['order'])])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('Admin'),
    ]),

  Enrollment: a
    .model({
      userSub: a.string().required(),
      courseId: a.string().required(),
      courseVersionId: a.string().required(),
      status: a.enum(['ACTIVE', 'COMPLETED']).default('ACTIVE'),
      purchasedVia: a.enum(['FREE', 'STRIPE']).default('FREE'),
    })
    .secondaryIndexes((index) => [index('userSub').sortKeys(['courseId'])])
    .authorization((allow) => [
      allow.authenticated(),
      allow.group('Admin'),
    ]),

  Progress: a
    .model({
      userSub: a.string().required(),
      courseVersionId: a.string().required(),
      lessonId: a.string().required(),
      completedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [index('userSub').sortKeys(['courseVersionId'])])
    .authorization((allow) => [
      allow.authenticated(),
      allow.group('Admin'),
    ]),

  Certificate: a
    .model({
      userSub: a.string().required(),
      courseId: a.string().required(),
      courseVersionId: a.string().required(),
      issuedAt: a.datetime().required(),
      certNumber: a.string().required(), // unique, human-readable
    })
    .secondaryIndexes((index) => [index('userSub').sortKeys(['courseId'])])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated(),
      allow.group('Admin'),
    ]),

  AuditLog: a
    .model({
      actorSub: a.string().required(),
      action: a.string().required(),
      resourceType: a.string().required(),
      resourceId: a.string().required(),
      at: a.datetime().required(),
      metaJson: a.string(),
    })
    .authorization((allow) => [allow.group('Admin')]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
