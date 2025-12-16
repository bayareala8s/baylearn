import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: false, error: 'STRIPE_SECRET_KEY missing' }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ ok: false, error: 'Missing session_id' }, { status: 400 });

  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const ok = session.payment_status === 'paid' || session.status === 'complete';
    return NextResponse.json({ ok, status: session.status, payment_status: session.payment_status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Stripe verify failed' }, { status: 500 });
  }
}
