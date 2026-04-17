import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { FuneralHomeAccount, FuneralHomeListing, FamilyInquiry } from '@/types'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/pro/login')

  const { data: account } = await supabase
    .from('funeral_home_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single<FuneralHomeAccount>()

  if (!account) redirect('/pro/login')

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

  // Inquiries for weekly chart
  const { data: weekInquiries } = await supabase
    .from('family_inquiries')
    .select('created_at')
    .eq('account_id', account.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .returns<Pick<FamilyInquiry, 'created_at'>[]>()

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
    if (listing.description) filledFields++
    if (listing.phone) filledFields++
    if (listing.website) filledFields++
    if (listing.services && listing.services.length > 0) filledFields++
    if (listing.price_range_cremation) filledFields++
    if (listing.price_range_burial) filledFields++
  }
  const completeness = Math.round((filledFields / totalFields) * 100)

  // Build weekly chart data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayCounts = [0, 0, 0, 0, 0, 0, 0]

  if (weekInquiries) {
    for (const inq of weekInquiries) {
      const day = new Date(inq.created_at).getDay()
      // Convert from JS day (0=Sun) to Mon-Sun index
      const idx = day === 0 ? 6 : day - 1
      dayCounts[idx]++
    }
  }

  const maxCount = Math.max(...dayCounts, 1)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Listing Analytics</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Listing Views</p>
          <p className="text-xs text-gray-400">Coming soon</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{totalInquiries ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Inquiries</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{weeklyInquiries ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">New This Week</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{completeness}%</p>
          <p className="text-sm text-gray-500 mt-1">Profile Completeness</p>
        </div>
      </div>

      {/* Weekly Inquiries Bar Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Inquiries This Week</h2>

        <div className="flex items-end justify-between gap-3 px-4" style={{ height: '10rem' }}>
          {days.map((day, i) => {
            const count = dayCounts[i]
            const heightRem = count > 0 ? (count / maxCount) * 8 : 0.25
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '8rem' }}>
                  <div
                    className="bg-[#D4AF37] rounded-t w-10 mx-auto"
                    style={{ height: `${heightRem}rem` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{day}</span>
              </div>
            )
          })}
        </div>

        <p className="text-sm text-gray-400 mt-6">Analytics update daily</p>
      </div>
    </div>
  )
}
