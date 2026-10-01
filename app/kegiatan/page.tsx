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
      <h1 className="text-4xl font-bold mb-4 text-center text-white tracking-tight">Agenda Kegiatan</h1>
      <p className="text-center text-[var(--spotify-subtext)] mb-8 max-w-2xl mx-auto">
        Jadwal ngumpul atau kegiatan ekstrim orang orang atos. Jangan sampai ketinggalan!
      </p>

      {/* Tampilkan Form Tambah jika user login (Anggota / Admin) */}
      {user && (
        <div className="flex justify-center mb-10 w-full">
          <AddActivityForm />
        </div>
      )}

      {error ? (
        <div className="text-center text-red-500 bg-red-950/20 p-4 rounded-xl border border-red-900/50">Gagal mengambil data kegiatan.</div>
      ) : kegiatanList && kegiatanList.length > 0 ? (
        <div className="space-y-4">
          {kegiatanList.map((kegiatan) => (
            <div key={kegiatan.id} className="bg-[var(--spotify-elevated)] rounded-xl border border-gray-800/50 p-6 flex flex-col md:flex-row gap-6 hover:bg-[var(--spotify-highlight)] transition-colors group cursor-pointer">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--spotify-green)] transition-colors">{kegiatan.nama}</h2>
                <div className="flex flex-wrap gap-3 mb-4 text-sm font-medium">
                  <span className="flex items-center gap-1.5 text-[var(--spotify-green)] bg-[var(--spotify-green)]/10 px-3 py-1.5 rounded-full shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {kegiatan.tanggal}
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {kegiatan.lokasi}
                  </span>
                </div>
                <p className="text-[var(--spotify-subtext)] leading-relaxed">
                  {kegiatan.deskripsi}
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center pr-4">
                 <div className="w-12 h-12 bg-[var(--spotify-green)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 shadow-xl">
                    <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-[var(--spotify-subtext)] bg-[var(--spotify-elevated)] p-12 rounded-xl">Belum ada kegiatan yang terdaftar.</div>
      )}
    </div>
  );
}
