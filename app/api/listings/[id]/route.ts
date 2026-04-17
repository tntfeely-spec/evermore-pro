import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const { data: listing, error } = await supabase
    .from('funeral_home_listings')
    .select('*')
    .eq('id', id)
    .eq('account_id', account.id)
    .single();

  if (error || !listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  // Verify listing belongs to account
  const { data: existing } = await supabase
    .from('funeral_home_listings')
    .select('id')
    .eq('id', id)
    .eq('account_id', account.id)
    .single();

  if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  const body = await request.json();
  const { description, phone, website, services, price_range_cremation, price_range_burial } = body;

  const { data: updated, error } = await supabase
    .from('funeral_home_listings')
    .update({
      description,
      phone,
      website,
      services,
      price_range_cremation,
      price_range_burial,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}
