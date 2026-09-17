const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    iconBg: 'bg-purple-500/20 text-purple-400',
    title: 'Full-Stack Web Development',
    desc: 'Custom, responsive web architectures built with modern frameworks that guarantee exceptional sprints, rapid rendering, and maintainable clean codebases.',
    features: ['Next.js / Vue.js & SPA & SSR', 'Headless Content Services'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
    iconBg: 'bg-orange-500/20 text-orange-400',
    title: 'UI/UX Systems Design',
    desc: 'User-centered design thinking paired with pixel-perfect technical implementation. Building intuitive interfaces that minimize churn and maximize retention.',
    features: ['Design Tokens & Prototypes', 'Accessibility WCAG 2.11'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    iconBg: 'bg-pink-500/20 text-pink-400',
    title: 'Branding & Visual Direction',
    desc: 'Distinctive brand identity, logo styling, and consistency guidelines tailored to communicate your value proposition clearly to target audiences.',
    features: ['Identity Guidelines', 'Multi-platform Brand Assets'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    iconBg: 'bg-blue-500/20 text-blue-400',
    title: 'Core Web Vitals & SEO',
    desc: 'Supercharging page speed, optimising LCP/CLS metrics, cracking search rankings, and technical SEO structure to drive search revenue and lower bounce rates.',
    features: ['90+ Avg Lighthouse Scores', 'Layout & Bundle Optimization'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    title: 'Responsive Cross-Platform',
    desc: 'Adaptive layouts engineered to look pristine across smartphones, foldables, tablets, ultrawide, and retina desktop displays.',
    features: ['Mobile-First Rethinking', 'Cross-browser Verification'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 6 0m-6 0H3m16.5 0a3 3 0 0 0-3-3m3 3a3 3 0 1 1-6 0m6 0h1.5m-7.5 0v1.5m0-7.5V3m0 3.75a3 3 0 0 1 3 3m-3-3a3 3 0 1 0-6 0m6 0H21M3 6.75h1.5m7.5-3V3" />
      </svg>
    ),
    iconBg: 'bg-yellow-500/20 text-yellow-400',
    title: 'Headless CMS & App Engines',
    desc: 'Custom web platforms with database integrations, user role management, RESTful APIs, and user-friendly editorial dashboards.',
    features: ['REST & GraphQL Integration', 'Custom CMS Wiring'],
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-4" style={{ background: 'rgba(13,22,39,0.5)' }}>
      <div className="max-w-7xl mx-auto">

        <div className="mb-16 text-center">
          <p className="section-label mb-3">// CMS Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Services &amp; Technical Offerings</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            I deliver full-lifecycle engineering services designed to help ambitious businesses and brands establish an uncompromised digital presence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(service => (
            <div
              key={service.title}
              className="card-hover rounded-xl p-6"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${service.iconBg}`}>
                {service.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">{service.desc}</p>
              <ul className="space-y-1.5">
                {service.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-[var(--accent)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
