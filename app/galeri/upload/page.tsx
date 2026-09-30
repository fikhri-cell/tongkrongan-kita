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
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Upload Foto Baru</h1>
      
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Pilih Foto (JPG, PNG, WebP)</label>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required 
            className="px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Keterangan / Judul Foto</label>
          <input 
            value={ket}
            onChange={(e) => setKet(e.target.value)}
            required 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
            placeholder="Nongkrong di Cafe..." 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Tanggal</label>
          <input 
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="bg-blue-600 text-white font-medium px-4 py-3 rounded-lg mt-4 hover:bg-blue-700 transition disabled:bg-blue-400 shadow-sm flex justify-center items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Mengunggah...
            </>
          ) : (
            "Simpan ke Galeri"
          )}
        </button>

        {errorMsg && (
          <p className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}
