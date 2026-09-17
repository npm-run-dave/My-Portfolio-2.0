import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: body.id || '00000000-0000-0000-0000-000000000001',
      name: body.name,
      title: body.title,
      bio: body.bio,
      avatar_url: body.avatar_url || null,
      email: body.email || null,
      resume_url: body.resume_url || null,
      social_links: body.social_links || [],
      location_badge: body.location_badge || null,
      hero_tagline: body.hero_tagline || null,
      tech_stack: body.tech_stack || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
