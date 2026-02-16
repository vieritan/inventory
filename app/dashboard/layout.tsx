// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavbarWrapper from '@/app/navbar-wrapper'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const supabase = await createClient()
  
  // Cek apakah user sudah login
  const { data: { session } } = await supabase.auth.getSession()
  
  // Jika belum login, redirect ke halaman login
  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  )
}