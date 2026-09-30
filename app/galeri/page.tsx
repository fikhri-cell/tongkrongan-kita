import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata = {
  title: "Galeri - Tongkrongan Kita",
};

export default async function Galeri() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: galeriList, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Galeri Kenangan</h1>
          <p className="text-[var(--spotify-subtext)]">
            Kumpulan momen berharga yang sempat terabadikan kamera.
          </p>
        </div>
        {user && (
          <Link href="/galeri/upload" className="mt-4 sm:mt-0 bg-[var(--spotify-green)] text-black font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform">
            + Upload Foto
          </Link>
        )}
      </div>

      {error ? (
        <div className="text-center text-red-500">Gagal mengambil data galeri.</div>
      ) : galeriList && galeriList.length > 0 ? (
        <GalleryGrid galeriList={galeriList} isAuthenticated={!!user} />
      ) : (
        <div className="text-center text-[var(--spotify-subtext)] bg-[var(--spotify-elevated)] p-12 rounded-xl">Belum ada foto di galeri.</div>
      )}
    </div>
  );
}
