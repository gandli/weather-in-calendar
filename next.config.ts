import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // Controls DNS prefetching to improve privacy and performance
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            // Enforces HTTPS connections. Preload directive included for HSTS preload list submission.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            // Prevents the site from being embedded in iframes on other domains (Clickjacking protection)
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            // Prevents the browser from MIME-sniffing a response away from the declared content-type
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            // Controls how much referrer information is included with requests
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            // Disables access to sensitive browser features.
            // Note: This app relies on user-inputted city names and does NOT use the Geolocation API.
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
