export const API_VERSION = '1.0.0'

export const TIER_LIMITS = {
  free: {
    requests_per_minute: 10,
    requests_per_month: 100
  },
  starter: {
    requests_per_minute: 60,
    requests_per_month: 5000
  },
  pro: {
    requests_per_minute: 300,
    requests_per_month: 25000
  },
  enterprise: {
    requests_per_minute: 1000,
    requests_per_month: 100000
  },
} as const

export const UNFURL_DEFAULTS = {
  timeout: 10000,
  follow_redirects: true,
  include_html: false,
  max_redirects: 5,
  max_content_length: 5 * 1024 * 1024, // 5MB
}

export const VALIDATION_LIMITS = {
  timeout: { min: 1000, max: 15000 },
  max_redirects: { min: 0, max: 10 },
}

export const ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_URL: 'INVALID_URL',
  INVALID_PARAMS: 'INVALID_PARAMS',
  FETCH_FAILED: 'FETCH_FAILED',
  TIMEOUT: 'TIMEOUT',
  TOO_MANY_REDIRECTS: 'TOO_MANY_REDIRECTS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

// SSRF protection - private IP ranges to block
export const BLOCKED_IP_RANGES = [
  '127.0.0.0/8',     // Loopback
  '10.0.0.0/8',      // Private Class A
  '172.16.0.0/12',   // Private Class B
  '192.168.0.0/16',  // Private Class C
  '169.254.0.0/16',  // Link-local
  '224.0.0.0/4',     // Multicast
  '240.0.0.0/4',     // Reserved
  'fc00::/7',        // IPv6 Private
  'fe80::/10',       // IPv6 Link-local
  '::1/128',         // IPv6 Loopback
]

export const BLOCKED_DOMAINS = [
  'localhost',
  '0.0.0.0',
]

export type ApiTier = keyof typeof TIER_LIMITS
export type ErrorCode = keyof typeof ERROR_CODES