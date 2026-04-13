'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, Zap, Shield, ArrowRight, Copy, Check } from 'lucide-react'

export default function HomePage() {
  const [demoUrl, setDemoUrl] = useState('https://github.com')
  const [demoResult, setDemoResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const handleDemo = async () => {
    if (!demoUrl) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/unfurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'ek_live_demo123', // Demo key from env
        },
        body: JSON.stringify({ url: demoUrl }),
      })

      const data = await response.json()
      setDemoResult(data)
    } catch (error) {
      setDemoResult({ success: false, error: { message: 'Failed to fetch' } })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">endpnt Preview API</span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Extract rich link previews from any URL
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Fast, reliable API for extracting metadata, Open Graph tags, and Twitter Cards.
            Perfect for social media apps, chat platforms, and content management systems.
          </p>

          <div className="flex justify-center space-x-4 mb-12">
            <div className="flex items-center text-green-400">
              <Zap className="h-5 w-5 mr-2" />
              <span>Sub-500ms response times</span>
            </div>
            <div className="flex items-center text-blue-400">
              <Shield className="h-5 w-5 mr-2" />
              <span>SSRF protection built-in</span>
            </div>
          </div>

          {/* Live Demo */}
          <div className="bg-gray-800 rounded-lg p-6 mb-12">
            <h3 className="text-lg font-semibold mb-4">Try it now</h3>
            <div className="flex space-x-4">
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="Enter a URL to unfurl..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleDemo}
                disabled={isLoading || !demoUrl}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                {isLoading ? 'Loading...' : 'Unfurl'}
              </button>
            </div>

            {demoResult && (
              <div className="mt-6">
                {demoResult.success ? (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="border border-gray-600 rounded-lg p-4">
                      {demoResult.data.image && (
                        <img
                          src={demoResult.data.image}
                          alt={demoResult.data.title}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-lg mb-1">
                        {demoResult.data.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">
                        {demoResult.data.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        {demoResult.data.favicon && (
                          <img
                            src={demoResult.data.favicon}
                            alt="favicon"
                            className="w-4 h-4 mr-2"
                          />
                        )}
                        <span>{demoResult.data.site_name}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-400 text-center">
                    Error: {demoResult.error?.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get started in seconds</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* cURL Example */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">cURL</h3>
                <button
                  onClick={() => copyToClipboard(`curl -X POST 'https://preview.endpnt.dev/api/v1/unfurl' \\
  -H 'x-api-key: YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"url": "https://github.com"}'`, 'curl')}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`curl -X POST 'https://preview.endpnt.dev/api/v1/unfurl' \\
  -H 'x-api-key: YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"url": "https://github.com"}'`}</code>
              </pre>
            </div>

            {/* JavaScript Example */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">JavaScript</h3>
                <button
                  onClick={() => copyToClipboard(`const response = await fetch('https://preview.endpnt.dev/api/v1/unfurl', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://github.com' }),
})

const data = await response.json()
console.log(data)`, 'js')}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`const response = await fetch('https://preview.endpnt.dev/api/v1/unfurl', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://github.com' }),
})

const data = await response.json()
console.log(data)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need for link previews</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Metadata</h3>
              <p className="text-gray-400">
                Extract titles, descriptions, images, favicons, and all Open Graph and Twitter Card data.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Pure HTML parsing with Cheerio. No browser overhead. Sub-500ms response times.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure by Design</h3>
              <p className="text-gray-400">
                Built-in SSRF protection, rate limiting, and security best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Start building amazing link previews today with our simple API.
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors"
          >
            View Documentation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 endpnt.dev. Fast, reliable APIs for developers.</p>
        </div>
      </footer>
    </div>
  )
}