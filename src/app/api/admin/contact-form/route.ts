import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const PROFILE_ID = '00000000-0000-0000-0000-000000000001'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('contact_form_config')
    .eq('id', PROFILE_ID)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data?.contact_form_config || null)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .update({ contact_form_config: body })
    .eq('id', PROFILE_ID)
    .select('contact_form_config')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data?.contact_form_config)
}
