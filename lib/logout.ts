import { supabase } from "@/lib/supabase";

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    return { error: error.message };
  }

  return { message: "Logout berhasil" };
}
