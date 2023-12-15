/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/stake-n-vote/out",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
