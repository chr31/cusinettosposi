import fs from 'node:fs'

/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === 'true'
const repoName = (process.env.GITHUB_REPOSITORY || '').split('/')[1]
// Detect custom domain: prefer explicit env, fall back to presence of public/CNAME
const hasCname = (() => {
  try {
    const s = fs.readFileSync('public/CNAME', 'utf8').trim()
    return s.length > 0
  } catch {
    return false
  }
})()
const usingCustomDomain = !!(process.env.CUSTOM_DOMAIN || hasCname)

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
        basePath: !usingCustomDomain && repoName ? `/${repoName}` : undefined,
        assetPrefix: !usingCustomDomain && repoName ? `/${repoName}/` : undefined,
        images: { unoptimized: true },
      }
    : {}),
}

export default nextConfig
