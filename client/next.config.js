/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["localhost", "res.cloudinary.com", "host.docker.internal"],
  },
  async headers() {
    return [
      {
        source: "/socket.io/", // Adjust the path as needed
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:9999", // Use the service name from Docker Compose
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://messages:9999", // Use the service name from Docker Compose
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
