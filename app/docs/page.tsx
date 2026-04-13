'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, ArrowLeft, Copy, Check, Play } from 'lucide-react'

export default function DocsPage() {
  const [testUrl, setTestUrl] = useState('https://github.com')
  const [testOptions, setTestOptions] = useState({
    include_html: false,
    timeout: 5000,
    follow_redirects: true,
  })
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const handleTest = async () => {
    if (!testUrl) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/unfurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'ek_live_demo123', // Demo key
        },
        body: JSON.stringify({
          url: testUrl,
          ...testOptions,
        }),
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: { message: 'Failed to fetch' } })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 2000)
  }

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
              <span className="ml-2 text-xl font-bold">API Documentation</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Documentation */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">URL Preview API</h1>
              <p className="text-gray-400 text-lg">
                Extract rich metadata and generate link previews from any URL with our fast and reliable API.
              </p>
            </div>

            {/* Authentication */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <p className="text-gray-400 mb-4">
                All API requests require an API key passed in the <code className="bg-gray-800 px-2 py-1 rounded">x-api-key</code> header.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <code className="text-green-400">x-api-key: ek_your_api_key_here</code>
              </div>
            </section>

            {/* Endpoint */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Endpoint</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-blue-400 font-mono">POST /api/v1/unfurl</div>
                  <div className="text-gray-400 text-sm mt-1">Extract metadata from a URL</div>
                </div>
              </div>
            </section>

            {/* Parameters */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Parameters</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 pr-4">Parameter</th>
                      <th className="text-left py-2 pr-4">Type</th>
                      <th className="text-left py-2 pr-4">Required</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-400">
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 font-mono">url</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2 pr-4 text-green-400">Yes</td>
                      <td className="py-2">URL to extract metadata from</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 font-mono">include_html</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2 pr-4">No</td>
                      <td className="py-2">Include raw HTML in response (default: false)</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 font-mono">timeout</td>
                      <td className="py-2 pr-4">number</td>
                      <td className="py-2 pr-4">No</td>
                      <td className="py-2">Request timeout in ms (1000-15000, default: 5000)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono">follow_redirects</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2 pr-4">No</td>
                      <td className="py-2">Follow HTTP redirects (default: true)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Response Fields */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Response Fields</h2>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><code className="text-blue-400">title</code> - Page title</div>
                  <div><code className="text-blue-400">description</code> - Meta description</div>
                  <div><code className="text-blue-400">image</code> - Social media image URL</div>
                  <div><code className="text-blue-400">favicon</code> - Site favicon URL</div>
                  <div><code className="text-blue-400">site_name</code> - Website name</div>
                  <div><code className="text-blue-400">type</code> - Open Graph type</div>
                  <div><code className="text-blue-400">canonical_url</code> - Canonical URL</div>
                  <div><code className="text-blue-400">theme_color</code> - Theme color</div>
                </div>
              </div>
            </section>

            {/* Example Response */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Example Response</h2>
              <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">{JSON.stringify({
                    "success": true,
                    "data": {
                      "url": "https://github.com",
                      "final_url": "https://github.com/",
                      "title": "GitHub: Let's build from here",
                      "description": "GitHub is where over 100 million developers shape the future of software...",
                      "image": "https://github.githubassets.com/images/modules/site/social-cards/campaign-social.png",
                      "favicon": "https://github.githubassets.com/favicons/favicon.svg",
                      "site_name": "GitHub",
                      "type": "website",
                      "canonical_url": "https://github.com/"
                    },
                    "meta": {
                      "request_id": "req_u1v2w3",
                      "processing_ms": 320,
                      "remaining_credits": 97
                    }
                  }, null, 2)}</code>
                </pre>
              </div>
            </section>
          </div>

          {/* Interactive Tester */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Play className="h-5 w-5 mr-2" />
                API Tester
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <input
                    type="url"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeout (ms)</label>
                    <input
                      type="number"
                      value={testOptions.timeout}
                      onChange={(e) => setTestOptions({ ...testOptions, timeout: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      min="1000"
                      max="15000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testOptions.include_html}
                        onChange={(e) => setTestOptions({ ...testOptions, include_html: e.target.checked })}
                        className="mr-2"
                      />
                      Include HTML
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testOptions.follow_redirects}
                        onChange={(e) => setTestOptions({ ...testOptions, follow_redirects: e.target.checked })}
                        className="mr-2"
                      />
                      Follow Redirects
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleTest}
                  disabled={isLoading || !testUrl}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  {isLoading ? 'Testing...' : 'Test API'}
                </button>

                {testResult && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Response</h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(testResult, null, 2))}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        {copied === JSON.stringify(testResult, null, 2) ?
                          <Check className="h-4 w-4" /> :
                          <Copy className="h-4 w-4" />
                        }
                      </button>
                    </div>

                    {testResult.success ? (
                      <div className="space-y-4">
                        {/* Preview Card */}
                        <div className="border border-gray-600 rounded p-3">
                          {testResult.data.image && (
                            <img
                              src={testResult.data.image}
                              alt={testResult.data.title}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <h5 className="font-medium text-sm mb-1">
                            {testResult.data.title}
                          </h5>
                          <p className="text-gray-400 text-xs mb-1">
                            {testResult.data.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            {testResult.data.favicon && (
                              <img
                                src={testResult.data.favicon}
                                alt="favicon"
                                className="w-3 h-3 mr-1"
                              />
                            )}
                            <span>{testResult.data.site_name}</span>
                          </div>
                        </div>

                        {/* JSON Response */}
                        <div className="bg-gray-900 p-3 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
                          <pre>
                            <code className="text-gray-300">
                              {JSON.stringify(testResult, null, 2)}
                            </code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-900 border border-red-700 rounded p-3">
                        <div className="text-red-300 text-sm">
                          Error: {testResult.error?.message}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}