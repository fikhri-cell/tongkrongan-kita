import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Login - Tongkrongan Kita",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;

  async function signIn(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    // Trik Domain Virtual: Menggabungkan username dengan domain virtual
    // Contoh: "budi" menjadi "budi@tongkrongan.local"
    const email = `${username.trim().toLowerCase()}@tongkrongan.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=" + encodeURIComponent("Username atau password salah"));
    }

    return redirect("/");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login Member</h1>
        <form className="flex flex-col gap-4" action={signIn}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              placeholder="Contoh: budi"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
            Masuk
          </button>
          
          {message && (
            <p className="mt-4 p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
