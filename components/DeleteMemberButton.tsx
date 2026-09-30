"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string | null;
  memberId: string;
  nama: string;
}

export default function DeleteMemberButton({ userId, memberId, nama }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${nama} secara permanen? Data auth dan profil akan dihapus total.`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const res = await fetch('/api/admin/delete-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, memberId })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat menghapus');
      }
      
      alert(data.message || 'Anggota berhasil dihapus secara permanen!');
      router.refresh();
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Gagal menghapus: ' + errMessage);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded transition disabled:opacity-50"
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </button>
  );
}
