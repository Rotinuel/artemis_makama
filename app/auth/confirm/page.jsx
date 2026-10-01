'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { AuthShell, Spinner } from '../../login/auth-ui'

// Landing page for invite / password-setup links sent to clients.
// The one-time token is only used when the person presses the button, so
// WhatsApp and email link previews can't burn it before they open it.
function ConfirmInner() {
  const router = useRouter()
  const params = useSearchParams()
  const tokenHash = params.get('token_hash')
  const type = params.get('type') === 'recovery' ? 'recovery' : 'invite'

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(tokenHash ? '' : 'This link is incomplete. Ask us for a new one.')

  useEffect(() => { setMounted(true) }, [])

  async function proceed() {
    if (!tokenHash) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) {
      setLoading(false)
      setError('This link has expired or was already used. Ask the Artemis team for a new one, or reset your password below.')
      return
    }
    router.push('/reset-password?welcome=1')
    router.refresh()
  }

  return (
    <AuthShell
      mounted={mounted}
      label="Artemis Atelier Ltd · Client Portal"
      title={type === 'invite' ? <>Welcome <em>aboard</em></> : <>Your <em>portal</em></>}
      subtitle={type === 'invite'
        ? 'Your project portal is ready. Choose a password to open it.'
        : 'Continue to set a password and open your project portal.'}
      footer={
        <p className="back-row">
          <Link href="/login" className="text-link">Already have a password? Sign in</Link>
        </p>
      }
    >
      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {error && tokenHash ? (
        <Link href="/forgot-password" className="submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          <span className="btn-content">Reset my password</span>
        </Link>
      ) : (
        <button onClick={proceed} disabled={loading || !tokenHash} className="submit-btn">
          <span className="btn-content">
            {loading && <Spinner />}
            {loading ? 'Opening…' : 'Continue'}
          </span>
        </button>
      )}
    </AuthShell>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  )
}
