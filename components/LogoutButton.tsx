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
    setShowModal(false);
    setIsLoggingOut(false);
    router.push("/login");
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-transparent text-[var(--spotify-subtext)] px-4 py-2 rounded-full hover:text-white hover:bg-[var(--spotify-highlight)] transition font-medium text-sm"
      >
        Logout
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-[var(--spotify-elevated)] border border-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-[var(--spotify-green)]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Konfirmasi Keluar</h3>
              <p className="text-[var(--spotify-subtext)] text-sm">Apakah Anda yakin ingin keluar dari akun ini?</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoggingOut}
                className="px-6 py-2.5 bg-transparent border border-gray-600 text-[var(--spotify-subtext)] rounded-full hover:text-white hover:border-white transition font-bold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2.5 bg-[var(--spotify-green)] text-black rounded-full hover:scale-105 transition-transform font-bold shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Keluar...
                  </>
                ) : "Ya, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
