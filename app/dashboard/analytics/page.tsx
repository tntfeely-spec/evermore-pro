"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, unread: 0, topService: 'N/A', completeness: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: account } = await supabase
        .from('funeral_home_accounts')
        .select('id')
        .eq('email', session.user.email)
        .single()
      if (account) {
        const { data: inquiries } = await supabase
          .from('family_inquiries')
          .select('*')
          .eq('account_id', account.id)
        const { data: listing } = await supabase
          .from('funeral_home_listings')
          .select('*')
          .eq('account_id', account.id)
          .single()

        const all = inquiries || []
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const thisWeek = all.filter(i => new Date(i.created_at) > weekAgo).length
        const unread = all.filter(i => !i.read).length
        const services = all.map(i => i.service_type).filter(Boolean)
        const topService = services.length > 0
          ? Object.entries(services.reduce((acc: any, s: string) => ({ ...acc, [s]: (acc[s] || 0) + 1 }), {}))
              .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'N/A'
          : 'N/A'

        const l = listing || {}
        const fields = [l.description, l.price_range_cremation, l.price_range_burial, (l.services || []).length > 0]
        const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100)

        setStats({ total: all.length, thisWeek, unread, topService, completeness })
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Listing Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Total Inquiries</p>
          <p className="text-3xl font-bold text-[#0F172A]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">This Week</p>
          <p className="text-3xl font-bold text-[#0F172A]">{stats.thisWeek}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Top Service</p>
          <p className="text-lg font-bold text-[#0F172A]">{stats.topService}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Profile Complete</p>
          <p className="text-3xl font-bold text-[#0F172A]">{stats.completeness}%</p>
          <div className="h-1.5 bg-gray-100 rounded-full mt-2">
            <div className="h-1.5 bg-[#D4AF37] rounded-full" style={{ width: `${stats.completeness}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#0F172A] mb-2">Listing Views</h2>
        <p className="text-sm text-gray-500">View tracking coming soon. Inquiries are tracked above.</p>
      </div>
    </div>
  )
}
