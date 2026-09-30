"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ProfileForm({ memberData, userId }: { memberData: { panggilan: string; deskripsi: string; avatar_url: string | null }; userId: string }) {
  const [panggilan, setPanggilan] = useState(memberData.panggilan || "");
  const [deskripsi, setDeskripsi] = useState(memberData.deskripsi || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const supabase = createClient();
    let updatedAvatarUrl = memberData.avatar_url;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setMessage({ text: `Gagal upload foto: ${uploadError.message}`, type: "error" });
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      updatedAvatarUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('members')
      .update({
        panggilan,
        deskripsi,
        avatar_url: updatedAvatarUrl
      })
      .eq('user_id', userId);

    setIsSubmitting(false);

    if (updateError) {
      setMessage({ text: `Gagal update profil: ${updateError.message}`, type: "error" });
    } else {
      setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleUpdate} className="bg-[var(--spotify-elevated)] p-8 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-800">
        <div className="w-32 h-32 rounded-full bg-black overflow-hidden shadow-2xl flex-shrink-0 relative group">
          {avatarFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : memberData.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={memberData.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--spotify-green)] text-5xl font-extrabold bg-[#333]">
              {panggilan.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-[var(--spotify-subtext)] uppercase tracking-wider text-sm">Ubah Foto Profil</label>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[var(--spotify-highlight)] file:text-[var(--spotify-green)] hover:file:bg-[#333] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--spotify-green)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[var(--spotify-subtext)] uppercase tracking-wider text-sm">Nama Panggilan / Display Name</label>
        <input 
          value={panggilan}
          onChange={(e) => setPanggilan(e.target.value)}
          required 
          className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[var(--spotify-subtext)] uppercase tracking-wider text-sm">Peran / Deskripsi di Tongkrongan</label>
        <input 
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          required 
          className="px-4 py-3 bg-[var(--spotify-highlight)] text-white border-none rounded-lg focus:ring-2 focus:ring-[var(--spotify-green)] outline-none transition" 
          placeholder="Misal: Seksi Konsumsi"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-[var(--spotify-green)] text-black font-bold px-4 py-3.5 rounded-full hover:scale-105 transition-transform disabled:opacity-50 mt-4 uppercase tracking-wider text-sm shadow-lg flex justify-center items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            Menyimpan...
          </>
        ) : "Simpan Perubahan"}
      </button>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-bold text-center ${message.type === 'success' ? 'bg-[var(--spotify-green)]/20 text-[var(--spotify-green)] border border-[var(--spotify-green)]' : 'bg-red-900/50 text-red-200 border border-red-500'}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
