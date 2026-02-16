// components/ui/DeleteBarangKeluarButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type BarangKeluar = {
  idkeluar: number;
  idbarang: number;
  qty: number;
};

export default function DeleteBarangKeluarButton({ item }: { item: BarangKeluar }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data barang keluar ini?")) {
      return;
    }

    setLoading(true);

    // Kembalikan stock barang (karena barang keluar dibatalkan)
    const { data: barang } = await supabase
      .from("stock")
      .select("stock")
      .eq("idbarang", item.idbarang)
      .single();

    if (barang) {
      await supabase
        .from("stock")
        .update({ stock: barang.stock + item.qty })
        .eq("idbarang", item.idbarang);
    }

    // Hapus data barang keluar
    const { error } = await supabase
      .from("barangkeluar")
      .delete()
      .eq("idkeluar", item.idkeluar);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    alert("Barang keluar berhasil dihapus dan stock dikembalikan!");
    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="destructive"
      size="sm"
      className="gap-1 h-8"
    >
      <Trash2 className="h-3 w-3" />
      {loading ? "Menghapus..." : "Delete"}
    </Button>
  );
}