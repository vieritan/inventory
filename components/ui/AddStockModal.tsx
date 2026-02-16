"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { addStock } from "@/app/actions/stock-action"
import { Plus } from "lucide-react"

export default function AddStockModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    namabarang: "",
    deskripsi: "",
    stock: "",
  })

  // Fungsi untuk reset form ke kosong
  const resetForm = () => {
    setFormData({
      namabarang: "",
      deskripsi: "",
      stock: "",
    })
  }

  // Fungsi batal
  const handleCancel = () => {
    resetForm()       // Reset form
    setIsOpen(false)  // Tutup popover
  }

  // Fungsi submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formDataObj = new FormData()
    formDataObj.append("namabarang", formData.namabarang)
    formDataObj.append("deskripsi", formData.deskripsi)
    formDataObj.append("stock", formData.stock.toString())

    const result = await addStock(formDataObj)

    if (result.error) {
      alert("Gagal menambah: " + result.error)
    } else {
      alert("Berhasil ditambahkan!")
      resetForm()       // Reset form setelah berhasil
      setIsOpen(false)  // Tutup popover
    }

    setLoading(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Barang
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Tambah Stock Barang</h4>
            <p className="text-muted-foreground text-sm">
              Masukkan informasi barang baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
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
                placeholder="Contoh: Laptop"
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
                placeholder="Contoh: Laptop Gaming"
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
                  setFormData({ ...formData, stock: e.target.value }) 
                }
                required
                min="0"
                placeholder="Masukkan jumlah stock"  // ✅ UBAH PLACEHOLDER
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
                onClick={handleCancel}
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