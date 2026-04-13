import Link from 'next/link'
import { Globe, ArrowLeft, Check, Zap, Shield, Globe2 } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
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
      popular: false,
    },
    {
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
      popular: true,
    },
    {
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
      popular: false,
    },
    {
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
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-300 hover:text-white mr-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">Pricing</span>
            </div>
          </div>
        </div>
      </header>

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gray-800 rounded-lg p-6 ${
                plan.popular ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-gray-400">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2 px-4 rounded transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">All plans include</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Metadata</h3>
              <p className="text-gray-400 text-sm">
                Extract titles, descriptions, images, Open Graph, and Twitter Card data from any URL.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">
                Sub-500ms response times with our optimized HTML parsing engine.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
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
          <div className="space-x-4">
            <Link
              href="/docs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center px-6 py-3 border border-gray-600 hover:bg-gray-800 rounded text-lg font-semibold transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}