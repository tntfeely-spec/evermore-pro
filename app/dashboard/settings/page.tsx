'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { FuneralHomeAccount } from '@/types'

type SettingsTab = 'account' | 'billing' | 'notifications'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [account, setAccount] = useState<FuneralHomeAccount | null>(null)
  const [loading, setLoading] = useState(true)

  // Account form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Notifications
  const [emailInquiries, setEmailInquiries] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data } = await supabase
        .from('funeral_home_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single<FuneralHomeAccount>()

      if (data) {
        setAccount(data)
        setName(data.owner_name)
        setEmail(data.email)
        setPhone(data.phone)
      }
      setLoading(false)
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
      const res = await fetch(`/api/accounts/${account.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_name: name, email, phone }),
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

  const handleCancelSubscription = async () => {
    setCancelling(true)
    try {
      const res = await fetch('/api/stripe/cancel', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to cancel')
      setAccount((prev) => (prev ? { ...prev, subscription_status: 'cancelled' } : prev))
      setShowCancelModal(false)
      showToast('success', 'Subscription cancelled.')
    } catch {
      showToast('error', 'Failed to cancel subscription.')
    } finally {
      setCancelling(false)
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
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.value
                ? 'bg-[#0F172A] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Evermore Pro — $199/month
            </p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Status</h3>
            <span
              className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                account?.subscription_status === 'active' || account?.subscription_status === 'trialing'
                  ? 'bg-[#10B981]/10 text-[#10B981]'
                  : 'bg-red-100 text-red-700'
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
              className="bg-[#D4AF37] text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:bg-[#C4A030] transition-colors cursor-pointer"
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
              Are you sure you want to cancel your Evermore Pro subscription? Your listing will
              remain visible until the end of your current billing period.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
