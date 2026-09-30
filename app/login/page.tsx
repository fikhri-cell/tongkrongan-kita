"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(searchParams?.message || "");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Trik Domain Virtual: "budi" → "budi@tongkrongan.local"
    const email = `${username.trim().toLowerCase()}@tongkrongan.local`;

    // Panggil Supabase Auth melalui route handler
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg("Username atau password salah");
      // Reset field password, tapi biarkan username untuk kemudahan koreksi
      setPassword("");
      setIsSubmitting(false);
      return;
    }

    // Login sukses → reset semua field lalu redirect
    setUsername("");
    setPassword("");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Login Member</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk ke Tongkrongan Kita</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: budi"
              autoComplete="username"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg mt-2 hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          {errorMsg && (
            <p className="mt-2 p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg font-medium">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
