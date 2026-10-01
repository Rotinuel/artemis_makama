// Look & feel of the client portal (light, matches the public site)
export const portalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

.pt-root {
    --ink: #141414; --muted: #6b6b6b; --faint: #9b9b9b; --line: #e7e3dc; --bg: #f6f4f0; --card: #fff;
    --accent: #08b796; --accent-ink: #067a64; --accent-soft: rgba(8,183,150,0.1);
    --warn: #b7791f; --warn-soft: #fdf3e1; --bad: #b42318; --bad-soft: #fdecea; --info: #2f5aa8; --info-soft: #eaf0fb;
    min-height: 100vh; background: var(--bg); color: var(--ink);
    font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; line-height: 1.55;
}
.pt-root *, .pt-root *::before, .pt-root *::after { box-sizing: border-box; }
.pt-serif { font-family: 'Cormorant Garamond', Georgia, serif; }

/* Header */
.pt-header { background: #111; color: #fff; }
.pt-header-in { max-width: 1120px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.pt-brand { display: flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; min-width: 0; }
.pt-logo { width: 38px; height: 38px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pt-brand-text { display: flex; flex-direction: column; line-height: 1.15; min-width: 0; }
.pt-brand-name { font-size: 13px; font-weight: 600; letter-spacing: 0.02em; }
.pt-brand-sub { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); }
.pt-head-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.pt-user { font-size: 12px; color: rgba(255,255,255,0.55); margin-right: 6px; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pt-hbtn {
    font: inherit; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.75); background: transparent; border: 1px solid rgba(255,255,255,0.18);
    padding: 7px 12px; border-radius: 8px; cursor: pointer; text-decoration: none; white-space: nowrap;
}
.pt-hbtn:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
.pt-hbtn.accent { color: var(--accent); border-color: rgba(8,183,150,0.5); }

.pt-main { max-width: 1120px; margin: 0 auto; padding: 32px 24px 80px; }
.pt-admin-note {
    background: #111; color: rgba(255,255,255,0.8); border-radius: 10px; padding: 10px 14px; font-size: 12px;
    margin-bottom: 20px; display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;
}
.pt-admin-note a { color: var(--accent); }

/* Project hero */
.pt-eyebrow { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-ink); font-weight: 600; margin: 0 0 8px; }
.pt-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(30px, 4vw, 44px); font-weight: 500; line-height: 1.05; margin: 0 0 8px; }
.pt-sub { color: var(--muted); margin: 0; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.pt-hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 24px; }
.pt-hero-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* Buttons */
.pt-btn {
    font: inherit; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink);
    cursor: pointer; text-decoration: none; transition: border-color .15s, background .15s; white-space: nowrap;
}
.pt-btn:hover { border-color: var(--ink); }
.pt-btn.primary { background: var(--ink); color: #fff; border-color: var(--ink); }
.pt-btn.primary:hover { background: #000; }
.pt-btn.green { background: var(--accent); border-color: var(--accent); color: #04120f; }
.pt-btn.small { padding: 6px 12px; font-size: 12px; }
.pt-btn:disabled { opacity: .5; cursor: default; }

/* Tabs */
.pt-tabs {
    display: flex; gap: 4px; border-bottom: 1px solid var(--line); margin-bottom: 24px;
    overflow-x: auto; scrollbar-width: none;
}
.pt-tabs::-webkit-scrollbar { display: none; }
.pt-tab {
    font: inherit; font-size: 13px; font-weight: 500; color: var(--muted); background: none; border: 0;
    padding: 12px 14px; border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 6px;
}
.pt-tab:hover { color: var(--ink); }
.pt-tab.on { color: var(--ink); border-bottom-color: var(--accent); }
.pt-tab-count { font-size: 11px; background: var(--accent-soft); color: var(--accent-ink); border-radius: 20px; padding: 0 7px; }

/* Cards & grid */
.pt-grid { display: grid; gap: 16px; }
.pt-grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.pt-grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pt-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.pt-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 20px; }
.pt-card h2, .pt-card h3 { margin: 0; }
.pt-card-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; font-weight: 500; margin: 0 0 14px; }
.pt-card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 14px; }
.pt-card-head .pt-card-title { margin: 0; }
.pt-link { color: var(--accent-ink); font-weight: 500; text-decoration: none; background: none; border: 0; padding: 0; font: inherit; cursor: pointer; }
.pt-link:hover { text-decoration: underline; }
.pt-stat-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--faint); margin: 0 0 6px; }
.pt-stat-value { font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
.pt-stat-note { font-size: 12px; color: var(--muted); margin: 4px 0 0; }
.pt-section { margin-top: 16px; }
.pt-muted { color: var(--muted); }
.pt-empty { text-align: center; color: var(--muted); padding: 40px 20px; border: 1px dashed var(--line); border-radius: 16px; background: rgba(255,255,255,0.5); }

/* Progress bar */
.pt-progress { height: 8px; background: #eeeae3; border-radius: 99px; overflow: hidden; }
.pt-progress > span { display: block; height: 100%; background: var(--accent); border-radius: 99px; }

/* Chips */
.pt-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: #f0ede8; color: var(--muted); white-space: nowrap; }
.pt-chip::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: .8; }
.pt-chip.good { background: var(--accent-soft); color: var(--accent-ink); }
.pt-chip.warn { background: var(--warn-soft); color: var(--warn); }
.pt-chip.info { background: var(--info-soft); color: var(--info); }
.pt-chip.bad { background: var(--bad-soft); color: var(--bad); }

/* Stage timeline */
.pt-timeline { list-style: none; margin: 0; padding: 0; }
.pt-step { position: relative; display: grid; grid-template-columns: 36px 1fr; gap: 14px; padding-bottom: 22px; }
.pt-step:last-child { padding-bottom: 0; }
.pt-step::before { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 2px; background: var(--line); }
.pt-step:last-child::before { display: none; }
.pt-step.done::before { background: var(--accent); }
.pt-dot {
    width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--line); background: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--faint); position: relative; z-index: 1;
}
.pt-step.done .pt-dot { background: var(--accent); border-color: var(--accent); color: #fff; }
.pt-step.active .pt-dot { border-color: var(--accent); color: var(--accent-ink); box-shadow: 0 0 0 4px var(--accent-soft); }
.pt-step.waiting .pt-dot { border-color: var(--warn); color: var(--warn); }
.pt-step-head { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; align-items: center; padding-top: 6px; }
.pt-step-name { font-weight: 600; font-size: 15px; }
.pt-step-dates { font-size: 12px; color: var(--muted); margin-top: 2px; }
.pt-signoff { margin-top: 10px; background: #f8faf9; border: 1px solid #dcefe9; border-radius: 10px; padding: 10px 12px; font-size: 13px; }
.pt-signoff strong { color: var(--accent-ink); }

/* Updates */
.pt-feed { display: flex; flex-direction: column; gap: 16px; }
.pt-update-date { font-size: 12px; color: var(--faint); letter-spacing: 0.04em; margin: 0 0 4px; }
.pt-update-title { font-size: 18px; font-weight: 600; margin: 0 0 6px; }
.pt-update-body { margin: 0; color: #333; white-space: pre-line; }
.pt-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-top: 14px; }
.pt-photo { position: relative; aspect-ratio: 4 / 3; border-radius: 10px; overflow: hidden; background: #eee; border: 0; padding: 0; cursor: zoom-in; }
.pt-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s; }
.pt-photo:hover img { transform: scale(1.04); }

/* Tables */
.pt-table-wrap { overflow-x: auto; }
.pt-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.pt-table th { text-align: left; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--faint); font-weight: 600; padding: 0 12px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.pt-table td { padding: 14px 12px; border-bottom: 1px solid #f0ede8; vertical-align: top; }
.pt-table tr:last-child td { border-bottom: 0; }
.pt-table .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

/* Documents */
.pt-doc-group + .pt-doc-group { margin-top: 22px; }
.pt-doc-group h3 { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faint); margin: 0 0 8px; font-weight: 600; }
.pt-doc { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid #f0ede8; }
.pt-doc:first-of-type { border-top: 0; }
.pt-doc-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--accent-soft); color: var(--accent-ink); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; font-weight: 700; letter-spacing: .04em; }
.pt-doc-main { flex: 1; min-width: 0; }
.pt-doc-title { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pt-doc-meta { font-size: 12px; color: var(--faint); }

/* Camera */
.pt-camera { position: relative; aspect-ratio: 16 / 9; background: #111; border-radius: 16px; overflow: hidden; }
.pt-camera iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.pt-camera-cta { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: #fff; text-align: center; padding: 24px; height: 100%; }
.pt-live { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .16em; color: #ff5a4f; }
.pt-live::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ff5a4f; animation: ptPulse 1.6s infinite; }
@keyframes ptPulse { 50% { opacity: .3; } }

/* Forms */
.pt-form { display: grid; gap: 14px; }
.pt-field label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; }
.pt-field input, .pt-field textarea, .pt-field select {
    width: 100%; font: inherit; font-size: 14px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: #fff; color: var(--ink); outline: none;
}
.pt-field input:focus, .pt-field textarea:focus, .pt-field select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.pt-hint { font-size: 12px; color: var(--faint); margin: 4px 0 0; }
.pt-error { background: var(--bad-soft); color: var(--bad); padding: 10px 12px; border-radius: 10px; font-size: 13px; }
.pt-success { background: var(--accent-soft); color: var(--accent-ink); padding: 10px 12px; border-radius: 10px; font-size: 13px; }
.pt-thumbs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.pt-thumb { position: relative; width: 72px; height: 72px; border-radius: 8px; overflow: hidden; background: #eee; }
.pt-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pt-thumb button { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; border: 0; background: rgba(0,0,0,.6); color: #fff; font-size: 12px; line-height: 1; cursor: pointer; }
.pt-reply { margin-top: 10px; padding: 10px 12px; border-left: 3px solid var(--accent); background: #f8faf9; border-radius: 0 10px 10px 0; font-size: 13px; }

/* Project list */
.pt-project-card { display: block; text-decoration: none; color: inherit; transition: border-color .15s, transform .15s; }
.pt-project-card:hover { border-color: var(--ink); transform: translateY(-2px); }

/* Lightbox */
.pt-lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.88); display: flex; align-items: center; justify-content: center; padding: 24px; }
.pt-lightbox img { max-width: 100%; max-height: 100%; border-radius: 8px; }
.pt-lightbox button { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: 0; background: rgba(255,255,255,.15); color: #fff; font-size: 20px; cursor: pointer; }

@media (max-width: 900px) {
    .pt-grid.cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .pt-grid.cols-3 { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
    .pt-main { padding: 22px 16px 64px; }
    .pt-header-in { padding: 12px 16px; }
    .pt-user, .pt-brand-name { display: none; }
    .pt-grid.cols-2 { grid-template-columns: 1fr; }
    .pt-card { padding: 16px; }
    .pt-stat-value { font-size: 14px; }
    .pt-table .hide-sm { display: none; }
    /* payment table becomes stacked cards */
    .pt-table thead { display: none; }
    .pt-table, .pt-table tbody { display: block; }
    .pt-table tr { display: grid; grid-template-columns: 1fr auto; gap: 6px 12px; padding: 14px 0; border-bottom: 1px solid #f0ede8; }
    .pt-table tr:last-child { border-bottom: 0; }
    .pt-table td { display: block; padding: 0; border: 0; }
    .pt-table td.rcpt::before { content: 'Receipt: '; color: var(--faint); }
}
`
