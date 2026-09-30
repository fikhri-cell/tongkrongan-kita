"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AddActivityForm() {
  const [showForm, setShowForm] = useState(false);
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const supabase = createClient();
    const { error } = await supabase.from('activities').insert({
      nama, tanggal, lokasi, deskripsi
    });

    setIsSubmitting(false);

    if (!error) {
      setShowForm(false);
      setNama(""); setTanggal(""); setLokasi(""); setDeskripsi("");
      router.refresh();
    } else {
      alert(`Gagal menambah: ${error.message}`);
    }
  }

  return (
    <div className="mb-8">
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-sm font-medium"
        >
          + Tambah Kegiatan Baru
        </button>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Form Kegiatan Baru</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                <input required value={nama} onChange={e => setNama(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Mabar Mingguan" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Tanggal</label>
                <input required type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Lokasi / Status</label>
              <input required value={lokasi} onChange={e => setLokasi(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Online via Discord" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Deskripsi Lengkap</label>
              <textarea required value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={3} className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Jangan lupa bawa snack..." />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-800 font-medium">Batal</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400">
                {isSubmitting ? "Menyimpan..." : "Simpan Kegiatan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
