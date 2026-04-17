import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: account, error } = await supabase
    .from('funeral_home_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  return NextResponse.json(account);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { business_name, owner_name, phone } = body;

  const { data: updated, error } = await supabase
    .from('funeral_home_accounts')
    .update({ business_name, owner_name, phone })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}
