/**
 * Definisi Type & Interface Aplikasi Tes Sumatif
 * SD NEGERI 3 LOLOAN TIMUR - KELAS VI - SENI RUPA
 * Materi: Membuat Karya Seni Makrame Sederhana (Pengertian Makrame, Alat dan Bahan, dan Langkah-Langkah Membuat Makrame)
 */

export type QuestionType = 'pg' | 'pgk' | 'pgk_kategori' | 'menjodohkan' | 'isian' | 'uraian';
export type Difficulty = 'Mudah' | 'Sedang' | 'Sukar';
export type LevelKognitif = 'L1' | 'L2' | 'L3'; // L1: Pemahaman, L2: Aplikasi, L3: Penalaran

export interface StudentBirthDate {
  hari?: string;
  bulan?: string;
  tahun?: string;
}

export interface StudentIdentity {
  nama: string;
  noAbsen: string;
  tglLahir?: StudentBirthDate;
}

export interface OptionItem {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface StatementItem {
  id: string; // e.g. 's1', 's2', 's3'
  text: string;
  correctAnswer: boolean; // true or false
  trueLabel?: string; // e.g. 'Benar', 'Setuju', 'Sesuai'
  falseLabel?: string; // e.g. 'Salah', 'Tidak Setuju', 'Tidak Sesuai'
}

export interface MatchingPair {
  id: string; // e.g. 'm1', 'm2', 'm3'
  premise: string; // Pertanyaan / Tokoh / Peristiwa (Kolom Kiri)
  match: string; // Pasangan Jawaban Benar (Kolom Kanan)
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  imageSvg?: string; // SVG visual untuk diagram/peta/bagan alur sejarah
  options?: OptionItem[]; // Untuk 'pg' (4 opsi) dan 'pgk'
  statements?: StatementItem[]; // Untuk 'pgk_kategori'
  matchingPairs?: MatchingPair[]; // Untuk 'menjodohkan'
  correctAnswer?: string | string[]; // string untuk 'pg', array untuk 'pgk', string untuk 'isian'
  acceptedAnswers?: string[]; // Untuk 'isian'
  categoryType?: 'benar_salah' | 'setuju_tidak' | 'sesuai_tidak'; // Untuk 'pgk_kategori'
  difficulty: Difficulty;
  explanation: string;
  topic: string;
  // Metadata Kisi-Kisi Kurikulum Merdeka
  elemen?: string; // e.g. "Pemahaman IPAS (Sejarah & Sosial)"
  cp?: string; // Capaian Pembelajaran
  tp?: string; // Tujuan Pembelajaran
  indikator?: string; // Indikator Soal
  levelKognitif?: LevelKognitif; // L1 / L2 / L3
  bobotSkor?: number; // Nilai skor maksimal butir (1 atau 2)
  // Untuk 'uraian'
  keyPoints?: string[]; // Poin-poin kunci jawaban
  rubric?: string; // Pedoman penskoran (skor maks & kriteria)
  maxScore?: number; // Nilai bobot skor butir
}

export interface ShuffledQuestion extends Question {
  originalQuestionId: number;
  shuffledOptions?: OptionItem[];
  shuffledMatchChoices?: string[]; // Pilihan kolom kanan yang diacak untuk 'menjodohkan'
}

export type AnswerValue = 
  | string 
  | string[] 
  | Record<string, boolean> 
  | Record<string, string>;

export interface ExamResult {
  id?: string;
  timestamp: string;
  nama: string;
  noAbsen: string;
  kelas: string;
  tglLahir?: string;
  benar: number;
  salah: number;
  nilai: number;
  totalSkor?: number;
  status: 'Lulus' | 'Belum Lulus' | 'Tuntas' | 'Remedial';
  durasiPengerjaan?: string;
  detailJawaban?: Record<number, AnswerValue>;
  itemScores?: Record<number, number>; // Skor yang diperoleh per butir soal (id soal -> skor)
  breakdownScore?: {
    pg: { score: number; max: number };
    pgk: { score: number; max: number };
    kategori: { score: number; max: number };
    menjodohkan: { score: number; max: number };
    isian: { score: number; max: number };
    uraian: { score: number; max: number };
  };
}

export type AppStage = 1 | 2 | 3 | 4;
