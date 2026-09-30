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

    // Jika ada file avatar baru yang dipilih
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

    // Update data di tabel members
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
    <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6">
      
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow flex-shrink-0">
          {avatarFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
          ) : memberData.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={memberData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold bg-blue-50 text-blue-300">
              {panggilan.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Ubah Foto Profil</label>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Nama Panggilan / Display Name</label>
        <input 
          value={panggilan}
          onChange={(e) => setPanggilan(e.target.value)}
          required 
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Peran / Deskripsi di Tongkrongan</label>
        <input 
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          required 
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
          placeholder="Misal: Seksi Konsumsi"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 mt-2"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
      </button>

      {message.text && (
        <p className={`p-3 rounded-lg text-sm font-medium text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
