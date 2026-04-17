import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status');

  let query = supabase
    .from('family_inquiries')
    .select('*')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false });

  if (statusFilter === 'new') query = query.eq('read', false);
  if (statusFilter === 'read') query = query.eq('read', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const body = await request.json();
  const { id, read } = body;

  // Verify inquiry belongs to this account
  const { data: inquiry } = await supabase
    .from('family_inquiries')
    .select('id')
    .eq('id', id)
    .eq('account_id', account.id)
    .single();

  if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });

  const { data: updated, error } = await supabase
    .from('family_inquiries')
    .update({ read: !!read })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}
