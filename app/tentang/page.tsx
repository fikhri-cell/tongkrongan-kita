export const metadata = {
  title: "Tentang Kami - Tongkrongan Kita",
};

export default function Tentang() {
  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Tentang Tongkrongan Kita</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Awal Mula Cerita</h2>
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Semua berawal dari kumpul-kumpul iseng sepulang sekolah (atau kerja) di warung kopi depan gang. 
          Awalnya cuma berdua-bertiga, lama-kelamaan makin banyak teman yang ikut gabung. 
          Dari sekadar numpang ngecas HP, kita jadi saling curhat, bercanda, sampai bikin rencana-rencana 
          liburan yang (kadang) cuma jadi wacana.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-10">Kenapa Website Ini Dibuat?</h2>
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Seiring berjalannya waktu, kesibukan masing-masing bikin kita makin jarang bisa kumpul lengkap. 
          Ada yang sibuk kuliah, kerja lembur, atau pindah ke luar kota. Website ini dibuat sebagai &quot;basecamp digital&quot; 
          supaya kenangan kita nggak hilang dan kita tetap bisa pantau kegiatan satu sama lain.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-10">Nilai Tongkrongan</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
          <li><strong>Solidaritas:</strong> Teman susah harus dibantu, teman senang kita ikut makan gratis.</li>
          <li><strong>Santai:</strong> Nggak perlu jaim, jadilah diri sendiri apa adanya.</li>
          <li><strong>Terbuka:</strong> Siapapun yang mau berteman dengan baik, silakan bergabung.</li>
        </ul>
      </div>
    </div>
  );
}
