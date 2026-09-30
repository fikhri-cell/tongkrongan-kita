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
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Galeri Kenangan</h1>
          <p className="text-gray-600">
            Kumpulan momen berharga yang sempat terabadikan kamera.
          </p>
        </div>
        {user && (
          <Link href="/galeri/upload" className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            + Upload Foto
          </Link>
        )}
      </div>

      {error ? (
        <div className="text-center text-red-500">Gagal mengambil data galeri.</div>
      ) : galeriList && galeriList.length > 0 ? (
        <GalleryGrid galeriList={galeriList} isAuthenticated={!!user} />
      ) : (
        <div className="text-center text-gray-500 bg-white p-12 border border-dashed rounded-xl">Belum ada foto di galeri.</div>
      )}
    </div>
  );
}
