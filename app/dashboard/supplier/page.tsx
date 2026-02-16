// app/dashboard/supplier/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditSupplierModal from "@/components/ui/EditSupplierModal";
import DeleteSupplierButton from "@/components/ui/DeleteSupplierButton";
import AddSupplierModal from "@/components/ui/AddSupplierModal";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type Supplier = {
  idsupplier: number;
  namasupplier: string;
  nohp: string;
  keterangan: string;
};

export default async function SupplierPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch data supplier
  const { data: suppliers, error } = await supabase
    .from("supplier")
    .select("idsupplier, namasupplier, nohp, keterangan")
    .order("idsupplier", { ascending: true });

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-800 mb-3">
            ❌ Error: Tabel supplier tidak ditemukan
          </h2>
          <p className="text-sm text-red-600 mb-4">
            {error.message || "Tabel 'supplier' belum dibuat di Supabase"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Data Supplier</h1>
          <p className="text-sm text-gray-600">Login: {session.user.email}</p>
        </div>
        <div className="w-full sm:w-auto">
          <AddSupplierModal />
        </div>
      </div>

      {!suppliers || suppliers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-2">📋 Tidak ada data supplier</p>
          <p className="text-sm text-gray-500">
            Klik tombol "Tambah Supplier" untuk menambah data baru
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {suppliers.map((supplier) => (
              <div key={supplier.idsupplier} className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    ID #{supplier.idsupplier}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Nama</div>
                  <div className="text-base font-semibold leading-snug">{supplier.namasupplier}</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">No. HP</div>
                  <a
                    href={`https://wa.me/${supplier.nohp.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {supplier.nohp}
                  </a>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Keterangan</div>
                  <div className="text-sm text-gray-700">{supplier.keterangan}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <EditSupplierModal supplier={supplier} />
                  <DeleteSupplierButton supplier={supplier} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Nama Supplier</th>
                  <th className="border p-2 text-left">No. HP</th>
                  <th className="border p-2 text-left">Keterangan</th>
                  <th className="border p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.idsupplier} className="hover:bg-gray-50">
                    <td className="border p-2">{supplier.idsupplier}</td>
                    <td className="border p-2 font-medium">{supplier.namasupplier}</td>
                    <td className="border p-2">
                      <a
                        href={`https://wa.me/${supplier.nohp.replace(/^0/, '62')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:underline"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {supplier.nohp}
                      </a>
                    </td>
                    <td className="border p-2 text-sm">{supplier.keterangan}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <EditSupplierModal supplier={supplier} />
                        <DeleteSupplierButton supplier={supplier} />
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
