-- 1. Buat Tabel `user_roles`
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'member')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (user_id)
);

-- 2. Buat Tabel `members`
CREATE TABLE public.members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  panggilan text NOT NULL,
  deskripsi text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- 3. Buat Tabel `activities`
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  tanggal text NOT NULL,
  lokasi text NOT NULL,
  deskripsi text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- 4. Buat Tabel `gallery`
CREATE TABLE public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ket text NOT NULL,
  tanggal text NOT NULL,
  image_url text NOT NULL, -- URL gambar
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- 5. Aktifkan Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 6. Fungsi Helper untuk Cek Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RLS Policy untuk `user_roles`
-- Hanya admin yang bisa melihat dan mengubah
CREATE POLICY "Admin can view roles" ON public.user_roles FOR SELECT TO authenticated USING (is_admin() OR user_id = auth.uid());

-- 8. RLS Policy untuk `members`
-- Publik bisa melihat
CREATE POLICY "Public can view members" ON public.members FOR SELECT USING (true);
-- Hanya admin yang bisa modifikasi
CREATE POLICY "Admin can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin can update members" ON public.members FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admin can delete members" ON public.members FOR DELETE TO authenticated USING (is_admin());

-- 9. RLS Policy untuk `activities`
-- Publik bisa melihat
CREATE POLICY "Public can view activities" ON public.activities FOR SELECT USING (true);
-- Hanya admin yang bisa modifikasi
CREATE POLICY "Admin can insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin can update activities" ON public.activities FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admin can delete activities" ON public.activities FOR DELETE TO authenticated USING (is_admin());

-- 10. RLS Policy untuk `gallery`
-- Publik bisa melihat
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
-- Anggota & Admin bisa menambah (Insert)
CREATE POLICY "Authenticated users can insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
-- Hanya admin atau pembuat (owner) yang bisa update/delete
CREATE POLICY "Owner or admin can update gallery" ON public.gallery FOR UPDATE TO authenticated USING (auth.uid() = created_by OR is_admin());
CREATE POLICY "Owner or admin can delete gallery" ON public.gallery FOR DELETE TO authenticated USING (auth.uid() = created_by OR is_admin());

-- Insert Data Dummy
INSERT INTO public.members (nama, panggilan, deskripsi) VALUES 
('Budi Santoso', 'Budi', 'Tukang lawak tongkrongan, selalu bawa cerita lucu.'),
('Andi Saputra', 'Andi', 'Ahli mabar, jago carry tim kalau lagi main bareng.'),
('Siti Aminah', 'Siti', 'Paling rajin ngatur jadwal dan tempat ngumpul.'),
('Rudi Hermawan', 'Rudi', 'Pecinta kopi sejati, tahu semua warkop enak di kota.');

INSERT INTO public.activities (nama, tanggal, lokasi, deskripsi) VALUES 
('Mabar Mingguan', 'Setiap Sabtu Malam', 'Discord / Kosan Budi', 'Kumpul online tiap malam minggu untuk main game bareng. Jangan lupa bawa snack dan pastikan internet lancar!'),
('Ngopi Sore', 'Minggu, 18 Oktober 2026', 'Warkop Berkah', 'Agenda tatap muka di warkop favorit untuk bahas hal-hal santai sampai yang berat-berat sambil ngopi.'),
('Olahraga Bareng (Futsal)', 'Minggu, 25 Oktober 2026', 'Futsal Champion', 'Main futsal bareng biar badan tetap sehat dan nggak gampang capek. Patungan sewa lapangan ya!');
