import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendEmail, buildLeadClaimEmail } from '@/lib/email';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook signature verification failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const claimType = session.metadata?.type;

        if (claimType === 'lead_claim') {
          // $75 one-time lead claim payment
          const inquiryId = session.metadata?.inquiry_id;
          const accountId = session.metadata?.account_id;

          if (inquiryId && accountId) {
            // Fetch inquiry details
            const { data: inquiry } = await supabase
              .from('family_inquiries')
              .select('*')
              .eq('id', inquiryId)
              .single();

            // Fetch account for email
            const { data: account } = await supabase
              .from('funeral_home_accounts')
              .select('email, business_name')
              .eq('id', accountId)
              .single();

            if (inquiry && account) {
              // Send full contact details to the funeral home
              const { subject, body: emailBody } = buildLeadClaimEmail({
                businessName: account.business_name,
                familyName: inquiry.family_name,
                familyEmail: inquiry.email,
                familyPhone: inquiry.phone,
                serviceType: inquiry.service_type,
                message: inquiry.message,
              });

              await sendEmail({
                to: account.email,
                subject,
                body: emailBody,
              });

              // Mark inquiry as claimed
              await supabase
                .from('family_inquiries')
                .update({ read: true })
                .eq('id', inquiryId);
            }
          }
        } else {
          // Subscription checkout
          const accountId = session.metadata?.account_id;
          const customer = session.customer as string;
          const subscription = session.subscription as string;

          await supabase
            .from('funeral_home_accounts')
            .update({
              subscription_status: 'active',
              stripe_customer_id: customer,
              stripe_subscription_id: subscription,
            })
            .eq('id', accountId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from('funeral_home_accounts')
          .update({ subscription_status: 'cancelled' })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const statusMap: Record<string, string> = {
          active: 'active',
          past_due: 'active',
          canceled: 'cancelled',
        };
        const subscriptionStatus = statusMap[sub.status] ?? 'inactive';

        await supabase
          .from('funeral_home_accounts')
          .update({ subscription_status: subscriptionStatus })
          .eq('stripe_subscription_id', sub.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const runtime = 'nodejs';
