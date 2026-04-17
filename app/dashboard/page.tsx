import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { FuneralHomeAccount, FamilyInquiry } from '@/types'

export default async function DashboardPage() {
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

  const { count: inquiryCount } = await supabase
    .from('family_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', account.id)

  const { data: recentInquiries } = await supabase
    .from('family_inquiries')
    .select('*')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<FamilyInquiry[]>()

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {account.business_name}
        </h1>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            account.subscription_status === 'active' || account.subscription_status === 'trialing'
              ? 'bg-[#10B981]/10 text-[#10B981]'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {account.subscription_status === 'active' || account.subscription_status === 'trialing'
            ? 'Active'
            : 'Inactive'}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Listing Views</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">{inquiryCount ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Family Inquiries</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Arrangements Started</p>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
        </div>

        {recentInquiries && recentInquiries.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Family Name</th>
                    <th className="px-6 py-3 font-medium">Service Type</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4 text-sm text-gray-900">{inquiry.family_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {inquiry.service_type ?? 'Not specified'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inquiry.status === 'new'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {inquiry.status === 'new' ? 'New' : 'Read'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link
                href="/dashboard/inquiries"
                className="text-sm font-medium text-[#D4AF37] hover:underline"
              >
                View all inquiries &rarr;
              </Link>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">No inquiries yet.</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/listing"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4AF37] transition-colors group"
        >
          <p className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">
            Update Your Listing &rarr;
          </p>
          <p className="text-sm text-gray-500 mt-1">Keep your information current</p>
        </Link>
        <Link
          href="/dashboard/inquiries"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4AF37] transition-colors group"
        >
          <p className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">
            View Inquiries &rarr;
          </p>
          <p className="text-sm text-gray-500 mt-1">Respond to family inquiries</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4AF37] transition-colors group"
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
