"use client";

import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.print();
  }, []);

  return null;
}
