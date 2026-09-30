"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import LogoutButton from "./LogoutButton";
import type { User } from "@supabase/supabase-js";

type MemberData = {
  panggilan: string | null;
  avatar_url: string | null;
} | null;

export default function NavbarAuthSection() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberData, setMemberData] = useState<MemberData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Fungsi untuk mengambil semua data profil user
    async function fetchUserData(currentUser: User | null) {
      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        setMemberData(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Cek role (admin/member)
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      setIsAdmin(roleData?.role === "admin");

      // Ambil data profil
      const { data: profile } = await supabase
        .from("members")
        .select("panggilan, avatar_url")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      setMemberData(profile);
      setLoading(false);
    }

    // Ambil state awal
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      fetchUserData(currentUser);
    });

    // Listener real-time untuk perubahan state Auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUserData(session?.user ?? null);
      }
    );

    // Bersihkan listener saat komponen di-unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Tampilkan skeleton saat sedang loading untuk menghindari flicker
  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* Menu Admin — hanya tampil jika user adalah Admin */}
      {isAdmin && (
        <Link
          href="/admin"
          className="text-purple-600 hover:text-purple-800 transition font-bold text-sm"
        >
          Admin
        </Link>
      )}

      <div className="text-sm font-medium flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition"
            >
              {memberData?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={memberData.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold text-sm">
                  {memberData?.panggilan?.charAt(0)?.toUpperCase() ||
                    user.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
              )}
              <span className="hidden sm:inline-block text-gray-700">
                {memberData?.panggilan || "Profile"}
              </span>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Login
          </Link>
        )}
      </div>
    </>
  );
}
