"use client";

import { useState } from "react";
import { editMemberAction } from "@/app/admin/actions";

interface Member {
  id: string;
  user_id: string;
  nama: string;
  panggilan: string;
  deskripsi: string;
  no_hp: string;
  status: string;
}

export default function EditMemberModal({ member, currentRole, currentUsername }: { member: Member, currentRole: string, currentUsername: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    formData.append("id", member.id);
    formData.append("user_id", member.user_id);
    
    const result = await editMemberAction(formData);
    setIsSubmitting(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert("Data berhasil diperbarui!");
      setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-[var(--spotify-green)] hover:text-white text-sm font-medium px-3 py-1 bg-[#333] hover:bg-[#444] rounded-full transition">
        Edit
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--spotify-elevated)] p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Edit Anggota: {member.nama}</h3>
        
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">Nama Lengkap</label>
              <input required name="nama" defaultValue={member.nama} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">Nama Panggilan</label>
              <input required name="panggilan" defaultValue={member.panggilan} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">Username Baru (Kosongkan jika tetap)</label>
              <input name="username" defaultValue={currentUsername} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">Password Baru (Kosongkan jika tetap)</label>
              <input type="password" name="password" className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none" placeholder="Minimal 6 karakter" minLength={6} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">No HP</label>
              <input name="no_hp" defaultValue={member.no_hp || ""} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">Role</label>
              <select name="role" defaultValue={currentRole} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--spotify-subtext)]">Status</label>
              <select name="status" defaultValue={member.status || "Aktif"} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none">
                <option value="Aktif">Aktif</option>
                <option value="Non-Aktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--spotify-subtext)]">Deskripsi</label>
            <textarea name="deskripsi" defaultValue={member.deskripsi} rows={2} className="px-3 py-2 bg-[var(--spotify-highlight)] text-white border border-gray-700 rounded focus:border-[var(--spotify-green)] outline-none" />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent text-[var(--spotify-subtext)] hover:text-white font-medium transition">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[var(--spotify-green)] text-black rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50">
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
