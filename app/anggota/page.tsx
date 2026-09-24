import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: "Anggota - Tongkrongan Kita",
};

export default async function Anggota() {
  const supabase = await createClient();
  const { data: anggotaList, error } = await supabase.from('members').select('*').order('created_at', { ascending: true });

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
          {anggotaList.map((anggota) => (
            <div key={anggota.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              {/* Placeholder Foto Anggota */}
              <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400">
                [Foto {anggota.panggilan}]
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800">{anggota.nama}</h2>
                <p className="text-blue-600 font-medium text-sm mb-3">&quot;{anggota.panggilan}&quot;</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {anggota.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Belum ada anggota yang terdaftar.</div>
      )}
    </div>
  );
}
