import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: account, error: accountError } = await supabase
      .from('funeral_home_accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const { data: inquiries, error: inquiriesError } = await supabase
      .from('family_inquiries')
      .select('*')
      .eq('account_id', account.id)
      .order('created_at', { ascending: false })

    if (inquiriesError) {
      return NextResponse.json({ error: inquiriesError.message }, { status: 500 })
    }

    return NextResponse.json(inquiries)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { inquiryId, status } = await request.json()
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's account
    const { data: account, error: accountError } = await supabase
      .from('funeral_home_accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Verify the inquiry belongs to this account
    const { data: inquiry, error: inquiryError } = await supabase
      .from('family_inquiries')
      .select('id, account_id')
      .eq('id', inquiryId)
      .single()

    if (inquiryError || !inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    if (inquiry.account_id !== account.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update status
    const { data: updated, error: updateError } = await supabase
      .from('family_inquiries')
      .update({ status })
      .eq('id', inquiryId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
