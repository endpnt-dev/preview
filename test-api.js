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
        'x-api-key': 'ek_live_demo123',
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