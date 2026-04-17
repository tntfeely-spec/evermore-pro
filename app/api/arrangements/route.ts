import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('arrangements')
    .select('*')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
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
  const { inquiry_id, family_name, email, phone, service_type } = body;

  const { data, error } = await supabase
    .from('arrangements')
    .insert({
      account_id: account.id,
      inquiry_id: inquiry_id || null,
      family_name,
      email,
      phone,
      service_type,
      status: 'new',
    })
    .select()
    .single();

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
  const { id, status, notes, package_selected, price_quoted } = body;

  const { data, error } = await supabase
    .from('arrangements')
    .update({
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      ...(package_selected !== undefined && { package_selected }),
      ...(price_quoted !== undefined && { price_quoted }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('account_id', account.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
