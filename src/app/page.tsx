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

  return (
    <main>
      <Navbar />
      <HeroSection profile={profile as Profile | null} />
      <ProjectsSection projects={(projects || []) as Project[]} />
      <ServicesSection />
      <ExperienceSection items={(experience || []) as Experience[]} />
      <TestimonialsSection />
      <ContactSection profile={profile as Profile | null} />

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
