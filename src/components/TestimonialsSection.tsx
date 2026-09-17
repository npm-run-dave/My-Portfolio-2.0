const TESTIMONIALS = [
  {
    initials: 'DP',
    avatarColor: 'bg-teal-500',
    name: 'Diome Nike S. Potot',
    role: 'Front End Lead · Publicis Groupe Philippines (Digitas)',
    quote:
      'Dave consistently demonstrates an eye for code cleanliness and user experience clarity. He brings technical dedication, adaptability, and high craftsmanship to every team collaboration.',
    email: 'diomenikep@gmail.com',
    badge: 'VERIFIED',
    badgeColor: 'text-teal-400 border-teal-500/40',
  },
  {
    initials: 'NA',
    avatarColor: 'bg-violet-500',
    name: 'Nicasio P. Amoin',
    role: 'Dean · College of Information Technology (CPC)',
    quote:
      'A standout developer whose perseverance, analytical ability, and passion for continuous learning distinguish him in both academic and production software initiatives.',
    email: 'nicasioamoin@gmail.com',
    badge: 'ACADEMIC DEAN',
    badgeColor: 'text-violet-400 border-violet-500/40',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4" style={{ background: 'rgba(13,22,39,0.5)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="section-label mb-3">// Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Professional References</h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              className="rounded-xl p-6 flex flex-col gap-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {/* ── Top: avatar + name + role ── */}
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-full ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-snug">{t.name}</p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: '#2dd4bf' }}>
                    {t.role}
                  </p>
                </div>
              </div>

              {/* ── Quote ── */}
              <p className="text-slate-300 text-sm leading-relaxed italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* ── Footer: email + badge ── */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <span className="text-xs text-slate-500">{t.email}</span>
                <span className={`text-[10px] font-semibold tracking-widest border rounded px-2.5 py-1 ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
