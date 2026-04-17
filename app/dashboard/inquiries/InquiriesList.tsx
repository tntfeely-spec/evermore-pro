'use client'

import { useState } from 'react'
import type { FamilyInquiry } from '@/types'

type FilterTab = 'all' | 'new' | 'read'

interface InquiriesListProps {
  inquiries: FamilyInquiry[]
}

export default function InquiriesList({ inquiries: initialInquiries }: InquiriesListProps) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<FamilyInquiry | null>(null)
  const [markingRead, setMarkingRead] = useState(false)

  const filters: { label: string; value: FilterTab }[] = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Read', value: 'read' },
  ]

  const filtered = inquiries.filter((inq) => {
    if (activeFilter === 'all') return true
    return inq.status === activeFilter
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const truncate = (text: string | null, max: number) => {
    if (!text) return ''
    return text.length > max ? text.slice(0, max) + '...' : text
  }

  const handleMarkAsRead = async (inquiry: FamilyInquiry) => {
    setMarkingRead(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId: inquiry.id, status: 'read' }),
      })

      if (!res.ok) throw new Error('Failed to update')

      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiry.id ? { ...inq, status: 'read' as const } : inq))
      )
      setSelectedInquiry({ ...inquiry, status: 'read' })
    } catch {
      // Silently fail — user can retry
    } finally {
      setMarkingRead(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Family Inquiries</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeFilter === filter.value
                ? 'bg-[#0F172A] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Family Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Service Type</th>
                <th className="px-6 py-3 font-medium">Message</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {inquiry.family_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inquiry.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inquiry.phone ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inquiry.service_type ?? 'Not specified'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {truncate(inquiry.message, 60)}
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
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            No inquiries yet. Make sure your listing is complete to start receiving family
            inquiries.
          </p>
        </div>
      )}

      {/* Slide-over Panel */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedInquiry(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500">Family Name</p>
                <p className="text-sm font-medium text-gray-900">{selectedInquiry.family_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{selectedInquiry.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedInquiry.phone ?? 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedInquiry.service_type ?? 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(selectedInquiry.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedInquiry.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {selectedInquiry.status === 'new' ? 'New' : 'Read'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                  {selectedInquiry.message ?? 'No message provided.'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              {selectedInquiry.status === 'new' && (
                <button
                  onClick={() => handleMarkAsRead(selectedInquiry)}
                  disabled={markingRead}
                  className="w-full bg-[#0F172A] text-white font-medium py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {markingRead ? 'Updating...' : 'Mark as Read'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
