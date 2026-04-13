'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
  showLineNumbers?: boolean
}

export default function CodeBlock({
  code,
  language = 'bash',
  title,
  className = '',
  showLineNumbers = false
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">{title}</h4>
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
      )}

      <div className="relative group">
        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-gray-400" />
          )}
        </button>

        {/* Code block */}
        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-gray-300">
            {showLineNumbers ? (
              <div className="table w-full">
                {lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell text-right pr-4 text-gray-500 select-none border-r border-gray-700 mr-4 min-w-[2ch]">
                      {index + 1}
                    </span>
                    <span className="table-cell pl-4">
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}