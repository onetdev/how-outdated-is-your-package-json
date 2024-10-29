/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    const oneHourCache = {
      key: 'Cache-Control',
      value: 'public, max-age=3600, immutable',
    };

    return [
      {
        source: '/assets/:all*',
        headers: [oneHourCache],
      },
      {
        source: '/favicon.png',
        headers: [oneHourCache],
      },
    ];
  },
};

module.exports = nextConfig;
