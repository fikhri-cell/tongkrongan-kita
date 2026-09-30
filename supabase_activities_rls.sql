-- Memastikan RLS aktif di tabel activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 1. Mengizinkan publik/tamu untuk melihat kegiatan (jika diperlukan)
-- Jika hanya untuk anggota, ganti "TO public" menjadi "TO authenticated"
DROP POLICY IF EXISTS "Public can read activities" ON public.activities;
CREATE POLICY "Public can read activities" ON public.activities
  FOR SELECT USING (true);

-- 2. Mengizinkan HANYA pengguna yang sudah login untuk MENAMBAH kegiatan
DROP POLICY IF EXISTS "Authenticated users can insert activities" ON public.activities;
CREATE POLICY "Authenticated users can insert activities" ON public.activities
  FOR INSERT TO authenticated WITH CHECK (true);

-- 3. Mengizinkan admin ATAU pembuat kegiatan untuk menghapus kegiatan
-- (Jika sebelumnya ada, ini untuk menjaga keamanan)
DROP POLICY IF EXISTS "Authenticated users can delete activities" ON public.activities;
CREATE POLICY "Authenticated users can delete activities" ON public.activities
  FOR DELETE TO authenticated USING (true);

-- 4. Mengizinkan pengguna login untuk mengedit (opsional, jika fitur edit ditambahkan ke kegiatan)
DROP POLICY IF EXISTS "Authenticated users can update activities" ON public.activities;
CREATE POLICY "Authenticated users can update activities" ON public.activities
  FOR UPDATE TO authenticated USING (true);
