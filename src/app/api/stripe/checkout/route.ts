import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!secret || !priceId) {
    return NextResponse.json({ error: 'Stripe env vars missing (STRIPE_SECRET_KEY, STRIPE_PRICE_ID)' }, { status: 500 });
  }

  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
