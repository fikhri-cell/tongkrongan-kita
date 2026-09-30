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

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return { error: authError.message };
  const userId = authData.user.id;

  const { error: membersError } = await adminClient.from("members").insert({
    nama, panggilan, deskripsi, no_hp, status, user_id: userId
  });
  if (membersError) return { error: membersError.message };

  const { error: roleError } = await adminClient.from("user_roles").insert({
    user_id: userId, role: role
  });
  if (roleError) return { error: roleError.message };

  revalidatePath("/admin");
  revalidatePath("/anggota");
  return { success: true };
}

export async function editMemberAction(formData: FormData) {
  const adminClient = createAdminClient();
  
  const id = formData.get("id") as string; // member table id
  const user_id = formData.get("user_id") as string; // auth.users id
  const nama = formData.get("nama") as string;
  const panggilan = formData.get("panggilan") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const role = formData.get("role") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const no_hp = formData.get("no_hp") as string;
  const status = formData.get("status") as string;

  // Update Auth if needed (username/password)
  if (user_id && (username || password)) {
    const updateData: { email?: string; password?: string } = {};
    if (username) updateData.email = `${username.trim().toLowerCase()}@tongkrongan.local`;
    if (password) updateData.password = password;

    const { error: authError } = await adminClient.auth.admin.updateUserById(user_id, updateData);
    if (authError) return { error: `Gagal update auth: ${authError.message}` };
  }

  // Update Members Table
  const { error: memberError } = await adminClient.from('members').update({
    nama, panggilan, deskripsi, no_hp, status
  }).eq('id', id);

  if (memberError) return { error: `Gagal update member: ${memberError.message}` };

  // Update Role
  if (user_id && role) {
    const { error: roleError } = await adminClient.from('user_roles').update({ role }).eq('user_id', user_id);
    if (roleError) return { error: `Gagal update role: ${roleError.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/anggota");
  return { success: true };
}
