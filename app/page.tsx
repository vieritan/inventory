import Image from "next/image";
import Stockbarang from "@/components/ui/stockbarang";
import { redirect } from "next/navigation";

export default async function Home() {
  return redirect("/dashboard");
}
