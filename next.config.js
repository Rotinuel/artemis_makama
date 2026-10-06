/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // optimised images cached for 30 days
    remotePatterns: [
      { protocol: 'https', hostname: 'artemisatelierltd.com' },
      { protocol: 'https', hostname: 'www.artemisatelierltd.com' },
      { protocol: 'https', hostname: '*.supabase.co' },   // portfolio images
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'player.vimeo.com' },
    ],
  },
  async redirects() {
    return [
      // One canonical host: www → apex (permanent 308)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.artemisatelierltd.com' }],
        destination: 'https://artemisatelierltd.com/:path*',
        permanent: true,
      },
      // The diaspora landing page became the Build from Abroad hub
      { source: '/diaspora-consultation', destination: '/build-from-abroad', permanent: true },
      // Old placeholder projects page → portfolio
      { source: '/projects', destination: '/portfolio', permanent: true },
      { source: '/projects/:path*', destination: '/portfolio', permanent: true },
      { source: '/news', destination: '/news-events', permanent: true },
      // Fix the misspelt portfolio URL. The project page accepts either database
      // slug (lib/portfolio-slugs.js), so this works before and after
      // supabase/fix_during_construction_slug.sql is run.
      { source: '/portfolio/during-contrustion', destination: '/portfolio/during-construction', permanent: true },
      { source: '/gallery/during-contrustion', destination: '/portfolio/during-construction', permanent: true },
      // Insurance partner pages: old addresses → current insurance partner
      { source: '/partners/lasaco', destination: '/partners/chemix', permanent: true },
      { source: '/partners/insurance-partner', destination: '/partners/chemix', permanent: true },
      // Old 3 MB catalogue with spaces in its name → the compressed, renamed one.
      // (Regex so it matches the space whether or not it arrives as %20.)
      { source: '/documents/:file(compressed.*simple.*elegant.*series\\.pdf)', destination: '/documents/aluminium-simple-elegant-series.pdf', permanent: true },
      // The cost guide now sits behind a short email form (/cost-guide). The old
      // direct link goes to the form; the PDF itself is at COST_GUIDE_PDF in
      // lib/site.js and is only linked after sign-up.
      { source: '/downloads/diaspora-build-cost-guide-2026.pdf', destination: '/cost-guide', permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Photos and files in /public: cache for a day at the browser, a week at the edge
        source: '/:all*(jpg|jpeg|png|webp|avif|svg|ico|mp4|pdf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800' }],
      },
      {
        // Lead-magnet downloads stay out of search results
        source: '/downloads/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ]
  },
}

module.exports = nextConfig
