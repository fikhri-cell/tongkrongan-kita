import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  const { data: kegiatanTerbaru } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: fotoTerbaru } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1DB954]/20 to-[var(--spotify-base)] text-white text-center py-20 px-4 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Tempat Cerita, Berkumpul, dan Berbagi
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-[var(--spotify-subtext)]">
            Selamat datang di rumah kedua kita. Ruang bebas untuk bertukar pikiran, main bareng, dan menciptakan kenangan tak terlupakan bersama teman-teman terbaik.
          </p>
          <Link 
            href="/tentang" 
            className="inline-block bg-[var(--spotify-green)] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
          >
            Kenal Lebih Dekat
          </Link>
        </div>
      </section>

      {/* Tentang Singkat */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Tentang Kami</h2>
        <p className="text-[var(--spotify-subtext)] leading-relaxed text-lg mb-6">
          Website komunitas ini dibuat sebagai wadah bagi kita semua untuk tetap terhubung, meskipun sibuk dengan kegiatan masing-masing. Di sini kita membagikan momen seru dan merencanakan agenda nongkrong.
        </p>
        <Link href="/tentang" className="text-[var(--spotify-green)] font-bold hover:underline tracking-wide uppercase text-sm">Baca cerita lengkapnya &rarr;</Link>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="py-16 px-4 bg-[var(--spotify-elevated)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-white">Kegiatan Terbaru</h2>
            <Link href="/kegiatan" className="text-[var(--spotify-green)] font-bold hover:underline hidden sm:block text-sm uppercase">Lihat Semua Kegiatan</Link>
          </div>
          
          {kegiatanTerbaru && kegiatanTerbaru.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {kegiatanTerbaru.map((kegiatan) => (
                <div key={kegiatan.id} className="bg-[var(--spotify-highlight)] rounded-xl p-6 hover:bg-[#333] transition group cursor-pointer">
                  <div className="w-12 h-12 bg-black/40 text-[var(--spotify-green)] flex items-center justify-center rounded-full mb-4 text-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[var(--spotify-green)] transition">{kegiatan.nama}</h3>
                  <p className="text-[var(--spotify-green)] text-sm mb-3 font-medium">{kegiatan.tanggal}</p>
                  <p className="text-[var(--spotify-subtext)] text-sm line-clamp-3">{kegiatan.deskripsi}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--spotify-subtext)]">Belum ada data kegiatan.</p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/kegiatan" className="text-[var(--spotify-green)] font-bold hover:underline text-sm uppercase">Lihat Semua Kegiatan</Link>
          </div>
        </div>
      </section>

      {/* Foto Terbaru */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-white">Foto Terbaru</h2>
          <Link href="/galeri" className="text-[var(--spotify-green)] font-bold hover:underline hidden sm:block text-sm uppercase">Lihat Semua Galeri</Link>
        </div>
        
        {fotoTerbaru && fotoTerbaru.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {fotoTerbaru.map((foto) => (
              <div key={foto.id} className="bg-[var(--spotify-elevated)] p-4 rounded-xl hover:bg-[var(--spotify-highlight)] transition group">
                <div className="aspect-square rounded-lg overflow-hidden relative mb-4 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.image_url} alt={foto.ket} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Play button overlay vibe */}
                  <div className="absolute right-2 bottom-2 w-12 h-12 bg-[var(--spotify-green)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                  </div>
                </div>
                <h4 className="text-white font-bold truncate">{foto.ket}</h4>
                <p className="text-sm text-[var(--spotify-subtext)] mt-1">{foto.tanggal}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--spotify-subtext)]">Belum ada foto terbaru.</p>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/galeri" className="text-[var(--spotify-green)] font-bold hover:underline text-sm uppercase">Lihat Semua Galeri</Link>
        </div>
      </section>
    </>
  );
}
