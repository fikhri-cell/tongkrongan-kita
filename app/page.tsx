import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  // Mengambil 3 kegiatan terbaru
  const { data: kegiatanTerbaru } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // Mengambil 4 foto terbaru
  const { data: fotoTerbaru } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20 px-4 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Tempat Cerita, Berkumpul, dan Berbagi
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-blue-100">
            Selamat datang di rumah kedua kita. Ruang bebas untuk bertukar pikiran, main bareng, dan menciptakan kenangan tak terlupakan bersama teman-teman terbaik.
          </p>
          <Link 
            href="/tentang" 
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            Kenal Lebih Dekat
          </Link>
        </div>
      </section>

      {/* Tentang Singkat */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Tentang Kami</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-6">
          Website komunitas ini dibuat sebagai wadah bagi kita semua untuk tetap terhubung, meskipun sibuk dengan kegiatan masing-masing. Di sini kita membagikan momen seru dan merencanakan agenda nongkrong.
        </p>
        <Link href="/tentang" className="text-blue-600 font-medium hover:underline">Baca cerita lengkapnya &rarr;</Link>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Kegiatan Terbaru</h2>
            <Link href="/kegiatan" className="text-blue-600 font-medium hover:underline hidden sm:block">Lihat Semua Kegiatan &rarr;</Link>
          </div>
          
          {kegiatanTerbaru && kegiatanTerbaru.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {kegiatanTerbaru.map((kegiatan) => (
                <div key={kegiatan.id} className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg mb-4 text-xl font-bold">📅</div>
                  <h3 className="text-xl font-semibold mb-2">{kegiatan.nama}</h3>
                  <p className="text-gray-600 text-sm mb-2 font-medium">{kegiatan.tanggal}</p>
                  <p className="text-gray-500 text-sm line-clamp-3">{kegiatan.deskripsi}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Belum ada data kegiatan.</p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/kegiatan" className="text-blue-600 font-medium hover:underline">Lihat Semua Kegiatan &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Foto Terbaru */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Foto Terbaru</h2>
          <Link href="/galeri" className="text-blue-600 font-medium hover:underline hidden sm:block">Lihat Semua Galeri &rarr;</Link>
        </div>
        
        {fotoTerbaru && fotoTerbaru.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fotoTerbaru.map((foto) => (
              <div key={foto.id} className="bg-gray-200 aspect-square rounded-lg flex flex-col items-center justify-center text-gray-400 overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.image_url} alt={foto.ket} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm p-3 font-medium truncate w-full">{foto.ket}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Belum ada foto terbaru.</p>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/galeri" className="text-blue-600 font-medium hover:underline">Lihat Semua Galeri &rarr;</Link>
        </div>
      </section>
    </>
  );
}
