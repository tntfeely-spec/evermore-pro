import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedTestUser() {
  console.log('Creating test auth user...');

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'james@sunsetvalleyfh.com',
    password: 'Sunset2026!',
    email_confirm: true,
    user_metadata: {
      account_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      business_name: 'Sunset Valley Funeral Home',
    },
  });

  if (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }

  console.log('Test user created:', data.user?.id);

  // Link auth user to existing account
  const { error: updateError } = await supabase
    .from('funeral_home_accounts')
    .update({ user_id: data.user!.id })
    .eq('id', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890');

  if (updateError) {
    console.error('Error linking user to account:', updateError.message);
  } else {
    console.log('Linked to account a1b2c3d4-e5f6-7890-abcd-ef1234567890');
  }

  console.log('');
  console.log('Login credentials:');
  console.log('  Email: james@sunsetvalleyfh.com');
  console.log('  Password: Sunset2026!');
}

seedTestUser();
