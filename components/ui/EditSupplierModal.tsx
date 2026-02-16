// components/ui/EditSupplierModal.tsx
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
import { Pencil } from "lucide-react";

type Supplier = {
  idsupplier: number;
  namasupplier: string;
  nohp: string;
  keterangan: string;
};

export default function EditSupplierModal({ supplier }: { supplier: Supplier }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namasupplier: supplier.namasupplier,
    nohp: supplier.nohp,
    keterangan: supplier.keterangan,
  });

  const router = useRouter();
  const supabase = createClient();

  const handleCancel = () => {
    setFormData({
      namasupplier: supplier.namasupplier,
      nohp: supplier.nohp,
      keterangan: supplier.keterangan,
    });
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("supplier")
      .update({
        namasupplier: formData.namasupplier,
        nohp: formData.nohp,
        keterangan: formData.keterangan,
      })
      .eq("idsupplier", supplier.idsupplier);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    alert("Supplier berhasil diupdate!");
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
            <h4 className="leading-none font-medium">Edit Supplier</h4>
            <p className="text-muted-foreground text-sm">
              Ubah informasi supplier.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="namasupplier-edit" className="text-xs">
                Nama Supplier
              </Label>
              <Input
                id="namasupplier-edit"
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
              <Label htmlFor="nohp-edit" className="text-xs">
                No. HP
              </Label>
              <Input
                id="nohp-edit"
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