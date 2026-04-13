'use client'

import { useState } from 'react'
import { ExternalLink, AlertCircle } from 'lucide-react'

interface PreviewCardProps {
  data: {
    title?: string
    description?: string
    image?: string
    favicon?: string
    site_name?: string
    final_url?: string
    url?: string
  }
  className?: string
  showUrl?: boolean
}

export default function PreviewCard({ data, className = '', showUrl = false }: PreviewCardProps) {
  const [imageError, setImageError] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  const displayUrl = data.final_url || data.url
  const displayTitle = data.title || 'Untitled'
  const displayDescription = data.description || ''
  const displaySiteName = data.site_name || (displayUrl ? new URL(displayUrl).hostname : '')

  const handleCardClick = () => {
    if (displayUrl) {
      window.open(displayUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={`group border border-gray-600 rounded-lg overflow-hidden bg-gray-800 hover:border-gray-500 transition-colors cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Image */}
      {data.image && !imageError && (
        <div className="relative overflow-hidden bg-gray-700">
          <img
            src={data.image}
            alt={displayTitle}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="flex items-start gap-3 mb-2">
          <h3 className="font-semibold text-gray-100 line-clamp-2 flex-1 group-hover:text-teal-300 transition-colors">
            {displayTitle}
          </h3>
          <ExternalLink className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Description */}
        {displayDescription && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-3">
            {displayDescription}
          </p>
        )}

        {/* Footer with favicon and site name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            {data.favicon && !faviconError ? (
              <img
                src={data.favicon}
                alt="favicon"
                className="w-4 h-4 mr-2 flex-shrink-0"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <div className="w-4 h-4 mr-2 bg-gray-600 rounded-sm flex items-center justify-center">
                <AlertCircle className="h-2.5 w-2.5 text-gray-400" />
              </div>
            )}
            <span className="truncate">{displaySiteName}</span>
          </div>

          {showUrl && displayUrl && (
            <div className="text-xs text-gray-500 truncate ml-4">
              {displayUrl.replace(/^https?:\/\//, '')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}