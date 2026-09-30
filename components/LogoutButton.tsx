"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // Tutup modal terlebih dahulu sebelum redirect
    setShowModal(false);
    setIsLoggingOut(false);
    router.push("/login");
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
      >
        Logout
      </button>

      {showModal && (
        // Backdrop dengan efek Glassmorphism Blur
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          onClick={(e) => {
            // Tutup jika klik di luar modal
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
              <p className="text-gray-500 text-sm">Apakah Anda yakin ingin keluar dari akun ini?</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoggingOut}
                className="px-6 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm disabled:bg-red-400 flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Keluar...
                  </>
                ) : "Ya, Logout Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
