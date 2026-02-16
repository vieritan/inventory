"use client"

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarDemo() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      // Panggil API logout agar cookie server-side ikut dibersihkan
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        cache: 'no-store',
      }).catch(() => null)

      if (res && !res.ok) {
        let body = ''
        try {
          body = await res.text()
        } catch {}
        console.error('Logout API failed:', res.status, body)
      }

      // Bersihkan state client Supabase (ignore error jika session tidak ada)
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.log('Logout warning:', error.message)
      }
    } catch {
      console.warn('Logout request gagal, lanjut bersihkan session lokal.')
    } finally {
      // Selalu redirect ke login dan clear cache
      router.replace('/login')
      router.refresh()
    }
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger onClick={() => router.push('/dashboard/')}>
          Dashboard
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={() => router.push('/dashboard/barangmasuk')}>
          Barang Masuk
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={() => router.push('/dashboard/barangkeluar')}>
          Barang Keluar
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={() => router.push('/dashboard/supplier')}>
          Supplier
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={handleLogout}>
          Log Out
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}

export default MenubarDemo
