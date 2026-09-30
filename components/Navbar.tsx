import Link from 'next/link';
import NavbarAuthSection from './NavbarAuthSection';

// Navbar sekarang hanya berisi bagian statis (logo + menu utama).
// Bagian auth (profil, admin, logout) ditangani oleh NavbarAuthSection
// yang merupakan Client Component dengan real-time listener, sehingga
// Navbar langsung update saat user login/logout tanpa perlu refresh halaman.
export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
          Tongkrongan Kita
        </Link>
        <nav className="flex flex-col md:flex-row items-center gap-6">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-600">
            <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
            <li><Link href="/tentang" className="hover:text-blue-600 transition">Tentang</Link></li>
            <li><Link href="/anggota" className="hover:text-blue-600 transition">Anggota</Link></li>
            <li><Link href="/galeri" className="hover:text-blue-600 transition">Galeri</Link></li>
            <li><Link href="/kegiatan" className="hover:text-blue-600 transition">Kegiatan</Link></li>
          </ul>

          {/* Bagian auth yang reactive — update real-time saat login/logout */}
          <NavbarAuthSection />
        </nav>
      </div>
    </header>
  );
}
