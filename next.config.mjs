/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === 'true'
const repoName = (process.env.GITHUB_REPOSITORY || '').split('/')[1]

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  // When deploying to GitHub Pages, export a fully static site and
  // adjust basePath/assetPrefix so assets load under /<repoName>
  ...(isGhPages
    ? {
        output: 'export',
        basePath: repoName ? `/${repoName}` : undefined,
        assetPrefix: repoName ? `/${repoName}/` : undefined,
        images: { unoptimized: true },
      }
    : {}),
}

export default nextConfig
