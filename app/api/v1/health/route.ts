import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/response'

export async function GET(request: NextRequest) {
  return successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
}