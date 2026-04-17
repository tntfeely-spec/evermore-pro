'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

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

interface Inquiry {
  id: string
  family_name: string
  email: string
  phone: string | null
  service_type: string | null
  message: string | null
  read: boolean
  created_at: string
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  new: { label: 'New', classes: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', classes: 'bg-yellow-100 text-yellow-700' },
  documents_sent: { label: 'Documents Sent', classes: 'bg-purple-100 text-purple-700' },
  payment_received: { label: 'Payment Received', classes: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-500' },
}

export default function ArrangementsPage() {
  const [arrangements, setArrangements] = useState<Arrangement[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [arrRes, inqRes] = await Promise.all([
        fetch('/api/arrangements'),
        fetch('/api/inquiries'),
      ])

      if (arrRes.ok) {
        const arrData = await arrRes.json()
        setArrangements(Array.isArray(arrData) ? arrData : [])
      }

      if (inqRes.ok) {
        const inqData = await inqRes.json()
        const allInquiries: Inquiry[] = Array.isArray(inqData) ? inqData : []
        // Filter out inquiries that already have arrangements
        const arrangementInquiryIds = arrangements.map((a) => a.inquiry_id).filter(Boolean)
        setInquiries(allInquiries.filter((i) => !arrangementInquiryIds.includes(i.id)))
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Re-filter inquiries when arrangements update
  useEffect(() => {
    if (!loading) {
      const arrangementInquiryIds = arrangements.map((a) => a.inquiry_id).filter(Boolean)
      setInquiries((prev) => prev.filter((i) => !arrangementInquiryIds.includes(i.id)))
    }
  }, [arrangements, loading])

  const handleConvert = async (inquiry: Inquiry) => {
    setConverting(inquiry.id)
    try {
      const res = await fetch('/api/arrangements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry_id: inquiry.id,
          family_name: inquiry.family_name,
          email: inquiry.email,
          phone: inquiry.phone,
          service_type: inquiry.service_type,
        }),
      })

      if (res.ok) {
        const newArr = await res.json()
        setArrangements((prev) => [newArr, ...prev])
        setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id))
      }
    } catch {
      // Silently fail
    } finally {
      setConverting(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-gray-500">Loading...</div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Arrangements</h1>

      {/* Arrangements Table */}
      {arrangements.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Family Name</th>
                  <th className="px-6 py-3 font-medium">Service Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date Started</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {arrangements.map((arr) => {
                  const config = statusConfig[arr.status] ?? statusConfig.new
                  return (
                    <tr
                      key={arr.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {arr.family_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {arr.service_type ?? 'Not specified'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(arr.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/arrangements/${arr.id}`}
                          className="text-sm text-[#D4AF37] font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            No arrangements yet. Convert a family inquiry to start an arrangement.
          </p>
        </div>
      )}

      {/* Convertible Inquiries */}
      {inquiries.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            New inquiries that can be converted to arrangements
          </h2>
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{inquiry.family_name}</p>
                  <p className="text-sm text-gray-500">
                    {inquiry.service_type ?? 'No service specified'} &middot;{' '}
                    {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleConvert(inquiry)}
                  disabled={converting === inquiry.id}
                  className="bg-[#D4AF37] text-[#0F172A] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {converting === inquiry.id ? 'Converting...' : 'Convert to Arrangement'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
