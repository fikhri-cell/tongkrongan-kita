import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: "Anggota - Tongkrongan Kita",
};

export default async function Anggota() {
  const supabase = await createClient();
  const { data: anggotaList, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-white">Anggota Tongkrongan</h1>
      <p className="text-center text-[var(--spotify-subtext)] mb-12 max-w-2xl mx-auto">
        Muka-muka familiar yang selalu meramaikan setiap obrolan. Tanpa mereka, tongkrongan ini nggak akan sama!
      </p>

      {error ? (
        <div className="text-center text-red-500 bg-red-950/20 p-4 rounded-xl border border-red-900/50">Gagal mengambil data anggota. Pastikan kredensial Supabase benar.</div>
      ) : anggotaList && anggotaList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {anggotaList.map((anggota) => {
            const initial = (anggota.panggilan || anggota.nama || 'A').charAt(0).toUpperCase();
            
            return (
              <div key={anggota.id} className="bg-[var(--spotify-elevated)] rounded-xl shadow-lg border border-gray-800/50 overflow-hidden hover:bg-[var(--spotify-highlight)] transition-colors group">
                {/* Foto Profil atau Avatar Default */}
                <div className="h-56 relative overflow-hidden bg-black flex items-center justify-center p-4">
                  {anggota.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={anggota.avatar_url}
                      alt={`Foto ${anggota.panggilan}`}
                      className="w-full h-full object-cover rounded-full shadow-2xl group-hover:scale-105 transition-transform duration-500 aspect-square max-w-[150px] max-h-[150px]"
                    />
                  ) : (
                    // Avatar default rapi jika belum ada foto
                    <div className="w-full h-full rounded-full shadow-2xl bg-[#333] text-[var(--spotify-green)] flex flex-col items-center justify-center aspect-square max-w-[150px] max-h-[150px]">
                      <span className="text-5xl font-extrabold">{initial}</span>
                    </div>
                  )}
                  {/* Badge Status Non-Aktif */}
                  {anggota.status === 'Non-Aktif' && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md">
                      Non-Aktif
                    </span>
                  )}
                  {/* Play Button Vibe Hover */}
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--spotify-green)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                  </div>
                </div>

                {/* Info Anggota */}
                <div className="p-5 text-center">
                  <h2 className="text-lg font-bold text-white leading-tight">{anggota.nama}</h2>
                  <p className="text-[var(--spotify-subtext)] font-medium text-sm mt-1 mb-3">&quot;{anggota.panggilan}&quot;</p>
                  
                  {anggota.no_hp && (
                    <p className="inline-block text-xs text-[var(--spotify-green)] bg-[var(--spotify-green)]/10 px-3 py-1 rounded-full mb-3">{anggota.no_hp}</p>
                  )}
                  
                  <p className="text-[var(--spotify-subtext)] text-sm leading-relaxed line-clamp-2">
                    {anggota.deskripsi || 'Tidak ada deskripsi.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-[var(--spotify-subtext)] bg-[var(--spotify-elevated)] p-12 rounded-xl">
          Belum ada anggota yang terdaftar.
        </div>
      )}
    </div>
  );
}
