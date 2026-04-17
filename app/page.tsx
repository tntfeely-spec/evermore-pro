import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0F172A] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The software that grows your funeral home
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Get found by more families. Manage cases online. Get paid faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pro/signup"
              className="bg-[#D4AF37] text-[#0F172A] px-6 py-3 rounded-lg font-semibold hover:bg-[#E8CC6A] transition-colors"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-[#0F172A]">4,800+</p>
            <p className="text-sm text-gray-600 mt-1">Listed funeral homes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0F172A]">Cited by ChatGPT and Gemini</p>
            <p className="text-sm text-gray-600 mt-1">AI-visible directory</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0F172A]">No demo required</p>
            <p className="text-sm text-gray-600 mt-1">Start in minutes</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-12">
            Everything you need to grow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#D4AF37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Get Found First</h3>
              <p className="text-gray-600">
                Your enhanced listing puts you at the top of search results. Families find you
                before your competitors -- on Google, ChatGPT, and the Evermore Directory.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#D4AF37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                Arrangements Made Simple
              </h3>
              <p className="text-gray-600">
                Send arrangement forms online. Families review packages, select options, and sign
                electronically -- no printing, scanning, or office visits required.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#D4AF37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Get Paid Faster</h3>
              <p className="text-gray-600">
                Accept payments online as part of the arrangement flow. Families can pay deposits
                or balances in full -- no awkward conversations, no chasing checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-[#0F172A] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl text-white italic leading-relaxed mb-6">
            &ldquo;We got 10 new cases in the first month. Families could finally find us
            online.&rdquo;
          </p>
          <p className="text-[#D4AF37] font-medium">
            &mdash; Funeral Director, Houston TX
          </p>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Evermore Pro</h3>
          <p className="mb-6">
            <span className="text-4xl font-bold text-[#0F172A]">$199</span>
            <span className="text-gray-500">/month</span>
          </p>
          <ul className="text-left space-y-3 mb-8">
            {[
              "Enhanced directory listing",
              "Verified badge on your listing",
              "Real-time family inquiry notifications",
              "Online arrangement flow with e-signatures",
              "Online payment processing",
              "Case management dashboard",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-green-500 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/pro/signup"
            className="block w-full bg-[#D4AF37] text-[#0F172A] py-3 rounded-lg font-semibold hover:bg-[#E8CC6A] transition-colors"
          >
            Start Free Trial
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No demo required. No setup fee. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#D4AF37] font-bold text-lg mb-3">Evermore Pro</p>
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link href="/pro/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/pro/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/pro/contact" className="text-gray-400 text-sm hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; 2026 Evermore Pro
          </p>
          <p className="text-gray-600 text-xs mt-2">
            A product of Colbridges Digital LLC
          </p>
        </div>
      </footer>
    </>
  );
}
