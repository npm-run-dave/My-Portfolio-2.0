import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: body.title,
      description: body.description,
      long_description: body.long_description || null,
      image_url: body.image_url || null,
      live_url: body.live_url || null,
      github_url: body.github_url || null,
      tags: body.tags || [],
      featured: body.featured || false,
      order_index: body.order_index || 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .update({
      title: body.title,
      description: body.description,
      long_description: body.long_description || null,
      image_url: body.image_url || null,
      live_url: body.live_url || null,
      github_url: body.github_url || null,
      tags: body.tags || [],
      featured: body.featured || false,
      order_index: body.order_index || 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const supabase = createAdminClient()

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
