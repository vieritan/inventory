// app/dashboard/navbar-wrapper.tsx
"use client"

import dynamic from 'next/dynamic'

const MenubarDemo = dynamic(
  () => import('@/components/ui/menunav').then(mod => mod.MenubarDemo),
  { ssr: false }
)

export default function NavbarWrapper() {
  return <MenubarDemo />
}