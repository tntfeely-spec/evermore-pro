import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/pro',

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://funeralhomedirectories.com',
          },
        ],
      },
    ]
  },
}

export default nextConfig
