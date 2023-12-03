/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["localhost", "res.cloudinary.com", "host.docker.internal"],
  },
};

module.exports = nextConfig;
