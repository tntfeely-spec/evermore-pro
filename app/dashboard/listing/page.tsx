"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const SERVICE_OPTIONS = ['Cremation','Traditional Burial','Memorial Service','Pre-Planning','Green Burial','Veteran Services','Pet Cremation','Graveside Services']

export default function ListingPage() {
  const [listing, setListing] = useState<any>(null)
  const [accountId, setAccountId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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
        setAccountId(account.id)
        const { data } = await supabase
          .from('funeral_home_listings')
          .select('*')
          .eq('account_id', account.id)
          .single()
        setListing(data || { account_id: account.id, description: '', services: [], price_range_cremation: '', price_range_burial: '' })
      }
      setLoading(false)
    })
  }, [])

  const toggleService = (svc: string) => {
    const current = listing.services || []
    const updated = current.includes(svc) ? current.filter((s: string) => s !== svc) : [...current, svc]
    setListing({ ...listing, services: updated })
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('funeral_home_listings').upsert({ ...listing, account_id: accountId })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Your Evermore Directory Listing</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#0F172A] mb-4">Business Description</h2>
          <textarea
            value={listing?.description || ''}
            onChange={e => setListing({ ...listing, description: e.target.value })}
            maxLength={500}
            rows={4}
            placeholder="Tell families about your funeral home..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] resize-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">{(listing?.description || '').length}/500</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#0F172A] mb-4">Services Offered</h2>
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map(svc => (
              <label key={svc} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={(listing?.services || []).includes(svc)}
                  onChange={() => toggleService(svc)}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <span className="text-sm text-gray-700">{svc}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#0F172A] mb-4">Pricing</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cremation price range</label>
              <input type="text" value={listing?.price_range_cremation || ''}
                onChange={e => setListing({ ...listing, price_range_cremation: e.target.value })}
                placeholder="e.g. $1,200 - $3,500"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Burial price range</label>
              <input type="text" value={listing?.price_range_burial || ''}
                onChange={e => setListing({ ...listing, price_range_burial: e.target.value })}
                placeholder="e.g. $4,500 - $9,000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="bg-[#D4AF37] text-[#0F172A] px-8 py-3 rounded-lg font-semibold hover:bg-[#E8CC6A] transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Listing'}
        </button>
      </div>
    </div>
  )
}
