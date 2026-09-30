import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AddMemberForm from '@/components/AddMemberForm';
import DeleteMemberButton from '@/components/DeleteMemberButton';

export const metadata = {
  title: "Admin Dashboard - Tongkrongan Kita",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Middleware already checks if user is admin, but we double check here
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleData || roleData.role !== 'admin') {
    return <div className="p-16 text-center text-red-500 font-bold text-xl">Anda bukan Admin!</div>;
  }

  // Fetch Data
  const { data: members } = await supabase.from('members').select('*').order('created_at', { ascending: false });
  const { data: activities } = await supabase.from('activities').select('*').order('created_at', { ascending: false });

  // Server Actions for Delete


  async function deleteActivity(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabaseServer = await createClient();
    await supabaseServer.from('activities').delete().eq('id', id);
    revalidatePath('/admin');
  }

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel Admin</h1>

      <AddMemberForm />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kelola Anggota */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Data Anggota</h2>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">{members?.length || 0} Terdaftar</span>
          </div>
          
          <div className="space-y-4">
            {members?.map(m => (
              <div key={m.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold text-gray-800">{m.nama}</p>
                  <p className="text-sm text-gray-500">&quot;{m.panggilan}&quot; {m.status && `• ${m.status}`}</p>
                </div>
                <DeleteMemberButton userId={m.user_id} memberId={m.id} nama={m.nama} />
              </div>
            ))}
            {(!members || members.length === 0) && <p className="text-sm text-gray-500 text-center py-4">Belum ada data anggota.</p>}
          </div>
        </div>

        {/* Kelola Kegiatan */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Data Kegiatan</h2>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">{activities?.length || 0} Kegiatan</span>
          </div>
          
          <div className="space-y-4">
            {activities?.map(a => (
              <div key={a.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold text-gray-800">{a.nama}</p>
                  <p className="text-sm text-gray-500">{a.tanggal}</p>
                </div>
                <form action={deleteActivity}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded transition">Hapus</button>
                </form>
              </div>
            ))}
            {(!activities || activities.length === 0) && <p className="text-sm text-gray-500 text-center py-4">Belum ada data kegiatan.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
