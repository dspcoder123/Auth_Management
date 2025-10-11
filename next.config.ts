/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix lockfile warning
  outputFileTracingRoot: undefined,
  // Ensure proper deployment
  trailingSlash: false,
}
module.exports = nextConfig;