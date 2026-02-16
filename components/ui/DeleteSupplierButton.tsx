// components/ui/DeleteSupplierButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Supplier = {
  idsupplier: number;
  namasupplier: string;
};

export default function DeleteSupplierButton({ supplier }: { supplier: Supplier }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus supplier "${supplier.namasupplier}"?`)) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("supplier")
      .delete()
      .eq("idsupplier", supplier.idsupplier);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    alert("Supplier berhasil dihapus!");
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
