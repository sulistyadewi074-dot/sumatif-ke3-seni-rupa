import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // =========================================================================
  // BAGIAN I: PILIHAN GANDA (10 BUTIR SOAL: NO. 1 - 10)
  // Setiap butir bernilai skor 1 (Total skor PG = 10)
  // =========================================================================
  {
    id: 1,
    type: 'pg',
    topic: 'Pengertian Makrame',
    difficulty: 'Mudah',
    text: 'Seni makrame merupakan salah satu cabang seni kriya tekstil yang memiliki keunikan tersendiri. Pengertian seni makrame yang paling tepat adalah...',
    options: [
      { id: 'A', text: 'Seni kerajinan tangan menyimpul tali atau benang menjadi aneka karya hias dan benda pakai tanpa alat tenun atau jarum' },
      { id: 'B', text: 'Seni melukis di atas kain menggunakan lilin malam cair dan canting tembaga tradisional' },
      { id: 'C', text: 'Seni merajut benang wol menggunakan sepasang jarum panjang khusus (hakpen atau breien)' },
      { id: 'D', text: 'Seni menyilangkan benang pakan dan lungsin pada bentangan mesin tenun kayu' },
    ],
    correctAnswer: 'A',
    explanation:
      'Makrame adalah seni kriya kerajinan tangan yang memanfaatkan keahlian menyimpul untaian benang atau tali untuk menghasilkan berbagai motif hiasan maupun benda pakai fungsional tanpa menggunakan bantuan jarum rajut atau mesin tenun.',
  },
  {
    id: 2,
    type: 'pg',
    topic: 'Asal-Usul Istilah Makrame',
    difficulty: 'Mudah',
    text: 'Perhatikan infografis sejarah dan asal-usul seni makrame di bawah ini!\n\nBerdasarkan catatan sejarah seni kriya, istilah kata "makrame" berakar dari bahasa Arab "miqramah" atau "migramah" yang memiliki arti dasar yaitu...',
    imageSvg: `<svg viewBox="0 0 540 180" class="w-full max-w-lg h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb" />
          <stop offset="100%" stop-color="#fef3c7" />
        </linearGradient>
        <linearGradient id="gradNode" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b45309" />
          <stop offset="100%" stop-color="#78350f" />
        </linearGradient>
      </defs>
      <rect width="540" height="180" fill="url(#gradBg)" rx="16" stroke="#fcd34d" stroke-width="2"/>
      <text x="270" y="24" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle" letter-spacing="1">SEJARAH &amp; ASAL ISTILAH SENI MAKRAME</text>
      
      <!-- Card 1: Arab Abad ke-13 -->
      <g transform="translate(18, 40)">
        <rect width="150" height="120" rx="10" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5" />
        <circle cx="75" cy="28" r="16" fill="#fef3c7"/>
        <text x="75" y="34" font-size="12" font-weight="bold" fill="#b45309" text-anchor="middle">1</text>
        <text x="75" y="60" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">Bahasa Arab</text>
        <text x="75" y="76" font-size="9.5" font-style="italic" fill="#b45309" text-anchor="middle">"Miqramah / Migramah"</text>
        <rect x="10" y="86" width="130" height="26" rx="6" fill="#fef3c7"/>
        <text x="75" y="103" font-size="8.5" font-weight="bold" fill="#78350f" text-anchor="middle">Hiasan Rumbai / Handuk</text>
      </g>

      <!-- Arrow 1 -->
      <path d="M 174 100 L 198 100" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <polygon points="198,95 208,100 198,105" fill="#b45309" />

      <!-- Card 2: Spanyol & Moor -->
      <g transform="translate(214, 40)">
        <rect width="144" height="120" rx="10" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5" />
        <circle cx="72" cy="28" r="16" fill="#fef3c7"/>
        <text x="72" y="34" font-size="12" font-weight="bold" fill="#b45309" text-anchor="middle">2</text>
        <text x="72" y="60" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">Penyebaran</text>
        <text x="72" y="76" font-size="9.5" fill="#b45309" text-anchor="middle">Spanyol &amp; Eropa</text>
        <rect x="10" y="86" width="124" height="26" rx="6" fill="#fef3c7"/>
        <text x="72" y="103" font-size="8.5" font-weight="bold" fill="#78350f" text-anchor="middle">Para Pelaut Handal</text>
      </g>

      <!-- Arrow 2 -->
      <path d="M 364 100 L 388 100" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <polygon points="388,95 398,100 388,105" fill="#b45309" />

      <!-- Card 3: Seni Kriya Modern -->
      <g transform="translate(404, 40)">
        <rect width="118" height="120" rx="10" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5" />
        <circle cx="59" cy="28" r="16" fill="#fef3c7"/>
        <text x="59" y="34" font-size="12" font-weight="bold" fill="#b45309" text-anchor="middle">3</text>
        <text x="59" y="60" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">Masa Kini</text>
        <text x="59" y="76" font-size="9.5" fill="#b45309" text-anchor="middle">Seni Makrame</text>
        <rect x="8" y="86" width="102" height="26" rx="6" fill="#fef3c7"/>
        <text x="59" y="103" font-size="8.5" font-weight="bold" fill="#78350f" text-anchor="middle">Dekorasi &amp; Fungsional</text>
      </g>
    </svg>`,
    options: [
      { id: 'A', text: 'Hiasan rumbai-rumbai, selubung berenda, atau tepi kain yang disimpul' },
      { id: 'B', text: 'Benang berwarna emas yang disulam pada jubah istana' },
      { id: 'C', text: 'Pewarna alami dari tumbuhan hutan tropis' },
      { id: 'D', text: 'Tali kapal yang digunakan untuk mengikat jangkar perahu' },
    ],
    correctAnswer: 'A',
    explanation:
      'Kata makrame berasal dari bahasa Arab "miqramah" atau "migramah" yang bermakna hiasan rumbai-rumbai, selubung kepala berenda, atau handuk hias berumbai tepi yang dibuat oleh para penenun Arab abad ke-13 untuk merapikan sisa untaian benang.',
  },
  {
    id: 3,
    type: 'pg',
    topic: 'Alat dan Bahan - Jenis Tali Katun',
    difficulty: 'Mudah',
    text: 'Siti ingin membuat hiasan dinding makrame berbentuk daun/bulu yang lembut. Jenis tali yang paling cocok digunakan karena terbuat dari serat kapas alami, bertekstur lembut, tidak licin saat disimpul, dan bagian ujungnya sangat mudah disisir menjadi rumbai halus adalah...',
    options: [
      { id: 'A', text: 'Tali katun (cotton rope)' },
      { id: 'B', text: 'Tali nilon sintetis' },
      { id: 'C', text: 'Tali kawat tembaga' },
      { id: 'D', text: 'Tali rafia plastik' },
    ],
    correctAnswer: 'A',
    explanation:
      'Tali katun (cotton rope/cotton yarn) adalah bahan paling populer dalam makrame modern karena terbuat dari serat kapas alami, memiliki tekstur lembut, tidak licin di tangan, serta serat ujungnya mudah diurai dan disisir dengan sisir rapat untuk menghasilkan aksen rumbai menyerupai daun atau bulu.',
  },
  {
    id: 4,
    type: 'pg',
    topic: 'Alat Pendukung Makrame',
    difficulty: 'Sedang',
    text: 'Saat menyimpul tali di atas meja, pengrajin sering menggunakan papan penjepit (clipboard) atau bantalan busa yang ditancapi jarum pentul/selotip kertas. Fungsi utama penggunaan alat tersebut adalah...',
    options: [
      { id: 'A', text: 'Menahan pangkal tali agar tetap kencang, stabil, dan tidak bergeser saat disimpul' },
      { id: 'B', text: 'Mengubah warna tali agar tampak lebih mengilap dan bercahaya' },
      { id: 'C', text: 'Memotong tali secara otomatis dengan ukuran yang tepat' },
      { id: 'D', text: 'Melelehkan serat tali agar mengeras permanen' },
    ],
    correctAnswer: 'A',
    explanation:
      'Papan penjepit (clipboard), bantalan gabus/busa, jarum pentul, atau selotip kertas berfungsi sebagai alat bantu penahan (anchor) agar tali pangkal tidak ikut bergeser atau terangkat saat tangan menarik simpul, sehingga anyaman menjadi lebih rapi, teratur, dan simetris.',
  },
  {
    id: 5,
    type: 'pg',
    topic: 'Langkah Membuat - Simpul Kepala',
    difficulty: 'Mudah',
    text: 'Perhatikan diagram teknik simpul di bawah ini!\n\nSimpul dasar yang dibuat dengan melipat tali menjadi dua bagian sama panjang, melingkarkannya pada tongkat kayu penyangga (dowel) atau ring, lalu menarik kedua ujung tali melalui lengkungan lipatan tali tersebut disebut...',
    imageSvg: `<svg viewBox="0 0 520 200" class="w-full max-w-lg h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#92400e" />
        </linearGradient>
      </defs>
      <rect width="520" height="200" fill="#f8fafc" rx="14" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="260" y="24" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">TEKNIK SIMPUL AWAL PADA KAYU PENYANGGA (DOWEL)</text>
      
      <!-- Tongkat kayu mendatar -->
      <rect x="40" y="50" width="440" height="18" rx="9" fill="url(#woodGrad)" stroke="#78350f" stroke-width="1.5"/>
      <text x="460" y="63" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Kayu Dowel</text>

      <!-- Tahap A: Lipat Tali -->
      <g transform="translate(70, 75)">
        <text x="40" y="18" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">Langkah 1</text>
        <path d="M 30 30 C 30 15, 50 15, 50 30 L 50 100 M 30 30 L 30 100" stroke="#0284c7" stroke-width="4" stroke-linecap="round" fill="none"/>
        <text x="40" y="115" font-size="8.5" fill="#475569" text-anchor="middle">Lipat tali jadi 2</text>
      </g>

      <!-- Panah -->
      <path d="M 180 120 L 210 120" stroke="#64748b" stroke-width="2" stroke-dasharray="3 3"/>
      <polygon points="210,116 218,120 210,124" fill="#64748b"/>

      <!-- Tahap B: Lingkarkan di belakang kayu -->
      <g transform="translate(230, 40)">
        <text x="40" y="53" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">Langkah 2</text>
        <path d="M 25 15 C 25 -5, 55 -5, 55 15" stroke="#0284c7" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M 25 40 L 25 120 M 55 40 L 55 120" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
        <text x="40" y="150" font-size="8.5" fill="#475569" text-anchor="middle">Selipkan lewat atas</text>
      </g>

      <!-- Panah -->
      <path d="M 340 120 L 370 120" stroke="#64748b" stroke-width="2" stroke-dasharray="3 3"/>
      <polygon points="370,116 378,120 370,124" fill="#64748b"/>

      <!-- Tahap C: Tarik Kedua Ujung Masuk Loop -->
      <g transform="translate(390, 42)">
        <text x="40" y="51" font-size="10" font-weight="bold" fill="#15803d" text-anchor="middle">Hasil Simpul</text>
        <!-- Loop yang mengikat kayu -->
        <ellipse cx="40" cy="20" rx="18" ry="10" fill="none" stroke="#16a34a" stroke-width="5"/>
        <path d="M 33 28 L 33 130 M 47 28 L 47 130" stroke="#16a34a" stroke-width="4.5" stroke-linecap="round"/>
        <rect x="25" y="17" width="30" height="14" rx="4" fill="#15803d"/>
        <text x="40" y="27" font-size="7.5" font-weight="bold" fill="#ffffff" text-anchor="middle">TERIKAT</text>
        <text x="40" y="148" font-size="8.5" font-weight="bold" fill="#15803d" text-anchor="middle">Lark's Head Knot</text>
      </g>
    </svg>`,
    options: [
      { id: 'A', text: 'Simpul Kepala (Lark\'s Head Knot)' },
      { id: 'B', text: 'Simpul Jangkar Nelayan (Fisherman Knot)' },
      { id: 'C', text: 'Simpul Hidup Pramuka (Slip Knot)' },
      { id: 'D', text: 'Simpul Pita Kado (Bow Knot)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Simpul Kepala (Lark\'s Head Knot / Cow Hitch) adalah simpul utama yang selalu digunakan untuk mengawali untaian tali makrame pada tongkat kayu (dowel) atau cincin gantungan sebelum memulai simpul pola lainnya.',
  },
  {
    id: 6,
    type: 'pg',
    topic: 'Teknik Simpul Spiral (Half Square Knot)',
    difficulty: 'Sedang',
    text: 'Budi sedang membuat gantungan kunci makrame. Ia menyimpulkan tali pengerja dengan simpul pipih tunggal secara terus-menerus ke arah yang sama (searah) tanpa bergantian sisi. Hasil bentuk anyaman tali yang akan diperoleh Budi adalah...',
    options: [
      { id: 'A', text: 'Anyaman simpul yang berpilin atau meliuk melingkar menyerupai bentuk spiral' },
      { id: 'B', text: 'Anyaman lurus dan pipih datar rata di kedua sisi' },
      { id: 'C', text: 'Untaian tali yang langsung putus dan longgar' },
      { id: 'D', text: 'Anyaman berbentuk kotak persegi kaku tanpa lekukan' },
    ],
    correctAnswer: 'A',
    explanation:
      'Jika simpul pipih tunggal (Half Square Knot) dibuat berulang-ulang ke satu arah yang sama (misalnya selalu mulai dari sisi kiri), tali secara alami akan berputar dan menghasilkan pola anyaman berpilin atau spiral (Spiral Stitch).',
  },
  {
    id: 7,
    type: 'pg',
    topic: 'Teknik Simpul Pipih Ganda (Square Knot)',
    difficulty: 'Sedang',
    text: 'Simpul Pipih Ganda (Square Knot) merupakan salah satu simpul paling mendasar dan terpenting dalam seni makrame. Prinsip pembuatan Simpul Pipih Ganda adalah...',
    options: [
      { id: 'A', text: 'Menyilangkan tali pengerja sisi kiri lalu disusul sisi kanan secara bergantian mengelilingi tali inti di tengah' },
      { id: 'B', text: 'Memutar seluruh helai tali secara bersamaan menggunakan bor listrik' },
      { id: 'C', text: 'Mengikat tali inti menjadi simpul mati tunggal tanpa melibatkan tali sisi samping' },
      { id: 'D', text: 'Mengelem untaian tali pengerja ke papan kayu agar merekat kuat' },
    ],
    correctAnswer: 'A',
    explanation:
      'Simpul Pipih Ganda (Square Knot) dibentuk dari 4 untaian tali (2 tali inti di tengah dan 2 tali pengerja di sisi kiri dan kanan). Gerakannya dilakukan dua tahap berlawanan: simpul setengah pipih pertama (dari kiri), lalu dikunci dengan simpul setengah pipih kedua (dari kanan) sehingga menghasilkan anyaman datar yang rata dan kokoh.',
  },
  {
    id: 8,
    type: 'pg',
    topic: 'Langkah Kerja - Perhitungan Panjang Tali',
    difficulty: 'Sukar',
    text: 'Dalam tahap perencanaan pembuatan makrame, mengapa panjang tali yang dipotong harus berkisar antara 4 hingga 6 kali lipat dari panjang hasil karya akhir yang diinginkan?',
    options: [
      { id: 'A', text: 'Karena setiap ikatan dan lilitan simpul menghabiskan banyak panjang tali selama proses pengerjaan' },
      { id: 'B', text: 'Agar berat karya makrame menjadi semakin berat dan sulit tertiup angin' },
      { id: 'C', text: 'Karena tali makrame akan menyusut sendiri jika terkena udara ruangan' },
      { id: 'D', text: 'Agar sisa tali yang dibuang ke tempat sampah semakin banyak' },
    ],
    correctAnswer: 'A',
    explanation:
      'Proses menyimpul (knotting) memakan banyak panjang tali karena setiap kali tali dilipat, dililitkan, dan ditarik menjadi simpul, panjang tali akan terserap masuk ke dalam ikatan simpul. Jika memotong tali terlalu pas dengan panjang karya jadi, tali akan habis sebelum pola simpul selesai dibuat.',
  },
  {
    id: 9,
    type: 'pg',
    topic: 'Finishing Tali Kur Sintetis',
    difficulty: 'Sedang',
    text: 'Edo memilih menggunakan bahan tali kur (filamen poliester/sintetis) untuk membuat gelang simpul. Setelah menggunting sisa tali pada tahap penyelesaian akhir (finishing), langkah apa yang harus dilakukan Edo agar ujung potongan tali tidak berserabut dan terurai?',
    options: [
      { id: 'A', text: 'Membakar sedikit ujung tali secara hati-hati dengan api korek/pemantik hingga seratnya meleleh dan merekat padat' },
      { id: 'B', text: 'Merendam tali kur ke dalam air es selama beberapa jam' },
      { id: 'C', text: 'Menyisir ujung tali kur dengan sisir rambut kawat hingga mengembang' },
      { id: 'D', text: 'Memukul ujung tali menggunakan palu besi hingga pipih' },
    ],
    correctAnswer: 'A',
    explanation:
      'Tali kur terbuat dari bahan sintetis (poliester/nilon). Sifat khas bahan sintetis adalah dapat meleleh bila terkena panas. Oleh karena itu, ujung potongan tali kur dirapikan dengan cara dipanaskan/dibakar sedikit dengan pemantik api secara hati-hati agar seratnya mengunci dan tidak terurai.',
  },
  {
    id: 10,
    type: 'pg',
    topic: 'Fungsi Terapan Karya Makrame',
    difficulty: 'Mudah',
    text: 'Selain memiliki nilai keindahan (estetis), karya seni makrame juga memiliki fungsi pakai (karya seni rupa terapan). Contoh karya makrame sederhana yang memiliki fungsi pakai dalam kehidupan sehari-hari di rumah adalah...',
    options: [
      { id: 'A', text: 'Gantungan pot tanaman (plant hanger) dan tempat botol minum gantung' },
      { id: 'B', text: 'Patung pahlawan dari batu pualam monumen' },
      { id: 'C', text: 'Lukisan pemandangan cat minyak di atas kanvas' },
      { id: 'D', text: 'Genteng tanah liat untuk atap rumah' },
    ],
    correctAnswer: 'A',
    explanation:
      'Gantungan pot tanaman (plant hanger), sarung botol minum, tas belanja tali kur, dan gantungan kunci merupakan contoh karya seni makrame terapan (applied art) yang memiliki fungsi praktis digunakan dalam kehidupan sehari-hari.',
  },

  // =========================================================================
  // BAGIAN II: PILIHAN GANDA KOMPLEKS (5 BUTIR SOAL: NO. 11 - 15)
  // Setiap butir bernilai skor 1 (Pilihan jawaban lebih dari satu / multi-select)
  // =========================================================================
  {
    id: 11,
    type: 'pgk',
    topic: 'Bahan Alami Pembuatan Makrame',
    difficulty: 'Sedang',
    text: 'Pilihlah DUA atau LEBIH bahan tali di bawah ini yang berasal dari serat alami dan cocok digunakan dalam pembuatan kerajinan makrame ramah lingkungan!',
    options: [
      { id: 'A', text: 'Tali katun (berasal dari serat kapas alami)' },
      { id: 'B', text: 'Tali rami / serat goni (jute rope)' },
      { id: 'C', text: 'Tali plastik rafia sintetis' },
      { id: 'D', text: 'Tali serat kulit pohon waru atau serat abaka (pisang manila)' },
      { id: 'E', text: 'Tali senar pancing plastik (monofilamen)' },
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation:
      'Bahan tali dari serat alami mencakup tali katun (kapas), tali rami/goni (jute), dan serat nabati seperti kulit pohon waru atau abaka. Sebaliknya, tali rafia dan senar pancing merupakan bahan plastik sintetis.',
  },
  {
    id: 12,
    type: 'pgk',
    topic: 'Peralatan Kerja Esensial Makrame',
    difficulty: 'Sedang',
    text: 'Dalam membuat karya makrame hiasan daun rumbai, peralatan manakah yang SANGAT PENTING disiapkan di meja kerja? (Pilih semua yang benar)',
    options: [
      { id: 'A', text: 'Gunting kain tajam (untuk memotong tali dan meratakan rumbai)' },
      { id: 'B', text: 'Meteran atau penggaris panjang (untuk mengukur panjang tali)' },
      { id: 'C', text: 'Sisir rapat atau sisir kawat (untuk mengurai serat katun menjadi rumbai mekar)' },
      { id: 'D', text: 'Papan penjepit / selotip / peniti (untuk menahan pangkal tali)' },
      { id: 'E', text: 'Mesin jahit listrik otomatis' },
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation:
      'Alat-alat esensial pembuatan makrame meliputi gunting kain, meteran/penggaris, sisir rumbai, dan alat penahan pangkal (papan penjepit/peniti/selotip). Mesin jahit tidak diperlukan dalam pembuatan karya simpul makrame.',
  },
  {
    id: 13,
    type: 'pgk',
    topic: 'Kriteria Kualitas Karya Makrame yang Baik',
    difficulty: 'Sedang',
    text: 'Guru seni rupa menilai hasil karya makrame siswa. Indikator apa sajakah yang menunjukkan bahwa sebuah karya makrame dibuat dengan baik dan berkualitas? (Pilih semua yang benar)',
    options: [
      { id: 'A', text: 'Ketegangan tarikan simpul seragam dan konsisten dari awal hingga akhir' },
      { id: 'B', text: 'Bentuk anyaman simetris, seimbang, dan rapi' },
      { id: 'C', text: 'Ikatan simpul terkunci kuat sehingga tidak mudah terlepas saat diangkat' },
      { id: 'D', text: 'Potongan rumbai bagian bawah terpotong rata dan bersih' },
      { id: 'E', text: 'Tali dibiarkan kusut dan terdapat sambungan tali yang tidak rapi' },
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation:
      'Kualitas karya seni makrame dinilai dari konsistensi ketegangan tarikan simpul, kesimetrisan bentuk, kekuatan ikatan, dan kerapian penyelesaian akhir (rumbai terpotong rapi).',
  },
  {
    id: 14,
    type: 'pgk',
    topic: 'Tahap Persiapan Sebelum Menyimpul',
    difficulty: 'Sedang',
    text: 'Sebelum tangan mulai membuat pola simpul pada makrame, langkah-langkah persiapan apa sajakah yang wajib dilakukan terlebih dahulu? (Pilih semua yang benar)',
    options: [
      { id: 'A', text: 'Menentukan desain atau jenis benda yang ingin dibuat (sketsa ide)' },
      { id: 'B', text: 'Mengukur dan memotong untaian tali dengan memperhitungkan panjang cadangan' },
      { id: 'C', text: 'Memasang tali awal pada batang kayu dowel menggunakan Simpul Kepala' },
      { id: 'D', text: 'Langsung menggunting habis rumbai sebelum simpul selesai' },
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation:
      'Tahap persiapan kerja makrame mencakup penentuan desain karya, pengukuran dan pemotongan tali dengan rasio perhitungan yang tepat, serta pemasangan tali pada penyangga (dowel/ring) dengan simpul kepala. Menggunting rumbai dilakukan di tahap akhir (finishing), bukan di awal.',
  },
  {
    id: 15,
    type: 'pgk',
    topic: 'Produk Karya Makrame Siswa',
    difficulty: 'Mudah',
    text: 'Manakah di antara produk-produk kerajinan di bawah ini yang dapat dibuat dengan teknik seni makrame sederhana oleh siswa kelas VI? (Pilih semua yang benar)',
    options: [
      { id: 'A', text: 'Gantungan kunci rumbai motif daun' },
      { id: 'B', text: 'Gantungan pot tanaman gantung (plant hanger)' },
      { id: 'C', text: 'Gelang tangan persahabatan dari tali kur' },
      { id: 'D', text: 'Hiasan dinding (wall hanging) estetik sederhana' },
      { id: 'E', text: 'Cangkir keramik porselen tahan panas' },
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation:
      'Gantungan kunci motif daun, gantungan pot (plant hanger), gelang persahabatan, dan wall hanging adalah produk kriya makrame yang sangat cocok untuk siswa sekolah dasar. Cangkir keramik dibuat dengan teknik kriya keramik (tanah liat dibakar), bukan makrame.',
  },

  // =========================================================================
  // BAGIAN III: PGK KATEGORI / PERNYATAAN BENAR-SALAH (5 BUTIR: NO. 16 - 20)
  // Setiap butir bernilai skor 1 (Semua pernyataan dalam butir dinilai)
  // =========================================================================
  {
    id: 16,
    type: 'pgk_kategori',
    topic: 'Konsep dan Prinsip Makrame',
    difficulty: 'Sedang',
    categoryType: 'benar_salah',
    text: 'Tentukan apakah setiap pernyataan mengenai konsep seni makrame berikut bernilai BENAR atau SALAH!',
    statements: [
      {
        id: 's1',
        text: 'Seni makrame membutuhkan mesin tenun modern bertenaga listrik untuk menghasilkan simpul yang kuat.',
        correctAnswer: false,
      },
      {
        id: 's2',
        text: 'Makrame murni mengandalkan keterampilan dan ketangkasan tangan manusia dalam membuat ikatan dan simpul tali.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Keindahan karya makrame ditentukan oleh perpaduan variasi pola simpul, tekstur tali, serta kerapian tarikan simpul.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Seni makrame tidak menggunakan mesin tenun atau jarum, melainkan sepenuhnya mengandalkan teknik ketangkasan tangan dalam mengikat dan menyimpul tali.',
  },
  {
    id: 17,
    type: 'pgk_kategori',
    topic: 'Alat dan Bahan Makrame',
    difficulty: 'Sedang',
    categoryType: 'benar_salah',
    text: 'Tentukan apakah setiap pernyataan mengenai bahan dan alat makrame berikut bernilai BENAR atau SALAH!',
    statements: [
      {
        id: 's1',
        text: 'Batang kayu silinder bulat (dowel) atau ranting kayu dapat difungsikan sebagai media penyangga pangkal simpul makrame.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Tali kur sintetis sangat mudah disisir dengan sisir rambut biasa untuk menghasilkan efek rumbai mekar seperti bulu halus.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Sisir berigi rapat atau sisir kawat digunakan untuk mengurai pilinan benang katun agar membentuk rumbai daun yang cantik.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Tali kur berserat nilon licin dan padat sehingga tidak bisa disisir menjadi rumbai halus (tali katunlah yang bisa disisir). Kayu dowel dan sisir rumbai adalah alat dan bahan yang benar.',
  },
  {
    id: 18,
    type: 'pgk_kategori',
    topic: 'Teknik-Teknik Simpul Dasar',
    difficulty: 'Sedang',
    categoryType: 'benar_salah',
    text: 'Tentukan apakah setiap pernyataan mengenai teknik simpul dasar berikut bernilai BENAR atau SALAH!',
    statements: [
      {
        id: 's1',
        text: 'Simpul Kepala (Lark\'s head knot) merupakan simpul awal yang berfungsi mengaitkan tali pada media penyangga.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Pola anyaman spiral terbentuk apabila simpul pipih tunggal dibuat secara bergantian ke kiri lalu ke kanan.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Simpul Pipih Ganda (Square knot) standar umumnya menggunakan 4 helai tali (2 tali inti di tengah dan 2 tali pengerja di sisi luar).',
        correctAnswer: true,
      },
    ],
    explanation:
      'Pola spiral terjadi jika simpul dibuat searah terus menerus (bukan bergantian). Jika bergantian kiri-kanan, yang terbentuk adalah simpul pipih ganda (Square Knot) yang datar.',
  },
  {
    id: 19,
    type: 'pgk_kategori',
    topic: 'Langkah Kerja dan Ketelitian',
    difficulty: 'Sedang',
    categoryType: 'benar_salah',
    text: 'Tentukan apakah setiap pernyataan seputar langkah kerja pembuatan makrame berikut bernilai BENAR atau SALAH!',
    statements: [
      {
        id: 's1',
        text: 'Saat memotong bahan tali, panjang tali cukup dipotong sama persis dengan panjang gantungan kunci yang diinginkan tanpa perlu dilebihkan.',
        correctAnswer: false,
      },
      {
        id: 's2',
        text: 'Tarikan simpul yang terlalu kencang di satu sisi dan terlalu kendur di sisi lain akan menyebabkan bentuk karya makrame menjadi miring dan tidak rapi.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Tahap finishing (penyelesaian akhir) meliputi perataan panjang rumbai menggunakan gunting tajam dan pengecekan kekencangan simpul.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Panjang tali wajib dilebihkan sekitar 4 hingga 6 kali lipat karena simpul memakan panjang tali. Konsistensi tarikan tali sangat penting agar karya simetris, dan perataan rumbai adalah bagian dari finishing.',
  },
  {
    id: 20,
    type: 'pgk_kategori',
    topic: 'Nilai Estetika dan Sikap Berkarya',
    difficulty: 'Mudah',
    categoryType: 'benar_salah',
    text: 'Tentukan apakah setiap pernyataan mengenai nilai seni dan sikap berkarya makrame berikut bernilai BENAR atau SALAH!',
    statements: [
      {
        id: 's1',
        text: 'Ketelitian, kesabaran, dan konsistensi tangan saat menyimpul sangat menentukan keindahan karya makrame.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Karya makrame hanya dapat dipajang di dinding museum dan sama sekali tidak bisa dimanfaatkan sebagai benda pakai sehari-hari.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Penambahan manik-manik kayu (wooden beads) pada untaian tali dapat memperkaya nilai estetika dan keunikan karya makrame.',
        correctAnswer: true,
      },
    ],
    explanation:
      'Karya makrame sangat banyak berfungsi sebagai benda pakai (seperti plant hanger, tempat botol, sabuk, tas, gantungan kunci). Manik-manik kayu dan sikap teliti merupakan aspek penting dalam berkarya.',
  },

  // =========================================================================
  // BAGIAN IV: MENJODOHKAN (5 BUTIR SOAL: NO. 21 - 25)
  // Setiap butir bernilai skor 1 (Menjodohkan 4 pasangan premis & match)
  // =========================================================================
  {
    id: 21,
    type: 'menjodohkan',
    topic: 'Macam Simpul dan Karakteristiknya',
    difficulty: 'Sedang',
    text: 'Pasangkanlah jenis simpul makrame di kolom kiri dengan fungsi atau bentuk hasil anyamannya yang tepat di kolom kanan!',
    matchingPairs: [
      {
        id: 'm1',
        premise: 'Simpul Kepala (Lark\'s Head Knot)',
        match: 'Mengaitkan dan memasang untaian tali pertama kali pada kayu dowel/ring',
      },
      {
        id: 'm2',
        premise: 'Simpul Spiral (Half Square Knot searah)',
        match: 'Menghasilkan bentuk anyaman tali berpilin melingkar seperti tangga putar',
      },
      {
        id: 'm3',
        premise: 'Simpul Pipih Ganda (Square Knot)',
        match: 'Menghasilkan simpul datar yang kokoh mengunci tali inti di kedua sisi',
      },
      {
        id: 'm4',
        premise: 'Simpul Pembungkus (Gathering Knot)',
        match: 'Mengikat dan merangkum bundel kumpulan banyak tali di pangkal bawah',
      },
    ],
    explanation:
      'Simpul kepala mengaitkan tali pada penyangga, simpul spiral menghasilkan pilinan, simpul pipih ganda menghasilkan anyaman datar, dan simpul pembungkus (gathering knot) mengikat seluruh berkas tali di bawah gantungan pot.',
  },
  {
    id: 22,
    type: 'menjodohkan',
    topic: 'Karakteristik Jenis Bahan Tali',
    difficulty: 'Sedang',
    text: 'Pasangkanlah jenis bahan tali di kolom kiri dengan sifat dan karakteristik fisiknya di kolom kanan!',
    matchingPairs: [
      {
        id: 'm1',
        premise: 'Tali Katun (Cotton Rope)',
        match: 'Bertekstur lembut dari serat kapas alami dan serabutnya mudah disisir mekar',
      },
      {
        id: 'm2',
        premise: 'Tali Kur (Poliester/Nilon)',
        match: 'Serat sintetis kuat dan licin yang ujungnya dirapikan dengan cara dipanaskan api',
      },
      {
        id: 'm3',
        premise: 'Tali Rami / Goni (Jute Rope)',
        match: 'Serat nabati kasar berwarna cokelat alami yang memberikan kesan klasik pedesaan (rustic)',
      },
      {
        id: 'm4',
        premise: 'Tali Karet Elastis',
        match: 'Sifatnya lentur memanjang dan kurang cocok untuk simpul makrame berstruktur tetap',
      },
    ],
    explanation:
      'Setiap jenis tali memiliki sifat khusus: tali katun lembut dan bisa disisir rumbai, tali kur sintetis kuat dan dilelehkan api, tali rami kasar rustic, dan tali karet lentur elastis.',
  },
  {
    id: 23,
    type: 'menjodohkan',
    topic: 'Peralatan Makrame dan Fungsinya',
    difficulty: 'Mudah',
    text: 'Pasangkanlah peralatan kerja makrame di kolom kiri dengan peran kerjanya yang tepat di kolom kanan!',
    matchingPairs: [
      {
        id: 'm1',
        premise: 'Gunting Kain Tajam',
        match: 'Memotong untaian tali dan merapikan sisa rumbai bagian bawah secara presisi',
      },
      {
        id: 'm2',
        premise: 'Meteran / Pita Ukur',
        match: 'Menghitung dan memastikan panjang potongan tali sesuai rencana desain',
      },
      {
        id: 'm3',
        premise: 'Papan Penjepit (Clipboard) & Peniti',
        match: 'Menahan pangkal anyaman agar tali tidak bergeser selama proses penyimpulan',
      },
      {
        id: 'm4',
        premise: 'Sisir Kawat / Sisir Rapat',
        match: 'Mengurai pilinan benang katun agar mekar menyerupai bulu halus atau daun',
      },
    ],
    explanation:
      'Gunting untuk memotong/merapikan rumbai, meteran untuk mengukur panjang tali, papan penjepit untuk menstabilkan posisi, dan sisir untuk menyisir serat rumbai.',
  },
  {
    id: 24,
    type: 'menjodohkan',
    topic: 'Tahapan Alur Kerja Pembuatan Makrame',
    difficulty: 'Sedang',
    text: 'Pasangkanlah tahapan alur kerja pembuatan makrame di kolom kiri dengan kegiatan yang dilakukan di kolom kanan!',
    matchingPairs: [
      {
        id: 'm1',
        premise: 'Tahap 1: Perencanaan & Persiapan',
        match: 'Membuat sketsa model karya, mengukur, dan memotong bahan tali cadangan',
      },
      {
        id: 'm2',
        premise: 'Tahap 2: Pemasangan Awal',
        match: 'Memasang tali pada tongkat dowel atau ring dengan Simpul Kepala',
      },
      {
        id: 'm3',
        premise: 'Tahap 3: Pembentukan Motif',
        match: 'Menyimpul tali pengerja dengan variasi simpul pipih atau simpul spiral secara teratur',
      },
      {
        id: 'm4',
        premise: 'Tahap 4: Finishing (Penyelesaian)',
        match: 'Mengunci simpul akhir, memotong rata rumbai bawah, dan merapikan serat',
      },
    ],
    explanation:
      'Alur kerja pembuatan karya makrame terbagi menjadi 4 tahap berurutan: perencanaan/pengukuran bahan, pemasangan awal (simpul kepala), pembentukan pola anyaman, dan tahap finishing.',
  },
  {
    id: 25,
    type: 'menjodohkan',
    topic: 'Produk Makrame dan Fungsinya',
    difficulty: 'Mudah',
    text: 'Pasangkanlah jenis produk makrame di kolom kiri dengan kegunaan praktisnya di kolom kanan!',
    matchingPairs: [
      {
        id: 'm1',
        premise: 'Gantungan Pot (Plant Hanger)',
        match: 'Menopang pot bunga tanaman hias secara menggantung di dinding atau teras',
      },
      {
        id: 'm2',
        premise: 'Gelang Tangan Simpul',
        match: 'Aksesoris perhiasan tangan bertema etnik atau persahabatan',
      },
      {
        id: 'm3',
        premise: 'Hiasan Dinding (Wall Hanging)',
        match: 'Elemen dekorasi interior untuk mempercantik ruangan rumah atau kelas',
      },
      {
        id: 'm4',
        premise: 'Sarung Botol Minum Makrame',
        match: 'Wadah pelindung botol air minum yang dilengkapi tali sandang untuk dibawa',
      },
    ],
    explanation:
      'Gantungan pot berfungsi menopang tanaman, gelang sebagai aksesoris diri, wall hanging sebagai dekorasi ruangan, dan sarung botol sebagai wadah praktis membawa botol minum.',
  },

  // =========================================================================
  // BAGIAN V: ISIAN SINGKAT (5 BUTIR SOAL: NO. 26 - 30)
  // Setiap butir bernilai skor 1 (Siswa mengetik jawaban singkat)
  // =========================================================================
  {
    id: 26,
    type: 'isian',
    topic: 'Etimologi Istilah Makrame',
    difficulty: 'Mudah',
    text: 'Secara etimologi, istilah "makrame" berakar dari bahasa Arab "miqramah" atau "migramah" yang memiliki arti dasar hiasan...',
    correctAnswer: 'rumbai',
    acceptedAnswers: ['rumbai', 'rumbai-rumbai', 'hiasan rumbai', 'renda', 'rumbai rumbai'],
    explanation:
      'Kata "makrame" berasal dari kata bahasa Arab "miqramah" atau "migramah" yang berarti hiasan rumbai-rumbai atau renda tepi kain.',
  },
  {
    id: 27,
    type: 'isian',
    topic: 'Simpul Awal Makrame',
    difficulty: 'Mudah',
    text: 'Simpul dasar yang dibuat pertama kali untuk memasang dan mengaitkan untaian tali pada tongkat kayu penyangga (dowel) atau ring cincin disebut simpul...',
    correctAnswer: 'kepala',
    acceptedAnswers: [
      'kepala',
      'simpul kepala',
      'lark\'s head',
      'larks head',
      'lark\'s head knot',
      'larks head knot',
      'simpul lark\'s head',
    ],
    explanation:
      'Simpul dasar untuk mengaitkan tali pada kayu penyangga dinamakan Simpul Kepala (Lark\'s Head Knot).',
  },
  {
    id: 28,
    type: 'isian',
    topic: 'Bahan Tali Katun Alami',
    difficulty: 'Mudah',
    text: 'Jenis tali berbahan serat kapas alami yang bertekstur lembut dan serat ujungnya sangat mudah disisir menjadi rumbai halus menyerupai daun atau bulu adalah tali...',
    correctAnswer: 'katun',
    acceptedAnswers: ['katun', 'tali katun', 'cotton', 'cotton rope', 'benang katun'],
    explanation:
      'Tali katun (cotton rope) berasal dari serat kapas alami dan menjadi bahan utama pembuatan rumbai makrame yang dapat disisir halus.',
  },
  {
    id: 29,
    type: 'isian',
    topic: 'Bentuk Anyaman Simpul Tunggal Berulang',
    difficulty: 'Sedang',
    text: 'Jika simpul pipih tunggal dibuat secara terus menerus ke satu arah yang sama (misalnya ke arah kiri terus), anyaman tali akan berputar membentuk pola...',
    correctAnswer: 'spiral',
    acceptedAnswers: ['spiral', 'pilin', 'pilinan', 'berpilin', 'ulir', 'pola spiral'],
    explanation:
      'Menyimpul ke satu arah secara konsisten akan menghasilkan pola anyaman berpilin melingkar yang dinamakan spiral (Spiral Knot).',
  },
  {
    id: 30,
    type: 'isian',
    topic: 'Alat Penyangga Kayu',
    difficulty: 'Mudah',
    text: 'Batang silinder kayu bulat yang umum digunakan sebagai media penyangga untuk menggantungkan pangkal tali makrame dinding disebut kayu...',
    correctAnswer: 'dowel',
    acceptedAnswers: ['dowel', 'kayu dowel', 'stik dowel', 'dowel kayu', 'stik kayu', 'ranting'],
    explanation:
      'Batang kayu silinder bulat penyangga makrame dikenal dengan sebutan kayu dowel (wooden dowel stick).',
  },

  // =========================================================================
  // BAGIAN VI: URAIAN TERSTRUKTUR (5 BUTIR SOAL: NO. 31 - 35)
  // Setiap butir bernilai skor 2 (Total skor Uraian = 10)
  // =========================================================================
  {
    id: 31,
    type: 'uraian',
    topic: 'Pengertian dan Keunikan Seni Makrame',
    difficulty: 'Sedang',
    maxScore: 2,
    text: 'Jelaskan pengertian seni makrame dengan kalimatmu sendiri! Mengapa seni makrame dikelompokkan ke dalam seni kriya tekstil yang unik jika dibandingkan dengan seni menenun atau merajut?',
    keyPoints: [
      'Makrame adalah seni kriya kerajinan tangan menyimpul untaian tali/benang menjadi benda hias atau pakai.',
      'Keunikan makrame: Tidak menggunakan jarum rajut (hakpen/breien) maupun alat tenun, melainkan murni mengandalkan ketangkasan dan keterampilan jari tangan.',
      'Keindahan makrame bertumpu pada variasi pola ikatan simpul dan tekstur tali.',
    ],
    rubric:
      'Skor 2: Menjelaskan pengertian seni makrame dengan tepat dan menguraikan keunikannya (tanpa jarum/alat tenun, murni simpul tangan). Skor 1: Hanya menyebutkan salah satu aspek (hanya pengertian atau hanya keunikan). Skor 0: Jawaban tidak relevan.',
    explanation:
      'Seni makrame adalah seni kriya menyimpul tali menjadi karya hiasan atau fungsional. Keunikannya terletak pada teknik pembuatannya yang murni mengandalkan keterampilan jari tangan tanpa bantuan jarum rajut (hakpen) maupun alat tenun tradisional/modern.',
  },
  {
    id: 32,
    type: 'uraian',
    topic: 'Perbedaan Tali Katun dan Tali Kur',
    difficulty: 'Sedang',
    maxScore: 2,
    text: 'Sebutkan dan jelaskan 2 (dua) perbedaan mendasar antara bahan tali katun (cotton rope) dengan tali kur (filamen poliester/sintetis) dalam pembuatan karya makrame!',
    keyPoints: [
      'Asal serat dan tekstur: Tali katun berasal dari serat kapas alami yang bertekstur lembut, tidak licin, dan menyerap air; sedangkan tali kur berasal dari serat sintetis nilon/poliester yang licin, kaku, dan tahan air.',
      'Penyelesaian akhir (finishing) ujung tali: Ujung tali katun dapat diurai dan disisir menjadi rumbai halus (motif bulu/daun); sedangkan ujung tali kur tidak bisa disisir dan harus dipanaskan/dibakar dengan api pemantik agar tidak terurai.',
    ],
    rubric:
      'Skor 2: Menyebutkan dan menjelaskan 2 perbedaan secara tepat (misal: asal bahan/tekstur dan cara merapikan ujung tali). Skor 1: Hanya menjelaskan 1 perbedaan dengan benar. Skor 0: Jawaban salah atau tidak menjawab.',
    explanation:
      'Dua perbedaan pokok: 1) Tali katun berbahan alami kapas yang lembut dan tidak licin, sedangkan tali kur sintetis nilon yang licin dan kuat. 2) Ujung tali katun dapat disisir membentuk rumbai mekar halus, sedangkan ujung tali kur dirapikan dengan cara dibakar sedikit agar serat plastiknya meleleh dan mengunci.',
  },
  {
    id: 33,
    type: 'uraian',
    topic: 'Langkah Membuat Simpul Kepala dan Simpul Pipih',
    difficulty: 'Sukar',
    maxScore: 2,
    text: 'Deskripsikan langkah-langkah dalam membuat:\na) Simpul Kepala (Lark\'s Head Knot) pada kayu penyangga\nb) Simpul Pipih Ganda (Square Knot) menggunakan 4 helai tali!',
    keyPoints: [
      'a) Simpul Kepala: Lipat tali menjadi 2 sama panjang, letakkan lekukan tali di belakang/depan kayu dowel, masukkan kedua ujung tali ke dalam lubang lekukan tali, lalu tarik kencang ke bawah hingga mengikat kayu.',
      'b) Simpul Pipih Ganda: Gunakan 4 tali (2 di tengah sebagai inti/poros, 2 di samping sebagai pengerja). Silangkan tali kiri ke atas tali inti, bawa tali kanan ke belakang dan masukkan ke celah kiri lalu tarik kencang. Lakukan gerakan kebalikannya (mulai dari kanan) untuk mengunci simpul menjadi pipih datar.',
    ],
    rubric:
      'Skor 2: Menguraikan kedua teknik simpul (Simpul Kepala dan Simpul Pipih Ganda) dengan runtut dan benar. Skor 1: Hanya menguraikan salah satu simpul dengan benar. Skor 0: Jawaban tidak tepat.',
    explanation:
      'Simpul Kepala dibuat dengan melipat tali menjadi dua lalu memasukkan ujungnya ke dalam lengkungan di atas kayu dowel. Simpul Pipih Ganda dibuat dengan 4 tali: menyilangkan tali kiri mengelilingi tali tengah lalu dikunci dengan gerakan menyilang tali kanan dari arah sebaliknya.',
  },
  {
    id: 34,
    type: 'uraian',
    topic: 'Analisis Perhitungan Panjang Tali',
    difficulty: 'Sukar',
    maxScore: 2,
    text: 'Mengapa dalam merencanakan karya seni makrame kita harus memotong tali jauh lebih panjang (sekitar 4 hingga 6 kali lipat) dibandingkan ukuran jadi karya yang diinginkan? Apa akibatnya jika seorang siswa memotong tali dengan ukuran yang pas-pasan?',
    keyPoints: [
      'Alasan: Setiap lilitan dan ikatan simpul menyerap dan memakan banyak panjang tali selama proses pembentukan motif.',
      'Akibat tali pas-pasan: Tali akan habis di tengah pengerjaan sebelum pola selesai, karya menjadi menggantung tidak tuntas, dan menyambung tali makrame di tengah pola sangat sulit serta merusak estetika dan kekuatan karya.',
    ],
    rubric:
      'Skor 2: Menjelaskan alasan konsumsi panjang tali oleh simpul dan menyebutkan dampak negatifnya (tali habis sebelum selesai/karya gagal/sulit disambung). Skor 1: Hanya menjelaskan alasan atau hanya dampak. Skor 0: Jawaban tidak tepat.',
    explanation:
      'Menyimpul memakan panjang tali secara drastis karena tali saling melilit dan bertumpuk. Jika memotong terlalu pas, bahan tali akan habis sebelum karya tuntas, sehingga karya menjadi gagal dan sulit disambung tanpa terlihat cacat sambungannya.',
  },
  {
    id: 35,
    type: 'uraian',
    topic: 'Tahapan Pembuatan Karya Makrame Sederhana',
    difficulty: 'Sukar',
    maxScore: 2,
    text: 'Uraikan 4 (empat) tahapan utama secara berurutan dalam membuat karya seni makrame sederhana (misalnya gantungan pot atau hiasan dinding motif daun) mulai dari awal hingga siap dipajang!',
    keyPoints: [
      '1. Tahap Perencanaan & Persiapan Bahan: Membuat sketsa desain, menyiapkan alat (gunting, meteran, dowel), serta mengukur dan memotong tali dengan panjang cadangan.',
      '2. Tahap Pemasangan Tali Awal: Mengaitkan tali-tali yang sudah dipotong pada kayu dowel atau ring gantungan menggunakan Simpul Kepala (Lark\'s head knot).',
      '3. Tahap Pembentukan Motif Anyaman: Menyimpul tali secara konsisten dan simetris menggunakan kombinasi simpul dasar (seperti Square Knot, spiral, atau simpul jangkar) sesuai pola yang direncanakan.',
      '4. Tahap Finishing (Penyelesaian Akhir): Mengunci ikatan akhir (simpul pembungkus/gathering knot), memotong rata rumbai bawah dengan gunting tajam, menyisir rumbai (jika tali katun), serta mengecek kekuatan dan kerapian produk.',
    ],
    rubric:
      'Skor 2: Menyebutkan dan menguraikan ke-4 tahapan secara runtut (perencanaan, pemasangan awal, penyimpulan motif, finishing). Skor 1: Menyebutkan 2-3 tahapan dengan benar. Skor 0: Hanya 1 tahapan atau jawaban keliru.',
    explanation:
      'Empat tahapan utama: 1) Perencanaan dan penyiapan bahan, 2) Pemasangan tali awal dengan Simpul Kepala, 3) Proses penyimpulan motif anyaman secara konsisten, dan 4) Finishing (meratakan rumbai dan merapikan hasil karya).',
  },
];
