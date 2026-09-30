"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Foto = {
  id: string;
  ket: string;
  tanggal: string;
  image_url: string;
};

export default function GalleryGrid({ galeriList, isAuthenticated }: { galeriList: Foto[], isAuthenticated: boolean }) {
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete(foto: Foto) {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    
    setIsDeleting(true);
    const supabase = createClient();
    
    // Hapus dari Storage
    // Ambil nama file dari URL
    const urlParts = foto.image_url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    
    // Sebaiknya pathnya juga spesifik sesuai upload, misal: 'uploads/fileName'
    // Asumsi di script upload: `uploads/${fileName}`
    const { error: storageError } = await supabase.storage.from("gallery").remove([`uploads/${fileName}`]);
    
    // Hapus dari tabel (meskipun gagal hapus storage, DB tetap dihapus agar tidak error reference)
    const { error: dbError } = await supabase.from("gallery").delete().eq("id", foto.id);
    
    setIsDeleting(false);
    
    if (dbError) {
      alert("Gagal menghapus dari database: " + dbError.message);
    } else {
      setSelectedFoto(null);
      router.refresh();
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galeriList.map((foto) => (
          <div 
            key={foto.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col cursor-pointer group"
            onClick={() => setSelectedFoto(foto)}
          >
            <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-400 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.image_url} alt={foto.ket} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <p className="font-semibold text-gray-800 mb-1 line-clamp-1">{foto.ket}</p>
              <p className="text-gray-500 text-sm">{foto.tanggal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal Preview */}
      {selectedFoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 p-4 animate-in fade-in duration-200">
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="w-full flex justify-end mb-4">
              <button onClick={() => setSelectedFoto(null)} className="text-white text-3xl font-bold hover:text-gray-300">&times;</button>
            </div>
            
            <div className="relative w-full max-h-[70vh] flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedFoto.image_url} alt={selectedFoto.ket} className="max-w-full max-h-[70vh] object-contain rounded" />
            </div>
            
            <div className="w-full bg-white rounded-lg mt-6 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-xl text-gray-800">{selectedFoto.ket}</h3>
                <p className="text-gray-500">{selectedFoto.tanggal}</p>
              </div>
              
              {isAuthenticated && (
                <button 
                  onClick={() => handleDelete(selectedFoto)}
                  disabled={isDeleting}
                  className="bg-red-50 text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-100 transition whitespace-nowrap"
                >
                  {isDeleting ? "Menghapus..." : "Hapus Foto"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
