import { Experience } from '@/lib/types'

function WorkItem({ item }: { item: Experience }) {
  return (
    <div className="group flex items-stretch gap-4">
      <div className="flex flex-col items-center shrink-0 pt-5" style={{ width: '16px' }}>
        <span
          className="w-2 h-2 rounded-full bg-[var(--accent)] relative z-10 shrink-0
            transition-all duration-300 ease-out
            group-hover:scale-125 group-hover:shadow-[0_0_10px_4px_rgba(74,222,128,0.55)]"
          style={{ transitionDelay: '600ms' }}
        />
        <div className="flex-1 w-px mt-1.5 relative overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100
              transition-transform duration-700 ease-out rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(74,222,128,0.9) 0%, rgba(74,222,128,0.4) 60%, transparent 100%)' }}
          />
        </div>
      </div>

      <div
        className="flex-1 rounded-xl p-5 mb-4 transition-all duration-300
          group-hover:shadow-[0_0_0_1px_rgba(74,222,128,0.2),0_6px_24px_rgba(74,222,128,0.06)]"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
          <span
            className="text-[10px] font-mono font-semibold whitespace-nowrap rounded px-2 py-0.5 shrink-0"
            style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}
          >
            {item.period}
          </span>
        </div>
        <p className="text-xs font-semibold mb-3" style={{ color: '#2dd4bf' }}>{item.organization}</p>
        <p className="text-slate-400 text-xs leading-relaxed mb-4">{item.description}</p>
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] text-slate-400 rounded px-2 py-0.5 font-medium"
                style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EduItem({ item }: { item: Experience }) {
  return (
    <div className="group flex items-stretch gap-4">
      <div className="flex flex-col items-center shrink-0 pt-5" style={{ width: '16px' }}>
        <span
          className="w-2 h-2 rounded-full bg-blue-400 relative z-10 shrink-0
            transition-all duration-300 ease-out
            group-hover:scale-125 group-hover:shadow-[0_0_10px_4px_rgba(96,165,250,0.55)]"
          style={{ transitionDelay: '600ms' }}
        />
        <div className="flex-1 w-px mt-1.5 relative overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100
              transition-transform duration-700 ease-out rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(96,165,250,0.9) 0%, rgba(96,165,250,0.4) 60%, transparent 100%)' }}
          />
        </div>
      </div>

      <div
        className="flex-1 rounded-xl p-5 mb-4 transition-all duration-300
          group-hover:shadow-[0_0_0_1px_rgba(96,165,250,0.2),0_6px_24px_rgba(96,165,250,0.06)]"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-sm font-bold text-white leading-snug mb-2">{item.title}</h3>
        <span
          className="inline-block text-[10px] font-mono font-semibold rounded px-2 py-0.5 mb-2"
          style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}
        >
          {item.period}
        </span>
        <p className="text-xs font-semibold text-white mb-3">{item.organization}</p>
        <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
      </div>
    </div>
  )
}

export default function ExperienceSection({ items }: { items: Experience[] }) {
  const work = items.filter(i => i.type === 'work').sort((a, b) => a.order_index - b.order_index)
  const education = items.filter(i => i.type === 'education').sort((a, b) => a.order_index - b.order_index)

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-14">

          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-[var(--accent)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Work Experience</h2>
            </div>
            {work.length === 0 ? (
              <p className="text-slate-600 text-sm pl-8">No work experience added yet.</p>
            ) : (
              work.map(item => <WorkItem key={item.id} item={item} />)
            )}
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Education</h2>
            </div>
            {education.length === 0 ? (
              <p className="text-slate-600 text-sm pl-8">No education added yet.</p>
            ) : (
              education.map(item => <EduItem key={item.id} item={item} />)
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
