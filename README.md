# endpnt URL Preview API

Extract rich link previews from any URL with our fast and reliable API. Perfect for social media apps, chat platforms, and content management systems.

## Features

- **Lightning Fast**: Sub-500ms response times with pure HTML parsing (no browser needed)
- **Comprehensive Metadata**: Extract titles, descriptions, images, Open Graph, and Twitter Card data
- **Secure by Design**: Built-in SSRF protection and rate limiting
- **Developer Friendly**: Simple REST API with consistent response format

## Quick Start

```bash
# Test the API
curl -X POST 'https://preview.endpnt.dev/api/v1/unfurl' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://github.com"}'
```

## API Documentation

Visit [https://preview.endpnt.dev/docs](https://preview.endpnt.dev/docs) for interactive API documentation.

## Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Deployment

This project is designed to deploy on Vercel with zero configuration.

```bash
# Build for production
npm run build

# Start production server
npm start
```
