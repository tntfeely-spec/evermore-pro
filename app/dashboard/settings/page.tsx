'use client'

import { useState, useEffect, type FormEvent } from 'react'
import type { FuneralHomeAccount } from '@/types'

type SettingsTab = 'account' | 'billing' | 'notifications'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [account, setAccount] = useState<FuneralHomeAccount | null>(null)
  const [loading, setLoading] = useState(true)

  // Account form
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Notifications
  const [emailInquiries, setEmailInquiries] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/account')
        if (!res.ok) {
          window.location.href = '/pro/login'
          return
        }
        const data = await res.json()
        setAccount(data)
        setBusinessName(data.business_name ?? '')
        setOwnerName(data.owner_name ?? '')
        setPhone(data.phone ?? '')
      } catch {
        window.location.href = '/pro/login'
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSaveAccount = async (e: FormEvent) => {
    e.preventDefault()
    if (!account) return
    setSaving(true)

    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName, owner_name: ownerName, phone }),
      })

      if (!res.ok) throw new Error('Failed to save')
      showToast('success', 'Account updated successfully!')
    } catch {
      showToast('error', 'Failed to update account. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      showToast('error', 'Failed to open billing portal.')
    }
  }

  const handleSaveNotifications = (e: FormEvent) => {
    e.preventDefault()
    showToast('success', 'Notification preferences saved!')
  }

  const tabs: { label: string; value: SettingsTab }[] = [
    { label: 'Account', value: 'account' },
    { label: 'Billing', value: 'billing' },
    { label: 'Notifications', value: 'notifications' },
  ]

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">Loading...</div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
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

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === tab.value
                ? 'border-[#D4AF37] text-[#0F172A] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccount} className="bg-white rounded-xl p-6 border border-gray-200 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#D4AF37] text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
          <div>
            <h3 className="text-sm text-gray-500">Current Plan</h3>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              Evermore Pro &mdash; $199/month
            </p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Status</h3>
            <span
              className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                account?.subscription_status === 'active' || account?.subscription_status === 'trialing'
                  ? 'bg-[#10B981]/10 text-[#10B981]'
                  : account?.subscription_status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {account?.subscription_status === 'active' || account?.subscription_status === 'trialing'
                ? 'Active'
                : account?.subscription_status === 'cancelled'
                  ? 'Cancelled'
                  : 'Inactive'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleManageBilling}
              className="bg-[#0F172A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              Manage Billing
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 font-medium px-6 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">New family inquiry emails</p>
              <p className="text-sm text-gray-500">Email me when I receive a new family inquiry</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailInquiries}
                onChange={(e) => setEmailInquiries(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekly performance summary</p>
              <p className="text-sm text-gray-500">Weekly listing performance summary</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weeklySummary}
                onChange={(e) => setWeeklySummary(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
            </label>
          </div>

          <button
            type="submit"
            className="bg-[#D4AF37] text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:bg-[#C4A030] transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </form>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
            <p className="text-sm text-gray-600 mt-2">
              Please contact support to cancel your subscription. We&apos;re here to help with any
              concerns you may have.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
