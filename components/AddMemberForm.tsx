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
    <div className="mb-8">
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
        >
          + Tambah Anggota Baru
        </button>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Form Anggota Baru (Membuat Akun)</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
          </div>
          
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input required name="nama" className="px-3 py-2 border rounded-lg focus:ring-blue-500" placeholder="Budi Santoso" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Nama Panggilan</label>
                <input required name="panggilan" className="px-3 py-2 border rounded-lg focus:ring-blue-500" placeholder="Budi" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Username (Untuk Login)</label>
                <input required name="username" className="px-3 py-2 border rounded-lg focus:ring-blue-500" placeholder="budisantoso" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input required name="password" type="password" className="px-3 py-2 border rounded-lg focus:ring-blue-500" placeholder="minimal 6 karakter" minLength={6} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">No HP / Kontak</label>
                <input name="no_hp" className="px-3 py-2 border rounded-lg focus:ring-blue-500" placeholder="0812345678" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select name="role" className="px-3 py-2 border rounded-lg bg-white focus:ring-blue-500">
                  <option value="member">Anggota (Member)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select name="status" className="px-3 py-2 border rounded-lg bg-white focus:ring-blue-500">
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Deskripsi / Peran</label>
              <textarea required name="deskripsi" rows={2} className="px-3 py-2 border rounded-lg focus:ring-blue-500" placeholder="Si paling sering ngaret..." />
            </div>

            {errorMsg && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 text-sm font-medium bg-green-50 p-2 rounded">{successMsg}</p>}

            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Batal</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-indigo-400">
                {isSubmitting ? "Memproses..." : "Simpan Anggota"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
