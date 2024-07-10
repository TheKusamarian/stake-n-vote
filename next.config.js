/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
