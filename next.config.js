/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/stake-n-vote' : ''

const nextConfig = {
  basePath: '',
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    path: `${basePath}/_next/image`,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
