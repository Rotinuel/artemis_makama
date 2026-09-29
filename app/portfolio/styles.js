// Shared styles for the Portfolio index and project pages.
export const portfolioStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');

.pf {
    --pf-ink: #141414;
    --pf-muted: #6b6b6b;
    --pf-soft: #9a9a9a;
    --pf-line: #e6e3de;
    --pf-paper: #f6f4f0;
    --pf-accent: #09b697;
    --pf-serif: 'Cormorant Garamond', Georgia, serif;
    --pf-sans: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
    --pf-gutter: clamp(20px, 5vw, 80px);
    --pf-ease: cubic-bezier(0.22, 1, 0.36, 1);

    font-family: var(--pf-sans);
    background: #fff;
    color: var(--pf-ink);
    min-height: 100vh;
    padding-top: 72px;
}
.pf *, .pf *::before, .pf *::after { box-sizing: border-box; }
.pf a { color: inherit; text-decoration: none; }
.pf img { display: block; }

.pf-wrap {
    max-width: 1600px;
    margin: 0 auto;
    padding-left: var(--pf-gutter);
    padding-right: var(--pf-gutter);
}

.pf-eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--pf-muted);
    margin: 0;
}
.pf-eyebrow::before {
    content: ''; width: 28px; height: 1px; background: var(--pf-accent);
}
.pf-num {
    font-family: var(--pf-sans);
    font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
    color: var(--pf-accent);
    font-variant-numeric: tabular-nums;
}
.pf-arrow { transition: transform 0.35s var(--pf-ease); }

/* ── Intro ─────────────────────────────── */
.pf-intro {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    padding-top: clamp(48px, 8vw, 112px);
    padding-bottom: clamp(40px, 5vw, 72px);
}
@media (min-width: 900px) {
    .pf-intro { grid-template-columns: 1.3fr 1fr; align-items: end; gap: 64px; }
}
.pf-title {
    font-family: var(--pf-serif);
    font-weight: 300;
    font-size: clamp(56px, 10vw, 148px);
    line-height: 0.88;
    letter-spacing: -0.03em;
    margin: 20px 0 0;
}
.pf-lede {
    font-size: 16px; line-height: 1.7; font-weight: 300;
    color: var(--pf-muted);
    margin: 0 0 28px;
    max-width: 460px;
}
.pf-stats { display: flex; gap: 48px; margin: 0; }
.pf-stats dt {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--pf-soft); margin-bottom: 6px;
}
.pf-stats dd {
    margin: 0;
    font-family: var(--pf-serif); font-size: 40px; font-weight: 300; line-height: 1;
    font-variant-numeric: tabular-nums;
}

/* ── Toolbar ───────────────────────────── */
.pf-toolbar {
    position: sticky; top: 72px; z-index: 20;
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid var(--pf-line);
    border-bottom: 1px solid var(--pf-line);
    margin-bottom: clamp(32px, 4vw, 56px);
}
.pf-toolbar-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 56px;
}
.pf-toolbar-label {
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--pf-muted);
}
.pf-toggle { display: flex; gap: 4px; }
.pf-toggle button {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--pf-sans);
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--pf-soft);
    background: none; border: none; cursor: pointer;
    padding: 8px 12px;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
}
.pf-toggle button:hover { color: var(--pf-ink); }
.pf-toggle button[aria-pressed="true"] { color: var(--pf-ink); border-bottom-color: var(--pf-accent); }

/* ── Featured project ─────────────────── */
.pf-featured {
    position: relative; display: block; overflow: hidden;
    aspect-ratio: 4 / 5;
    background: #111;
    margin-bottom: clamp(56px, 7vw, 112px);
}
@media (min-width: 700px) { .pf-featured { aspect-ratio: 16 / 9; } }
@media (min-width: 1200px) { .pf-featured { aspect-ratio: 21 / 9; } }
.pf-featured img {
    width: 100%; height: 100%; object-fit: cover;
    transform: scale(1.02);
    transition: transform 1.4s var(--pf-ease);
}
.pf-featured:hover img { transform: scale(1.06); }
.pf-featured::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.62) 100%);
}
.pf-featured-body {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 1;
    padding: clamp(20px, 4vw, 56px);
    display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
    color: #fff;
}
.pf-featured-body .pf-num { color: #fff; opacity: 0.8; }
.pf-featured-title {
    font-family: var(--pf-serif); font-weight: 300;
    font-size: clamp(36px, 6vw, 88px); line-height: 0.95; letter-spacing: -0.02em;
    margin: 10px 0 10px;
}
.pf-featured-meta { font-size: 13px; letter-spacing: 0.04em; opacity: 0.82; margin: 0; }
.pf-featured-cta {
    flex-shrink: 0;
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 14px 20px;
    border: 1px solid rgba(255,255,255,0.5);
    transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.pf-featured:hover .pf-featured-cta { background: #fff; color: var(--pf-ink); border-color: #fff; }
.pf-featured:hover .pf-arrow { transform: translateX(4px); }
@media (max-width: 699px) { .pf-featured-cta { display: none; } }

/* ── Project grid ─────────────────────── */
.pf-grid {
    display: grid; grid-template-columns: 1fr;
    column-gap: clamp(24px, 4vw, 72px);
    row-gap: clamp(56px, 6vw, 96px);
}
@media (min-width: 800px) {
    .pf-grid { grid-template-columns: 1fr 1fr; }
    .pf-grid > .pf-card:nth-child(even) { margin-top: clamp(64px, 10vw, 160px); }
}
.pf-card { display: block; }
.pf-card-media {
    position: relative; overflow: hidden; background: var(--pf-paper);
    aspect-ratio: 4 / 5;
}
.pf-card:nth-child(4n+2) .pf-card-media,
.pf-card:nth-child(4n+3) .pf-card-media { aspect-ratio: 1 / 1; }
.pf-card-media img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 1.2s var(--pf-ease), filter 0.6s ease;
}
.pf-card:hover .pf-card-media img { transform: scale(1.045); }
.pf-card-count {
    position: absolute; top: 16px; right: 16px;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: #fff; background: rgba(20,20,20,0.55);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    padding: 6px 10px;
    opacity: 0; transform: translateY(-4px);
    transition: opacity 0.3s, transform 0.3s;
}
.pf-card:hover .pf-card-count { opacity: 1; transform: none; }
.pf-card-body {
    display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: baseline;
    padding-top: 20px;
    border-bottom: 1px solid var(--pf-line);
    padding-bottom: 18px;
    transition: border-color 0.3s;
}
.pf-card:hover .pf-card-body { border-bottom-color: var(--pf-ink); }
.pf-card-title {
    font-family: var(--pf-serif); font-weight: 400;
    font-size: clamp(24px, 2.4vw, 34px); line-height: 1.1; letter-spacing: -0.01em;
    margin: 0;
}
.pf-card-meta { grid-column: 2 / 3; font-size: 13px; color: var(--pf-muted); margin: -8px 0 0; }
.pf-card-body .pf-arrow { color: var(--pf-ink); align-self: center; }
.pf-card:hover .pf-arrow { transform: translateX(6px); }

/* ── Index (list) view ────────────────── */
.pf-index { border-top: 1px solid var(--pf-ink); }
.pf-index-head, .pf-row {
    display: grid; align-items: center; gap: 24px;
    grid-template-columns: 56px 1fr 72px 24px;
}
.pf-index.has-meta .pf-index-head,
.pf-index.has-meta .pf-row { grid-template-columns: 56px 2fr 1.2fr 1.2fr 72px 72px 24px; }
.pf-index-head {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--pf-soft);
    padding: 14px 0; border-bottom: 1px solid var(--pf-line);
}
.pf-row {
    padding: 22px 0; border-bottom: 1px solid var(--pf-line);
    transition: padding 0.35s var(--pf-ease), background 0.3s;
    position: relative;
}
.pf-row-title {
    font-family: var(--pf-serif); font-weight: 400;
    font-size: clamp(22px, 2.6vw, 36px); line-height: 1.05; letter-spacing: -0.01em;
    transition: color 0.25s;
}
.pf-row-cell { font-size: 14px; color: var(--pf-muted); font-variant-numeric: tabular-nums; }
.pf .pf-row-thumb { display: none; }
.pf-index:hover .pf-row .pf-row-title { color: var(--pf-soft); }
.pf-index .pf-row:hover .pf-row-title { color: var(--pf-ink); }
.pf-row:hover { padding-left: 12px; }
.pf-row:hover .pf-arrow { transform: translateX(6px); color: var(--pf-accent); }
.pf-cell-hide { }
@media (max-width: 899px) {
    .pf-index-head { display: none; }
    .pf-index .pf-row, .pf-index.has-meta .pf-row {
        grid-template-columns: 64px 1fr 20px; gap: 16px; padding: 16px 0;
    }
    .pf-row:hover { padding-left: 0; }
    .pf-row .pf-num, .pf-cell-hide { display: none; }
    .pf .pf-row-thumb { display: block; width: 64px; height: 64px; object-fit: cover; background: var(--pf-paper); }
    .pf-row-sub { display: block !important; font-size: 12px; color: var(--pf-muted); margin-top: 4px; font-family: var(--pf-sans); letter-spacing: 0; }
}
.pf-row-sub { display: none; }

.pf-preview {
    position: fixed; top: 0; left: 0; z-index: 30;
    width: 320px; aspect-ratio: 4 / 3; overflow: hidden;
    pointer-events: none;
    opacity: 0; transform: scale(0.94);
    transition: opacity 0.25s ease, transform 0.35s var(--pf-ease);
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    background: var(--pf-paper);
}
.pf-preview.on { opacity: 1; transform: scale(1); }
.pf-preview img { width: 100%; height: 100%; object-fit: cover; }
@media (hover: none), (max-width: 899px) { .pf-preview { display: none; } }

.pf-empty {
    text-align: center; padding: 120px 24px; color: var(--pf-muted);
    font-size: 15px; font-weight: 300;
}
.pf-bottom-space { height: clamp(80px, 10vw, 160px); }

/* ── Project page ─────────────────────── */
.pf-hero {
    position: relative; overflow: hidden; background: #111;
    height: min(82vh, 860px); min-height: 440px;
    cursor: zoom-in;
}
.pf-hero img {
    width: 100%; height: 100%; object-fit: cover;
    animation: pfHeroIn 1.8s var(--pf-ease) both;
}
.pf-hero::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.66) 100%);
}
.pf-hero-body {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; color: #fff;
    padding-bottom: clamp(28px, 5vw, 64px);
}
.pf-hero-body .pf-eyebrow { color: rgba(255,255,255,0.85); }
.pf-hero-title {
    font-family: var(--pf-serif); font-weight: 300;
    font-size: clamp(44px, 8vw, 128px); line-height: 0.9; letter-spacing: -0.03em;
    margin: 18px 0 16px; max-width: 14ch;
}
.pf-hero-meta { font-size: 14px; letter-spacing: 0.04em; opacity: 0.85; margin: 0; }
@keyframes pfHeroIn { from { transform: scale(1.08); opacity: 0.4; } to { transform: scale(1); opacity: 1; } }

.pf-crumbs {
    display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--pf-soft);
    padding-top: 24px; padding-bottom: 24px;
    border-bottom: 1px solid var(--pf-line);
}
.pf-crumbs a:hover { color: var(--pf-ink); }
.pf-crumbs span[aria-current] { color: var(--pf-ink); }

.pf-brief {
    display: grid; grid-template-columns: 1fr; gap: 48px;
    padding-top: clamp(48px, 7vw, 112px); padding-bottom: clamp(56px, 8vw, 128px);
}
@media (min-width: 960px) {
    .pf-brief { grid-template-columns: minmax(260px, 1fr) 2fr; gap: clamp(48px, 8vw, 140px); }
}
.pf-facts { margin: 0; border-top: 1px solid var(--pf-ink); }
.pf-facts > div {
    display: grid; grid-template-columns: 110px 1fr; gap: 16px;
    padding: 14px 0; border-bottom: 1px solid var(--pf-line);
}
.pf-facts dt { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--pf-soft); padding-top: 3px; }
.pf-facts dd { margin: 0; font-size: 14px; line-height: 1.5; }
.pf-brief.no-summary { grid-template-columns: 1fr; }
.pf-brief.no-summary .pf-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); column-gap: 32px; }
.pf-summary {
    font-family: var(--pf-serif); font-weight: 300;
    font-size: clamp(24px, 2.6vw, 38px); line-height: 1.35; letter-spacing: -0.005em;
    margin: 0; white-space: pre-line;
}
.pf-summary::first-letter { color: var(--pf-accent); }

/* image sequence */
.pf-seq { display: flex; flex-direction: column; gap: clamp(20px, 3vw, 40px); }
.pf-seq-row { display: grid; gap: clamp(20px, 3vw, 40px); }
.pf-seq-row.full   { grid-template-columns: 1fr; }
.pf-seq-row.pair   { grid-template-columns: 1fr; }
.pf-seq-row.offset { grid-template-columns: 1fr; }
@media (min-width: 800px) {
    .pf-seq-row.pair { grid-template-columns: 1fr 1fr; }
    .pf-seq-row.offset { grid-template-columns: repeat(12, 1fr); }
    .pf-seq-row.offset .pf-fig { grid-column: 5 / 13; }
    .pf-seq-row.offset.left .pf-fig { grid-column: 1 / 9; }
    .pf-seq-row.offset .pf-fig-note { grid-column: 1 / 5; grid-row: 1; align-self: end; }
    .pf-seq-row.offset.left .pf-fig-note { grid-column: 9 / 13; }
}
.pf-fig { margin: 0; }
.pf-fig button {
    display: block; width: 100%; padding: 0; border: 0; background: var(--pf-paper);
    cursor: zoom-in; overflow: hidden; position: relative;
}
.pf-fig img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--pf-ease), opacity 0.6s; }
.pf-fig button:hover img { transform: scale(1.03); }
.full   .pf-fig button { aspect-ratio: 16 / 9; }
.pair   .pf-fig button { aspect-ratio: 4 / 5; }
.offset .pf-fig button { aspect-ratio: 4 / 3; }
.pf-fig figcaption {
    display: flex; gap: 14px; align-items: baseline;
    font-size: 13px; color: var(--pf-muted); padding-top: 12px;
}
.pf-fig-note {
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--pf-soft);
    display: none;
}
@media (min-width: 800px) { .pf-fig-note { display: block; } }

/* next project */
.pf .pf-next {
    position: relative; display: block; overflow: hidden; background: #111; color: #fff;
    margin-top: clamp(80px, 10vw, 160px);
    min-height: clamp(280px, 38vw, 520px);
}
.pf-next img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0.55; transition: opacity 0.6s ease, transform 1.4s var(--pf-ease);
}
.pf-next:hover img { opacity: 0.75; transform: scale(1.04); }
.pf-next-body {
    position: relative; z-index: 1;
    min-height: inherit;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding-top: 48px; padding-bottom: clamp(32px, 5vw, 64px);
}
.pf-next .pf-eyebrow { color: rgba(255,255,255,0.8); }
.pf-next-title {
    display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
    font-family: var(--pf-serif); font-weight: 300;
    font-size: clamp(40px, 7vw, 112px); line-height: 0.92; letter-spacing: -0.03em;
    margin: 18px 0 0;
}
.pf-next:hover .pf-arrow { transform: translateX(10px); }
.pf .pf-back {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--pf-muted);
    padding: 40px 0;
}
.pf .pf-back:hover { color: var(--pf-ink); }
.pf-back:hover .pf-arrow { transform: translateX(-4px); }

/* lightbox */
.pf-lb {
    position: fixed; inset: 0; z-index: 1000;
    background: #0b0b0b; color: #eee;
    display: grid; grid-template-rows: auto 1fr auto;
    font-family: var(--pf-sans);
    animation: pfFade 0.25s ease both;
}
.pf-lb-top, .pf-lb-bottom {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 18px var(--pf-gutter);
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.6);
}
.pf-lb-bottom { text-transform: none; letter-spacing: 0.02em; font-size: 14px; min-height: 58px; justify-content: center; }
.pf-lb-stage { position: relative; display: flex; align-items: center; justify-content: center; min-height: 0; padding: 0 clamp(8px, 6vw, 96px); }
.pf-lb-stage img {
    max-width: 100%; max-height: 100%; object-fit: contain;
    animation: pfFade 0.35s ease both;
    user-select: none; -webkit-user-drag: none;
}
.pf-lb-btn {
    background: none; border: 1px solid rgba(255,255,255,0.18); color: #fff; cursor: pointer;
    width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
}
.pf-lb-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.4); }
.pf-lb-nav { position: absolute; top: 50%; transform: translateY(-50%); }
.pf-lb-nav.prev { left: clamp(8px, 2vw, 32px); }
.pf-lb-nav.next { right: clamp(8px, 2vw, 32px); }
@media (max-width: 700px) { .pf-lb-nav { display: none; } }
@keyframes pfFade { from { opacity: 0; } to { opacity: 1; } }

/* reveal */
.pf-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s var(--pf-ease), transform 0.9s var(--pf-ease); }
.pf-reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
    .pf-reveal { opacity: 1; transform: none; transition: none; }
    .pf-hero img { animation: none; }
}
`
