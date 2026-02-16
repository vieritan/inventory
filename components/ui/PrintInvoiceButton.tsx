"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintInvoiceButton({ id }: { id: string }) {
  const idStr = String(id ?? "").trim();
  const isInvalid = !idStr || idStr === "undefined" || idStr === "null";
  const href = `/dashboard/barangkeluar/invoice/${encodeURIComponent(idStr)}?print=1`;

  if (isInvalid) {
    console.error("Print PDF: id invalid", id);
    return (
      <Button variant="outline" size="sm" className="gap-1 h-8" disabled>
        <Printer className="h-3 w-3" />
        Print PDF
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm" className="gap-1 h-8">
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <Printer className="h-3 w-3" />
        Print PDF
      </Link>
    </Button>
  );
}
