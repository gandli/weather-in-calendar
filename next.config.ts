import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/weather-in-calendar' : '',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
