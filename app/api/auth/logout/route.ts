// app/api/auth/logout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Sign out dari Supabase
    const { error } = await supabase.auth.signOut()
    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    // Kembalikan response sederhana; client akan handle redirect
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, message }, { status: 500 })
  }
}
