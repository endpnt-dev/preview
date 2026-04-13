import * as cheerio from 'cheerio'
import { UNFURL_DEFAULTS } from './config'
import { isValidUrl, isSSRFProtected, resolveUrl, extractDomainFromUrl, normalizeUrl } from './url-utils'

export interface UnfurlOptions {
  timeout?: number
  follow_redirects?: boolean
  include_html?: boolean
  max_redirects?: number
}

export interface UnfurlResult {
  url: string
  final_url: string
  title: string | null
  description: string | null
  image: string | null
  image_width: number | null
  image_height: number | null
  favicon: string | null
  site_name: string | null
  type: string | null
  locale: string | null
  twitter_card: string | null
  twitter_site: string | null
  canonical_url: string | null
  theme_color: string | null
  author: string | null
  published_date: string | null
  keywords: string[]
  html?: string
}

export class UnfurlError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'UnfurlError'
  }
}

export async function unfurlUrl(url: string, options: UnfurlOptions = {}): Promise<UnfurlResult> {
  const opts = { ...UNFURL_DEFAULTS, ...options }

  // Validate URL
  if (!isValidUrl(url)) {
    throw new UnfurlError('Invalid URL format', 'INVALID_URL')
  }

  // SSRF Protection
  if (!isSSRFProtected(url)) {
    throw new UnfurlError('URL not allowed for security reasons', 'INVALID_URL')
  }

  const normalizedUrl = normalizeUrl(url)
  let currentUrl = normalizedUrl
  let redirectCount = 0
  let response: Response
  let finalUrl = currentUrl

  // Follow redirects manually to track count and final URL
  try {
    while (redirectCount <= opts.max_redirects) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), opts.timeout)

      try {
        response = await fetch(currentUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'endpnt-preview/1.0 (+https://preview.endpnt.dev)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          redirect: 'manual',
        })
      } finally {
        clearTimeout(timeoutId)
      }

      // Check if this is a redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (!location) {
          throw new UnfurlError('Redirect without location header', 'FETCH_FAILED')
        }

        currentUrl = resolveUrl(location, currentUrl)
        finalUrl = currentUrl

        // Validate redirect URL
        if (!isSSRFProtected(currentUrl)) {
          throw new UnfurlError('Redirect URL not allowed for security reasons', 'INVALID_URL')
        }

        redirectCount++
        if (redirectCount > opts.max_redirects) {
          throw new UnfurlError(`Too many redirects (>${opts.max_redirects})`, 'TOO_MANY_REDIRECTS')
        }
        continue
      }

      // Got final response
      break
    }

    if (!response.ok) {
      throw new UnfurlError(`HTTP ${response.status}: ${response.statusText}`, 'FETCH_FAILED', response.status)
    }

    // Check content type
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      // Handle non-HTML content
      return {
        url: normalizedUrl,
        final_url: finalUrl,
        title: extractFilenameFromUrl(finalUrl),
        description: `${contentType} file`,
        image: null,
        image_width: null,
        image_height: null,
        favicon: null,
        site_name: extractDomainFromUrl(finalUrl),
        type: 'file',
        locale: null,
        twitter_card: null,
        twitter_site: null,
        canonical_url: finalUrl,
        theme_color: null,
        author: null,
        published_date: null,
        keywords: [],
        ...(opts.include_html && { html: '' }),
      }
    }

    // Read HTML
    const html = await response.text()

    // Parse with Cheerio
    const $ = cheerio.load(html)

    // Extract metadata
    const metadata = extractMetadata($, finalUrl)

    return {
      url: normalizedUrl,
      final_url: finalUrl,
      ...metadata,
      ...(opts.include_html && { html }),
    }

  } catch (error) {
    if (error instanceof UnfurlError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new UnfurlError('Request timed out', 'TIMEOUT')
      }

      // Network errors
      if (error.message.includes('fetch')) {
        throw new UnfurlError('Failed to fetch URL', 'FETCH_FAILED')
      }
    }

    throw new UnfurlError('Internal error during unfurling', 'INTERNAL_ERROR')
  }
}

function extractMetadata($: cheerio.CheerioAPI, finalUrl: string) {
  // Title extraction priority: og:title > twitter:title > title tag > first h1
  const title = getMetaContent($, 'og:title') ||
                getMetaContent($, 'twitter:title') ||
                $('title').text()?.trim() ||
                $('h1').first().text()?.trim() ||
                null

  // Description extraction priority: og:description > twitter:description > meta description
  const description = getMetaContent($, 'og:description') ||
                      getMetaContent($, 'twitter:description') ||
                      getMetaContent($, 'description') ||
                      null

  // Image extraction
  let image = getMetaContent($, 'og:image') ||
              getMetaContent($, 'twitter:image') ||
              null

  // Resolve relative URLs
  if (image) {
    image = resolveUrl(image, finalUrl)
  }

  // Image dimensions
  const imageWidth = parseIntOrNull(getMetaContent($, 'og:image:width'))
  const imageHeight = parseIntOrNull(getMetaContent($, 'og:image:height'))

  // Favicon
  let favicon = $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href') ||
                $('link[rel="apple-touch-icon"]').attr('href') ||
                '/favicon.ico'

  if (favicon) {
    favicon = resolveUrl(favicon, finalUrl)
  }

  // Site name
  const siteName = getMetaContent($, 'og:site_name') ||
                   getMetaContent($, 'application-name') ||
                   $('title').text()?.split(' - ')[1]?.split(' | ')[1] ||
                   extractDomainFromUrl(finalUrl)

  // Other Open Graph properties
  const type = getMetaContent($, 'og:type') || 'website'
  const locale = getMetaContent($, 'og:locale') || null

  // Twitter Card data
  const twitterCard = getMetaContent($, 'twitter:card') || null
  const twitterSite = getMetaContent($, 'twitter:site') || null

  // Canonical URL
  const canonicalUrl = $('link[rel="canonical"]').attr('href') ||
                       getMetaContent($, 'og:url') ||
                       finalUrl

  // Theme color
  const themeColor = getMetaContent($, 'theme-color') ||
                     getMetaContent($, 'msapplication-TileColor') ||
                     null

  // Author
  const author = getMetaContent($, 'author') ||
                 getMetaContent($, 'article:author') ||
                 null

  // Published date
  const publishedDate = getMetaContent($, 'article:published_time') ||
                        getMetaContent($, 'published_time') ||
                        getMetaContent($, 'date') ||
                        null

  // Keywords
  const keywordsStr = getMetaContent($, 'keywords') || ''
  const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(Boolean) : []

  return {
    title,
    description,
    image,
    image_width: imageWidth,
    image_height: imageHeight,
    favicon,
    site_name: siteName,
    type,
    locale,
    twitter_card: twitterCard,
    twitter_site: twitterSite,
    canonical_url: canonicalUrl ? resolveUrl(canonicalUrl, finalUrl) : finalUrl,
    theme_color: themeColor,
    author,
    published_date: publishedDate,
    keywords,
  }
}

function getMetaContent($: cheerio.CheerioAPI, name: string): string | null {
  // Try property attribute first (for Open Graph)
  const propertyMeta = $(`meta[property="${name}"]`).attr('content')
  if (propertyMeta) return propertyMeta.trim()

  // Try name attribute
  const nameMeta = $(`meta[name="${name}"]`).attr('content')
  if (nameMeta) return nameMeta.trim()

  return null
}

function parseIntOrNull(value: string | null): number | null {
  if (!value) return null
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? null : parsed
}

function extractFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const filename = pathname.split('/').pop() || 'file'
    return filename
  } catch {
    return 'file'
  }
}