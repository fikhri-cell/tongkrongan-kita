export const metadata = {
  title: "Tentang Kami - Selipan",
};

export default function Tentang() {
  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Selipan</h1>
      
      <div className="bg-[var(--spotify-elevated)] rounded-2xl shadow-xl border border-gray-800 p-8 md:p-12 hover:bg-[var(--spotify-highlight)] transition-colors">
        <h2 className="text-2xl font-bold mb-4 text-[var(--spotify-green)]">Awal Mula Cerita</h2>
        <p className="text-[var(--spotify-subtext)] leading-relaxed mb-6 text-lg">
          Semuanya berawala dari anak anak blok Pahing yang saling mengenal dan bermain sejak masih balita, Mereka mungkin tidak sadar kalau sudah menjadi teman yang setia dan tidak pernah lupa akan sekawan, Mereka terus tumbuh menjadi orang- orang atos secara bersamaan, mereka saling melengkapi banyak kawan baru yang sudah tidak berkawan lagi, tapi mereka tetap ada.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-[var(--spotify-green)] mt-10">Kenapa Website Ini Dibuat?</h2>
        <p className="text-[var(--spotify-subtext)] leading-relaxed mb-6 text-lg">
          Website ini dibuat sebagai basecamp digital orang-orang atos, tempat merencanakan acara tempat sharing gambar atau foto dan tempat hadir nya orang orang atos
        </p>

        <h2 className="text-2xl font-bold mb-4 text-[var(--spotify-green)] mt-10">Selipan</h2>
        <ul className="list-disc list-inside text-[var(--spotify-subtext)] leading-relaxed text-lg space-y-2">
          <li>Orang selipan memang tidak berperasaan dan mereka bebas secara pergaulan dan mental namun orang selipan berisi niceguy dan orang orang ganteng cihuyyyy</li>
        </ul>
      </div>
    </div>
  );
}
