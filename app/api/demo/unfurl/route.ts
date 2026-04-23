import { NextRequest } from 'next/server'
import { demoProxy } from '../../../../lib/demo-proxy'
import { DEMO_ALLOWED_ORIGINS } from '../../../../lib/demo-config'

export async function POST(request: NextRequest) {
  return demoProxy(request, {
    endpoint: '/unfurl',
    allowedOrigins: DEMO_ALLOWED_ORIGINS,
  })
}