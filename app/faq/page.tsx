import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | Evermore Pro',
  description: 'Frequently asked questions about Evermore Pro billing, listings, inquiries, lead claims, refunds, and more.',
};

const faqs = [
  {
    q: 'How does billing work?',
    a: 'Evermore Pro costs $199 per month. Your subscription is billed automatically on the same day each month through Stripe. You can view your invoices and update your payment method anytime from Dashboard > Settings > Billing > Manage Billing.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Dashboard > Settings > Billing and click Manage Billing. From the Stripe billing portal you can cancel immediately or at the end of your current billing period. There are no cancellation fees, no contracts, and no penalties. Your listing remains on Evermore Directory but reverts to the free tier.',
  },
  {
    q: 'How do I update my listing?',
    a: 'Go to Dashboard > My Listing. From there you can edit your business description, services offered, pricing ranges, phone number, and website. Changes are saved instantly and reflected on your public Evermore Directory listing within minutes.',
  },
  {
    q: 'How do I see my inquiries?',
    a: 'Go to Dashboard > Inquiries. Every inquiry submitted by a family through your Evermore Directory listing appears here with the family name, email, phone number, service type, and message. You can filter by New or Read, and click any inquiry to see full details.',
  },
  {
    q: 'What is the Evermore Directory?',
    a: 'The Evermore Directory (funeralhomedirectories.com) is a free funeral home search engine used by families to find and compare funeral homes across all 50 states. It lists over 4,800 funeral homes and is cited by ChatGPT, Google Gemini, and other AI assistants when families search for funeral services. Evermore Pro is the software platform that funeral homes use to manage their listing, receive family inquiries, and grow their business through the directory.',
  },
  {
    q: 'How do families find my listing?',
    a: 'Families find your listing by searching for funeral homes on Evermore Directory by city, state, or ZIP code. Your listing also appears when AI assistants like ChatGPT and Google Gemini recommend funeral homes in your area. Evermore Pro subscribers receive an enhanced listing with a verified badge, higher placement, and real-time inquiry notifications.',
  },
  {
    q: 'What is the difference between a subscriber and a non-subscriber?',
    a: 'Subscribers ($199/month) receive an enhanced listing with a verified badge, priority placement in search results, real-time family inquiry notifications with full contact details, listing analytics, and access to the case management dashboard. Non-subscribers have a basic listing and can claim individual leads for $75 each when a family contacts them through the directory.',
  },
  {
    q: 'How do lead claims work?',
    a: 'When a family submits an inquiry through your Evermore Directory listing and you are not a subscriber, you receive an email notification with the family name and service type but not their contact details. The email includes a Claim This Lead button that links to a $75 one-time payment. Once payment is processed, the full contact details (name, email, phone, message) are automatically emailed to you. No manual steps, no waiting. Subscribers receive all inquiry details automatically at no per-lead cost.',
  },
  {
    q: 'How do I get a refund?',
    a: 'For subscription refunds, email hello@evermorepro.com within 7 days of a charge and we will process a full refund for that billing period. For lead claim refunds ($75), we offer a refund if the contact information provided was invalid or the inquiry was clearly spam. Email hello@evermorepro.com with the inquiry details and we will review within 24 hours.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-center mb-12">
          Everything you need to know about Evermore Pro.
        </p>

        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h2>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</p>
          <p className="text-gray-600 mb-6">Email us at hello@evermorepro.com and we will get back to you within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-block bg-[#D4AF37] text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:bg-[#E8CC6A] transition-colors"
            >
              View Pricing
            </Link>
            <Link
              href="/dashboard"
              className="inline-block bg-[#0F172A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1E293B] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
