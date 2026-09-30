"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addMemberAction(formData: FormData) {
  const adminClient = createAdminClient();
  
  const nama = formData.get("nama") as string;
  const panggilan = formData.get("panggilan") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const role = formData.get("role") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const no_hp = formData.get("no_hp") as string;
  const status = formData.get("status") as string;

  const email = `${username.trim().toLowerCase()}@tongkrongan.local`;

  // 1. Create User di Supabase Auth menggunakan Admin API
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData.user.id;

  // 2. Masukkan ke tabel members dengan relasi user_id
  const { error: membersError } = await adminClient.from("members").insert({
    nama,
    panggilan,
    deskripsi,
    no_hp,
    status,
    user_id: userId
  });

  if (membersError) {
    return { error: membersError.message };
  }

  // 3. Masukkan role ke tabel user_roles
  const { error: roleError } = await adminClient.from("user_roles").insert({
    user_id: userId,
    role: role
  });

  if (roleError) {
    return { error: roleError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/anggota");
  
  return { success: true };
}
