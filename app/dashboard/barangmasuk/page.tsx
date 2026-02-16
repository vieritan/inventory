// app/dashboard/barangmasuk/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditBarangMasukModal from "@/components/ui/EditBarangMasukModal";
import DeleteBarangMasukButton from "@/components/ui/DeleteBarangMasukButton";
import AddBarangMasukModal from "@/components/ui/AddBarangMasukModal";

// Definisikan types
type BarangMasukItem = {
  idmasuk: number;
  idbarang: number;
  tanggal: string;
  qty: number;
  keterangan: string;
  stock?: {
    namabarang: string;
  } | null;
};

export default async function BarangMasuk() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // JOIN dengan format: namaRelasi:foreignKey(kolom)
  const { data, error } = await supabase
    .from("barangmasuk")
    .select(`
      idmasuk,
      idbarang,
      tanggal,
      qty,
      keterangan,
      stock:idbarang (
        namabarang
      )
    `)
    .order("idmasuk", { ascending: false });

  // Cast ke type yang sudah didefinisikan
  const barangMasuk = data as BarangMasukItem[] | null;

  // Fetch list barang untuk dropdown
  const { data: barangList } = await supabase
    .from("stock")
    .select("idbarang, namabarang")
    .order("namabarang", { ascending: true });

  // Debug: Log untuk cek struktur data
  console.log("Barang Masuk Data:", JSON.stringify(barangMasuk, null, 2));

  if (error) {
    console.error("Error:", error);
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Barang Masuk</h1>
          <p className="text-sm text-gray-600">Login: {session.user.email}</p>
        </div>
        <div className="w-full sm:w-auto">
          <AddBarangMasukModal
            barangList={(barangList || []).map((b) => ({
              idbarang: b.idbarang,
              nama: b.namabarang,
            }))}
          />
        </div>
      </div>

      {!barangMasuk || barangMasuk.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          Tidak ada data barang masuk
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {barangMasuk.map((item) => (
              <div key={item.idmasuk} className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    ID #{item.idmasuk}
                  </div>
                  <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                    Qty: {item.qty}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Nama Barang</div>
                  <div className="text-base font-semibold leading-snug">
                    {item.stock?.namabarang || "-"}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Tanggal</div>
                  <div className="text-sm text-gray-700">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Keterangan</div>
                  <div className="text-sm text-gray-700">{item.keterangan}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <EditBarangMasukModal
                    item={{
                      idmasuk: item.idmasuk,
                      idbarang: item.idbarang,
                      tanggal: item.tanggal,
                      qty: item.qty,
                      keterangan: item.keterangan,
                    }}
                    barangList={(barangList || []).map((b) => ({
                      idbarang: b.idbarang,
                      nama: b.namabarang,
                    }))}
                  />
                  <DeleteBarangMasukButton
                    item={{
                      idmasuk: item.idmasuk,
                      idbarang: item.idbarang,
                      qty: item.qty,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Nama Barang</th>
                  <th className="border p-2">Tanggal</th>
                  <th className="border p-2 text-right">Qty</th>
                  <th className="border p-2">Keterangan</th>
                  <th className="border p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barangMasuk.map((item) => (
                  <tr key={item.idmasuk} className="hover:bg-gray-50">
                    <td className="border p-2">{item.idmasuk}</td>
                    <td className="border p-2 font-medium">
                      {item.stock?.namabarang || "-"}
                    </td>
                    <td className="border p-2">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="border p-2 text-right">{item.qty}</td>
                    <td className="border p-2">{item.keterangan}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <EditBarangMasukModal
                          item={{
                            idmasuk: item.idmasuk,
                            idbarang: item.idbarang,
                            tanggal: item.tanggal,
                            qty: item.qty,
                            keterangan: item.keterangan,
                          }}
                          barangList={(barangList || []).map((b) => ({
                            idbarang: b.idbarang,
                            nama: b.namabarang,
                          }))}
                        />
                        <DeleteBarangMasukButton
                          item={{
                            idmasuk: item.idmasuk,
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
