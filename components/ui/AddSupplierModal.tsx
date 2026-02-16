// components/ui/AddSupplierModal.tsx
"use client";

import { useState } from "react";
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

export default function AddSupplierModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namasupplier: "",
    nohp: "",
    keterangan: "",
  });

  const router = useRouter();
  const supabase = createClient();

  const resetForm = () => {
    setFormData({
      namasupplier: "",
      nohp: "",
      keterangan: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("supplier").insert([
      {
        namasupplier: formData.namasupplier,
        nohp: formData.nohp,
        keterangan: formData.keterangan,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    alert("Supplier berhasil ditambahkan!");
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
          Tambah Supplier
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Tambah Supplier</h4>
            <p className="text-muted-foreground text-sm">
              Masukkan informasi supplier baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="namasupplier" className="text-xs">
                Nama Supplier
              </Label>
              <Input
                id="namasupplier"
                type="text"
                value={formData.namasupplier}
                onChange={(e) =>
                  setFormData({ ...formData, namasupplier: e.target.value })
                }
                required
                placeholder="PT. ABC"
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="nohp" className="text-xs">
                No. HP
              </Label>
              <Input
                id="nohp"
                type="tel"
                value={formData.nohp}
                onChange={(e) =>
                  setFormData({ ...formData, nohp: e.target.value })
                }
                required
                placeholder="081234567890"
                className="col-span-2 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="keterangan" className="text-xs">
                Keterangan
              </Label>
              <textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
                required
                placeholder="Supplier elektronik"
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