/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      'react-is': 'react-is',
    },
  },
  // Transpile packages that might have issues with Turbopack
  transpilePackages: ['react-is'],
  // Security headers for wallet integration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://freighter.app https://albedo.link; object-src 'none';",
          },
        ],
      },
    ]
  },
}

export default nextConfig
