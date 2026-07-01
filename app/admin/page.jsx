'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const pages = [
  {
    href: '/admin/news',
    label: 'News',
    description: 'Manage news items, press releases, and media coverage.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 7h10M5 10h7M5 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/events',
    label: 'Events',
    description: 'Add and reorder upcoming events, conferences, and trade shows.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 8h16M6 2v4M14 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="6" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    href: '/admin/gallery',
    label: 'Gallery',
    description: 'Upload and organise images across project categories.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 13l4-4 3 3 3-3 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/admin/gallery/categories',
    label: 'Gallery Categories',
    description: 'Create, rename, and reorder gallery categories.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
]

export default function AdminIndexPage() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }

        .admin-index {
          min-height: 100vh;
          background: #0b0b0b;
          font-family: 'DM Sans', sans-serif;
          color: #f0ece4;
          padding: 0 0 6rem;
          position: relative;
        }
        .admin-index::before {
          content: '';
          position: fixed; top: -200px; right: -200px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(196,140,40,0.09) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .inner {
          position: relative; z-index: 1;
          max-width: 760px; margin: 0 auto; padding: 0 2rem;
        }

        .top-bar {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 1.5rem 0;
          margin-bottom: 3rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .top-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 300; letter-spacing: 0.02em; color: #f0ece4;
        }
        .top-brand span { color: #c48c28; font-style: italic; }
        .logout-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(240,236,228,0.35); border: 1px solid rgba(255,255,255,0.1);
          background: transparent; padding: 7px 16px; border-radius: 8px; cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .logout-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

        .heading-block { margin-bottom: 2.5rem; }
        .eyebrow {
          font-size: 10px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase;
          color: #c48c28; margin-bottom: 8px;
        }
        .heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px; font-weight: 300; color: #f0ece4;
          margin: 0; line-height: 1.1; letter-spacing: -0.01em;
        }
        .subheading {
          font-size: 13px; font-weight: 300; color: rgba(240,236,228,0.4);
          margin: 8px 0 0; line-height: 1.6;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 520px) { .nav-grid { grid-template-columns: 1fr; } }

        .nav-card {
          display: flex; flex-direction: column;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.5rem;
          text-decoration: none; color: inherit;
          position: relative; overflow: hidden;
          transition: border-color 0.25s, background 0.25s, transform 0.2s;
        }
        .nav-card::before {
          content: '';
          position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,140,40,0.3), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .nav-card:hover {
          border-color: rgba(196,140,40,0.25);
          background: rgba(196,140,40,0.04);
          transform: translateY(-2px);
        }
        .nav-card:hover::before { opacity: 1; }

        .card-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(240,236,228,0.5);
          margin-bottom: 1rem; flex-shrink: 0;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .nav-card:hover .card-icon {
          color: #c48c28;
          background: rgba(196,140,40,0.1);
          border-color: rgba(196,140,40,0.25);
        }

        .card-label {
          font-size: 14px; font-weight: 500; color: #f0ece4;
          margin-bottom: 6px; letter-spacing: 0.01em;
        }
        .card-desc {
          font-size: 12px; font-weight: 300; color: rgba(240,236,228,0.38);
          line-height: 1.6; flex: 1;
        }
        .card-arrow {
          margin-top: 1.25rem; font-size: 16px;
          color: rgba(196,140,40,0.4);
          transition: color 0.2s, transform 0.2s;
          align-self: flex-end;
        }
        .nav-card:hover .card-arrow { color: #c48c28; transform: translateX(3px); }

        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        .divider {
          height: 1px; background: rgba(255,255,255,0.06);
          margin: 2.5rem 0;
        }
        .footer-note {
          font-size: 11px; font-weight: 300; color: rgba(240,236,228,0.2);
          letter-spacing: 0.04em; text-align: center;
        }
      `}</style>

      <div className="admin-index">
        <div className="inner fade-in">

          <div className="top-bar">
            <div className="top-brand">Artemis <span>Admin</span></div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>

          <div className="heading-block">
            <p className="eyebrow">Dashboard</p>
            <h1 className="heading">Content Manager</h1>
            <p className="subheading">Select a section below to manage your site content.</p>
          </div>

          <div className="nav-grid">
            {pages.map(page => (
              <Link key={page.href} href={page.href} className="nav-card">
                <div className="card-icon">{page.icon}</div>
                <p className="card-label">{page.label}</p>
                <p className="card-desc">{page.description}</p>
                <span className="card-arrow">→</span>
              </Link>
            ))}
          </div>

          <div className="divider" />
          <p className="footer-note">Artemis Atelier Ltd — Internal Admin Panel</p>

        </div>
      </div>
    </>
  )
}