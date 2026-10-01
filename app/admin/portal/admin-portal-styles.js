// Dark admin look (same family as the other admin pages)
export const adminPortalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
select option { background: #1a1a1a; color: #f0ece4; }

.ap-page { min-height: 100vh; background: #0b0b0b; font-family: 'DM Sans', sans-serif; color: #f0ece4; padding: 0 0 6rem; position: relative; }
.ap-page::before {
    content: ''; position: fixed; top: -200px; right: -200px; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(8,183,150,0.14) 0%, transparent 65%); pointer-events: none; z-index: 0;
}
.ap-inner { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 0 2rem; }
.ap-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0b0b0b; font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(240,236,228,0.3); letter-spacing: 0.06em; }

.top-bar { border-bottom: 1px solid rgba(255,255,255,0.06); padding: 1.5rem 0; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.top-brand { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; letter-spacing: 0.02em; }
.top-brand span { color: #08b796; font-style: italic; }
.nav-btns { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.nav-btn {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(240,236,228,0.45); border: 1px solid rgba(255,255,255,0.1); background: transparent; padding: 8px 16px; border-radius: 8px;
    cursor: pointer; text-decoration: none; display: inline-block; transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.nav-btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
.nav-btn.primary { color: #08b796; border-color: rgba(8,183,150,0.35); }
.nav-btn.primary:hover { background: rgba(8,183,150,0.08); border-color: rgba(8,183,150,0.6); }

.ap-h1 { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300; margin: 0 0 4px; line-height: 1.1; }
.ap-h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; margin: 0 0 12px; }
.intro { font-size: 13px; font-weight: 300; line-height: 1.7; color: rgba(240,236,228,0.5); margin: 0 0 1.75rem; max-width: 680px; }
.intro strong { color: rgba(240,236,228,0.85); font-weight: 400; }
.muted { color: rgba(240,236,228,0.45); }
.small { font-size: 12px; }

.tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.5rem; }
.tab {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(255,255,255,0.09); background: transparent; color: rgba(240,236,228,0.45);
    display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
}
.tab:hover { color: #f0ece4; border-color: rgba(255,255,255,0.18); }
.tab.active { background: rgba(8,183,150,0.12); border-color: rgba(8,183,150,0.45); color: #08b796; }
.tab-count { font-size: 10px; padding: 1px 7px; border-radius: 20px; background: rgba(255,255,255,0.06); letter-spacing: 0.04em; }
.tab-count.alert { background: rgba(224,160,60,0.2); color: #f0c070; }

.card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.25rem 1.4rem; }
.card + .card { margin-top: 12px; }
.card.busy { opacity: 0.5; pointer-events: none; }
.card-link { display: block; color: inherit; text-decoration: none; transition: border-color .2s; }
.card-link:hover { border-color: rgba(8,183,150,0.45); }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.empty { text-align: center; padding: 3rem 2rem; border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px; font-size: 13px; font-weight: 300; color: rgba(240,236,228,0.4); }

.grid { display: grid; gap: 10px 14px; grid-template-columns: repeat(12, minmax(0, 1fr)); }
.span-1 { grid-column: span 1; } .span-2 { grid-column: span 2; } .span-3 { grid-column: span 3; } .span-4 { grid-column: span 4; } .span-5 { grid-column: span 5; } .span-6 { grid-column: span 6; }
.span-7 { grid-column: span 7; } .span-8 { grid-column: span 8; } .span-9 { grid-column: span 9; } .span-10 { grid-column: span 10; } .span-11 { grid-column: span 11; } .span-12 { grid-column: span 12; }
@media (max-width: 720px) { .grid > * { grid-column: span 12 !important; } }

.field label { display: block; font-size: 9px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(240,236,228,0.38); margin: 0 0 6px; }
.field input, .field textarea, .field select {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 11px;
    font-family: inherit; font-size: 13px; font-weight: 300; color: #f0ece4; outline: none; resize: vertical; color-scheme: dark;
}
.field input:focus, .field textarea:focus, .field select:focus { border-color: rgba(8,183,150,0.5); }
.field input[type=file] { padding: 7px; font-size: 12px; }
.check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(240,236,228,0.7); cursor: pointer; }

.actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
.btn {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: rgba(240,236,228,0.7);
    transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
}
.btn:hover { color: #f0ece4; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }
.btn.approve { background: #08b796; border-color: #08b796; color: #04120f; }
.btn.approve:hover { background: #0ccfa9; border-color: #0ccfa9; color: #04120f; }
.btn.reject:hover { background: rgba(180,40,40,0.35); border-color: rgba(220,60,60,0.5); color: #ffcccc; }
.btn.icon { padding: 6px 9px; letter-spacing: 0; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: default; }

.chip { font-size: 9px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; padding: 3px 8px; border-radius: 5px; background: rgba(255,255,255,0.07); color: rgba(240,236,228,0.6); white-space: nowrap; }
.chip.good { background: rgba(8,183,150,0.14); color: #08b796; }
.chip.warn { background: rgba(224,160,60,0.16); color: #f0c070; }
.chip.info { background: rgba(90,140,230,0.16); color: #9dbbf5; }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.thumbs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.thumbs a, .thumbs span { width: 76px; height: 76px; border-radius: 8px; overflow: hidden; background: #1a1a1a; display: block; }
.thumbs img { width: 100%; height: 100%; object-fit: cover; display: block; }

.linkbox { margin-top: 14px; padding: 14px; border-radius: 12px; border: 1px solid rgba(8,183,150,0.35); background: rgba(8,183,150,0.06); }
.linkbox code { display: block; word-break: break-all; font-size: 12px; color: #bff0e4; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin: 8px 0 0; }

.totals { display: flex; gap: 24px; flex-wrap: wrap; font-size: 12px; color: rgba(240,236,228,0.55); margin-bottom: 14px; }
.totals strong { color: #f0ece4; font-weight: 500; }

@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.toast { position: fixed; bottom: 28px; right: 28px; z-index: 999; max-width: min(460px, calc(100vw - 56px)); padding: 11px 18px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; animation: slideUp 0.3s ease; display: flex; align-items: center; gap: 8px; }
.toast.success { background: #1a1a1a; border: 1px solid rgba(8,183,150,0.35); color: #f0ece4; }
.toast.error { background: #1a1a1a; border: 1px solid rgba(220,60,60,0.35); color: #f09090; }
.toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.toast.success .toast-dot { background: #08b796; }
.toast.error .toast-dot { background: #e05050; }

.fade-in { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 600px) { .ap-inner { padding: 0 1rem; } }
`
