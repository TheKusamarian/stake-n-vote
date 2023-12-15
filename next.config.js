/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/stake-n-vote" : "";

const nextConfig = {
  basePath: basePath,
  output: "export",
  images: {
    unoptimized: true,
    path: `${basePath}/_next/image`,
  },
};

module.exports = nextConfig;
