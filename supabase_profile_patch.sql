-- 1. Penambahan Kolom di Tabel members
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Pembuatan Storage Bucket 'avatars' (Jika belum ada)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Kebijakan RLS (Security) untuk bucket 'avatars'
CREATE POLICY "Public avatars access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth users upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users update own avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "Users delete own avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- 4. Mengubah RLS Galeri agar Semua Anggota Biasa bisa Menghapus (Sesuai Request)
-- Tabel gallery
DROP POLICY IF EXISTS "Owner or admin can delete gallery" ON public.gallery;
CREATE POLICY "Any authenticated user can delete gallery" ON public.gallery FOR DELETE TO authenticated USING (true);

-- Storage bucket gallery (Hapus kebijakan lama jika ada, lalu buat baru)
DROP POLICY IF EXISTS "Users can delete own objects" ON storage.objects;
-- Kebijakan baru: Semua user login bisa hapus gambar di bucket gallery
CREATE POLICY "Any auth user can delete gallery storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

-- Opsional: Mengizinkan semua user login mengedit (UPDATE) data profilnya sendiri di tabel members
DROP POLICY IF EXISTS "User can update own member data" ON public.members;
CREATE POLICY "User can update own member data" ON public.members FOR UPDATE TO authenticated USING (user_id = auth.uid());
