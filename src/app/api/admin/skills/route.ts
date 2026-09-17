import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('skills')
    .insert({
      name: body.name,
      category: body.category,
      level: body.level || 80,
      icon: body.icon || null,
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
    .from('skills')
    .update({
      name: body.name,
      category: body.category,
      level: body.level,
      icon: body.icon || null,
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

  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
