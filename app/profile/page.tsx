import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

export const metadata = {
  title: "Pengaturan Profil - Tongkrongan Kita",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !member) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Profil Saya</h1>
        <div className="bg-red-950/20 text-red-500 p-6 rounded-xl border border-red-900/50">
          <p className="font-bold">Data profil Anda belum terhubung.</p>
          <p className="text-sm mt-2 text-red-400">Harap hubungi Admin untuk memperbarui relasi akun Anda di database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Pengaturan Profil</h1>
      <ProfileForm memberData={member} userId={user.id} />
    </div>
  );
}
