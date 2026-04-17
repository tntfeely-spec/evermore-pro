'use client';

import { useState, FormEvent } from 'react';

export default function TestInquiryPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    familyName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          family_name: form.familyName,
          email: form.email,
          phone: form.phone,
          service_type: form.serviceType,
          message: form.message,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit inquiry.');
      }

      setInquiryId(data.inquiry_id || data.id || '');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]';

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center font-bold mb-8">
        TEST ONLY — Development Use
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Test Inquiry</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          <p className="font-semibold">Inquiry submitted successfully!</p>
          {inquiryId && <p className="text-sm mt-1">Inquiry ID: <span className="font-mono">{inquiryId}</span></p>}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">
            Family name
          </label>
          <input
            id="familyName"
            type="text"
            required
            value={form.familyName}
            onChange={(e) => update('familyName', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
            Service type
          </label>
          <select
            id="serviceType"
            value={form.serviceType}
            onChange={(e) => update('serviceType', e.target.value)}
            className={inputClass}
          >
            <option value="">Select service type</option>
            <option value="Cremation">Cremation</option>
            <option value="Traditional Burial">Traditional Burial</option>
            <option value="Memorial Service">Memorial Service</option>
            <option value="Pre-Planning">Pre-Planning</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D4AF37] text-[#0F172A] py-3 rounded-lg font-semibold hover:bg-[#E8CC6A] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Test Inquiry'}
        </button>
      </form>
    </div>
  );
}
