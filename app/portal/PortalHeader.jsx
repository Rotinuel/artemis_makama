'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function PortalHeader({ email, isAdmin = false, showAllLink = false }) {
    const router = useRouter()
    const [busy, setBusy] = useState(false)

    async function signOut() {
        setBusy(true)
        await createClient().auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="pt-header">
            <div className="pt-header-in">
                <Link href="/portal" className="pt-brand">
                    <span className="pt-logo">
                        <Image src="/logo-bg.png" alt="Artemis Atelier Ltd" width={30} height={30} style={{ height: 'auto' }} />
                    </span>
                    <span className="pt-brand-text">
                        <span className="pt-brand-name">Artemis Atelier Ltd</span>
                        <span className="pt-brand-sub">Client Portal</span>
                    </span>
                </Link>
                <div className="pt-head-actions">
                    {email && <span className="pt-user" title={email}>{email}</span>}
                    {showAllLink && <Link href="/portal" className="pt-hbtn">All projects</Link>}
                    {isAdmin && <Link href="/admin/portal" className="pt-hbtn accent">Admin</Link>}
                    <button type="button" className="pt-hbtn" onClick={signOut} disabled={busy}>
                        {busy ? 'Signing out…' : 'Sign out'}
                    </button>
                </div>
            </div>
        </header>
    )
}
