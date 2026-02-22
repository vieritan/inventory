// app/dashboard/barangkeluar/invoice/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PrintNowButton from "@/components/ui/PrintNowButton";
import AutoPrint from "@/components/ui/AutoPrint";

export const dynamic = "force-dynamic";

type BarangKeluarRow = {
  idkeluar: number;
  idbarang: number;
  tanggal: string;
  penerima: string;
  qty: number;
  namabarang: string;
};

export default async function BarangKeluarInvoiceAll({
  searchParams,
}: {
  searchParams?: Promise<{ print?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: barangKeluar, error: errorKeluar } = await supabase
    .from("barangkeluar")
    .select("idkeluar, idbarang, tanggal, penerima, qty")
    .order("idkeluar", { ascending: false });

  if (errorKeluar) {
    return <div className="p-6">Gagal mengambil data barang keluar.</div>;
  }

  const { data: stockList } = await supabase
    .from("stock")
    .select("idbarang, namabarang");

  const rows: BarangKeluarRow[] = (barangKeluar || []).map((item) => {
    const stock = stockList?.find((s) => s.idbarang === item.idbarang);
    return {
      ...item,
      namabarang: stock?.namabarang || "Barang tidak ditemukan",
    };
  });

  const shouldAutoPrint = resolvedSearchParams?.print === "1";

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
            <h1 className="text-2xl font-bold">Invoice Barang Keluar (Semua)</h1>
            <p className="text-sm text-gray-600">Total: {rows.length} data</p>
          </div>
          <div className="text-left text-sm sm:text-right">
            <div className="font-medium">Tanggal Cetak</div>
            <div>
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="text-sm text-gray-600">Tidak ada data untuk dicetak.</div>
        ) : (
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
                {rows.map((row) => (
                  <tr key={row.idkeluar}>
                    <td className="border p-2">{row.idkeluar}</td>
                    <td className="border p-2">{row.namabarang}</td>
                    <td className="border p-2">
                      {new Date(row.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border p-2">{row.penerima}</td>
                    <td className="border p-2 text-right">{row.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between text-sm text-gray-600">
          <div>Dibuat oleh: {user.email}</div>
          <div>Tanda tangan: ____________________</div>
        </div>
      </div>
    </div>
  );
}
