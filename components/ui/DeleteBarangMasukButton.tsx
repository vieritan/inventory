// components/ui/DeleteBarangMasukButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type BarangMasuk = {
  idmasuk: number;   // ✅ Ubah dari id_masuk
  idbarang: number;  // ✅ Ubah dari id_barang
  qty: number;
};

export default function DeleteBarangMasukButton({ item }: { item: BarangMasuk }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data barang masuk ini?")) {
      return;
    }

    setLoading(true);

    // Kurangi stock barang
    const { data: barang } = await supabase
      .from("stock")
      .select("stock")
      .eq("idbarang", item.idbarang)  // ✅ Ubah dari id_barang
      .single();

    if (barang) {
      await supabase
        .from("stock")
        .update({ stock: Math.max(0, barang.stock - item.qty) })
        .eq("idbarang", item.idbarang);  // ✅ Ubah dari id_barang
    }

    // Hapus data barang masuk
    const { error } = await supabase
      .from("barangmasuk")
      .delete()
      .eq("idmasuk", item.idmasuk);  // ✅ Ubah dari id_masuk

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    alert("Barang masuk berhasil dihapus!");
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "Menghapus..." : "Delete"}
    </button>
  );
}