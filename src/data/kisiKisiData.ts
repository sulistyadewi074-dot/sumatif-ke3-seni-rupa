import { Question, LevelKognitif, Difficulty, QuestionType } from '../types';

export interface KisiKisiItem {
  id: number;
  elemen: string;
  cp: string;
  tp: string;
  indikator: string;
  levelKognitif: LevelKognitif;
  bobotSkor: number;
}

const ELEMEN_DEFAULT = 'Mengalami, Menciptakan, Berpikir dan Bekerja Artistik (Seni Rupa Fase C)';

const CP_DEFAULT =
  'Peserta didik mampu memahami konsep dan prinsip seni kriya tekstil simpul makrame sederhana, mengidentifikasi dan memilih aneka alat dan bahan yang sesuai karakteristik karya (tali katun, tali kur, tali rami, kayu dowel, gunting, sisir, papan penjepit), mengaplikasikan langkah-langkah kerja terstruktur (mengukur rasio tali, memasang simpul kepala/Lark\'s head knot, membuat variasi simpul mati/square knot, simpul tunggal/spiral, dan simpul pembungkus), serta menghasilkan karya finishing yang memiliki nilai fungsi terapan maupun nilai estetika secara rapi dan mandiri.';

const TP_1 =
  'Menjelaskan pengertian seni makrame, asal-usul istilah, karakteristik kerajinan simpul tanpa alat tenun/jarum, serta membedakan fungsi estetis dan fungsi pakai karya makrame.';
const TP_2 =
  'Mengidentifikasi, membedakan karakteristik, dan memilih aneka alat dan bahan (tali katun, tali kur, tali rami, kayu dowel, ring, gunting, sisir, perekat/penjepit) yang aman dan tepat.';
const TP_3 =
  'Menganalisis, mengurutkan, dan mendemonstrasikan langkah-langkah pembuatan karya seni makrame sederhana (perhitungan panjang tali, simpul kepala, variasi anyaman simpul, hingga teknik finishing).';

export const KISI_KISI_MAP: Record<number, KisiKisiItem> = {
  // --- BAGIAN I: PILIHAN GANDA (10 BUTIR: NO. 1 - 10) ---
  1: {
    id: 1,
    elemen: 'Mengalami (Experiencing)',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan pernyataan mengenai teknik pembuatan kerajinan tangan tekstil, peserta didik dapat mengidentifikasi pengertian seni makrame sebagai seni kriya menyimpul tali tanpa jarum rajut atau mesin tenun.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  2: {
    id: 2,
    elemen: 'Mengalami & Berpikir Artistik',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan infografis sejarah dan asal-usul kata, peserta didik dapat menentukan asal bahasa dan makna istilah "makrame" (dari bahasa Arab "miqramah" yang berarti hiasan rumbai/renda tepi).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  3: {
    id: 3,
    elemen: 'Mengalami (Experiencing)',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan karakteristik bahan serat kapas alami yang lembut dan mudah disisir menjadi rumbai bulu/daun, peserta didik dapat menentukan jenis bahan tali yang dimaksud (tali katun / cotton rope).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  4: {
    id: 4,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan situasi pembuatan karya makrame di atas meja kerja, peserta didik dapat menentukan fungsi alat papan penjepit (clipboard) atau bantalan busa berjarum pentul untuk menjaga stabilitas tegangan tali saat disimpul.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  5: {
    id: 5,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan gambar bagan simpul awal, peserta didik dapat mengidentifikasi nama simpul yang digunakan untuk mengaitkan tali pada stik kayu/ring gantungan (Simpul Kepala / Lark\'s Head Knot).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  6: {
    id: 6,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan deskripsi teknik penyimpulan satu arah yang dilakukan berulang-ulang, peserta didik dapat menentukan jenis simpul yang menghasilkan anyaman tali berpilin melingkar (Simpul Tunggal / Simpul Spiral / Half Square Knot).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  7: {
    id: 7,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan cara menyilangkan tali pengerja sisi kiri dan kanan secara bergantian mengelilingi tali pengisi tengah, peserta didik dapat menentukan nama simpul datar tersebut (Simpul Pipih Ganda / Square Knot).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  8: {
    id: 8,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan kasus perencanaan ukuran tali makrame, peserta didik dapat menganalisis alasan rasio pemotongan panjang tali harus 4 hingga 6 kali lipat dari panjang produk akhir.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  9: {
    id: 9,
    elemen: 'Menciptakan & Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan permasalahan ujung serat sintetis tali kur yang mudah terurai dan berserabut, peserta didik dapat menentukan teknik penyelesaian akhir yang aman dan tepat (membakar sedikit ujung tali dengan api pemantik).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  10: {
    id: 10,
    elemen: 'Merefleksikan & Berdampak',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan berbagai contoh benda kerajinan, peserta didik dapat mengidentifikasi karya seni makrame yang memiliki fungsi pakai terapan dalam kehidupan sehari-hari (gantungan pot / plant hanger dan tempat botol minum).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },

  // --- BAGIAN II: PILIHAN GANDA KOMPLEKS (5 BUTIR: NO. 11 - 15) ---
  11: {
    id: 11,
    elemen: 'Mengalami & Berpikir Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan daftar aneka jenis bahan tali, peserta didik dapat memilih lebih dari satu jenis bahan tali yang berasal dari serat alami untuk kerajinan makrame.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  12: {
    id: 12,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan daftar peralatan kerja, peserta didik dapat menentukan beberapa alat esensial yang diperlukan untuk memotong, mengukur, dan merapikan rumbai pada pembuatan makrame.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  13: {
    id: 13,
    elemen: 'Merefleksikan (Reflecting)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan kriteria penilaian kriya tekstil, peserta didik dapat memilih beberapa indikator yang menunjukkan kualitas dan kerapian hasil karya makrame yang baik.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  14: {
    id: 14,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan prosedur kerja pembuatan makrame, peserta didik dapat mengidentifikasi tahapan persiapan awal sebelum proses penyimpulan pola dimulai.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  15: {
    id: 15,
    elemen: 'Merefleksikan & Berdampak',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan berbagai produk kriya, peserta didik dapat memilih produk-produk kerajinan makrame sederhana yang cocok dibuat untuk melatih ketangkasan siswa sekolah dasar.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },

  // --- BAGIAN III: PGK KATEGORI / BENAR-SALAH (5 BUTIR: NO. 16 - 20) ---
  16: {
    id: 16,
    elemen: 'Mengalami (Experiencing)',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan 3 butir pernyataan seputar pengertian dasar, prinsip tanpa alat tenun, dan nilai estetis karya seni makrame, peserta didik dapat memvalidasi kebenaran masing-masing pernyataan (Benar/Salah).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  17: {
    id: 17,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan 3 butir pernyataan tentang karakteristik bahan (tali kur vs katun), fungsi stik dowel, dan fungsi sisir rumbai, peserta didik dapat menentukan status kebenaran setiap pernyataan (Benar/Salah).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  18: {
    id: 18,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan 3 butir pernyataan seputar mekanisme simpul kepala, pembentukan simpul spiral, dan struktur simpul pipih ganda, peserta didik dapat menganalisis kebenaran pernyataan (Benar/Salah).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  19: {
    id: 19,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan 3 butir pernyataan terkait perhitungan panjang tali, konsistensi tarikan simpul, dan perataan rumbai akhir, peserta didik dapat memvalidasi kebenaran prinsip kerja tersebut (Benar/Salah).',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  20: {
    id: 20,
    elemen: 'Merefleksikan & Berdampak',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan 3 butir pernyataan mengenai sikap ketelitian dalam menyimpul, fleksibilitas fungsi pakai, dan penambahan aksesoris manik-manik, peserta didik dapat mengevaluasi kebenarannya (Benar/Salah).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },

  // --- BAGIAN IV: MENJODOHKAN (5 BUTIR: NO. 21 - 25) ---
  21: {
    id: 21,
    elemen: 'Menciptakan & Mengalami',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan 4 jenis simpul dasar makrame (Simpul Kepala, Simpul Spiral, Simpul Pipih Ganda, Simpul Pembungkus/Gathering), peserta didik dapat memasangkannya secara tepat dengan bentuk hasil atau fungsi utamanya.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  22: {
    id: 22,
    elemen: 'Mengalami & Berpikir Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan 4 jenis bahan tali (Tali Katun, Tali Kur, Tali Rami/Goni, Tali Nilon), peserta didik dapat mencocokkannya dengan karakteristik fisik dan sifat bahan yang bersesuaian.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  23: {
    id: 23,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan 4 alat pendukung pembuatan makrame (Gunting tajam, Meteran kain, Papan penjepit/peniti, Sisir rumbai rapat), peserta didik dapat menjodohkannya dengan fungsi operasionalnya.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  24: {
    id: 24,
    elemen: 'Menciptakan & Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan 4 tahapan alur kerja pembuatan makrame (Persiapan bahan, Pemasangan tali awal, Pembentukan motif simpul, Penyelesaian/finishing), peserta didik dapat memasangkannya dengan aktivitas kerja yang tepat.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  25: {
    id: 25,
    elemen: 'Merefleksikan & Berdampak',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan 4 ragam bentuk karya makrame (Gantungan pot, Gelang simpul, Hiasan dinding/wall hanging, Sarung botol minum), peserta didik dapat mencocokkannya dengan nilai guna dan fungsinya.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },

  // --- BAGIAN V: ISIAN SINGKAT (5 BUTIR: NO. 26 - 30) ---
  26: {
    id: 26,
    elemen: 'Mengalami (Experiencing)',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Disajikan kalimat mengenai etimologi kata "makrame" dari bahasa Arab miqramah, peserta didik dapat melengkapi arti istilah tersebut secara tepat (rumbai / rumbai-rumbai).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  27: {
    id: 27,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan kalimat tentang simpul pembuka untuk mengaitkan tali pada stik penyangga, peserta didik dapat menyebutkan nama simpul tersebut (simpul kepala / Lark\'s head knot).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  28: {
    id: 28,
    elemen: 'Mengalami & Berpikir Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan ciri bahan tali serat alami yang lembut dan serabut ujungnya mudah disisir menjadi rumbai daun estetis, peserta didik dapat menuliskan nama jenis tali tersebut (tali katun / cotton rope).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  29: {
    id: 29,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Disajikan kalimat efek dari pembuatan simpul pipih tunggal yang dilakukan terus menerus secara searah, peserta didik dapat menyebutkan bentuk pilinan yang terbentuk (spiral / ulir).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  30: {
    id: 30,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Disajikan deskripsi batang silinder kayu bulat untuk menggantungkan pangkal anyaman makrame dinding, peserta didik dapat menuliskan istilah kayu penyangga tersebut (kayu dowel / stik kayu).',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },

  // --- BAGIAN VI: URAIAN TERSTRUKTUR (5 BUTIR: NO. 31 - 35) ---
  31: {
    id: 31,
    elemen: 'Mengalami & Berpikir Artistik',
    cp: CP_DEFAULT,
    tp: TP_1,
    indikator:
      'Peserta didik dapat menguraikan pengertian seni makrame dengan bahasa sendiri serta menjelaskan keunikannya dibandingkan dengan seni merajut dan menenun.',
    levelKognitif: 'L2',
    bobotSkor: 2,
  },
  32: {
    id: 32,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_2,
    indikator:
      'Peserta didik dapat menguraikan 2 perbedaan pokok antara bahan tali katun alami dan tali kur sintetis ditinjau dari karakteristik tekstur serta teknik penyelesaian ujung talinya.',
    levelKognitif: 'L2',
    bobotSkor: 2,
  },
  33: {
    id: 33,
    elemen: 'Menciptakan (Making/Creating)',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Peserta didik dapat menguraikan secara sistematis urutan langkah membuat Simpul Kepala (Lark\'s head knot) pada kayu penyangga dan Simpul Pipih Ganda (Square knot).',
    levelKognitif: 'L3',
    bobotSkor: 2,
  },
  34: {
    id: 34,
    elemen: 'Berpikir dan Bekerja Artistik',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Peserta didik dapat menganalisis alasan keharusan memperhitungkan panjang tali cadangan 4-6 kali lipat dari panjang produk akhir serta dampak bila pemotongan tali terlalu pendek.',
    levelKognitif: 'L3',
    bobotSkor: 2,
  },
  35: {
    id: 35,
    elemen: 'Menciptakan & Merefleksikan',
    cp: CP_DEFAULT,
    tp: TP_3,
    indikator:
      'Peserta didik dapat menguraikan 4 tahapan utama dalam proses pembuatan karya seni makrame sederhana (misalnya gantungan pot atau hiasan dinding rumbai) mulai dari perencanaan hingga penyelesaian akhir.',
    levelKognitif: 'L3',
    bobotSkor: 2,
  },
};

/**
 * Memperkaya objek Question dengan data kisi-kisi resmi
 */
export function enrichQuestion(question: Question): Question {
  const item = KISI_KISI_MAP[question.id];
  if (!item) {
    return {
      ...question,
      elemen: question.elemen || ELEMEN_DEFAULT,
      cp: question.cp || CP_DEFAULT,
      tp: question.tp || TP_1,
      indikator: question.indikator || `Indikator butir soal nomor ${question.id}`,
      levelKognitif: question.levelKognitif || 'L2',
      bobotSkor: question.bobotSkor || (question.type === 'uraian' ? 2 : 1),
    };
  }

  return {
    ...question,
    elemen: question.elemen || item.elemen,
    cp: question.cp || item.cp,
    tp: question.tp || item.tp,
    indikator: question.indikator || item.indikator,
    levelKognitif: question.levelKognitif || item.levelKognitif,
    bobotSkor: question.bobotSkor || item.bobotSkor,
  };
}

export interface KisiKisiSummaryStats {
  totalSoal: number;
  totalSkor: number;
  elemenCounts: Record<string, number>;
  levelCounts: {
    L1: { count: number; percent: number; label: string };
    L2: { count: number; percent: number; label: string };
    L3: { count: number; percent: number; label: string };
  };
  difficultyCounts: {
    Mudah: { count: number; percent: number };
    Sedang: { count: number; percent: number };
    Sukar: { count: number; percent: number };
  };
  typeCounts: Record<QuestionType, number>;
}

/**
 * Menghitung rekapitulasi statistik kisi-kisi secara otomatis
 */
export function calculateKisiKisiStats(questions: Question[]): KisiKisiSummaryStats {
  const total = questions.length || 1;
  let totalScore = 0;

  const elemenCounts: Record<string, number> = {};
  const levelRaw = { L1: 0, L2: 0, L3: 0 };
  const diffRaw = { Mudah: 0, Sedang: 0, Sukar: 0 };
  const typeCounts: Record<QuestionType, number> = {
    pg: 0,
    pgk: 0,
    pgk_kategori: 0,
    menjodohkan: 0,
    isian: 0,
    uraian: 0,
  };

  questions.forEach((q) => {
    const enriched = enrichQuestion(q);
    const score = enriched.bobotSkor || (q.type === 'uraian' ? 2 : 1);
    totalScore += score;

    const el = enriched.elemen || ELEMEN_DEFAULT;
    elemenCounts[el] = (elemenCounts[el] || 0) + 1;

    const lvl =
      enriched.levelKognitif ||
      (enriched.difficulty === 'Mudah' ? 'L1' : enriched.difficulty === 'Sedang' ? 'L2' : 'L3');
    if (lvl in levelRaw) {
      levelRaw[lvl as keyof typeof levelRaw] += 1;
    }

    const diff = enriched.difficulty || 'Sedang';
    if (diff in diffRaw) {
      diffRaw[diff as keyof typeof diffRaw] += 1;
    }

    if (q.type in typeCounts) {
      typeCounts[q.type as keyof typeof typeCounts] += 1;
    }
  });

  return {
    totalSoal: questions.length,
    totalSkor: totalScore,
    elemenCounts,
    levelCounts: {
      L1: {
        count: levelRaw.L1,
        percent: Math.round((levelRaw.L1 / total) * 100),
        label: 'L1 - Mengingat & Memahami (Pemahaman Konsep)',
      },
      L2: {
        count: levelRaw.L2,
        percent: Math.round((levelRaw.L2 / total) * 100),
        label: 'L2 - Mengaplikasikan & Menganalisis (Penerapan Kriya)',
      },
      L3: {
        count: levelRaw.L3,
        percent: Math.round((levelRaw.L3 / total) * 100),
        label: 'L3 - Menalar & Mencipta HOTS (Kreativitas & Evaluasi)',
      },
    },
    difficultyCounts: {
      Mudah: { count: diffRaw.Mudah, percent: Math.round((diffRaw.Mudah / total) * 100) },
      Sedang: { count: diffRaw.Sedang, percent: Math.round((diffRaw.Sedang / total) * 100) },
      Sukar: { count: diffRaw.Sukar, percent: Math.round((diffRaw.Sukar / total) * 100) },
    },
    typeCounts,
  };
}
