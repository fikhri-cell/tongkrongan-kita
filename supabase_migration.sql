-- 1. Tambah Kolom Baru di Tabel members
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS status text DEFAULT 'Aktif';
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS no_hp text;

-- 2. Buat Storage Bucket untuk Galeri (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Atur Keamanan (RLS) untuk Storage Bucket 'gallery'
-- Mengizinkan siapa saja melihat file
CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

-- Mengizinkan pengguna yang login untuk mengupload file
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'gallery');

-- Mengizinkan pengguna yang login untuk menghapus fotonya sendiri
CREATE POLICY "Users can delete own objects" ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'gallery' AND auth.uid() = owner);
