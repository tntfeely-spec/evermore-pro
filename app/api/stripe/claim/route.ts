import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const inquiryId = url.searchParams.get('inquiry_id');
  const accountId = url.searchParams.get('account_id');
  const email = url.searchParams.get('email');

  if (!inquiryId || !accountId) {
    return NextResponse.json({ error: 'Missing inquiry_id or account_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Lead Claim: Family Inquiry Contact Details',
              description: 'One-time payment to receive the full contact details for a family inquiry from Evermore Directory.',
            },
            unit_amount: 7500,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'lead_claim',
        inquiry_id: inquiryId,
        account_id: accountId,
      },
      customer_email: email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/inquiries?claimed=${inquiryId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/inquiries`,
    });

    return NextResponse.redirect(session.url!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
