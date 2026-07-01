'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin/news'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
      <>
        <style>{`
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
          color: #08080;
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
          border: 1.5px solid rgba(8,8,8,0.3);
          border-top-color: #080808;
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
      `}</style>

        <div className="login-root">
          <div className="orb-1" />
          <div className="orb-2" />

          <div className={`card-wrap ${mounted ? 'visible' : ''}`}>
            {/* Header */}
            <p className="portal-label">Artemis-Atelier Ltd Admin Portal</p>
            <h1 className="headline">
              Welcome <em>back</em>
            </h1>
            <p className="subline">Sign in to continue to your dashboard</p>

            <div className="accent-line" />

            {/* Card */}
            <div className="glass-card">
              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="you@example.com"
                    className="field-input"
                />
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="••••••••"
                    className="field-input"
                />
              </div>

              {/* Error */}
              {error && (
                  <div className="error-box">
                    <p>{error}</p>
                  </div>
              )}

              {/* Button */}
              <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="submit-btn"
              >
              <span className="btn-content">
                {loading && <span className="spinner" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </span>
              </button>
            </div>

            {/* Footer */}
            <p className="footer-note">
              <span className="footer-dot" />
              Secured with end-to-end encryption
              <span className="footer-dot" />
            </p>
          </div>
        </div>
      </>
  )
}

export default function LoginPage() {
  return (
      <Suspense>
        <LoginForm />
      </Suspense>
  )
}


// 'use client'
//
// import { Suspense, useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { createClient } from '@/utils/supabase/client'
//
// export default function LoginPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const redirectTo = searchParams.get('redirectTo') || '/admin/news'
//
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [mounted, setMounted] = useState(false)
//
//   useEffect(() => {
//     setMounted(true)
//   }, [])
//
//   async function handleLogin() {
//     setLoading(true)
//     setError('')
//     const supabase = createClient()
//
//     const { error } = await supabase.auth.signInWithPassword({ email, password })
//
//     if (error) {
//       setError(error.message)
//       setLoading(false)
//     } else {
//       router.push(redirectTo)
//       router.refresh()
//     }
//   }
//
//   return (
//       <Suspense>
//         <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
//
//         .login-root {
//           font-family: 'DM Sans', sans-serif;
//           background: #080808;
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 2rem;
//           position: relative;
//           overflow: hidden;
//         }
//
//         /* Ambient grain overlay */
//         .login-root::before {
//           content: '';
//           position: fixed;
//           inset: 0;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
//           opacity: 0.035;
//           pointer-events: none;
//           z-index: 0;
//         }
//
//         /* Warm orb top-left */
//         .orb-1 {
//           position: fixed;
//           top: -180px;
//           left: -120px;
//           width: 600px;
//           height: 600px;
//           border-radius: 50%;
//           background: radial-gradient(circle, rgba(196,140,40,0.18) 0%, rgba(160,90,10,0.08) 50%, transparent 70%);
//           pointer-events: none;
//           z-index: 0;
//         }
//
//         /* Cool dark orb bottom-right */
//         .orb-2 {
//           position: fixed;
//           bottom: -200px;
//           right: -150px;
//           width: 700px;
//           height: 700px;
//           border-radius: 50%;
//           background: radial-gradient(circle, rgba(80,60,120,0.12) 0%, transparent 65%);
//           pointer-events: none;
//           z-index: 0;
//         }
//
//         /* Thin horizontal rule accent */
//         .accent-line {
//           width: 40px;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, #c48c28, transparent);
//           margin: 0 auto 2rem;
//         }
//
//         .card-wrap {
//           position: relative;
//           z-index: 10;
//           width: 100%;
//           max-width: 420px;
//           opacity: 0;
//           transform: translateY(24px);
//           transition: opacity 0.7s ease, transform 0.7s ease;
//         }
//
//         .card-wrap.visible {
//           opacity: 1;
//           transform: translateY(0);
//         }
//
//         /* Header text */
//         .portal-label {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 10px;
//           font-weight: 500;
//           letter-spacing: 0.35em;
//           text-transform: uppercase;
//           color: #c48c28;
//           text-align: center;
//           margin-bottom: 1rem;
//         }
//
//         .headline {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 52px;
//           font-weight: 300;
//           color: #f0ece4;
//           text-align: center;
//           line-height: 1.05;
//           margin: 0 0 0.35rem;
//           letter-spacing: -0.01em;
//         }
//
//         .headline em {
//           font-style: italic;
//           color: #c48c28;
//         }
//
//         .subline {
//           font-size: 13px;
//           font-weight: 300;
//           color: rgba(240,236,228,0.4);
//           text-align: center;
//           margin-bottom: 2.5rem;
//           letter-spacing: 0.02em;
//         }
//
//         /* Glass card */
//         .glass-card {
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(255,255,255,0.07);
//           border-radius: 20px;
//           padding: 2rem 2rem 2.25rem;
//           backdrop-filter: blur(24px);
//           -webkit-backdrop-filter: blur(24px);
//           box-shadow:
//             0 0 0 1px rgba(196,140,40,0.06) inset,
//             0 40px 80px rgba(0,0,0,0.5),
//             0 2px 4px rgba(0,0,0,0.3);
//           position: relative;
//           overflow: hidden;
//         }
//
//         /* Subtle top-edge shimmer on card */
//         .glass-card::before {
//           content: '';
//           position: absolute;
//           top: 0; left: 10%; right: 10%;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(196,140,40,0.5), transparent);
//         }
//
//         /* Field group */
//         .field-group {
//           margin-bottom: 1.25rem;
//         }
//
//         .field-label {
//           display: block;
//           font-size: 10px;
//           font-weight: 500;
//           letter-spacing: 0.22em;
//           text-transform: uppercase;
//           color: rgba(240,236,228,0.35);
//           margin-bottom: 0.5rem;
//         }
//
//         .field-input {
//           width: 100%;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 10px;
//           padding: 12px 14px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 14px;
//           font-weight: 300;
//           color: #f0ece4;
//           outline: none;
//           transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
//           box-sizing: border-box;
//         }
//
//         .field-input::placeholder {
//           color: rgba(240,236,228,0.2);
//         }
//
//         .field-input:focus {
//           border-color: rgba(196,140,40,0.5);
//           background: rgba(196,140,40,0.05);
//           box-shadow: 0 0 0 3px rgba(196,140,40,0.08);
//         }
//
//         /* Error */
//         .error-box {
//           background: rgba(220,60,60,0.08);
//           border: 1px solid rgba(220,60,60,0.2);
//           border-radius: 10px;
//           padding: 10px 14px;
//           margin-bottom: 1.25rem;
//         }
//
//         .error-box p {
//           font-size: 13px;
//           font-weight: 300;
//           color: #f0a0a0;
//           margin: 0;
//         }
//
//         /* Submit button */
//         .submit-btn {
//           width: 100%;
//           margin-top: 0.5rem;
//           padding: 13px 0;
//           border: none;
//           border-radius: 10px;
//           background: linear-gradient(135deg, #c48c28 0%, #a06b10 100%);
//           color: #080808;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px;
//           font-weight: 500;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
//           box-shadow: 0 4px 20px rgba(196,140,40,0.25);
//           position: relative;
//           overflow: hidden;
//         }
//
//         .submit-btn::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%);
//           pointer-events: none;
//         }
//
//         .submit-btn:hover:not(:disabled) {
//           opacity: 0.92;
//           transform: translateY(-1px);
//           box-shadow: 0 6px 28px rgba(196,140,40,0.35);
//         }
//
//         .submit-btn:active:not(:disabled) {
//           transform: translateY(0);
//           opacity: 0.85;
//         }
//
//         .submit-btn:disabled {
//           cursor: not-allowed;
//           opacity: 0.5;
//         }
//
//         /* Loading dots */
//         .btn-content {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//         }
//
//         .spinner {
//           width: 14px;
//           height: 14px;
//           border: 1.5px solid rgba(8,8,8,0.3);
//           border-top-color: #080808;
//           border-radius: 50%;
//           animation: spin 0.7s linear infinite;
//         }
//
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//
//         /* Footer */
//         .footer-note {
//           text-align: center;
//           margin-top: 1.75rem;
//           font-size: 11px;
//           font-weight: 300;
//           color: rgba(240,236,228,0.2);
//           letter-spacing: 0.04em;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 6px;
//         }
//
//         .footer-dot {
//           width: 3px;
//           height: 3px;
//           background: rgba(196,140,40,0.4);
//           border-radius: 50%;
//           display: inline-block;
//         }
//       `}</style>
//
//         <div className="login-root">
//           <div className="orb-1" />
//           <div className="orb-2" />
//
//           <div className={`card-wrap ${mounted ? 'visible' : ''}`}>
//             {/* Header */}
//             <p className="portal-label">Admin Portal</p>
//             <h1 className="headline">
//               Welcome <em>back</em>
//             </h1>
//             <p className="subline">Sign in to continue to your dashboard</p>
//
//             <div className="accent-line" />
//
//             {/* Card */}
//             <div className="glass-card">
//               {/* Email */}
//               <div className="field-group">
//                 <label className="field-label">Email Address</label>
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     onKeyDown={e => e.key === 'Enter' && handleLogin()}
//                     placeholder="you@example.com"
//                     className="field-input"
//                 />
//               </div>
//
//               {/* Password */}
//               <div className="field-group">
//                 <label className="field-label">Password</label>
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     onKeyDown={e => e.key === 'Enter' && handleLogin()}
//                     placeholder="••••••••"
//                     className="field-input"
//                 />
//               </div>
//
//               {/* Error */}
//               {error && (
//                   <div className="error-box">
//                     <p>{error}</p>
//                   </div>
//               )}
//
//               {/* Button */}
//               <button
//                   onClick={handleLogin}
//                   disabled={loading}
//                   className="submit-btn"
//               >
//               <span className="btn-content">
//                 {loading && <span className="spinner" />}
//                 {loading ? 'Signing in…' : 'Sign In'}
//               </span>
//               </button>
//             </div>
//
//             {/* Footer */}
//             <p className="footer-note">
//               <span className="footer-dot" />
//               Secured with end-to-end encryption
//               <span className="footer-dot" />
//             </p>
//           </div>
//         </div>
//       </Suspense>
//   )
// }