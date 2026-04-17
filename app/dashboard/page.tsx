import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { FuneralHomeAccount, FamilyInquiry } from '@/types'

export default async function DashboardPage() {
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

  const { data: recentInquiries } = await supabase
    .from('family_inquiries')
    .select('*')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<FamilyInquiry[]>()

  const { count: totalCount } = await supabase
    .from('family_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', account.id)

  const { count: unreadCount } = await supabase
    .from('family_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', account.id)
    .eq('read', false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 24) {
      if (diffHours < 1) return 'Just now'
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const inquiryDisplay =
    (totalCount ?? 0) > 0
      ? `${totalCount}${(unreadCount ?? 0) > 0 ? ` (${unreadCount} new)` : ''}`
      : '0'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {account.business_name}
        </h1>
        {account.subscription_status === 'active' || account.subscription_status === 'trialing' ? (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            Active
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
            Inactive
          </span>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Listing Views</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{inquiryDisplay}</p>
          <p className="text-sm text-gray-500 mt-1">Family Inquiries</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Arrangements Started</p>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Inquiries</h2>
        {recentInquiries && recentInquiries.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-xs font-medium text-gray-500 uppercase px-4 py-3 text-left">
                    Family Name
                  </th>
                  <th className="text-xs font-medium text-gray-500 uppercase px-4 py-3 text-left">
                    Service Type
                  </th>
                  <th className="text-xs font-medium text-gray-500 uppercase px-4 py-3 text-left">
                    Date
                  </th>
                  <th className="text-xs font-medium text-gray-500 uppercase px-4 py-3 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900">{inquiry.family_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {inquiry.service_type ?? 'Not specified'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {!inquiry.read ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                          Read
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100">
              <Link
                href="/dashboard/inquiries"
                className="text-sm text-[#D4AF37] font-medium hover:underline"
              >
                View all inquiries &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 bg-white rounded-xl p-8 border border-gray-200 text-center">
            No inquiries yet. Complete your listing to start receiving inquiries.
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/listing"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4AF37] transition group"
        >
          <p className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">
            Update Your Listing &rarr;
          </p>
          <p className="text-sm text-gray-500 mt-1">Keep your information current</p>
        </Link>
        <Link
          href="/dashboard/inquiries"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4AF37] transition group"
        >
          <p className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">
            View Inquiries &rarr;
          </p>
          <p className="text-sm text-gray-500 mt-1">Respond to family inquiries</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4AF37] transition group"
        >
          <p className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">
            Account Settings &rarr;
          </p>
          <p className="text-sm text-gray-500 mt-1">Manage your account and billing</p>
        </Link>
      </div>
    </div>
  )
}
