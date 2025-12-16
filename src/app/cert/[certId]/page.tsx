import { cookiesClient } from '@/utils/amplify-utils';
import Link from 'next/link';

export default async function CertVerify({ params }: { params: { certId: string } }) {
  const client = cookiesClient;
  const { data: cert } = await client.models.Certificate.get({ id: params.certId });
  if (!cert) {
    return (
      <div className="card">
        <h2>Certificate not found</h2>
        <p className="small">This certificate ID does not exist.</p>
        <Link href="/">Go to BayLearn</Link>
      </div>
    );
  }
  const course = (await client.models.Course.get({ id: cert.courseId })).data;

  return (
    <div className="card">
      <h1>Certificate Verified</h1>
      <p><b>Certificate #:</b> {cert.certNumber}</p>
      <p><b>Course:</b> {course?.title ?? cert.courseId}</p>
      <p><b>Issued:</b> {new Date(cert.issuedAt).toLocaleString()}</p>
      <p className="small">This page verifies the certificate authenticity.</p>
      <Link href="/">Back to catalog</Link>
    </div>
  );
}
