import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { businessName, ownerName, email, phone, address, city, state, zip, referralSource } =
      await request.json()

    // Generate temporary password: first 6 lowercase alpha chars of business name + 4 random digits
    const alphaOnly = businessName.replace(/[^a-zA-Z]/g, '').toLowerCase()
    const prefix = alphaOnly.slice(0, 6)
    const suffix = Math.floor(1000 + Math.random() * 9000).toString()
    const tempPassword = prefix + suffix

    const supabase = await createServiceClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    const userId = authData.user.id

    // Insert funeral_home_accounts record
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
        referral_source: referralSource,
        subscription_status: 'trialing',
        user_id: userId,
      })
      .select('id')
      .single()

    if (accountError) {
      return NextResponse.json({ error: accountError.message }, { status: 500 })
    }

    // Insert funeral_home_listings record
    const { error: listingError } = await supabase
      .from('funeral_home_listings')
      .insert({
        account_id: account.id,
        services_offered: [],
        photos: [],
        is_verified: false,
      })

    if (listingError) {
      return NextResponse.json({ error: listingError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      accountId: account.id,
      tempPassword,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
