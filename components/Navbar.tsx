import Link from 'next/link';
import NavbarAuthSection from './NavbarAuthSection';

export default function Navbar() {
  return (
    <header className="bg-[var(--spotify-base)] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white mb-4 md:mb-0 hover:text-[var(--spotify-green)] transition">
          Selipan
        </Link>
        <nav className="flex flex-col md:flex-row items-center gap-6">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-[var(--spotify-subtext)]">
            <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
            <li><Link href="/tentang" className="hover:text-white transition">Tentang</Link></li>
            <li><Link href="/anggota" className="hover:text-white transition">Anggota</Link></li>
            <li><Link href="/galeri" className="hover:text-white transition">Galeri</Link></li>
            <li><Link href="/kegiatan" className="hover:text-white transition">Kegiatan</Link></li>
          </ul>
          <NavbarAuthSection />
        </nav>
      </div>
    </header>
  );
}
