import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Cek autentikasi & otorisasi (hanya admin yang boleh menghapus)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Ambil parameter dari body request
    const body = await request.json();
    const { userId, memberId } = body;
    
    if (!userId && !memberId) {
        return NextResponse.json({ error: 'Missing userId or memberId' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 3. Hapus data dari tabel members
    if (memberId) {
      const { error: memberError } = await adminClient.from('members').delete().eq('id', memberId);
      if (memberError) {
        console.error("Error deleting from members:", memberError);
      }
    }

    // 4. Hapus data dari tabel user_roles dan auth.users secara total
    if (userId) {
      // Hapus role terlebih dahulu
      const { error: roleError } = await adminClient.from('user_roles').delete().eq('user_id', userId);
      if (roleError) {
          console.error("Error deleting from user_roles:", roleError);
      }
      
      // Terakhir, hapus akun Auth secara permanen menggunakan admin API
      const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
      
      if (deleteAuthError) {
        return NextResponse.json({ error: deleteAuthError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Anggota dan akun berhasil dihapus secara permanen' });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
