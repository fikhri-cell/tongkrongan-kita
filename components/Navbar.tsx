import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    isAdmin = roleData?.role === "admin";
  }

  async function signOut() {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 mb-4 sm:mb-0">
          Tongkrongan Kita
        </Link>
        <nav className="flex flex-col sm:flex-row items-center gap-6">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-600">
            <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
            <li><Link href="/tentang" className="hover:text-blue-600 transition">Tentang</Link></li>
            <li><Link href="/anggota" className="hover:text-blue-600 transition">Anggota</Link></li>
            <li><Link href="/galeri" className="hover:text-blue-600 transition">Galeri</Link></li>
            <li><Link href="/kegiatan" className="hover:text-blue-600 transition">Kegiatan</Link></li>
            {isAdmin && (
              <li><Link href="/admin" className="text-purple-600 hover:text-purple-800 transition font-bold">Admin</Link></li>
            )}
          </ul>
          
          <div className="text-sm font-medium">
            {user ? (
              <form action={signOut}>
                <button type="submit" className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition">
                  Logout
                </button>
              </form>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
