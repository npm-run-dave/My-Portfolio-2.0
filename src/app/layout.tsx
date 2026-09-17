import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DAVE.DEV — Full Stack & Frontend Engineer',
  description: 'Full Stack & Frontend Engineer based in PH. Specializing in responsive, scalable web systems using Vue.js, Next.js, and Node/Express with custom headless CMS architectures.',
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
