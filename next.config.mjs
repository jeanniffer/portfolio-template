/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SITE_VARIANT: process.env.SITE_VARIANT || "nonprofits",
  },
};

export default nextConfig;
