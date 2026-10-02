'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { CURRENCIES, fromNaira, formatMoney } from '@/lib/fx'

const Ctx = createContext({ code: 'NGN', rates: null, setCode: () => {} })
const KEY = 'aal-currency'

/** Wrap a page section; amounts inside can switch between ₦, £, $ */
export function CurrencyProvider({ rates, children }) {
    const [code, setCode] = useState('NGN')
    useEffect(() => {
        try {
            const saved = localStorage.getItem(KEY)
            if (saved && CURRENCIES[saved]) setCode(saved)
        } catch { /* ignore */ }
    }, [])
    const choose = c => {
        setCode(c)
        try { localStorage.setItem(KEY, c) } catch { /* ignore */ }
    }
    return <Ctx.Provider value={{ code, rates, setCode: choose }}>{children}</Ctx.Provider>
}

export function CurrencyToggle({ codes = ['NGN', 'GBP', 'USD', 'CAD'] }) {
    const { code, setCode, rates } = useContext(Ctx)
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#6b6b6b]">Show amounts in</span>
            <div className="inline-flex border border-[#d9d9d9]" role="radiogroup" aria-label="Currency">
                {codes.map(c => (
                    <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={code === c}
                        onClick={() => setCode(c)}
                        className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${code === c ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a] hover:bg-[#f2f2f2]'}`}
                    >
                        {CURRENCIES[c].symbol} {c}
                    </button>
                ))}
            </div>
            {code !== 'NGN' && rates?.perUnit?.[code] && (
                <span className="text-[11px] text-[#8a8a8a]">
                    at ₦{Math.round(rates.perUnit[code]).toLocaleString('en-GB')} = 1 {code} ({rates.source}, {rates.date})
                </span>
            )}
        </div>
    )
}

/** <Money ngn={[45e6, 75e6]} /> or <Money ngn={150000} suffix="/m²" /> */
export function Money({ ngn, suffix = '', plus = false }) {
    const { code, rates } = useContext(Ctx)
    const conv = v => fromNaira(v, code, rates)
    const shown = code !== 'NGN' && rates?.perUnit?.[code] ? code : 'NGN'
    const fmt = v => formatMoney(shown === 'NGN' ? v : conv(v), shown)
    const text = Array.isArray(ngn)
        ? (ngn[1] == null ? `${fmt(ngn[0])}+` : `${fmt(ngn[0])} – ${fmt(ngn[1])}`)
        : `${fmt(ngn)}${plus ? '+' : ''}`
    return <span className="tabular-nums whitespace-nowrap">{text}{suffix}</span>
}
