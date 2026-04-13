'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', current: pathname === '/' },
    { name: 'Docs', href: '/docs', current: pathname === '/docs' },
    { name: 'Pricing', href: '/pricing', current: pathname === '/pricing' },
  ]

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <Globe className="h-8 w-8 text-teal-400 group-hover:text-teal-300 transition-colors" />
            <span className="ml-2 text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
              endpnt Preview API
            </span>
          </Link>

          <nav className="flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-teal-400 bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}