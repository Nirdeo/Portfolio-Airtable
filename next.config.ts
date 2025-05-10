import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['v5.airtableusercontent.com', 'dl.airtable.com'],
  },
};

export default nextConfig;
