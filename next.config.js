/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Server Components
    serverComponentsExternalPackages: ['cheerio'],
  },
}

module.exports = nextConfig