// app/actions/stock-action.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Action untuk tambah stock baru
export async function addStock(formData: FormData) {
  const supabase = await createClient()

  const namabarang = formData.get("namabarang") as string
  const deskripsi = formData.get("deskripsi") as string
  const stock = parseInt(formData.get("stock") as string)

  // Validasi input
  if (!namabarang || !deskripsi || isNaN(stock)) {
    return { error: "Data tidak lengkap atau tidak valid" }
  }

  const { error } = await supabase
    .from("stock")
    .insert({
      namabarang,
      deskripsi,
      stock,
    })

  if (error) {
    console.error("Error adding:", error)
    return { error: error.message }
  }

  revalidatePath("/stockbarang")
  return { success: true }
}

// Action untuk update stock
export async function updateStock(formData: FormData) {
  const supabase = await createClient()

  const idbarang = formData.get("idbarang") as string
  const namabarang = formData.get("namabarang") as string
  const deskripsi = formData.get("deskripsi") as string
  const stock = parseInt(formData.get("stock") as string)

  // Validasi input
  if (!idbarang || !namabarang || !deskripsi || isNaN(stock)) {
    return { error: "Data tidak lengkap atau tidak valid" }
  }

  const { error } = await supabase
    .from("stock")
    .update({
      namabarang,
      deskripsi,
      stock,
    })
    .eq("idbarang", idbarang)

  if (error) {
    console.error("Error updating:", error)
    return { error: error.message }
  }

  revalidatePath("/stockbarang")
  return { success: true }
}

// Action untuk delete stock
export async function deleteStock(idbarang: string) {
  const supabase = await createClient()

  // Validasi input
  if (!idbarang) {
    return { error: "ID barang tidak valid" }
  }

  const { error } = await supabase
    .from("stock")
    .delete()
    .eq("idbarang", idbarang)

  if (error) {
    console.error("Error deleting:", error)
    return { error: error.message }
  }

  revalidatePath("/stockbarang")
  return { success: true }
}