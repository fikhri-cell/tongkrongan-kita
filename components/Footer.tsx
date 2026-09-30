export default function Footer() {
  return (
    <footer className="bg-black text-[var(--spotify-subtext)] py-8 text-center mt-auto border-t border-gray-800">
      <p className="font-bold text-white mb-2">Tongkrongan Kita</p>
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Tongkrongan Kita. Dibuat untuk teman-teman.
      </p>
    </footer>
  );
}
