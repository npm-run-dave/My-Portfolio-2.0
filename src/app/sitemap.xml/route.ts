import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devs-dave.vercel.app'

const urls = [
  { loc: BASE_URL,                      changefreq: 'weekly',  priority: '1.0' },
  { loc: `${BASE_URL}/#projects`,       changefreq: 'weekly',  priority: '0.8' },
  { loc: `${BASE_URL}/#services`,       changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/#experience`,     changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/#contact`,        changefreq: 'yearly',  priority: '0.5' },
]

export function GET() {
  const lastmod = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
