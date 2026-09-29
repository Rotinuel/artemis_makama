'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { AuthShell, PasswordInput, Spinner } from '../login/auth-ui'

const MIN_LENGTH = 8

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState('checking') // checking | ready | no-session | done
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // The reset link signs the user in (via /auth/callback) before landing here
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '')
        setStatus('ready')
      } else {
        setStatus('no-session')
      }
    })
  }, [])

  async function save() {
    if (password.length < MIN_LENGTH) return setError(`Use at least ${MIN_LENGTH} characters.`)
    if (password !== confirm) return setError('The two passwords don’t match.')
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }
    setStatus('done')
    setTimeout(() => {
      router.push('/admin')
      router.refresh()
    }, 1500)
  }

  const footer = (
    <p className="back-row">
      <Link href="/login" className="text-link">← Back to sign in</Link>
    </p>
  )

  if (status === 'checking') {
    return (
      <AuthShell title={<>New <em>password</em></>} subtitle="One moment…" footer={footer}>
        <p className="hint" style={{ textAlign: 'center', margin: 0 }}>Checking your reset link…</p>
      </AuthShell>
    )
  }

  if (status === 'no-session') {
    return (
      <AuthShell title={<>Link <em>expired</em></>} subtitle="This reset link is invalid or has already been used" footer={footer}>
        <Link href="/forgot-password" className="submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          <span className="btn-content">Request a new link</span>
        </Link>
      </AuthShell>
    )
  }

  if (status === 'done') {
    return (
      <AuthShell title={<>All <em>set</em></>} subtitle="Taking you to your dashboard…" footer={footer}>
        <div className="success-box" style={{ marginBottom: 0 }}>
          <p>Your password has been updated.</p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title={<>New <em>password</em></>}
      subtitle={email ? `For ${email}` : 'Choose a new password'}
      footer={footer}
    >
      <div className="field-group">
        <label className="field-label" htmlFor="new-password">New Password</label>
        <PasswordInput
          id="new-password"
          value={password}
          onChange={setPassword}
          onEnter={save}
          autoComplete="new-password"
          placeholder={`At least ${MIN_LENGTH} characters`}
        />
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="confirm-password">Confirm Password</label>
        <PasswordInput
          id="confirm-password"
          value={confirm}
          onChange={setConfirm}
          onEnter={save}
          autoComplete="new-password"
          placeholder="Type it again"
        />
      </div>

      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      <button onClick={save} disabled={saving} className="submit-btn">
        <span className="btn-content">
          {saving && <Spinner />}
          {saving ? 'Saving…' : 'Save new password'}
        </span>
      </button>
    </AuthShell>
  )
}
