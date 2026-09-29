'use client'

// Shared look + pieces for the admin auth pages (login, forgot / reset password)

import { useState } from 'react'

export const authStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          font-family: 'DM Sans', sans-serif;
          background: #080808;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Ambient grain overlay */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.035;
          pointer-events: none;
          z-index: 0;
        }

        /* Warm orb top-left */
        .orb-1 {
          position: fixed;
          top: -180px;
          left: -120px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(8,183,150,0.18) 0%, rgba(5,120,100,0.08) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Cool dark orb bottom-right */
        .orb-2 {
          position: fixed;
          bottom: -200px;
          right: -150px;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(80,60,120,0.12) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        /* Thin horizontal rule accent */
        .accent-line {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #08b796, transparent);
          margin: 0 auto 2rem;
        }

        .card-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .card-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Header text */
        .portal-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #08b796;
          text-align: center;
          margin-bottom: 1rem;
        }

        .headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          color: #f0ece4;
          text-align: center;
          line-height: 1.05;
          margin: 0 0 0.35rem;
          letter-spacing: -0.01em;
        }

        .headline em {
          font-style: italic;
          color: #08b796;
        }

        .subline {
          font-size: 13px;
          font-weight: 300;
          color: rgba(240,236,228,0.4);
          text-align: center;
          margin-bottom: 2.5rem;
          letter-spacing: 0.02em;
        }

        /* Glass card */
        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem 2rem 2.25rem;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(196,140,40,0.06) inset,
            0 40px 80px rgba(0,0,0,0.5),
            0 2px 4px #08b796;
          position: relative;
          overflow: hidden;
        }

        /* Subtle top-edge shimmer on card */
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #08b796, transparent);
        }

        /* Field group */
        .field-group {
          margin-bottom: 1.25rem;
        }

        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,228,0.35);
          margin-bottom: 0.5rem;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #f0ece4;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .field-input::placeholder {
          color: rgba(240,236,228,0.2);
        }

        .field-input:focus {
          border-color: rgba(8,183,150,0.5);
          background: rgba(8,183,150,0.05);
          box-shadow: 0 0 0 3px rgba(8,183,150,0.08);
        }

        /* Error */
        .error-box {
          background: rgba(220,60,60,0.08);
          border: 1px solid rgba(220,60,60,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 1.25rem;
        }

        .error-box p {
          font-size: 13px;
          font-weight: 300;
          color: #f0a0a0;
          margin: 0;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 13px 0;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(8,183,150,0.85) 0%, rgba(5,107,88,0.85) 100%);
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 20px #056b58;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%);
          pointer-events: none;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(8,183,150,0.35);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
          opacity: 0.85;
        }

        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Loading dots */
        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 1.5px solid rgba(240,236,228,0.3);
          border-top-color: #f0ece4;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .footer-note {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 11px;
          font-weight: 300;
          color: rgba(240,236,228,0.2);
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .footer-dot {
          width: 3px;
          height: 3px;
          background: rgba(8,183,150,0.4);
          border-radius: 50%;
          display: inline-block;
        }

        /* Password field with show/hide toggle */
        .pw-wrap { position: relative; }
        .pw-wrap .field-input { padding-right: 46px; }
        .pw-toggle {
          position: absolute; top: 50%; right: 6px; transform: translateY(-50%);
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer;
          color: rgba(240,236,228,0.4);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .pw-toggle:hover { color: #f0ece4; background: rgba(255,255,255,0.05); }
        .pw-toggle:focus-visible { outline: none; color: #08b796; box-shadow: 0 0 0 2px rgba(8,183,150,0.4); }

        /* Label row with a link on the right */
        .label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .label-row .field-label { margin-bottom: 0.5rem; }
        .text-link {
          font-size: 11px; font-weight: 400; letter-spacing: 0.02em;
          color: rgba(8,183,150,0.85); text-decoration: none; background: none; border: none;
          cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s ease;
        }
        .text-link:hover { color: #0ccfa9; text-decoration: underline; }

        .success-box {
          background: rgba(8,183,150,0.08);
          border: 1px solid rgba(8,183,150,0.25);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 1.25rem;
        }
        .success-box p { font-size: 13px; font-weight: 300; color: #bff0e4; margin: 0; line-height: 1.6; }

        .hint { font-size: 11px; font-weight: 300; color: rgba(240,236,228,0.3); margin: 0.5rem 0 0; }
        .back-row { text-align: center; margin-top: 1.25rem; }
`

export function AuthShell({ label = 'Artemis-Atelier Ltd Admin Portal', title, subtitle, mounted = true, children, footer }) {
  return (
    <>
      <style>{authStyles}</style>
      <div className="login-root">
        <div className="orb-1" />
        <div className="orb-2" />

        <div className={`card-wrap ${mounted ? 'visible' : ''}`}>
          <p className="portal-label">{label}</p>
          <h1 className="headline">{title}</h1>
          {subtitle && <p className="subline">{subtitle}</p>}

          <div className="accent-line" />

          <div className="glass-card">{children}</div>

          {footer}
        </div>
      </div>
    </>
  )
}

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/** Password input with a show / hide (eye) toggle */
export function PasswordInput({ id, value, onChange, onEnter, placeholder = '••••••••', autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="pw-wrap">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="field-input"
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        title={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export function Spinner() {
  return <span className="spinner" />
}
