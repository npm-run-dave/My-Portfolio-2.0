import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const supabase = createAdminClient()

  // Ensure bucket exists
  await supabase.storage.createBucket('portfolio-assets', { public: true }).catch(() => {})

  const ext = file.name.split('.').pop() || 'png'
  const path = `tech-icons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('portfolio-assets')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
