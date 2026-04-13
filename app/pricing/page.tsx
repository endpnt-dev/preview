import Link from 'next/link'
import { Globe, ArrowLeft, Check, Zap, Shield, Globe2 } from 'lucide-react'
import PricingTable from '@/components/PricingTable'

export default function PricingPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for testing and small projects',
      features: [
        '100 requests per month',
        '10 requests per minute',
        'Basic metadata extraction',
        'Standard support',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$9',
      period: 'month',
      description: 'For growing applications and businesses',
      features: [
        '5,000 requests per month',
        '60 requests per minute',
        'Full metadata extraction',
        'Priority support',
        'Custom user agents',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'month',
      description: 'For high-traffic applications',
      features: [
        '25,000 requests per month',
        '300 requests per minute',
        'Full metadata extraction',
        'Priority support',
        'Custom user agents',
        'Webhook notifications',
      ],
      cta: 'Go Pro',
      highlighted: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large-scale applications',
      features: [
        '100,000+ requests per month',
        '1,000+ requests per minute',
        'Full metadata extraction',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantees',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="bg-gray-900 text-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-400">
            Choose the plan that fits your needs. All plans include our core features.
          </p>
        </div>

        {/* Pricing Grid */}
        <PricingTable plans={plans} className="mb-16" />

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">All plans include</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Metadata</h3>
              <p className="text-gray-400 text-sm">
                Extract titles, descriptions, images, Open Graph, and Twitter Card data from any URL.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">
                Sub-500ms response times with our optimized HTML parsing engine.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-400 text-sm">
                Built-in SSRF protection, rate limiting, and security best practices.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What happens if I exceed my plan limits?</h3>
              <p className="text-gray-400">
                Requests that exceed your monthly limit will receive a 429 rate limit error. You can upgrade your plan at any time to increase your limits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans at any time?</h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-400">
                We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What about GDPR and privacy?</h3>
              <p className="text-gray-400">
                We're fully GDPR compliant. We don't store any content from the URLs you process, only metadata for billing and analytics purposes.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">
            Sign up for a free account and start extracting link previews in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-lg text-lg font-semibold transition-all shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 hover:bg-gray-800 rounded-lg text-lg font-semibold transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}