import type { NextConfig } from 'next';
 
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      fallback: [
        // API routes - proxy to backend
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
        },
        // Legacy site fallback
        {
          source: '/:path*',
          destination: 'https://my-legacy-site.com/:path*',
        },
      ],
    };
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  },

  // Image optimization for mix artwork and user avatars
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.nrsgirls.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'my-legacy-site.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // Custom headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
 
export default nextConfig;