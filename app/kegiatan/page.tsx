import { createClient } from '@/utils/supabase/server';
import AddActivityForm from '@/components/AddActivityForm';

export const metadata = {
  title: "Kegiatan - Tongkrongan Kita",
};

export default async function Kegiatan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: kegiatanList, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Agenda Kegiatan</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Jadwal ngumpul dan kegiatan seru tongkrongan kita. Jangan sampai ketinggalan!
      </p>

      {/* Tampilkan Form Tambah jika user login (Anggota / Admin) */}
      {user && (
        <div className="flex justify-center mb-8">
          <AddActivityForm />
        </div>
      )}

      {error ? (
        <div className="text-center text-red-500">Gagal mengambil data kegiatan.</div>
      ) : kegiatanList && kegiatanList.length > 0 ? (
        <div className="space-y-6">
          {kegiatanList.map((kegiatan) => (
            <div key={kegiatan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{kegiatan.nama}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1 font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">📅 {kegiatan.tanggal}</span>
                  <span className="flex items-center gap-1 font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📍 {kegiatan.lokasi}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {kegiatan.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 bg-white p-12 rounded-xl border border-dashed">Belum ada kegiatan yang terdaftar.</div>
      )}
    </div>
  );
}
