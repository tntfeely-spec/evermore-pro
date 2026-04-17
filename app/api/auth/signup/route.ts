import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, ownerName, email, phone, address, city, state, zip, referralSource } = body;

    // Validate required fields
    if (!businessName || !ownerName || !email || !phone || !address || !city || !state || !zip) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Generate temp password: first 6 lowercase alpha chars of business name + "2026!"
    const alphaOnly = businessName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const tempPassword = alphaOnly.slice(0, 6).padEnd(6, 'x') + '2026!';

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // Insert account
    const { data: account, error: accountError } = await supabase
      .from('funeral_home_accounts')
      .insert({
        business_name: businessName,
        owner_name: ownerName,
        email,
        phone,
        address,
        city,
        state,
        zip,
        referral_source: referralSource || null,
        subscription_status: 'trialing',
        user_id: userId,
      })
      .select()
      .single();

    if (accountError) {
      // Clean up auth user if account insert fails
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: accountError.message }, { status: 500 });
    }

    // Insert empty listing
    const { error: listingError } = await supabase
      .from('funeral_home_listings')
      .insert({
        account_id: account.id,
        services: [],
        photos: [],
        verified: false,
      });

    if (listingError) {
      console.error('Listing insert error:', listingError);
    }

    return NextResponse.json({ success: true, accountId: account.id, tempPassword });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
