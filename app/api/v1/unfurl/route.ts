import { NextRequest } from 'next/server'
import { unfurlUrl, UnfurlError, UnfurlOptions } from '@/lib/unfurl'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { VALIDATION_LIMITS } from '@/lib/config'
import { isValidUrl } from '@/lib/url-utils'

interface UnfurlRequest {
  url: string
  include_html?: boolean
  timeout?: number
  follow_redirects?: boolean
}

export async function GET(request: NextRequest) {
  return handleUnfurlRequest(request)
}

export async function POST(request: NextRequest) {
  return handleUnfurlRequest(request)
}

async function handleUnfurlRequest(request: NextRequest) {
  const startTime = Date.now()
  const requestId = generateRequestId()

  try {
    // Auth check
    const apiKey = getApiKeyFromHeaders(request.headers)
    const keyInfo = validateApiKey(apiKey)

    if (!keyInfo) {
      return errorResponse(
        'AUTH_REQUIRED',
        getErrorMessage('AUTH_REQUIRED'),
        401,
        { request_id: requestId }
      )
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(apiKey!, keyInfo.tier)
    if (!rateLimitResult.allowed) {
      return errorResponse(
        'RATE_LIMIT_EXCEEDED',
        getErrorMessage('RATE_LIMIT_EXCEEDED'),
        429,
        {
          request_id: requestId,
          remaining_credits: rateLimitResult.remaining
        }
      )
    }

    // Parse request data
    let requestData: UnfurlRequest

    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url)
      requestData = {
        url: searchParams.get('url') || '',
        include_html: searchParams.get('include_html') === 'true',
        timeout: searchParams.has('timeout') ? parseInt(searchParams.get('timeout')!) : undefined,
        follow_redirects: searchParams.has('follow_redirects') ? searchParams.get('follow_redirects') === 'true' : undefined,
      }
    } else {
      try {
        requestData = await request.json()
      } catch {
        return errorResponse(
          'INVALID_PARAMS',
          'Invalid JSON body',
          400,
          { request_id: requestId }
        )
      }
    }

    // Validate required parameters
    if (!requestData.url) {
      return errorResponse(
        'INVALID_PARAMS',
        'URL parameter is required',
        400,
        { request_id: requestId }
      )
    }

    if (!isValidUrl(requestData.url)) {
      return errorResponse(
        'INVALID_URL',
        getErrorMessage('INVALID_URL'),
        400,
        { request_id: requestId }
      )
    }

    // Validate optional parameters
    if (requestData.timeout !== undefined) {
      if (requestData.timeout < VALIDATION_LIMITS.timeout.min ||
          requestData.timeout > VALIDATION_LIMITS.timeout.max) {
        return errorResponse(
          'INVALID_PARAMS',
          `Timeout must be between ${VALIDATION_LIMITS.timeout.min} and ${VALIDATION_LIMITS.timeout.max}ms`,
          400,
          { request_id: requestId }
        )
      }
    }

    // Prepare unfurl options
    const unfurlOptions: UnfurlOptions = {
      timeout: requestData.timeout,
      follow_redirects: requestData.follow_redirects,
      include_html: requestData.include_html,
    }

    // Perform unfurling
    try {
      const result = await unfurlUrl(requestData.url, unfurlOptions)

      const processingTime = Date.now() - startTime

      return successResponse(
        result,
        {
          request_id: requestId,
          processing_ms: processingTime,
          remaining_credits: rateLimitResult.remaining,
        }
      )

    } catch (error) {
      if (error instanceof UnfurlError) {
        let status = 400

        switch (error.code) {
          case 'TIMEOUT':
            status = 504
            break
          case 'FETCH_FAILED':
            status = 502
            break
          case 'TOO_MANY_REDIRECTS':
            status = 400
            break
          case 'INVALID_URL':
            status = 400
            break
          default:
            status = 500
        }

        return errorResponse(
          error.code as any,
          error.message,
          status,
          { request_id: requestId }
        )
      }

      console.error('Unfurl error:', error)
      return errorResponse(
        'INTERNAL_ERROR',
        getErrorMessage('INTERNAL_ERROR'),
        500,
        { request_id: requestId }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}