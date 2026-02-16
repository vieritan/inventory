// app/stockbarang/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditStockModal from "@/components/ui/EditStockModal";
import DeleteStockButton from "@/components/ui/DeleteStockButton";
import AddStockModal from "@/components/ui/AddStockModal";

export default async function Stockbarang() {
  const supabase = await createClient();

  // Cek session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch data stock
  const { data: stock, error } = await supabase
    .from("stock")
    .select("*")
    .order("idbarang", { ascending: true });

  if (error) {
    console.error("Supabase Error:", error);
    return <div className="p-6">Gagal mengambil data: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Stock Barang</h1>
          <p className="text-sm text-gray-600">
            Login : {session.user.email}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <AddStockModal />
        </div>
      </div>

      {!stock || stock.length === 0 ? (
        <p>Tidak ada data stock.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {stock.map((item) => (
              <div key={item.idbarang} className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    ID #{item.idbarang}
                  </div>
                  <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                    Stock: {item.stock}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Nama</div>
                  <div className="text-base font-semibold leading-snug">{item.namabarang}</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Deskripsi</div>
                  <div className="text-sm text-gray-700">{item.deskripsi}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <EditStockModal item={item} />
                  <DeleteStockButton item={item} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Deskripsi</th>
                <th className="border p-2 text-right">Stock</th>
                <th className="border p-2 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {stock.map((item) => (
                <tr key={item.idbarang} className="hover:bg-gray-50">
                  <td className="border p-2">{item.idbarang}</td>
                  <td className="border p-2">{item.namabarang}</td>
                  <td className="border p-2">{item.deskripsi}</td>
                  <td className="border p-2 text-right">{item.stock}</td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <EditStockModal item={item} />
                      <DeleteStockButton item={item} />
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
