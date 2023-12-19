/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  swcMinify: true,
  images: {
    domains: ["localhost", "res.cloudinary.com", "host.docker.internal"],
  },
};

module.exports = nextConfig;
