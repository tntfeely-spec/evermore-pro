"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<any>(null)

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
        const { data } = await supabase
          .from('family_inquiries')
          .select('*')
          .eq('account_id', account.id)
          .order('created_at', { ascending: false })
        setInquiries(data || [])
      }
      setLoading(false)
    })
  }, [])

  const markRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from('family_inquiries').update({ read: true }).eq('id', id)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: true } : i))
    setSelected((prev: any) => prev?.id === id ? { ...prev, read: true } : prev)
  }

  const filtered = inquiries.filter(i => {
    if (filter === 'new') return !i.read
    if (filter === 'read') return i.read
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Family Inquiries</h1>

      <div className="flex gap-2 mb-4">
        {['all', 'new', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f === 'all' ? `All (${inquiries.length})` : f === 'new' ? `New (${inquiries.filter(i => !i.read).length})` : `Read (${inquiries.filter(i => i.read).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 text-sm">
            No inquiries yet. Complete your listing to start receiving family inquiries.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(inq => (
              <div key={inq.id}
                onClick={() => setSelected(inq)}
                className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!inq.read ? 'bg-blue-50/30' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{inq.family_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{inq.service_type} · {new Date(inq.created_at).toLocaleDateString()}</p>
                    {inq.message && <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{inq.message}</p>}
                  </div>
                  {!inq.read && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-4">New</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-[#0F172A]">Inquiry Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">Close</button>
            </div>
            <div className="space-y-4 text-sm">
              <div><p className="text-gray-500 text-xs mb-1">Family Name</p><p className="font-medium">{selected.family_name}</p></div>
              <div><p className="text-gray-500 text-xs mb-1">Email</p><p>{selected.email}</p></div>
              {selected.phone && <div><p className="text-gray-500 text-xs mb-1">Phone</p><p>{selected.phone}</p></div>}
              <div><p className="text-gray-500 text-xs mb-1">Service Needed</p><p>{selected.service_type}</p></div>
              {selected.message && <div><p className="text-gray-500 text-xs mb-1">Message</p><p className="text-gray-700 leading-relaxed">{selected.message}</p></div>}
              <div><p className="text-gray-500 text-xs mb-1">Received</p><p>{new Date(selected.created_at).toLocaleString()}</p></div>
              <div><p className="text-gray-500 text-xs mb-1">Source</p><p className="capitalize">{selected.source || 'direct'}</p></div>
              {!selected.read && (
                <button onClick={() => markRead(selected.id)}
                  className="w-full bg-[#D4AF37] text-[#0F172A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#E8CC6A] transition-colors mt-4">
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
