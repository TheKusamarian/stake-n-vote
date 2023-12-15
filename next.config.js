/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/out",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
