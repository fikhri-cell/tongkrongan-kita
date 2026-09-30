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
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Anggota Tongkrongan</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Muka-muka familiar yang selalu meramaikan setiap obrolan. Tanpa mereka, tongkrongan ini nggak akan sama!
      </p>

      {error ? (
        <div className="text-center text-red-500">Gagal mengambil data anggota. Pastikan kredensial Supabase benar.</div>
      ) : anggotaList && anggotaList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {anggotaList.map((anggota) => {
            // Ambil huruf pertama nama panggilan untuk avatar teks
            const initial = (anggota.panggilan || anggota.nama || 'A').charAt(0).toUpperCase();
            // Pilih warna latar avatar berdasarkan huruf (biar tiap anggota unik)
            const colorClasses = [
              'bg-blue-100 text-blue-600',
              'bg-purple-100 text-purple-600',
              'bg-green-100 text-green-600',
              'bg-orange-100 text-orange-600',
              'bg-pink-100 text-pink-600',
              'bg-teal-100 text-teal-600',
            ];
            const colorIndex = initial.charCodeAt(0) % colorClasses.length;
            const avatarColor = colorClasses[colorIndex];

            return (
              <div key={anggota.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                {/* Foto Profil atau Avatar Default */}
                <div className="h-48 relative overflow-hidden">
                  {anggota.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={anggota.avatar_url}
                      alt={`Foto ${anggota.panggilan}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    // Avatar default rapi jika belum ada foto
                    <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${avatarColor}`}>
                      <span className="text-5xl font-extrabold opacity-60">{initial}</span>
                    </div>
                  )}
                  {/* Badge Status Non-Aktif */}
                  {anggota.status === 'Non-Aktif' && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                      Non-Aktif
                    </span>
                  )}
                </div>

                {/* Info Anggota */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">{anggota.nama}</h2>
                  <div className="flex justify-between items-center mt-1 mb-3">
                    <p className="text-blue-600 font-medium text-sm">&quot;{anggota.panggilan}&quot;</p>
                    {anggota.no_hp && (
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{anggota.no_hp}</p>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {anggota.deskripsi || 'Tidak ada deskripsi.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 bg-white p-12 border border-dashed rounded-xl">
          Belum ada anggota yang terdaftar.
        </div>
      )}
    </div>
  );
}
