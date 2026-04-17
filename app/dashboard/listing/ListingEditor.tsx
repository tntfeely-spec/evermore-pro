'use client'

import { useState, type FormEvent } from 'react'
import type { FuneralHomeListing, FuneralHomeAccount } from '@/types'

const SERVICE_OPTIONS = [
  'Cremation',
  'Traditional Burial',
  'Memorial Service',
  'Pre-Planning',
  'Green Burial',
  'Veteran Services',
  'Pet Cremation',
  'Graveside Services',
]

interface ListingEditorProps {
  listing: FuneralHomeListing | null
  account: FuneralHomeAccount
}

export default function ListingEditor({ listing, account }: ListingEditorProps) {
  const [description, setDescription] = useState(listing?.description ?? '')
  const [phone, setPhone] = useState(listing?.phone ?? '')
  const [website, setWebsite] = useState(listing?.website ?? '')
  const [services, setServices] = useState<string[]>(listing?.services ?? [])
  const [cremationPrice, setCremationPrice] = useState(listing?.price_range_cremation ?? '')
  const [burialPrice, setBurialPrice] = useState(listing?.price_range_burial ?? '')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!listing) return

    setSaving(true)
    setToast(null)

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          phone,
          website,
          services,
          price_range_cremation: cremationPrice,
          price_range_burial: burialPrice,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setToast({ type: 'success', message: 'Listing updated successfully' })
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast({ type: 'error', message: 'Failed to save listing. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-[#10B981]/10 text-[#10B981]'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Your Evermore Directory Listing
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 space-y-8">
          {/* Business Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                rows={4}
                maxLength={500}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                placeholder="Tell families about your funeral home, your history, and what makes your services special..."
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {description.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="https://www.yourfuneralhome.com"
              />
            </div>
          </div>

          {/* Services Offered */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Services Offered</h2>
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((service) => (
                <label
                  key={service}
                  className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={services.includes(service)}
                    onChange={() => toggleService(service)}
                    className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cremation Price Range
              </label>
              <input
                type="text"
                value={cremationPrice}
                onChange={(e) => setCremationPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="$1,200 - $3,500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burial Price Range
              </label>
              <input
                type="text"
                value={burialPrice}
                onChange={(e) => setBurialPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="$4,000 - $8,000"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="bg-[#D4AF37] text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Listing'}
          </button>
        </form>

        {/* Right Side Preview */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Listing Preview</h3>
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
              <h4 className="text-lg font-bold text-gray-900">{account.business_name}</h4>

              {description ? (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description.length > 120 ? description.slice(0, 120) + '...' : description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">No description yet</p>
              )}

              {services.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {services.map((s) => (
                    <span
                      key={s}
                      className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {(cremationPrice || burialPrice) && (
                <div className="text-sm text-gray-600 space-y-1 border-t border-gray-100 pt-3">
                  {cremationPrice && (
                    <p>
                      <span className="font-medium">Cremation:</span> {cremationPrice}
                    </p>
                  )}
                  {burialPrice && (
                    <p>
                      <span className="font-medium">Burial:</span> {burialPrice}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
