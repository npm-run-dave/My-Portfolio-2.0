import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('experience')
    .insert({
      type: body.type,
      title: body.title,
      organization: body.organization || '',
      period: body.period || '',
      description: body.description || '',
      tags: body.tags || [],
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
    .from('experience')
    .update({
      type: body.type,
      title: body.title,
      organization: body.organization || '',
      period: body.period || '',
      description: body.description || '',
      tags: body.tags || [],
      order_index: body.order_index || 0,
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

  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
