/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        "node:util": "util",
        "node:events": "events",
        "node:stream": "stream-browserify",
        "node:buffer": "buffer",
        "node:crypto": "crypto-browserify",
        "node:path": "path-browserify",
        "node:os": "os-browserify",
        "node:http": "stream-http",
        "node:https": "https-browserify",
        "node:zlib": "browserify-zlib",
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;
