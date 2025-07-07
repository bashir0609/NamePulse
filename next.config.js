/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables
  env: {
    APP_NAME: 'Advanced Name Demographics Analyzer',
    APP_VERSION: '1.0.0',
  },
  
  // CORRECT: allowedDevOrigins at root level (not in experimental)
  allowedDevOrigins: [
    '192.168.0.103:3000',
    'localhost:3000',
    '127.0.0.1:3000'
  ],
  
  // API routes configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  
  // Handle redirects
  async redirects() {
    return []
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  
  // Image optimization
  images: {
    domains: [],
  },
}

module.exports = nextConfig