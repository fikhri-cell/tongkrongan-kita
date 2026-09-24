export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 text-center mt-auto">
      <p className="font-semibold text-white mb-2">Tongkrongan Kita</p>
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Tongkrongan Kita. Dibuat untuk teman-teman.
      </p>
    </footer>
  );
}
