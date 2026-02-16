"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintNowButton() {
  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  return (
    <Button onClick={handlePrint} variant="outline" className="gap-2">
      <Printer className="h-4 w-4" />
      Print Invoice
    </Button>
  );
}
