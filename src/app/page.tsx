import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ProjectsSection from '@/components/ProjectsSection'
import ServicesSection from '@/components/ServicesSection'
import ExperienceSection from '@/components/ExperienceSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactSection from '@/components/ContactSection'
import { Project, Experience, Profile } from '@/lib/types'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devs-dave.vercel.app'

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: profile },
    { data: projects },
    { data: experience },
  ] = await Promise.all([
    supabase.from('profiles').select('*').single(),
    supabase.from('projects').select('*').order('order_index').order('created_at', { ascending: false }),
    supabase.from('experience').select('*').order('order_index'),
  ])

  const p = profile as Profile | null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#person`,
        name: p?.name || 'Ryan Dave Doño',
        alternateName: 'Dave',
        jobTitle: p?.title || 'Full Stack & Frontend Engineer',
        description: p?.bio || 'Full Stack & Frontend Engineer specializing in responsive, scalable web systems using Vue.js, Next.js, and Node/Express.',
        url: BASE_URL,
        ...(p?.email && { email: p.email }),
        ...(p?.avatar_url && { image: p.avatar_url }),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cebu City',
          addressCountry: 'PH',
        },
        knowsAbout: p?.tech_stack?.map(t => t.name) || [
          'Vue.js', 'Next.js', 'React', 'TypeScript', 'JavaScript',
          'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'TailwindCSS',
        ],
        sameAs: [...new Set([
          'https://www.linkedin.com/in/do%C3%B1o-ryan-dave-p-bba305346/',
          ...(p?.social_links?.map(s => s.url) || []),
        ])],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'DAVE.DEV',
        url: BASE_URL,
        description: `Portfolio of ${p?.name || 'Dave'} — Full Stack & Frontend Engineer based in the Philippines.`,
        author: { '@id': `${BASE_URL}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${BASE_URL}/#profilepage`,
        url: BASE_URL,
        name: `${p?.name || 'Dave'} — Full Stack & Frontend Engineer`,
        mainEntity: { '@id': `${BASE_URL}/#person` },
      },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HeroSection profile={p} />
      <ProjectsSection projects={(projects || []) as Project[]} />
      <ServicesSection />
      <ExperienceSection items={(experience || []) as Experience[]} />
      <TestimonialsSection />
      <ContactSection profile={p} />

      <footer className="border-t border-[var(--border)] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white tracking-widest uppercase">DAVE.DEV</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Full Stack &amp; Frontend Engineer based in PH</p>
          </div>
          <p className="text-xs text-slate-600">
            DAVE.DEV © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
