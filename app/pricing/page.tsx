import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Evermore Pro",
  description: "Simple, transparent pricing for funeral home software. $199/month, no contracts.",
};

const features = [
  "Enhanced Evermore Directory listing",
  "Verified badge on your listing",
  "Real-time family inquiry notifications",
  "Listing analytics (views, clicks, inquiries)",
  "Online arrangement flow",
  "Multi-signer e-signature",
  "Package and pricing configuration",
  "Online payment processing",
  "Automated review requests",
  "Case management dashboard",
];

const faqs = [
  {
    q: "Do I need to already be listed on Evermore Directory?",
    a: "No. When you sign up for Evermore Pro your listing is created automatically.",
  },
  {
    q: "Is there a contract or commitment?",
    a: "No contracts. Month to month. Cancel anytime from your dashboard.",
  },
  {
    q: "How long does setup take?",
    a: "About 15 minutes. No demo call required.",
  },
  {
    q: "Does this work for traditional funeral homes or just cremation?",
    a: "Both. Evermore Pro works for cremation, traditional burial, and full-service funeral homes.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 px-4">
      <h1 className="text-4xl font-bold text-center text-[#0F172A] mb-12">
        Simple, transparent pricing
      </h1>

      {/* Plan card */}
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-20">
        <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-2">Evermore Pro</h2>
        <p className="text-center mb-8">
          <span className="text-5xl font-bold text-[#0F172A]">$199</span>
          <span className="text-gray-500 text-lg">/month</span>
        </p>

        <ul className="space-y-4 mb-8">
          {features.map((feature) => (
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
          href="/signup"
          className="block w-full bg-[#D4AF37] text-[#0F172A] py-3 rounded-lg font-semibold text-center hover:bg-[#E8CC6A] transition-colors"
        >
          Start Free Trial. No Credit Card Required.
        </Link>

        <p className="text-sm text-gray-500 text-center mt-4">
          Questions? Email us at{" "}
          <a href="mailto:hello@evermorepro.com" className="underline">
            hello@evermorepro.com
          </a>
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
