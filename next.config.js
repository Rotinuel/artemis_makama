/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.artemisatelierltd.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'player.vimeo.com' },
    ],
  },
  async redirects() {
    return [
      // Fix the misspelt portfolio URL. Run supabase/fix_during_construction_slug.sql
      // at the same time so the corrected address has a page behind it.
      { source: '/portfolio/during-contrustion', destination: '/portfolio/during-construction', permanent: true },
      { source: '/gallery/during-contrustion', destination: '/portfolio/during-construction', permanent: true },
    ]
  },
}

module.exports = nextConfig
