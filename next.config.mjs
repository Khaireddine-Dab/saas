/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent mapbox-gl from being bundled on the server
      config.externals = [...(config.externals || []), 'mapbox-gl'];
    }
    return config;
  },
}

export default nextConfig
