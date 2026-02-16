// components/ui/EditBarangMasukModal.tsx
"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil } from "lucide-react";

type BarangMasuk = {
  idmasuk: number;
  idbarang: number;
  tanggal: string;
  qty: number;
  keterangan: string;
};

type Barang = {
  idbarang: number;
  nama: string;
};

export default function EditBarangMasukModal({
  item,
  barangList,
}: {
  item: BarangMasuk;
  barangList: Barang[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idbarang: item.idbarang.toString(),
    tanggal: item.tanggal,
    qty: item.qty.toString(),
    keterangan: item.keterangan,
  });

  const router = useRouter();
  const supabase = createClient();

  // Deduplicate barangList
  const uniqueBarangList = useMemo(() => {
    if (!barangList || barangList.length === 0) return [];
    
    const seen = new Set();
    return barangList.filter((barang) => {
      if (seen.has(barang.idbarang)) return false;
      seen.add(barang.idbarang);
      return true;
    });
  }, [barangList]);

  const handleCancel = () => {
    // Reset ke data awal
    setFormData({
      idbarang: item.idbarang.toString(),
      tanggal: item.tanggal,
      qty: item.qty.toString(),
      keterangan: item.keterangan,
    });
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("barangmasuk")
      .update({
        idbarang: parseInt(formData.idbarang),
        tanggal: formData.tanggal,
        qty: parseInt(formData.qty),
        keterangan: formData.keterangan,
      })
      .eq("idmasuk", item.idmasuk);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    alert("Barang masuk berhasil diupdate!");
    setIsOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 h-8">
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Edit Barang Masuk</h4>
            <p className="text-muted-foreground text-sm">
              Ubah informasi barang masuk.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="barang-edit" className="text-xs">
                Nama Barang
              </Label>
              <select
                id="barang-edit"
                value={formData.idbarang}
                onChange={(e) =>
                  setFormData({ ...formData, idbarang: e.target.value })
                }
                className="col-span-2 h-8 text-xs px-2 border rounded"
                required
              >
                <option value="">Pilih Barang</option>
                {uniqueBarangList.length > 0 ? (
                  uniqueBarangList.map((barang) => (
                    <option key={barang.idbarang} value={barang.idbarang}>
                      {barang.nama}
                    </option>
                  ))
                ) : (
                  <option disabled>Tidak ada data barang</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="tanggal-edit" className="text-xs">
                Tanggal
              </Label>
              <Input
                id="tanggal-edit"
                type="date"
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal: e.target.value })
                }
                required
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="qty-edit" className="text-xs">
                Qty
              </Label>
              <Input
                id="qty-edit"
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) =>
                  setFormData({ ...formData, qty: e.target.value })
                }
                required
                placeholder="Masukkan jumlah"
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="keterangan-edit" className="text-xs">
                Keterangan
              </Label>
              <textarea
                id="keterangan-edit"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
                required
                placeholder="Masukkan keterangan"
                rows={3}
                className="col-span-2 text-xs px-2 py-1 border rounded"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-8 text-xs"
              >
                {loading ? "Menyimpan..." : "Update"}
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
  );
}