// NOTE: API key rotated 2026-04-24 per C-008. Retrieve from Vercel env.
const API_KEY = process.env.API_KEY
if (!API_KEY) {
  console.error('API_KEY env var not set. Run: API_KEY=<your-key> node test-api.js')
  process.exit(1)
}

// Simple test script to verify the API is working
const testUrl = 'https://github.com'

async function testUnfurlAPI() {
  try {
    console.log('Testing URL Preview API...')
    console.log('URL:', testUrl)

    const response = await fetch('http://localhost:3000/api/v1/unfurl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ url: testUrl }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ API Test Successful!')
      console.log('Title:', data.data.title)
      console.log('Description:', data.data.description)
      console.log('Image:', data.data.image)
      console.log('Processing time:', data.meta.processing_ms + 'ms')
    } else {
      console.log('❌ API Test Failed')
      console.log('Error:', data.error?.message)
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message)
  }
}

testUnfurlAPI()