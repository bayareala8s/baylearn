/**
 * Optional local script to seed data after backend is deployed.
 * Run manually in a trusted environment with proper Amplify outputs.
 */
import { getClient } from '../src/lib/dataClient';

async function main() {
  const client = getClient();
  const course = await client.models.Course.create({
    title: 'AWS Solution Architect Foundations',
    slug: 'aws-saa-foundations',
    summary: 'Core AWS services, VPC, IAM, compute, storage, and architecture patterns.',
    level: 'BEGINNER',
    platform: 'AWS',
    isPublished: false,
    createdBy: 'admin',
    publishedVersionId: null,
  });
  console.log(course);
}

main().catch((e) => { console.error(e); process.exit(1); });
