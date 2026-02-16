// components/ui/EditBarangKeluarModal.tsx
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

type BarangKeluar = {
  idkeluar: number;
  idbarang: number;
  tanggal: string;
  penerima: string;
  qty: number;
};

type Barang = {
  idbarang: number;
  nama: string;
};

export default function EditBarangKeluarModal({
  item,
  barangList,
}: {
  item: BarangKeluar;
  barangList: Barang[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idbarang: item.idbarang.toString(),
    tanggal: item.tanggal,
    penerima: item.penerima,
    qty: item.qty.toString(),
  });

  const router = useRouter();
  const supabase = createClient();

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
    setFormData({
      idbarang: item.idbarang.toString(),
      tanggal: item.tanggal,
      penerima: item.penerima,
      qty: item.qty.toString(),
    });
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const qtyChanged = parseInt(formData.qty) !== item.qty;
      const barangChanged = parseInt(formData.idbarang) !== item.idbarang;

      if (qtyChanged || barangChanged) {
        // Step 1: Kembalikan stock barang lama
        const { data: oldBarang, error: oldError } = await supabase
          .from("stock")
          .select("stock")
          .eq("idbarang", item.idbarang)
          .single();

        if (oldError || !oldBarang) {
          alert("Error: Tidak bisa mengambil data stock lama");
          setLoading(false);
          return;
        }

        const { error: updateOldError } = await supabase
          .from("stock")
          .update({ stock: oldBarang.stock + item.qty })
          .eq("idbarang", item.idbarang);

        if (updateOldError) {
          alert("Error: Tidak bisa mengembalikan stock lama");
          setLoading(false);
          return;
        }

        // Step 2: Cek dan kurangi stock barang baru
        const { data: newBarang, error: newError } = await supabase
          .from("stock")
          .select("stock")
          .eq("idbarang", parseInt(formData.idbarang))
          .single();

        if (newError || !newBarang) {
          await supabase
            .from("stock")
            .update({ stock: oldBarang.stock })
            .eq("idbarang", item.idbarang);
          
          alert("Error: Barang tidak ditemukan");
          setLoading(false);
          return;
        }

        if (newBarang.stock < parseInt(formData.qty)) {
          await supabase
            .from("stock")
            .update({ stock: oldBarang.stock })
            .eq("idbarang", item.idbarang);
          
          alert(`Stock tidak cukup! Stock tersedia: ${newBarang.stock}`);
          setLoading(false);
          return;
        }

        const { error: updateNewError } = await supabase
          .from("stock")
          .update({ stock: newBarang.stock - parseInt(formData.qty) })
          .eq("idbarang", parseInt(formData.idbarang));

        if (updateNewError) {
          await supabase
            .from("stock")
            .update({ stock: oldBarang.stock })
            .eq("idbarang", item.idbarang);
          
          alert("Error: Tidak bisa mengurangi stock baru");
          setLoading(false);
          return;
        }
      }

      // Step 3: Update barang keluar
      const { error: updateError } = await supabase
        .from("barangkeluar")
        .update({
          idbarang: parseInt(formData.idbarang),
          tanggal: formData.tanggal,
          penerima: formData.penerima,
          qty: parseInt(formData.qty),
        })
        .eq("idkeluar", item.idkeluar);

      if (updateError) {
        console.error("Update error:", updateError);
        alert("Error: " + updateError.message);
        setLoading(false);
        return;
      }

      alert("Barang keluar berhasil diupdate!");
      setIsOpen(false);
      
      // ✅ PERBAIKAN: Hard reload untuk force refresh data
      window.location.reload();
      
    } catch (error) {
      console.error("Catch error:", error);
      alert("Terjadi error yang tidak terduga");
      setLoading(false);
    }
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
            <h4 className="leading-none font-medium">Edit Barang Keluar</h4>
            <p className="text-muted-foreground text-sm">
              Ubah informasi barang keluar.
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
              <Label htmlFor="penerima-edit" className="text-xs">
                Penerima
              </Label>
              <Input
                id="penerima-edit"
                type="text"
                value={formData.penerima}
                onChange={(e) =>
                  setFormData({ ...formData, penerima: e.target.value })
                }
                required
                placeholder="Nama penerima"
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