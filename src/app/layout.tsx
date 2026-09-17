import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devs-dave.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'DAVE.DEV — Full Stack & Frontend Engineer',
  description: 'Full Stack & Frontend Engineer based in PH. Specializing in responsive, scalable web systems using Vue.js, Next.js, and Node/Express with custom headless CMS architectures.',
  keywords: [
    'Full Stack Developer', 'Frontend Engineer', 'Vue.js', 'Next.js', 'React',
    'TypeScript', 'Node.js', 'Supabase', 'Philippines', 'Cebu', 'Web Developer',
    'Freelance Developer', 'CMS Development', 'TailwindCSS',
  ],
  authors: [{ name: 'Dave', url: BASE_URL }],
  openGraph: {
    type: 'profile',
    url: BASE_URL,
    title: 'DAVE.DEV — Full Stack & Frontend Engineer',
    description: 'Full Stack & Frontend Engineer based in the Philippines. Scalable web systems, CMS architectures, Vue.js & Next.js.',
    siteName: 'DAVE.DEV',
  },
  twitter: {
    card: 'summary',
    title: 'DAVE.DEV — Full Stack & Frontend Engineer',
    description: 'Full Stack & Frontend Engineer based in the Philippines. Scalable web systems, CMS architectures, Vue.js & Next.js.',
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
