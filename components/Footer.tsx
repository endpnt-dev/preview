import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">endpnt Preview API</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Fast, reliable URL metadata extraction API. Perfect for social media apps,
              chat platforms, and content management systems.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/endpnt-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://endpnt.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-1"
              >
                <span className="text-sm">endpnt.dev</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/api/v1/health" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                  API Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Contact: hello@endpnt.dev</span>
              </li>
              <li>
                <Link href="https://endpnt.dev/privacy" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="https://endpnt.dev/terms" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} endpnt.dev. Fast, reliable APIs for developers.
          </p>
        </div>
      </div>
    </footer>
  )
}