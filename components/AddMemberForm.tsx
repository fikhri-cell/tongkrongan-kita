"use client";

import { useState } from "react";
import { addMemberAction } from "@/app/admin/actions";

export default function AddMemberForm() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await addMemberAction(formData);

    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg("Anggota berhasil ditambahkan beserta Akun Login!");
      setTimeout(() => {
        setShowForm(false);
        setSuccessMsg("");
      }, 2000);
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="mb-8 w-full max-w-3xl mx-auto">
      {!showForm ? (
        <div className="flex justify-center">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[var(--spotify-green)] text-black px-6 py-3 rounded-full hover:scale-105 transition-transform font-bold tracking-wide shadow-lg"
          >
            + Tambah Anggota Baru
          </button>
        </div>
      ) : (
        <div className="bg-[var(--spotify-elevated)] p-6 md:p-8 rounded-xl shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Form Anggota Baru (Membuat Akun)</h3>
            <button onClick={() => setShowForm(false)} className="text-[var(--spotify-subtext)] hover:text-white transition font-bold text-3xl leading-none">&times;</button>
          </div>
          
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Nama Lengkap</label>
                <input required name="nama" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="Budi Santoso" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Nama Panggilan</label>
                <input required name="panggilan" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="Budi" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Username (Untuk Login)</label>
                <input required name="username" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="budisantoso" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Password</label>
                <input required name="password" type="password" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="minimal 6 karakter" minLength={6} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">No HP / Kontak</label>
                <input name="no_hp" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="0812345678" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Role</label>
                <select name="role" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition">
                  <option value="member">Anggota (Member)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Status</label>
                <select name="status" className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition">
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Deskripsi / Peran</label>
              <textarea required name="deskripsi" rows={2} className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition resize-y" placeholder="Si paling sering ngaret..." />
            </div>

            {errorMsg && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm font-bold">{errorMsg}</div>}
            {successMsg && <div className="bg-[var(--spotify-green)]/20 border border-[var(--spotify-green)] text-[var(--spotify-green)] px-4 py-3 rounded-lg text-sm font-bold">{successMsg}</div>}

            <div className="flex justify-end gap-4 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-transparent text-[var(--spotify-subtext)] hover:text-white font-bold transition">Batal</button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[var(--spotify-green)] text-black rounded-full hover:scale-105 transition-transform font-bold disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
                {isSubmitting ? "Memproses..." : "Simpan Anggota"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
