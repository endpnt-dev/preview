'use client'

import { useState } from 'react'
import { Play, Copy, Check, Loader2, AlertCircle, Settings } from 'lucide-react'
import PreviewCard from './PreviewCard'

interface ApiTesterProps {
  className?: string
}

export default function ApiTester({ className = '' }: ApiTesterProps) {
  const [url, setUrl] = useState('https://github.com')
  const [options, setOptions] = useState({
    include_html: false,
    timeout: 5000,
    follow_redirects: true,
  })
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleTest = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/unfurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '',
        },
        body: JSON.stringify({
          url: url.trim(),
          ...options,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: {
          message: 'Network error - please try again',
          code: 'NETWORK_ERROR'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const generateCurlCommand = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://preview.endpnt.dev'
    const body = JSON.stringify({ url, ...options }, null, 2)

    return `curl -X POST '${baseUrl}/api/v1/unfurl' \\
  -H 'x-api-key: YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '${body.replace(/'/g, "'\\''")}' \\
  | jq .`
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Play className="h-6 w-6 text-teal-400" />
        <h3 className="text-xl font-semibold">API Tester</h3>
      </div>

      <div className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-100 placeholder-gray-400"
            placeholder="https://example.com"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Advanced Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeout (ms)
              </label>
              <input
                type="number"
                value={options.timeout}
                onChange={(e) => setOptions({ ...options, timeout: parseInt(e.target.value) || 5000 })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-100"
                min="1000"
                max="15000"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={options.include_html}
                  onChange={(e) => setOptions({ ...options, include_html: e.target.checked })}
                  className="w-4 h-4 text-teal-600 bg-gray-600 border-gray-500 rounded focus:ring-teal-400"
                />
                Include raw HTML
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={options.follow_redirects}
                  onChange={(e) => setOptions({ ...options, follow_redirects: e.target.checked })}
                  className="w-4 h-4 text-teal-600 bg-gray-600 border-gray-500 rounded focus:ring-teal-400"
                />
                Follow redirects
              </label>
            </div>
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={handleTest}
          disabled={isLoading || !url.trim()}
          className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing API...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Test API
            </>
          )}
        </button>

        {/* cURL Command */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">cURL Command</h4>
            <button
              onClick={() => copyToClipboard(generateCurlCommand(), 'curl')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              {copied === 'curl' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              Copy
            </button>
          </div>
          <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto text-gray-300">
            <code>{generateCurlCommand()}</code>
          </pre>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-300">Response</h4>
              <button
                onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'json')}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                {copied === 'json' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy JSON
              </button>
            </div>

            {result.success ? (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Success • {result.meta?.processing_ms}ms</span>
                </div>

                {/* Preview and JSON in tabs or side-by-side */}
                <div className="grid lg:grid-cols-2 gap-4">
                  {/* Preview Card */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Preview</h5>
                    <PreviewCard data={result.data} showUrl />
                  </div>

                  {/* JSON Response */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">JSON Response</h5>
                    <div className="bg-gray-900 p-3 rounded text-xs overflow-x-auto max-h-80 overflow-y-auto">
                      <pre>
                        <code className="text-gray-300">
                          {JSON.stringify(result, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Error Status */}
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Error • {result.error?.code || 'UNKNOWN_ERROR'}</span>
                </div>

                {/* Error Details */}
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
                  <p className="text-red-300 text-sm mb-2">{result.error?.message || 'An unknown error occurred'}</p>

                  {/* Full Error JSON */}
                  <details className="mt-2">
                    <summary className="text-xs text-red-400 cursor-pointer">View full error response</summary>
                    <pre className="mt-2 text-xs text-red-300 bg-red-950/50 p-2 rounded overflow-x-auto">
                      <code>{JSON.stringify(result, null, 2)}</code>
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}