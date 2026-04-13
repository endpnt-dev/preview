'use client'

import Link from 'next/link'
import { Globe, ArrowLeft, Code, BookOpen } from 'lucide-react'
import ApiTester from '@/components/ApiTester'
import CodeBlock from '@/components/CodeBlock'

export default function DocsPage() {
  return (
    <div className="bg-gray-900 text-gray-100">

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
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-teal-400" />
                Authentication
              </h2>
              <p className="text-gray-400 mb-4">
                All API requests require an API key passed in the <code className="bg-gray-800 px-2 py-1 rounded text-teal-300">x-api-key</code> header.
              </p>
              <CodeBlock
                code="x-api-key: ek_your_api_key_here"
                language="http"
              />
            </section>

            {/* Endpoint */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-6 w-6 text-teal-400" />
                Endpoint
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-teal-400 font-mono text-lg">POST /api/v1/unfurl</div>
                  <div className="text-gray-400 text-sm mt-1">Extract metadata from a URL</div>
                </div>
              </div>
            </section>

            {/* Parameters */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Parameters</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Parameter</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Required</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-300">
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4 font-mono text-teal-300">url</td>
                      <td className="py-3 px-4 text-gray-400">string</td>
                      <td className="py-3 px-4 text-green-400 font-medium">Yes</td>
                      <td className="py-3 px-4">URL to extract metadata from</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4 font-mono text-teal-300">include_html</td>
                      <td className="py-3 px-4 text-gray-400">boolean</td>
                      <td className="py-3 px-4 text-gray-400">No</td>
                      <td className="py-3 px-4">Include raw HTML in response (default: false)</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4 font-mono text-teal-300">timeout</td>
                      <td className="py-3 px-4 text-gray-400">number</td>
                      <td className="py-3 px-4 text-gray-400">No</td>
                      <td className="py-3 px-4">Request timeout in ms (1000-15000, default: 5000)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-teal-300">follow_redirects</td>
                      <td className="py-3 px-4 text-gray-400">boolean</td>
                      <td className="py-3 px-4 text-gray-400">No</td>
                      <td className="py-3 px-4">Follow HTTP redirects (default: true)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Response Fields */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Response Fields</h2>
              <div className="space-y-2 text-sm bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><code className="text-teal-400">title</code> <span className="text-gray-400">- Page title</span></div>
                  <div><code className="text-teal-400">description</code> <span className="text-gray-400">- Meta description</span></div>
                  <div><code className="text-teal-400">image</code> <span className="text-gray-400">- Social media image URL</span></div>
                  <div><code className="text-teal-400">favicon</code> <span className="text-gray-400">- Site favicon URL</span></div>
                  <div><code className="text-teal-400">site_name</code> <span className="text-gray-400">- Website name</span></div>
                  <div><code className="text-teal-400">type</code> <span className="text-gray-400">- Open Graph type</span></div>
                  <div><code className="text-teal-400">canonical_url</code> <span className="text-gray-400">- Canonical URL</span></div>
                  <div><code className="text-teal-400">theme_color</code> <span className="text-gray-400">- Theme color</span></div>
                </div>
              </div>
            </section>

            {/* Example Response */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Example Response</h2>
              <CodeBlock
                language="json"
                showLineNumbers={true}
                code={JSON.stringify({
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
                }, null, 2)}
              />
            </section>
          </div>

          {/* Interactive Tester */}
          <div className="lg:sticky lg:top-8 h-fit">
            <ApiTester />
          </div>
        </div>
      </div>
    </div>
  )
}