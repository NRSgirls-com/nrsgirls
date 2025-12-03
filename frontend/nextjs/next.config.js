/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Power optimizations
  poweredByHeader: false,

  // Compression
  compress: true,

  // Image optimization
  images: {
    domains: ['nrsgirls.com', 'cdn.nrsgirls.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  // Redirects (if needed)
  async redirects() {
    return [
      // Redirect old URLs to new ones if needed
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // Rewrites for clean URLs
  async rewrites() {
    return [
      // Keep URLs clean
      // Static HTML files served with clean URLs handled by Vercel
    ]
  },
}

module.exports = nextConfig
