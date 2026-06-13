'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function GalleryClient({ categories, images }) {
    const [activeCategory, setActiveCategory] = useState('all')

    const filtered = activeCategory === 'all'
        ? images
        : images.filter(img => img.gallery_categories?.slug === activeCategory)

    return (
        <>
            <Navigation />
            <style>{styles}</style>

            <main className="gallery-main">

                {/* Page header */}
                <div className="gallery-container">
                    <div className="page-header animate-in">
                        <p className="page-eyebrow">Our Work</p>
                        <h1 className="page-title">Gallery</h1>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="filter-bar animate-in delay-1">
                    <div className="gallery-container filter-inner">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
                        >
                            All
                            <span className="filter-count">{images.length}</span>
                        </button>

                        {categories.map(cat => {
                            const count = images.filter(img => img.gallery_categories?.slug === cat.slug).length
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className={`filter-tab ${activeCategory === cat.slug ? 'active' : ''}`}
                                >
                                    {cat.name}
                                    <span className="filter-count">{count}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Grid */}
                <div className="gallery-container grid-section animate-in delay-2">
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: '16px', opacity: 0.2 }}>
                                <rect x="3" y="3" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 24l8-8 6 6 5-5 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <p>No images in this category yet.</p>
                        </div>
                    ) : (
                        <div className="image-grid">
                            {filtered.map((img, i) => (
                                <Link
                                    key={img.id}
                                    href={`/gallery/${img.id}`}
                                    className="image-card"
                                    style={{ animationDelay: `${0.24 + i * 0.04}s` }}
                                >
                                    <div className="image-thumb">
                                        <img
                                            src={img.url}
                                            alt={img.title || 'Gallery image'}
                                        />
                                        <div className="image-overlay">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="image-meta">
                                        {img.gallery_categories?.name && (
                                            <span className="image-category">{img.gallery_categories.name}</span>
                                        )}
                                        {img.title && (
                                            <p className="image-title">{img.title}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </>
    )
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

    .gallery-main {
        font-family: 'DM Sans', sans-serif;
        background: #fff;
        color: #09b697;
        min-height: 100vh;
        padding-top: 88px;
        padding-bottom: 96px;
    }

    .gallery-container {
        padding-left: clamp(24px, 5vw, 80px);
        padding-right: clamp(24px, 5vw, 80px);
        max-width: 1600px;
        margin: 0 auto;
    }

    /* Header */
    .page-header { margin-bottom: 52px; }
    .page-eyebrow {
        font-size: 10px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #3a3530;
        margin: 0 0 14px;
    }
    .page-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(44px, 6vw, 80px);
        font-weight: 300;
        color: #09b697;
        margin: 0;
        line-height: 0.95;
        letter-spacing: -0.02em;
    }

    /* Filter bar */
    .filter-bar {
        position: sticky;
        top: 0;
        z-index: 20;
        background: #0c0c0c;
        border-bottom: 1px solid #1a1a1a;
        margin-bottom: 48px;
    }
    .filter-inner {
        display: flex;
        gap: 0;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .filter-inner::-webkit-scrollbar { display: none; }

    .filter-tab {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-family: 'DM Sans', sans-serif;
        color: #3a3530;
        background: none;
        border: none;
        border-bottom: 1px solid transparent;
        padding: 18px 20px;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        margin-bottom: -1px;
    }
    .filter-tab:hover { color: #9e9588; }
    .filter-tab.active {
        color: #09b697;
        border-bottom-color: #09b697;
    }
    .filter-count {
        font-size: 10px;
        color: #2e2e2e;
        transition: color 0.2s;
    }
    .filter-tab.active .filter-count { color: #09b697; }

    /* Grid */
    .grid-section {}
    .image-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 28px;
    }
    @media (min-width: 640px)  { .image-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .image-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1280px) { .image-grid { grid-template-columns: repeat(4, 1fr); } }

    /* Card */
    .image-card {
        text-decoration: none;
        display: block;
        animation: fadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
    .image-thumb {
        position: relative;
        overflow: hidden;
        background: #111;
        aspect-ratio: 4/3;
    }
    .image-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .image-card:hover .image-thumb img { transform: scale(1.07); }

    .image-overlay {
        position: absolute;
        inset: 0;
        background: rgba(12, 12, 12, 0);
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 16px;
        transition: background 0.35s ease;
    }
    .image-overlay svg {
        color: #e8e2d9;
        opacity: 0;
        transform: translate(4px, 4px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .image-card:hover .image-overlay { background: rgba(12, 12, 12, 0.45); }
    .image-card:hover .image-overlay svg { opacity: 1; transform: translate(0, 0); }

    .image-meta {
        margin-top: 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .image-category {
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #3a3530;
    }
    .image-title {
        font-size: 13px;
        color: #6b6460;
        font-weight: 300;
        line-height: 1.4;
        margin: 0;
        transition: color 0.25s ease;
    }
    .image-card:hover .image-title { color: #9e9588; }

    /* Empty */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 96px 24px;
        color: #3a3530;
        font-size: 14px;
        font-weight: 300;
    }

    /* Animations */
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .animate-in { animation: fadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
    .delay-1 { animation-delay: 0.08s; }
    .delay-2 { animation-delay: 0.16s; }
`