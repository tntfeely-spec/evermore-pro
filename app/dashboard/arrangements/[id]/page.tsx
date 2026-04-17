'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Arrangement {
  id: string
  family_name: string
  email: string
  phone: string | null
  service_type: string | null
  status: 'new' | 'in_progress' | 'documents_sent' | 'payment_received' | 'completed'
  package_name: string | null
  price_quoted: number | null
  notes: string | null
  inquiry_id: string | null
  created_at: string
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'documents_sent', label: 'Documents Sent' },
  { value: 'payment_received', label: 'Payment Received' },
  { value: 'completed', label: 'Completed' },
]

export default function ArrangementDetailPage() {
  const params = useParams()
  const arrangementId = params.id as string

  const [arrangement, setArrangement] = useState<Arrangement | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Editable fields
  const [status, setStatus] = useState<string>('new')
  const [packageName, setPackageName] = useState('')
  const [priceQuoted, setPriceQuoted] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/arrangements')
        if (res.ok) {
          const data = await res.json()
          const arr = (Array.isArray(data) ? data : []).find(
            (a: Arrangement) => a.id === arrangementId
          )
          if (arr) {
            setArrangement(arr)
            setStatus(arr.status)
            setPackageName(arr.package_name ?? '')
            setPriceQuoted(arr.price_quoted != null ? String(arr.price_quoted) : '')
            setNotes(arr.notes ?? '')
          }
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [arrangementId])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    setSaving(true)
    try {
      const res = await fetch('/api/arrangements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: arrangementId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      setArrangement((prev) => (prev ? { ...prev, status: newStatus as Arrangement['status'] } : prev))
      showToast('success', 'Status updated')
    } catch {
      showToast('error', 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePackage = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/arrangements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: arrangementId,
          package_name: packageName,
          price_quoted: priceQuoted ? Number(priceQuoted) : null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      showToast('success', 'Package saved')
    } catch {
      showToast('error', 'Failed to save package')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/arrangements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: arrangementId, notes }),
      })
      if (!res.ok) throw new Error('Failed')
      showToast('success', 'Notes saved')
    } catch {
      showToast('error', 'Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const handleMarkComplete = async () => {
    await handleStatusChange('completed')
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-gray-500">Loading...</div>
    )
  }

  if (!arrangement) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-gray-500">
        Arrangement not found.
      </div>
    )
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

      <Link
        href="/pro/dashboard/arrangements"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; Back to Arrangements
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {arrangement.family_name}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Status</h2>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{arrangement.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">
                {arrangement.phone ?? 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Type</p>
              <p className="text-sm font-medium text-gray-900">
                {arrangement.service_type ?? 'Not specified'}
              </p>
            </div>
          </div>

          {/* Package */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Package</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="e.g. Traditional Service Package"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Quoted</label>
              <input
                type="number"
                value={priceQuoted}
                onChange={(e) => setPriceQuoted(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="5000"
              />
            </div>
            <button
              onClick={handleSavePackage}
              disabled={saving}
              className="bg-[#D4AF37] text-[#0F172A] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Package'}
            </button>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
              placeholder="Add notes about this arrangement..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="bg-[#D4AF37] text-[#0F172A] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>

            <button
              disabled
              className="w-full text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            >
              Send Documents (Coming Soon)
            </button>

            <button
              disabled
              className="w-full text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
            >
              Request Payment (Coming Soon)
            </button>

            {status !== 'completed' && (
              <button
                onClick={handleMarkComplete}
                disabled={saving}
                className="w-full bg-[#10B981] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Updating...' : 'Mark Complete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
