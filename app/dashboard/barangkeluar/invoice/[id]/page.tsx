// app/dashboard/barangkeluar/invoice/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PrintNowButton from "@/components/ui/PrintNowButton";
import AutoPrint from "@/components/ui/AutoPrint";

export const dynamic = "force-dynamic";

type InvoiceItem = {
  idkeluar: number;
  idbarang: number;
  tanggal: string;
  penerima: string;
  qty: number;
  namabarang: string;
};

export default async function BarangKeluarInvoice({
  params,
  searchParams,
}: {
  params?: { id?: string };
  searchParams?: { print?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const idParam = params?.id ?? "";
  const isBadId =
    !idParam || idParam === "undefined" || idParam === "null";
  const idNumber = Number(idParam);
  const idValue = Number.isFinite(idNumber) ? idNumber : idParam;
  if (isBadId) {
    return (
      <div className="p-6">
        ID invoice tidak valid.
        <div className="mt-2 text-xs text-gray-500">ID: {idParam || "(kosong)"}</div>
      </div>
    );
  }

  const { data: barangKeluar, error: keluarError } = await supabase
    .from("barangkeluar")
    .select("idkeluar, idbarang, tanggal, penerima, qty")
    .eq("idkeluar", idValue)
    .maybeSingle();

  if (keluarError || !barangKeluar) {
    return (
      <div className="p-6">
        Data barang keluar tidak ditemukan.
        <div className="mt-2 text-xs text-gray-500">
          ID: {idParam}
          {keluarError?.message ? ` | Error: ${keluarError.message}` : ""}
        </div>
      </div>
    );
  }

  const { data: stock } = await supabase
    .from("stock")
    .select("namabarang")
    .eq("idbarang", barangKeluar.idbarang)
    .single();

  const invoice: InvoiceItem = {
    ...barangKeluar,
    namabarang: stock?.namabarang || "Barang tidak ditemukan",
  };

  const shouldAutoPrint = searchParams?.print === "1";

  return (
    <div className="p-4 sm:p-6">
      {shouldAutoPrint && <AutoPrint />}
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard/barangkeluar" className="text-sm text-blue-600 hover:underline">
          Kembali ke Barang Keluar
        </Link>
        <PrintNowButton />
      </div>
      <div className="no-print mb-4 text-xs text-gray-500">
        Gunakan menu Print browser lalu pilih "Save as PDF" untuk menyimpan invoice.
      </div>

      <div className="border border-gray-300 rounded-lg p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoice Barang Keluar</h1>
            <p className="text-sm text-gray-600">No: INV-BK-{invoice.idkeluar}</p>
          </div>
          <div className="text-left text-sm sm:text-right">
            <div className="font-medium">Tanggal</div>
            <div>
              {new Date(invoice.tanggal).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border border-collapse text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Barang</th>
                <th className="border p-2 text-left">Tanggal</th>
                <th className="border p-2 text-left">Penerima</th>
                <th className="border p-2 text-right">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{invoice.idkeluar}</td>
                <td className="border p-2">{invoice.namabarang}</td>
                <td className="border p-2">
                  {new Date(invoice.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="border p-2">{invoice.penerima}</td>
                <td className="border p-2 text-right">{invoice.qty}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex items-center justify-between text-sm text-gray-600">
          <div>Dibuat oleh: {user.email}</div>
          <div>Tanda tangan: ____________________</div>
        </div>
      </div>
    </div>
  );
}
