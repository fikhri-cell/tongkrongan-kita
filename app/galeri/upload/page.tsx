"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UploadGaleri() {
  const [file, setFile] = useState<File | null>(null);
  const [ket, setKet] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Harap pilih gambar terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    const supabase = createClient();
    
    // Pastikan user login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg("Anda harus login untuk upload.");
      setIsUploading(false);
      return;
    }

    // 1. Buat nama file unik
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 2. Upload file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      setErrorMsg(`Gagal upload: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    // 3. Dapatkan Public URL
    const { data: publicUrlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
      
    const publicUrl = publicUrlData.publicUrl;

    // 4. Simpan ke tabel gallery
    const { error: dbError } = await supabase.from('gallery').insert({
      ket,
      tanggal,
      image_url: publicUrl,
      created_by: user.id
    });

    if (dbError) {
      setErrorMsg(`Gagal menyimpan data: ${dbError.message}`);
      setIsUploading(false);
      return;
    }

    // 5. Sukses, redirect ke galeri
    router.refresh();
    router.push("/galeri");
  }

  return (
    <div className="py-16 px-4 max-w-2xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Upload Foto Baru</h1>
      
      <form onSubmit={handleUpload} className="bg-[var(--spotify-elevated)] p-8 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-[var(--spotify-subtext)] uppercase tracking-wider text-sm">Pilih Foto (JPG, PNG, WebP)</label>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required 
            className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[var(--spotify-green)] file:text-black hover:file:scale-105 file:transition-transform cursor-pointer outline-none focus:ring-2 focus:ring-[var(--spotify-green)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-[var(--spotify-subtext)] uppercase tracking-wider text-sm">Keterangan / Judul Foto</label>
          <input 
            value={ket}
            onChange={(e) => setKet(e.target.value)}
            required 
            className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" 
            placeholder="Nongkrong di Cafe..." 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-bold text-[var(--spotify-subtext)] uppercase tracking-wider text-sm">Tanggal</label>
          <input 
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required 
            className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition [color-scheme:dark]" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="bg-[var(--spotify-green)] text-black font-bold px-4 py-3.5 rounded-full mt-4 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2 uppercase tracking-wide text-sm"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Mengunggah...
            </>
          ) : (
            "Simpan ke Galeri"
          )}
        </button>

        {errorMsg && (
          <div className="mt-2 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}
      </form>
    </div>
  );
}
