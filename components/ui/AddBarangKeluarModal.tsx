// components/ui/AddBarangKeluarModal.tsx
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
import { Plus } from "lucide-react";

type Barang = {
  idbarang: number;
  nama: string;
};

export default function AddBarangKeluarModal({
  barangList,
}: {
  barangList: Barang[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idbarang: "",
    tanggal: new Date().toISOString().split("T")[0],
    penerima: "",
    qty: "",
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

  const resetForm = () => {
    setFormData({
      idbarang: "",
      tanggal: new Date().toISOString().split("T")[0],
      penerima: "",
      qty: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Cek stock tersedia
    const { data: barang } = await supabase
      .from("stock")
      .select("stock, namabarang")
      .eq("idbarang", parseInt(formData.idbarang))
      .single();

    if (!barang) {
      alert("Barang tidak ditemukan!");
      setLoading(false);
      return;
    }

    if (barang.stock < parseInt(formData.qty)) {
      alert(`Stock tidak cukup! Stock tersedia: ${barang.stock}`);
      setLoading(false);
      return;
    }

    // Insert barang keluar
    const { error } = await supabase.from("barangkeluar").insert([
      {
        idbarang: parseInt(formData.idbarang),
        tanggal: formData.tanggal,
        penerima: formData.penerima,
        qty: parseInt(formData.qty),
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    // Kurangi stock barang
    await supabase
      .from("stock")
      .update({ stock: barang.stock - parseInt(formData.qty) })
      .eq("idbarang", parseInt(formData.idbarang));

    alert("Barang keluar berhasil ditambahkan!");
    resetForm();
    setIsOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Barang Keluar
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Tambah Barang Keluar</h4>
            <p className="text-muted-foreground text-sm">
              Masukkan informasi barang keluar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="barang" className="text-xs">
                Nama Barang
              </Label>
              <select
                id="barang"
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
              <Label htmlFor="tanggal" className="text-xs">
                Tanggal
              </Label>
              <Input
                id="tanggal"
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
              <Label htmlFor="penerima" className="text-xs">
                Penerima
              </Label>
              <Input
                id="penerima"
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
              <Label htmlFor="qty" className="text-xs">
                Qty
              </Label>
              <Input
                id="qty"
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
  );
}