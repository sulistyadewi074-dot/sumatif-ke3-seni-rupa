import React from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { enrichQuestion } from '../data/kisiKisiData';
import {
  X,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Clock,
  BookOpen,
  Brain,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface DetailAnalisisSiswaModalProps {
  result: ExamResult | null;
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
}

export const DetailAnalisisSiswaModal: React.FC<DetailAnalisisSiswaModalProps> = ({
  result,
  questions,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !result) return null;

  const isTuntas = (result.nilai ?? 0) >= CONFIG.KKTP;

  // Evaluasi skor per butir soal untuk siswa ini
  const itemScores = result.itemScores || {};
  const enrichedQuestions = questions.map(enrichQuestion);

  // Kategorisasi butir soal siswa: Benar Penuh, Sebagian, Salah
  const benarPenuhList: Question[] = [];
  const sebagianList: { question: Question; score: number }[] = [];
  const salahList: Question[] = [];

  enrichedQuestions.forEach((q) => {
    const maxScore = q.bobotSkor || (q.type === 'uraian' ? 2 : 1);
    const score = itemScores[q.id] !== undefined ? itemScores[q.id] : 0;

    if (score >= maxScore) {
      benarPenuhList.push(q);
    } else if (score > 0) {
      sebagianList.push({ question: q, score });
    } else {
      salahList.push(q);
    }
  });

  // Analisis kelemahan per Tujuan Pembelajaran (TP)
  const tpLosses: Record<string, { tp: string; missedQuestions: number[]; topic: string }> = {};

  [...salahList, ...sebagianList.map((s) => s.question)].forEach((q) => {
    const tpText = q.tp || 'Penguasaan Konsep IPAS';
    if (!tpLosses[tpText]) {
      tpLosses[tpText] = {
        tp: tpText,
        missedQuestions: [],
        topic: q.topic,
      };
    }
    if (!tpLosses[tpText].missedQuestions.includes(q.id)) {
      tpLosses[tpText].missedQuestions.push(q.id);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {result.nama}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Absen: {result.noAbsen}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelas {CONFIG.KELAS} • Tes Sumatif {CONFIG.MATA_PELAJARAN} (KKTP: {CONFIG.KKTP})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="overflow-y-auto py-5 space-y-6 pr-1 text-xs sm:text-sm">
          {/* Ringkasan Skor & Kelulusan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Nilai Akhir
              </span>
              <span
                className={`text-3xl font-black block mt-1 ${
                  isTuntas ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {result.nilai}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Skala 0-100</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Skor
              </span>
              <span className="text-2xl font-black text-slate-800 block mt-1">
                {result.totalSkor || (result.nilai * 0.4).toFixed(1)} / 40
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Poin Maksimal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Status Ketercapaian
              </span>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isTuntas
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isTuntas ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {isTuntas ? 'Tuntas' : 'Remedial'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">KKTP: {CONFIG.KKTP}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Durasi Kerja
              </span>
              <div className="mt-2 flex items-center justify-center gap-1 font-bold text-slate-700 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{result.durasiPengerjaan || '60 Menit'}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Alokasi: 90 Mnt</span>
            </div>
          </div>

          {/* Rekap Visual: Benar Penuh, Sebagian, dan Salah */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Distribusi Respon 35 Butir Soal</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
                  <span>Benar (Skor Penuh)</span>
                  <span className="text-base">{benarPenuhList.length} Soal</span>
                </div>
                <p className="text-[11px] text-emerald-700 break-words">
                  Nomor: {benarPenuhList.map((q) => q.id).join(', ') || '-'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
                  <span>Benar Sebagian</span>
                  <span className="text-base">{sebagianList.length} Soal</span>
                </div>
                <p className="text-[11px] text-amber-700 break-words">
                  Nomor:{' '}
                  {sebagianList.map((s) => `${s.question.id} (${s.score}p)`).join(', ') || '-'}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex items-center justify-between text-rose-900 font-bold mb-1">
                  <span>Salah (Skor 0)</span>
                  <span className="text-base">{salahList.length} Soal</span>
                </div>
                <p className="text-[11px] text-rose-700 break-words">
                  Nomor: {salahList.map((q) => q.id).join(', ') || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* 1. ANALISIS KELEMAHAN INDIKATOR / TOPIK MATERI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 text-rose-800">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>Analisis Diagnostik Kelemahan Indikator &amp; Topik yang Belum Dikuasai</span>
            </h4>

            {Object.keys(tpLosses).length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="font-semibold text-xs">
                  Luar biasa! Siswa telah menguasai seluruh indikator dan Capaian Pembelajaran pada materi ini dengan sempurna.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {Object.values(tpLosses).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="text-rose-950 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        {item.tp}
                      </span>
                      <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[10px]">
                        Soal No: {item.missedQuestions.join(', ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Siswa belum mencapai skor maksimal pada soal yang menguji indikator terkait <strong>{item.topic}</strong>. Perlu bimbingan pada pemahaman konsep dan penalaran kasus tersebut.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. REKOMENDASI TINDAK LANJUT / REMEDIAL SPESIFIK */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Rekomendasi Tindak Lanjut &amp; Rencana Remedial / Pengayaan</span>
            </h4>

            {!isTuntas ? (
              <div className="space-y-2 text-xs text-blue-950 leading-relaxed">
                <p className="font-bold text-amber-900 bg-amber-100/80 p-2.5 rounded-lg border border-amber-200">
                  Status Remedial: Nilai siswa ({result.nilai}) belum mencapai standar KKTP ({CONFIG.KKTP}).
                </p>
                <div className="space-y-1.5 pl-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">1.</span>
                    <p>
                      <strong>Bimbingan Konseptual Terfokus:</strong> Berikan penguatan materi pada indikator yang keliru (fokus pada {Object.values(tpLosses).map((t) => t.topic).slice(0, 2).join(' dan ')}).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">2.</span>
                    <p>
                      <strong>Media Visual &amp; Bagan Alur:</strong> Manfaatkan diagram peta alur sistem Tanam Paksa dan peta perjuangan pahlawan untuk memudahkan pemahaman spasial dan kronologis siswa.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">3.</span>
                    <p>
                      <strong>Tes Remedial Bertahap:</strong> Berikan tes remedial pada butir soal nomor: {salahList.map((q) => q.id).slice(0, 5).join(', ')} hingga mencapai batas KKTP 60.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-blue-950 leading-relaxed">
                <p className="font-bold text-emerald-900 bg-emerald-100/80 p-2.5 rounded-lg border border-emerald-200">
                  Status Tuntas: Siswa telah melampaui kriteria ketuntasan ({result.nilai} ≥ {CONFIG.KKTP}).
                </p>
                <div className="space-y-1.5 pl-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">1.</span>
                    <p>
                      <strong>Program Pengayaan (Enrichment):</strong> Siswa diberikan tugas studi literasi komparatif mengenai peran pahlawan daerah dalam mendorong persatuan menuju proklamasi 1945.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">2.</span>
                    <p>
                      <strong>Tutor Sebaya:</strong> Berdayakan siswa sebagai tutor sebaya dalam kelompok belajar untuk mendampingi rekan yang sedang menjalani sesi remedial.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup Analisis
          </button>
        </div>
      </div>
    </div>
  );
};
