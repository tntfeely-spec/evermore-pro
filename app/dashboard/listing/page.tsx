import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { FuneralHomeAccount, FuneralHomeListing } from '@/types'
import ListingEditor from './ListingEditor'

export default async function ListingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single<FuneralHomeAccount>()

  if (!account) redirect('/login')

  const { data: listing } = await supabase
    .from('funeral_home_listings')
    .select('*')
    .eq('account_id', account.id)
    .single<FuneralHomeListing>()

  return <ListingEditor listing={listing} account={account} />
}
