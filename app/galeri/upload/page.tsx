import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Upload Foto - Tongkrongan Kita",
};

export default async function UploadGaleri({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  async function uploadFoto(formData: FormData) {
    "use server";
    const ket = formData.get("ket") as string;
    const tanggal = formData.get("tanggal") as string;
    const imageUrl = formData.get("imageUrl") as string;
    
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) {
      return redirect("/login");
    }

    const { error } = await supabaseServer.from('gallery').insert({
      ket: ket,
      tanggal: tanggal,
      image_url: imageUrl,
      created_by: user.id
    });

    if (error) {
      return redirect("/galeri/upload?message=" + encodeURIComponent(error.message));
    }

    return redirect("/galeri");
  }

  return (
    <div className="py-16 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Upload Foto Baru</h1>
      
      <form action={uploadFoto} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Keterangan / Judul Foto</label>
          <input name="ket" required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nongkrong di Cafe..." />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Tanggal</label>
          <input name="tanggal" required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="15 Agustus 2026" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">URL Gambar</label>
          <input name="imageUrl" required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://example.com/foto.jpg" />
          <p className="text-sm text-gray-500">Untuk saat ini, masukkan URL gambar langsung (bisa dari Imgur atau layanan lain).</p>
        </div>

        <button type="submit" className="bg-blue-600 text-white font-medium px-4 py-3 rounded-lg mt-4 hover:bg-blue-700 transition">
          Simpan ke Galeri
        </button>

        {message && (
          <p className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
