'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { AuthShell, Spinner } from '../login/auth-ui'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const linkError = searchParams.get('error') === 'link'

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [error, setError] = useState(linkError ? 'That reset link is invalid or has expired. Request a new one below.' : '')
  const [sentTo, setSentTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function sendLink() {
    const value = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError('Enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(value, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)

    // Rate limits are worth showing; anything else gets the same neutral
    // message so the page never reveals which emails have accounts.
    if (error && /rate|seconds|too many/i.test(error.message)) {
      setError(error.message)
      return
    }
    setSentTo(value)
  }

  return (
    <AuthShell
      mounted={mounted}
      title={<>Reset <em>password</em></>}
      subtitle={sentTo ? 'Check your inbox' : 'We’ll email you a link to choose a new password'}
      footer={
        <p className="back-row">
          <Link href="/login" className="text-link">← Back to sign in</Link>
        </p>
      }
    >
      {sentTo ? (
        <>
          <div className="success-box">
            <p>
              If an admin account exists for <strong>{sentTo}</strong>, a password reset link is on its way.
              It may take a minute — check your spam folder too.
            </p>
          </div>
          <button className="submit-btn" onClick={() => { setSentTo(''); setError('') }}>
            <span className="btn-content">Send again</span>
          </button>
        </>
      ) : (
        <>
          <div className="field-group">
            <label className="field-label" htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendLink()}
              placeholder="you@example.com"
              autoComplete="username"
              className="field-input"
              autoFocus
            />
          </div>

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          <button onClick={sendLink} disabled={loading} className="submit-btn">
            <span className="btn-content">
              {loading && <Spinner />}
              {loading ? 'Sending…' : 'Send reset link'}
            </span>
          </button>
        </>
      )}
    </AuthShell>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  )
}
