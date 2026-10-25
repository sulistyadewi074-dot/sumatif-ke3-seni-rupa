import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { downloadStudentResultPDF, downloadExamQuestionsPDF } from '../utils/pdfGenerator';
import { downloadExamDocx } from '../utils/docxGenerator';
import {
  Award,
  CheckCircle2,
  XCircle,
  Download,
  RotateCcw,
  School,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Eye,
  BookOpen,
  FileText,
  Layers,
  Sparkles,
  AlignLeft,
} from 'lucide-react';

interface Stage3ResultProps {
  result: ExamResult;
  questions: Question[];
  allowReview: boolean;
  onRestart: () => void;
}

export const Stage3Result: React.FC<Stage3ResultProps> = ({
  result,
  questions,
  allowReview,
  onRestart,
}) => {
  const isPassed = result.status === 'Lulus' || result.nilai >= CONFIG.KKTP;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback jika confetti terhalang
      }
    }
  }, [isPassed]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Kartu Utama Hasil Tes */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 text-center relative overflow-hidden">
        {/* Latar Aksen Atas */}
        <div
          className={`absolute top-0 left-0 right-0 h-3 ${
            isPassed ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />

        {/* Badge Kelulusan */}
        <div className="inline-flex items-center justify-center mb-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md ${
              isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 mb-2 border border-blue-200">
          <School className="w-3.5 h-3.5 text-blue-600" />
          {CONFIG.SEKOLAH}
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Laporan Hasil Tes Sumatif
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Mata Pelajaran: <span className="font-semibold text-slate-700">{CONFIG.MATA_PELAJARAN}</span> (Materi: {CONFIG.MATERI_SHORT}) • Kelas {CONFIG.KELAS}
        </p>

        {/* Kotak Nilai Utama */}
        <div className="my-8 max-w-sm mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Nilai Akhir Ujian (Skala 0-100)
          </p>
          <div
            className={`text-5xl sm:text-6xl font-black my-2 ${
              isPassed ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {result.nilai}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide mt-1">
            {isPassed ? (
              <span className="bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                LULUS (Mencapai KKTP)
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <AlertTriangle className="w-4 h-4" />
                BELUM LULUS (Perlu Remedial)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): <span className="font-bold text-slate-700">{CONFIG.KKTP}</span>
          </p>
        </div>

        {/* Rincian Identitas Siswa & Statistik Jawaban */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Nama Siswa</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block">
              {result.nama}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Nomor Absen</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block">
              {result.noAbsen}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] text-emerald-700 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Jawaban Benar
            </span>
            <span className="font-extrabold text-emerald-800 text-base sm:text-lg block">
              {result.benar} Soal
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] text-rose-700 block flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Jawaban Salah/Kurang
            </span>
            <span className="font-extrabold text-rose-800 text-base sm:text-lg block">
              {result.salah} Soal
            </span>
          </div>
        </div>

        {/* Rincian Skor per Bagian Soal jika ada */}
        {result.breakdownScore && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Rincian Perolehan Skor Berdasarkan Jenis Soal (35 Butir)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">1. Pilihan Ganda</span>
                <span className="font-bold text-slate-900">{result.breakdownScore.pg.score} / {result.breakdownScore.pg.max} Poin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">2. PG Kompleks</span>
                <span className="font-bold text-slate-900">{result.breakdownScore.pgk.score} / {result.breakdownScore.pgk.max} Poin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">3. PGK Kategori</span>
                <span className="font-bold text-slate-900">{result.breakdownScore.kategori.score.toFixed(1)} / {result.breakdownScore.kategori.max} Poin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">4. Menjodohkan</span>
                <span className="font-bold text-slate-900">{result.breakdownScore.menjodohkan.score.toFixed(1)} / {result.breakdownScore.menjodohkan.max} Poin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">5. Isian Singkat</span>
                <span className="font-bold text-slate-900">{result.breakdownScore.isian.score} / {result.breakdownScore.isian.max} Poin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">6. Uraian / Essay</span>
                <span className="font-bold text-slate-900">{result.breakdownScore.uraian.score.toFixed(1)} / {result.breakdownScore.uraian.max} Poin</span>
              </div>
            </div>
          </div>
        )}

        {/* Informasi Penyimpanan & Rekap */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs max-w-2xl mx-auto mb-8 text-left flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-950">
              Data hasil ujian telah tersimpan dan terekam ke panel guru serta Google Spreadsheet sekolah.
            </p>
            <p className="mt-0.5 text-blue-800 text-[11px] leading-relaxed">
              Anda dapat mengunduh lembar hasil tes resmi dalam bentuk file PDF atau Naskah Lengkap Soal dalam format .docx (Word). Dokumen memuat tanda tangan Guru ({CONFIG.GURU}) dan Orang Tua/Wali Murid.
            </p>
          </div>
        </div>

        {/* Tombol Aksi: Download Word .docx, PDF & Mulai Tes Baru */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => downloadExamDocx(questions)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Naskah Soal (.docx)</span>
          </button>

          <button
            type="button"
            onClick={() => downloadStudentResultPDF(result)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh Lembar Hasil (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Tes Siswa Lain</span>
          </button>
        </div>

        {/* Fitur Kunci Jawaban / Pembahasan (HANYA TAMPIL JIKA DIAKTIFKAN GURU) */}
        {allowReview && (
          <div className="mt-10 pt-8 border-t border-slate-200 text-left max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Pembahasan &amp; Kunci Jawaban Soal (35 Butir)</span>
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Fitur Pembahasan Diaktifkan Guru
              </span>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span className="text-blue-900">
                      Soal #{idx + 1} [{q.type.toUpperCase()}] ({q.difficulty})
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      {q.topic}
                    </span>
                  </div>

                  <p className="text-slate-800 whitespace-pre-line font-medium">{q.text}</p>

                  {/* Kunci Jawaban Sesuai Tipe */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                    <span className="font-bold block mb-1">Kunci Jawaban Benar:</span>
                    {q.type === 'pg' && (
                      <p>Opsi {q.correctAnswer}: {q.options?.find((o) => o.id === q.correctAnswer)?.text}</p>
                    )}
                    {q.type === 'pgk' && (
                      <p>Opsi Benar: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</p>
                    )}
                    {q.type === 'pgk_kategori' && (
                      <div className="space-y-0.5 text-[11px]">
                        {(q.statements || []).map((st, sIdx) => (
                          <div key={st.id}>
                            {sIdx + 1}. {st.text} : <span className="font-bold text-emerald-800">{st.correctAnswer ? (st.trueLabel || 'Benar') : (st.falseLabel || 'Salah')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'menjodohkan' && (
                      <div className="space-y-0.5 text-[11px]">
                        {(q.matchingPairs || []).map((p, pIdx) => (
                          <div key={p.id}>
                            {pIdx + 1}. {p.premise} ➔ <span className="font-bold text-emerald-800">{p.match}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'isian' && (
                      <p>Kunci: {Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers.join(' / ') : q.correctAnswer}</p>
                    )}
                    {q.type === 'uraian' && (
                      <div className="space-y-1 text-[11px]">
                        <p className="font-bold text-slate-800">Poin Kunci Jawaban:</p>
                        {(q.keyPoints || []).map((kp, kpIdx) => (
                          <p key={kpIdx}>• {kp}</p>
                        ))}
                        {q.rubric && <p className="italic text-slate-600 mt-1">Rubrik: {q.rubric}</p>}
                      </div>
                    )}
                  </div>

                  {/* Pembahasan Konseptual */}
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-0.5">Penjelasan / Pembahasan:</span>
                    <p className="whitespace-pre-line">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
