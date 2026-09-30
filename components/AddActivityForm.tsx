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
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const supabase = createClient();
    
    // Pastikan user login
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setErrorMsg("Sesi Anda telah habis. Silakan login kembali.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('activities').insert({
      nama, tanggal, lokasi, deskripsi
    });

    setIsSubmitting(false);

    if (!error) {
      setShowForm(false);
      setNama(""); setTanggal(""); setLokasi(""); setDeskripsi("");
      router.refresh();
    } else {
      setErrorMsg(`Gagal menambah: ${error.message}`);
    }
  }

  return (
    <div className="mb-8 w-full max-w-3xl mx-auto">
      {!showForm ? (
        <div className="flex justify-center">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[var(--spotify-green)] text-black px-6 py-3 rounded-full hover:scale-105 transition-transform font-bold tracking-wide"
          >
            + Tambah Kegiatan Baru
          </button>
        </div>
      ) : (
        <div className="bg-[var(--spotify-elevated)] p-6 md:p-8 rounded-xl shadow-xl border border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Form Kegiatan Baru</h3>
            <button onClick={() => setShowForm(false)} className="text-[var(--spotify-subtext)] hover:text-white transition font-bold text-3xl leading-none">&times;</button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Judul Kegiatan</label>
                <input required value={nama} onChange={e => setNama(e.target.value)} className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="Mabar Mingguan" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Tanggal</label>
                <input required type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition [color-scheme:dark]" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Lokasi / Status</label>
              <input required value={lokasi} onChange={e => setLokasi(e.target.value)} className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" placeholder="Online via Discord" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[var(--spotify-subtext)] uppercase tracking-wider">Deskripsi Lengkap</label>
              <textarea required value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={3} className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition resize-y" placeholder="Jangan lupa bawa snack..." />
            </div>
            
            {errorMsg && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-transparent text-[var(--spotify-subtext)] hover:text-white font-bold transition">Batal</button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[var(--spotify-green)] text-black rounded-full hover:scale-105 transition-transform font-bold disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
                {isSubmitting ? "Menyimpan..." : "Simpan Kegiatan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
