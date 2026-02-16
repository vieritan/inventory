// app/dashboard/barangkeluar/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditBarangKeluarModal from "@/components/ui/EditBarangKeluarModal";
import DeleteBarangKeluarButton from "@/components/ui/DeleteBarangKeluarButton";
import AddBarangKeluarModal from "@/components/ui/AddBarangKeluarModal";
import PrintInvoiceButton from "@/components/ui/PrintInvoiceButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

type BarangKeluarItem = {
  idkeluar: number;
  idbarang: number;
  tanggal: string;
  penerima: string;
  qty: number;
};

export default async function BarangKeluar() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Fetch data barang keluar
  const { data: barangKeluar, error: errorKeluar } = await supabase
    .from("barangkeluar")
    .select("idkeluar, idbarang, tanggal, penerima, qty")
    .order("idkeluar", { ascending: false });

  // Fetch semua data stock
  const { data: stockList } = await supabase
    .from("stock")
    .select("idbarang, namabarang");

  // Fetch list barang untuk dropdown
  const { data: barangList } = await supabase
    .from("stock")
    .select("idbarang, namabarang")
    .order("namabarang", { ascending: true });

  // Debug: Log data
  console.log("Barang Keluar Data:", barangKeluar);
  console.log("Stock List:", stockList);

  // Handle error
  if (errorKeluar) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-800 mb-3">
            ❌ Error: Tabel barangkeluar tidak ditemukan
          </h2>
          <p className="text-sm text-red-600 mb-4">
            {errorKeluar.message || "Tabel 'barangkeluar' belum dibuat di Supabase"}
          </p>
        </div>
      </div>
    );
  }

  // Filter data yang valid (semua field harus ada)
  const validBarangKeluar = (barangKeluar || []).filter((item) => {
    const isValid = 
      item.idkeluar !== undefined &&
      item.idbarang !== undefined &&
      item.tanggal !== undefined &&
      item.penerima !== undefined &&
      item.qty !== undefined;
    
    if (!isValid) {
      console.warn("⚠️ Invalid item:", item);
    }
    
    return isValid;
  });

  // Manual JOIN
  const barangKeluarWithNames = validBarangKeluar.map((item) => {
    const stock = stockList?.find((s) => s.idbarang === item.idbarang);
    return {
      ...item,
      namabarang: stock?.namabarang || "⚠️ Barang tidak ditemukan",
    };
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Barang Keluar</h1>
          <p className="text-sm text-gray-600">Login: {user.email}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <Link
            href="/dashboard/barangkeluar/invoice"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 sm:w-auto"
          >
            Print Semua
          </Link>
          <AddBarangKeluarModal
            barangList={(barangList || []).map((b) => ({
              idbarang: b.idbarang,
              nama: b.namabarang,
            }))}
          />
        </div>
      </div>

      {!barangKeluarWithNames || barangKeluarWithNames.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-2">📤 Tidak ada data barang keluar</p>
          <p className="text-sm text-gray-500">
            Klik tombol "Tambah Barang Keluar" untuk menambah data baru
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {barangKeluarWithNames.map((item) => (
              <div key={item.idkeluar} className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    ID #{item.idkeluar}
                  </div>
                  <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                    Qty: {item.qty}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Nama Barang</div>
                  <div className="text-base font-semibold leading-snug">{item.namabarang}</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Tanggal</div>
                  <div className="text-sm text-gray-700">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Penerima</div>
                  <div className="text-sm text-gray-700">{item.penerima}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <PrintInvoiceButton id={String(item.idkeluar ?? "")} />
                  <EditBarangKeluarModal
                    item={{
                      idkeluar: item.idkeluar,
                      idbarang: item.idbarang,
                      tanggal: item.tanggal,
                      penerima: item.penerima,
                      qty: item.qty,
                    }}
                    barangList={(barangList || []).map((b) => ({
                      idbarang: b.idbarang,
                      nama: b.namabarang,
                    }))}
                  />
                  <DeleteBarangKeluarButton
                    item={{
                      idkeluar: item.idkeluar,
                      idbarang: item.idbarang,
                      qty: item.qty,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="min-w-[720px] w-full border border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Nama Barang</th>
                  <th className="border p-2 text-left">Tanggal</th>
                  <th className="border p-2 text-left">Penerima</th>
                  <th className="border p-2 text-right">Qty</th>
                  <th className="border p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barangKeluarWithNames.map((item) => (
                  <tr key={item.idkeluar} className="hover:bg-gray-50">
                    <td className="border p-2">{item.idkeluar}</td>
                    <td className="border p-2 font-medium">{item.namabarang}</td>
                    <td className="border p-2">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border p-2">{item.penerima}</td>
                    <td className="border p-2 text-right font-medium">{item.qty}</td>
                    <td className="border p-2 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <PrintInvoiceButton id={String(item.idkeluar ?? "")} />
                        <EditBarangKeluarModal
                          item={{
                            idkeluar: item.idkeluar,
                            idbarang: item.idbarang,
                            tanggal: item.tanggal,
                            penerima: item.penerima,
                            qty: item.qty,
                          }}
                          barangList={(barangList || []).map((b) => ({
                            idbarang: b.idbarang,
                            nama: b.namabarang,
                          }))}
                        />
                        <DeleteBarangKeluarButton
                          item={{
                            idkeluar: item.idkeluar,
                            idbarang: item.idbarang,
                            qty: item.qty,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
