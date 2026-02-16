"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateStock } from "@/app/actions/stock-action"

import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Stock {
  idbarang: string
  namabarang: string
  deskripsi: string
  stock: number
}

export default function EditStockModal({ item }: { item: Stock }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    namabarang: item.namabarang,
    deskripsi: item.deskripsi,
    stock: item.stock,
  })

  const resetForm = () => {
    setFormData({
      namabarang: item.namabarang,
      deskripsi: item.deskripsi,
      stock: item.stock,
    })
  }

  const handleCancel = () => {
    resetForm()       // 1. Reset form ke nilai awal
    setIsOpen(false)  // 2. Tutup popover
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formDataObj = new FormData()
    formDataObj.append("idbarang", item.idbarang)
    formDataObj.append("namabarang", formData.namabarang)
    formDataObj.append("deskripsi", formData.deskripsi)
    formDataObj.append("stock", formData.stock.toString())

    const result = await updateStock(formDataObj)

    if (result.error) {
      alert("Gagal update: " + result.error)
    } else {
      alert("Berhasil diupdate!")
      setIsOpen(false)
    }

    setLoading(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
        >
          Edit
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Edit Stock Barang</h4>
            <p className="text-muted-foreground text-sm">
              Ubah informasi barang di bawah ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="idbarang" className="text-xs">
                ID Barang
              </Label>
              <Input
                id="idbarang"
                value={item.idbarang}
                disabled
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="namabarang" className="text-xs">
                Nama Barang
              </Label>
              <Input
                id="namabarang"
                value={formData.namabarang}
                onChange={(e) =>
                  setFormData({ ...formData, namabarang: e.target.value })
                }
                required
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="deskripsi" className="text-xs">
                Deskripsi
              </Label>
              <Input
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                required
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="stock" className="text-xs">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                }
                required
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-8 text-xs"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="flex-1 h-8 text-xs"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  )
}