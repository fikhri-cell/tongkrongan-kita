import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galeriList.map((foto) => (
            <div key={foto.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-400 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.image_url} alt={foto.ket} className="object-cover w-full h-full" />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <p className="font-semibold text-gray-800 mb-1">{foto.ket}</p>
                <p className="text-gray-500 text-sm">{foto.tanggal}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Belum ada foto di galeri.</div>
      )}
    </div>
  );
}
