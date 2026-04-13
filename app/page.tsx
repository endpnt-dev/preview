'use client'

import Link from 'next/link'
import { Globe, Zap, Shield, ArrowRight } from 'lucide-react'
import UnfurlDemo from '@/components/UnfurlDemo'
import CodeBlock from '@/components/CodeBlock'
import PreviewCard from '@/components/PreviewCard'

// Example preview data for showcase
const examplePreviews = [
  {
    title: 'GitHub: Let\'s build from here',
    description: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage Git repositories, and review code like a pro.',
    image: 'https://github.githubassets.com/images/modules/site/social-cards/campaign-social.png',
    favicon: 'https://github.githubassets.com/favicons/favicon.svg',
    site_name: 'GitHub',
    final_url: 'https://github.com'
  },
  {
    title: 'YouTube',
    description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
    image: 'https://www.youtube.com/img/desktop/yt_1200.png',
    favicon: 'https://www.youtube.com/s/desktop/favicon.ico',
    site_name: 'YouTube',
    final_url: 'https://youtube.com'
  }
]

export default function HomePage() {

  return (
    <div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Extract rich link previews from any URL
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Fast, reliable API for extracting metadata, Open Graph tags, and Twitter Cards.
            Perfect for social media apps, chat platforms, and content management systems.
          </p>

          <div className="flex justify-center space-x-6 mb-12">
            <div className="flex items-center text-green-400">
              <Zap className="h-5 w-5 mr-2" />
              <span>Sub-500ms response times</span>
            </div>
            <div className="flex items-center text-teal-400">
              <Shield className="h-5 w-5 mr-2" />
              <span>SSRF protection built-in</span>
            </div>
          </div>

          {/* Live Demo */}
          <UnfurlDemo className="mb-12" />
        </div>
      </section>

      {/* Example Previews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">See it in action</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {examplePreviews.map((preview, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-medium text-gray-300">
                  {preview.site_name} Preview
                </h3>
                <PreviewCard data={preview} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get started in seconds</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <CodeBlock
              title="cURL"
              language="bash"
              code={`curl -X POST 'https://preview.endpnt.dev/api/v1/unfurl' \\
  -H 'x-api-key: YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"url": "https://github.com"}'`}
            />

            <CodeBlock
              title="JavaScript"
              language="javascript"
              code={`const response = await fetch('https://preview.endpnt.dev/api/v1/unfurl', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://github.com' }),
})

const data = await response.json()
console.log(data)`}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need for link previews</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Metadata</h3>
              <p className="text-gray-400">
                Extract titles, descriptions, images, favicons, and all Open Graph and Twitter Card data.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Pure HTML parsing with Cheerio. No browser overhead. Sub-500ms response times.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Start building amazing link previews today with our simple API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-lg text-lg font-semibold transition-all shadow-lg"
            >
              View Documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 hover:bg-gray-800 rounded-lg text-lg font-semibold transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}