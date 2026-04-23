'use client'

import { useState } from 'react'
import { Globe, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import PreviewCard from './PreviewCard'

const EXAMPLE_URLS = [
  'https://github.com',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://twitter.com/vercel',
  'https://www.figma.com',
  'https://docs.anthropic.com'
]

interface UnfurlDemoProps {
  className?: string
}

export default function UnfurlDemo({ className = '' }: UnfurlDemoProps) {
  const [url, setUrl] = useState('https://github.com')
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUnfurl = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/demo/unfurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        setError(null)
      } else {
        setError(data.error?.message || 'Failed to unfurl URL')
        setResult(null)
      }
    } catch (err) {
      setError('Network error - please try again')
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl)
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUnfurl()
    }
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-6 w-6 text-teal-400" />
        <h3 className="text-xl font-semibold">Try it live</h3>
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a URL to unfurl..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-100 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleUnfurl}
            disabled={isLoading || !url.trim()}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unfurling...
              </>
            ) : (
              'Unfurl'
            )}
          </button>
        </div>

        {/* Example URLs */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Try:</span>
          {EXAMPLE_URLS.map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => handleExampleClick(exampleUrl)}
              className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              disabled={isLoading}
            >
              {exampleUrl.replace(/^https?:\/\//, '').split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {(result || error) && (
        <div className="mt-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {result && result.success && (
            <>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Successfully extracted metadata in {result.meta?.processing_ms}ms</span>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                {/* Preview Card */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Link Preview</h4>
                  <PreviewCard data={result.data} showUrl />
                </div>

                {/* Metadata Summary */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Extracted Data</h4>
                  <div className="bg-gray-900 rounded p-3 text-xs space-y-1">
                    {result.data.title && (
                      <div><span className="text-gray-400">Title:</span> <span className="text-gray-200">{result.data.title}</span></div>
                    )}
                    {result.data.description && (
                      <div><span className="text-gray-400">Description:</span> <span className="text-gray-200">{result.data.description.substring(0, 80)}...</span></div>
                    )}
                    {result.data.image && (
                      <div><span className="text-gray-400">Image:</span> <span className="text-blue-400">{result.data.image}</span></div>
                    )}
                    {result.data.site_name && (
                      <div><span className="text-gray-400">Site:</span> <span className="text-gray-200">{result.data.site_name}</span></div>
                    )}
                    {result.data.type && (
                      <div><span className="text-gray-400">Type:</span> <span className="text-gray-200">{result.data.type}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}