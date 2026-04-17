import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendEmail, buildNewInquiryNotificationEmail } from '@/lib/email';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { account_id, family_name, email, phone, message, service_type } = body;

    if (!account_id || !family_name || !email) {
      return NextResponse.json({ error: 'account_id, family_name, and email are required' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Insert the inquiry
    const { data, error } = await supabase
      .from('family_inquiries')
      .insert({
        account_id,
        family_name,
        email,
        phone: phone || null,
        message: message || null,
        service_type: service_type || null,
        read: false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Fetch account to determine subscriber status and email
    const { data: account } = await supabase
      .from('funeral_home_accounts')
      .select('email, business_name, subscription_status')
      .eq('id', account_id)
      .single();

    if (account) {
      const isSubscriber = account.subscription_status === 'active' || account.subscription_status === 'trialing';

      // Send notification email
      // Subscribers get full details in dashboard
      // Non-subscribers get a "Claim This Lead" link for $75
      const { subject, body: emailBody } = buildNewInquiryNotificationEmail({
        businessName: account.business_name,
        familyName: family_name,
        serviceType: service_type,
        inquiryId: data.id,
        accountId: account_id,
        isSubscriber,
      });

      await sendEmail({
        to: account.email,
        subject,
        body: emailBody,
      });
    }

    return NextResponse.json({ success: true, inquiry_id: data.id }, { headers: corsHeaders });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
