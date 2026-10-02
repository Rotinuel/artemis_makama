// Analytics events → Google Analytics 4 (gtag) and Vercel Analytics (va).
// Safe to call anywhere on the client; does nothing if neither is loaded.
//
// Events used on the site:
//   whatsapp_click, phone_click, email_click     (automatic, any link)
//   generate_lead { form: 'consultation' | 'contact' | 'booking' }
//   newsletter_signup, file_download { file }

export function track(name, params = {}) {
    if (typeof window === 'undefined') return
    try { window.gtag?.('event', name, params) } catch { /* ignore */ }
    try { window.va?.('event', { name, data: params }) } catch { /* ignore */ }
}
