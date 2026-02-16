// components/DeleteStockButton.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteStock } from "@/app/actions/stock-action"

interface Stock {
  idbarang: string
  namabarang: string
  deskripsi: string
  stock: number
}

export default function DeleteStockButton({ item }: { item: Stock }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Apakah Anda yakin ingin menghapus barang:\n\n` +
      `ID: ${item.idbarang}\n` +
      `Nama: ${item.namabarang}\n` +
      `Deskripsi: ${item.deskripsi}\n` +
      `Stock: ${item.stock}`
    )

    if (!confirm) return

    setLoading(true)

    const result = await deleteStock(item.idbarang)

    if (result.error) {
      alert("Gagal menghapus: " + result.error)
    } else {
      alert("Berhasil dihapus!")
    }

    setLoading(false)
  }

  return (
    <Button
      onClick={handleDelete}
      variant="destructive"
      size="sm"
      disabled={loading}
    >
      {loading ? "..." : "Delete"}
    </Button>
  )
}