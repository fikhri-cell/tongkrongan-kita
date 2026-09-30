import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';


export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Mengambil data anggota berdasarkan user_id
  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !member) {
    // Jika tidak ada data anggota, mungkin pengguna ini dibuat sebelum fitur relasi ditambahkan,
    // atau admin belum mengisikan data untuk user_id ini.
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Profil Saya</h1>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
          <p className="font-medium">Data profil Anda belum terhubung.</p>
          <p className="text-sm mt-2">Harap hubungi Admin untuk memperbarui relasi akun Anda di database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Pengaturan Profil</h1>
      <ProfileForm memberData={member} userId={user.id} />
    </div>
  );
}
