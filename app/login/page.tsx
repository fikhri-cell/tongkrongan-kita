"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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

    const email = `${username.trim().toLowerCase()}@tongkrongan.local`;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg("Username atau password salah");
      setPassword("");
      setIsSubmitting(false);
      return;
    }

    setUsername("");
    setPassword("");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="bg-[var(--spotify-elevated)] p-8 rounded-xl shadow-2xl border border-gray-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-[var(--spotify-green)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Login Member</h1>
          <p className="text-[var(--spotify-subtext)] text-sm mt-2">Masuk ke Tongkrongan Kita</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--spotify-subtext)] uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="px-4 py-3 bg-[var(--spotify-highlight)] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--spotify-green)] text-white transition"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: budi"
              autoComplete="username"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--spotify-subtext)] uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="px-4 py-3 bg-[var(--spotify-highlight)] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--spotify-green)] text-white transition"
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
            className="bg-[var(--spotify-green)] text-black font-bold px-4 py-3.5 rounded-full mt-4 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 uppercase tracking-wide text-sm shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          {errorMsg && (
            <div className="mt-2 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm text-center rounded-lg font-bold">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
