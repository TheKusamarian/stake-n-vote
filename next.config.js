/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/stake-n-vote" : "",
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
