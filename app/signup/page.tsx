'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    yourName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    hearAbout: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: form.businessName,
          name: form.yourName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          hear_about: form.hearAbout,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]';

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left column */}
        <div className="lg:pt-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Start your free trial</h1>
          <p className="text-gray-600 text-lg mb-8">
            Get your funeral home listed, start receiving family inquiries, and manage everything
            from one dashboard.
          </p>
          <ul className="space-y-4">
            {[
              'No credit card required',
              'Set up in under 15 minutes',
              'Cancel anytime',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-green-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#0F172A] font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — form */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                required
                value={form.businessName}
                onChange={(e) => update('businessName', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-1">
                Your name
              </label>
              <input
                id="yourName"
                type="text"
                required
                value={form.yourName}
                onChange={(e) => update('yourName', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
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
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street address
              </label>
              <input
                id="address"
                type="text"
                required
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  id="state"
                  required
                  value={form.state}
                  onChange={(e) => update('state', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP code
              </label>
              <input
                id="zip"
                type="text"
                required
                maxLength={5}
                value={form.zip}
                onChange={(e) => update('zip', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="hearAbout" className="block text-sm font-medium text-gray-700 mb-1">
                How did you hear about us?
              </label>
              <select
                id="hearAbout"
                value={form.hearAbout}
                onChange={(e) => update('hearAbout', e.target.value)}
                className={inputClass}
              >
                <option value="">Select one (optional)</option>
                <option value="Google">Google</option>
                <option value="Evermore Directory">Evermore Directory</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0F172A] py-3 rounded-lg font-semibold hover:bg-[#E8CC6A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create My Account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D4AF37] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
