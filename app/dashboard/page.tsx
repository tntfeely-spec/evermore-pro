"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [account, setAccount] = useState<any>(null)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return

      const { data: accountData } = await supabase
        .from('funeral_home_accounts')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (accountData) {
        setAccount(accountData)
        const { data: inquiryData } = await supabase
          .from('family_inquiries')
          .select('*')
          .eq('account_id', accountData.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setInquiries(inquiryData || [])
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  )

  const unread = inquiries.filter(i => !i.read).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
        Welcome back{account?.business_name ? `, ${account.business_name}` : ''}
      </h1>
      <p className="text-gray-500 text-sm mb-8">Here is what is happening with your listing today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Total Inquiries</p>
          <p className="text-3xl font-bold text-[#0F172A]">{inquiries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Unread</p>
          <p className="text-3xl font-bold text-[#0F172A]">{unread}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">From Directory</p>
          <p className="text-3xl font-bold text-[#0F172A]">
            {inquiries.filter(i => i.source === 'directory').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Listing Status</p>
          <p className="text-lg font-bold text-green-600">Active</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#0F172A]">Recent Inquiries</h2>
        </div>
        {inquiries.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 text-sm">
            No inquiries yet. Complete your listing to start receiving family inquiries.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inquiries.map(inq => (
              <div key={inq.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{inq.family_name}</p>
                  <p className="text-xs text-gray-500">{inq.service_type} · {new Date(inq.created_at).toLocaleDateString()}</p>
                </div>
                {!inq.read && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <button onClick={() => window.location.href = '/pro/dashboard/listing'}
          className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-[#D4AF37] transition-colors">
          <p className="font-medium text-[#0F172A] mb-1">Update Your Listing</p>
          <p className="text-xs text-gray-500">Edit your description, services, and pricing</p>
        </button>
        <button onClick={() => window.location.href = '/pro/dashboard/inquiries'}
          className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-[#D4AF37] transition-colors">
          <p className="font-medium text-[#0F172A] mb-1">View All Inquiries</p>
          <p className="text-xs text-gray-500">{unread} unread message{unread !== 1 ? 's' : ''}</p>
        </button>
        <button onClick={() => window.location.href = '/pro/dashboard/settings'}
          className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-[#D4AF37] transition-colors">
          <p className="font-medium text-[#0F172A] mb-1">Account Settings</p>
          <p className="text-xs text-gray-500">Billing, notifications, profile</p>
        </button>
      </div>
    </div>
  )
}
