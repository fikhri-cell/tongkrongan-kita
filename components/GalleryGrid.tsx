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
    
    const urlParts = foto.image_url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    
    const { error: storageError } = await supabase.storage.from("gallery").remove([`uploads/${fileName}`]);
    if (storageError) console.error(storageError);
    
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galeriList.map((foto) => (
          <div 
            key={foto.id} 
            className="bg-[var(--spotify-elevated)] rounded-xl shadow-lg border border-gray-800/50 overflow-hidden hover:bg-[var(--spotify-highlight)] transition-colors flex flex-col cursor-pointer group"
            onClick={() => setSelectedFoto(foto)}
          >
            <div className="bg-black aspect-square flex items-center justify-center overflow-hidden relative p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.image_url} alt={foto.ket} className="object-cover w-full h-full rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute right-4 bottom-4 w-12 h-12 bg-[var(--spotify-green)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
              </div>
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <p className="font-bold text-white mb-1 line-clamp-1">{foto.ket}</p>
              <p className="text-[var(--spotify-subtext)] text-sm">{foto.tanggal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal Preview */}
      {selectedFoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setSelectedFoto(null); }}>
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="w-full flex justify-end mb-4">
              <button onClick={() => setSelectedFoto(null)} className="text-[var(--spotify-subtext)] hover:text-white transition font-bold text-3xl">&times;</button>
            </div>
            
            <div className="relative w-full max-h-[60vh] flex justify-center bg-black rounded-xl p-2 border border-gray-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedFoto.image_url} alt={selectedFoto.ket} className="max-w-full max-h-[60vh] object-contain rounded-lg" />
            </div>
            
            <div className="w-full bg-[var(--spotify-elevated)] border border-gray-800 rounded-xl mt-6 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <h3 className="font-bold text-2xl text-white mb-1">{selectedFoto.ket}</h3>
                <p className="text-[var(--spotify-subtext)]">{selectedFoto.tanggal}</p>
              </div>
              
              {isAuthenticated && (
                <button 
                  onClick={() => handleDelete(selectedFoto)}
                  disabled={isDeleting}
                  className="bg-transparent border border-red-500/50 text-red-500 font-bold px-6 py-2.5 rounded-full hover:bg-red-500 hover:text-black transition uppercase text-sm tracking-wider"
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
