import Image from 'next/image'
import Link from 'next/link'

const studios = [
  '70B Olorunlogbon Street, Anthony Village, Lagos, Nigeria'
]

const footerLinks = [
  { label: 'News + Events', href: '/news-events' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' }
]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/aal/',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/aalnetwork/',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/AALNetwork',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/user/aalnetwork',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      {/* Top section */}
      <div className="px-6 md:px-10 py-16 max-w-400 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Image src="/logo-bg.png" alt="AAL Logo" width={60} height={24} />
              </div>
            </Link>
            <p className="text-[13px] text-[#888] leading-relaxed mb-6 ">
              A global design, architecture, engineering and planning.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-white transition-colors" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#555] font-medium mb-5">Navigation</p>
            <ul className="space-y-3">
              {footerLinks.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] text-[#888] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studios — two sub-columns */}
          <div className="md:col-span-2">
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#555] font-medium mb-5">Studios</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
              {studios.map(s => (
                <Link key={s} href="#" className="text-[13px] text-[#888] hover:text-white transition-colors leading-snug">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a2a2a] px-6 md:px-10 py-6 max-w-400 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-[#555]">© Artemis Atelier Ltd 2026</p>
        <div className="flex flex-wrap gap-6">
          <Link href="https://immanuel-ten.vercel.app" className="text-[12px] text-[#555] hover:text-[#aaa] transition-colors">Site Credit</Link>
        </div>
      </div>
    </footer>
  )
}
