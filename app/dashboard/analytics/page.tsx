import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { FuneralHomeAccount, FuneralHomeListing } from '@/types'

export default async function AnalyticsPage() {
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

  // Total inquiry count
  const { count: totalInquiries } = await supabase
    .from('family_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', account.id)

  // New inquiries this week
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { count: weeklyInquiries } = await supabase
    .from('family_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', account.id)
    .gte('created_at', sevenDaysAgo.toISOString())

  // Listing for profile completeness
  const { data: listing } = await supabase
    .from('funeral_home_listings')
    .select('*')
    .eq('account_id', account.id)
    .single<FuneralHomeListing>()

  // Calculate profile completeness
  let filledFields = 0
  const totalFields = 6
  if (listing) {
    if (listing.business_description) filledFields++
    if (listing.phone) filledFields++
    if (listing.website) filledFields++
    if (listing.services_offered && listing.services_offered.length > 0) filledFields++
    if (listing.price_range_cremation) filledFields++
    if (listing.price_range_burial) filledFields++
  }
  const completeness = Math.round((filledFields / totalFields) * 100)

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Listing Analytics</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Listing Views This Month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{totalInquiries ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Inquiries Received</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{weeklyInquiries ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">New Inquiries This Week</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{completeness}%</p>
          <p className="text-sm text-gray-500 mt-1">Profile Completeness</p>
        </div>
      </div>

      {/* Weekly Views Bar Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Views</h2>

        <div className="flex items-end justify-between gap-3 h-48 px-4">
          {days.map((day) => (
            <div key={day} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col justify-end h-36">
                <div
                  className="bg-[#D4AF37]/20 rounded-t-md w-full"
                  style={{ height: '0px' }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{day}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6">Analytics update every 24 hours</p>
      </div>
    </div>
  )
}
