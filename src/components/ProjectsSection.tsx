'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Project } from '@/lib/types'

const FILTERS = ['All', 'Frontend', 'Fullstack', 'CMS']

interface PreviewMeta {
  preview_headline?: string
  preview_headline_italic?: boolean
  preview_subtitle?: string
  preview_category?: string
  preview_category_color?: 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose'
  preview_url?: string
  badge?: string
  badge_color?: 'teal' | 'orange' | 'pink' | 'blue' | 'purple'
  link_label?: string
  right_label?: string
}

function parseMeta(raw: string | null): PreviewMeta {
  if (!raw) return {}
  try { return JSON.parse(raw) } catch { return {} }
}

const BADGE_STYLE: Record<string, string> = {
  teal:   'bg-teal-500/25 text-teal-300 border-teal-500/40',
  orange: 'bg-orange-500/25 text-orange-300 border-orange-500/40',
  pink:   'bg-pink-500/25 text-pink-300 border-pink-500/40',
  blue:   'bg-blue-500/25 text-blue-300 border-blue-500/40',
  purple: 'bg-purple-500/25 text-purple-300 border-purple-500/40',
}

const CATEGORY_COLOR: Record<string, string> = {
  amber:   'text-amber-400',
  emerald: 'text-emerald-400',
  cyan:    'text-cyan-400',
  purple:  'text-purple-400',
  rose:    'text-rose-400',
}

const PREVIEW_GLOW: Record<string, string> = {
  amber:   'radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.06) 0%, transparent 70%)',
  emerald: 'radial-gradient(ellipse at 50% 80%, rgba(52,211,153,0.06) 0%, transparent 70%)',
  cyan:    'radial-gradient(ellipse at 50% 80%, rgba(34,211,238,0.06) 0%, transparent 70%)',
  purple:  'radial-gradient(ellipse at 50% 80%, rgba(167,139,250,0.06) 0%, transparent 70%)',
  rose:    'radial-gradient(ellipse at 50% 80%, rgba(251,113,133,0.06) 0%, transparent 70%)',
}

function filterMatch(meta: PreviewMeta, active: string): boolean {
  if (active === 'All') return true
  const badge = (meta.badge || '').toLowerCase()
  if (active === 'Fullstack') return badge === 'fullstack'
  if (active === 'CMS') return badge.includes('cms')
  if (active === 'Frontend') return badge.includes('frontend') || badge === 'maintenance'
  return false
}

function BrowserDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const meta = parseMeta(project.long_description)
  const badgeStyle = BADGE_STYLE[meta.badge_color || 'teal'] || BADGE_STYLE.teal
  const catColor = CATEGORY_COLOR[meta.preview_category_color || 'cyan'] || CATEGORY_COLOR.cyan
  const glow = PREVIEW_GLOW[meta.preview_category_color || 'cyan'] || ''

  return (
    <div
      className="group rounded-xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 0 0 0 rgba(74,222,128,0)' }}
    >
      {/* ── Browser Mockup ── */}
      <div className="relative overflow-hidden" style={{ height: '220px', background: '#060b14' }}>

        {/* Background image — scales on hover */}
        {project.image_url && (
          <Image
            src={project.image_url}
            alt={`${project.title} – project preview screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}

        {/* Base overlay — always present, lightens so image shows clearly */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: project.image_url
              ? 'linear-gradient(to bottom, rgba(6,11,20,0.72) 0%, rgba(6,11,20,0.25) 50%, rgba(6,11,20,0.45) 100%)'
              : `linear-gradient(to bottom, #060b14, #0d1627)`,
          }}
        />

        {/* Hover overlay — darkens to make text readable, fades in */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to bottom, rgba(6,11,20,0.55) 0%, rgba(6,11,20,0.72) 45%, rgba(6,11,20,0.92) 100%)',
          }}
        />

        {/* Browser top bar */}
        <div
          className="relative z-10 flex items-center px-3 py-2 gap-3"
          style={{ background: 'rgba(6,11,20,0.80)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <BrowserDots />
          <span className="flex-1 text-center text-[10px] text-slate-500 font-mono tracking-wide">
            {meta.preview_url || project.live_url?.replace('https://', '') || 'preview.dev'}
          </span>
          {meta.badge && (
            <span className={`text-[9px] font-semibold border rounded-full px-2 py-0.5 whitespace-nowrap ${badgeStyle}`}>
              {meta.badge}
            </span>
          )}
        </div>

        {/* Preview content — fades in on hover, always centered */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100%-36px)] px-6 text-center gap-1
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          {meta.preview_category && (
            <p className={`text-[9px] font-bold tracking-[0.18em] uppercase mb-1 ${catColor}`}>
              {meta.preview_category}
            </p>
          )}
          {meta.preview_headline && (
            <p className={`text-white font-bold leading-tight text-xl drop-shadow-lg ${meta.preview_headline_italic ? 'italic' : ''}`}>
              {meta.preview_headline}
            </p>
          )}
          {meta.preview_subtitle && (
            <p className="text-slate-300 text-[11px] mt-0.5 drop-shadow">
              {meta.preview_subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Card Info ── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags?.map(tag => (
            <span
              key={tag}
              className="text-[10px] text-slate-400 border border-[var(--border)] rounded px-2 py-0.5 bg-slate-800/30 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[var(--accent)] hover:text-green-300 transition-colors font-medium"
            >
              {meta.link_label || 'View Live Site'}
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
              </svg>
            </a>
          ) : <span />}
          {meta.right_label && (
            <span className="text-[10px] text-slate-600 font-medium">{meta.right_label}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('All')

  const filtered = projects.filter(p => filterMatch(parseMeta(p.long_description), active))

  return (
    <section id="projects" className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header + Filter row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <p className="section-label mb-3">// Featured Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Recent Case Studies</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Explore a curated selection of production applications spanning luxury hospitality, master-planned developments, and modern spas.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 flex-wrap shrink-0">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-colors ${
                  active === f
                    ? 'bg-[var(--accent)] text-[var(--background)] border-[var(--accent)]'
                    : 'border-[var(--border)] text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No projects yet. Add some from the <a href="/admin" className="text-[var(--accent)] hover:underline">admin panel</a>.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">No projects in this category.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
