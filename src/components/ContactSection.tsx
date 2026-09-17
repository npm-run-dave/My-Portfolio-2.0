'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Profile, ContactFormConfig, DEFAULT_CONTACT_FORM_CONFIG } from '@/lib/types'

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

const inputCls =
  'w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[var(--accent)]/50 transition-colors'

declare global {
  interface Window {
    grecaptcha?: {
      render: (el: HTMLElement, opts: object) => number
      reset: (id: number) => void
      getResponse: (id: number) => string
    }
    __onRecaptchaLoad?: () => void
  }
}

export default function ContactSection({ profile }: { profile: Profile | null }) {
  const config: ContactFormConfig = profile?.contact_form_config || DEFAULT_CONTACT_FORM_CONFIG
  const activeFields = config.fields.filter(f => f.enabled).sort((a, b) => a.order - b.order)
  const email = profile?.email || 'contact@daves.dev'

  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(activeFields.map(f => [f.key, f.type === 'select' ? (f.options?.[0] ?? '') : '']))
  )
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const renderWidget = useCallback(() => {
    if (!captchaRef.current || widgetIdRef.current !== null || !window.grecaptcha) return
    widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
      sitekey: SITE_KEY,
      theme: 'dark',
      callback: (token: string) => { setCaptchaToken(token); setCaptchaError(false) },
      'expired-callback': () => setCaptchaToken(''),
      'error-callback': () => setCaptchaToken(''),
    })
  }, [])

  // Load reCAPTCHA script once
  useEffect(() => {
    if (window.grecaptcha?.render) { renderWidget(); return }
    window.__onRecaptchaLoad = renderWidget
    const s = document.createElement('script')
    s.src = 'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoad&render=explicit'
    s.async = true; s.defer = true
    document.head.appendChild(s)
    return () => { delete window.__onRecaptchaLoad }
  }, [renderWidget])

  // Re-render widget when form reappears after "Send another"
  useEffect(() => {
    if (status !== 'idle') return
    widgetIdRef.current = null
    setCaptchaToken('')
    setCaptchaError(false)
    if (window.grecaptcha?.render) {
      const t = setTimeout(renderWidget, 50)
      return () => clearTimeout(t)
    }
  }, [status, renderWidget])

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!captchaToken) { setCaptchaError(true); return }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken: captchaToken }),
      })
      if (res.ok) {
        setStatus('sent')
        setForm(Object.fromEntries(activeFields.map(f => [f.key, f.type === 'select' ? (f.options?.[0] ?? '') : ''])))
      } else {
        setStatus('error')
        if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current)
        setCaptchaToken('')
      }
    } catch {
      setStatus('error')
      if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current)
      setCaptchaToken('')
    }
  }

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left: Info */}
          <div>
            <p className="section-label mb-3">// Direct Inquiries</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Let&apos;s build something<br />exceptional together.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
              Whether you are looking to construct a new enterprise web platform, optimise existing web performance, or hire for engineering contracts, my inbox is open.
            </p>

            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-[var(--accent)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Email</p>
                  <a href={`mailto:${email}`} className="text-sm text-white hover:text-[var(--accent)] transition-colors">{email}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-[var(--accent)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Location</p>
                  <p className="text-sm text-white">Cebu City, Philippines (GMT+8)</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {(profile?.social_links || []).length > 0
                ? (profile!.social_links).map(s => {
                    const domain = (() => { try { return new URL(s.url).hostname } catch { return '' } })()
                    return (
                      <a key={s.platform} href={s.url} aria-label={s.platform} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-slate-400 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-colors">
                        {s.icon
                          ? <span className="text-base leading-none">{s.icon}</span>
                          : domain
                            ? <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-4 h-4" />
                            : <span className="text-xs font-bold">{s.platform.charAt(0).toUpperCase()}</span>
                        }
                      </a>
                    )
                  })
                : [
                    { label: 'GitHub', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
                    { label: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                    { label: 'Twitter', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  ].map(s => (
                    <a key={s.label} href="#" aria-label={s.label}
                      className="w-9 h-9 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-slate-400 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-colors">
                      {s.icon}
                    </a>
                  ))
              }
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-xl p-7" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {status === 'sent' ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7 text-[var(--accent)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Message Transmitted!</h3>
                <p className="text-slate-400 text-sm">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-xs text-[var(--accent)] hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                      {field.label}{field.required && <span className="text-[var(--accent)] ml-0.5">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        value={form[field.key] ?? ''}
                        onChange={e => setField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className={inputCls + ' resize-none'}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={form[field.key] ?? ''}
                        onChange={e => setField(field.key, e.target.value)}
                        className={inputCls}
                      >
                        {(field.options || []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        value={form[field.key] ?? ''}
                        onChange={e => setField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={inputCls}
                      />
                    )}
                  </div>
                ))}

                {/* reCAPTCHA */}
                <div>
                  <div ref={captchaRef} />
                  {captchaError && (
                    <p className="text-red-400 text-xs mt-1.5">Please complete the CAPTCHA before submitting.</p>
                  )}
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-xs">Something went wrong. Please try emailing directly.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 rounded-lg bg-[var(--accent)] text-[var(--background)] text-sm font-semibold hover:bg-green-300 transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? 'Transmitting…' : 'Transmit Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
