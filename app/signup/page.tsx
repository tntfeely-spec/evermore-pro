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
  const [success, setSuccess] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    referralSource: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): string | null {
    if (!form.businessName.trim()) return 'Business name is required.';
    if (!form.ownerName.trim()) return 'Your name is required.';
    if (!form.email.trim() || !form.email.includes('@')) return 'Please enter a valid email address.';
    if (!form.phone.trim()) return 'Phone number is required.';
    if (!form.address.trim()) return 'Street address is required.';
    if (!form.city.trim()) return 'City is required.';
    if (!form.state) return 'Please select a state.';
    if (!form.zip.trim() || !/^[0-9]{5}$/.test(form.zip)) return 'Please enter a valid 5-digit ZIP code.';
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          ownerName: form.ownerName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          referralSource: form.referralSource,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setTempPassword(data.tempPassword || '');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 5000);
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left column */}
        <div className="lg:pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Start your free trial</h1>
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
                <span className="text-gray-900 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — form or success */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {success ? (
            <div className="text-center py-8">
              <svg
                className="h-16 w-16 text-green-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account created!</h2>
              <p className="text-gray-700 mb-2">Your temporary password is:</p>
              <p className="text-lg font-mono font-bold text-gray-900 bg-gray-100 rounded-lg px-4 py-2 inline-block mb-4">
                {tempPassword}
              </p>
              <p className="text-gray-600 text-sm mb-4">Please change it after your first login.</p>
              <p className="text-gray-500 text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <>
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
                  <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                  </label>
                  <input
                    id="ownerName"
                    type="text"
                    required
                    value={form.ownerName}
                    onChange={(e) => update('ownerName', e.target.value)}
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

                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    required
                    maxLength={5}
                    pattern="[0-9]{5}"
                    value={form.zip}
                    onChange={(e) => update('zip', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="referralSource"
                    value={form.referralSource}
                    onChange={(e) => update('referralSource', e.target.value)}
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
                  {loading ? 'Creating your account...' : 'Create My Account'}
                </button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-[#D4AF37] font-medium hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
