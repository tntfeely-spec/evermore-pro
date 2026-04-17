import { createClient } from '@/lib/supabase/server'
import type { FuneralHomeAccount, FamilyInquiry } from '@/types'
import InquiriesList from './InquiriesList'

export default async function InquiriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single<FuneralHomeAccount>()

  if (!account) return null

  const { data: inquiries } = await supabase
    .from('family_inquiries')
    .select('*')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false })
    .returns<FamilyInquiry[]>()

  return <InquiriesList initialInquiries={inquiries ?? []} />
}
