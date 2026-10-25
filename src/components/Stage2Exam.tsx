import React, { useState, useEffect, useMemo } from 'react';
import { CONFIG } from '../config';
import {
  Question,
  ShuffledQuestion,
  StudentIdentity,
  AnswerValue,
  ExamResult,
  OptionItem,
} from '../types';
import { gasService } from '../services/gasService';
import { downloadExamQuestionsPDF } from '../utils/pdfGenerator';
import { downloadExamDocx } from '../utils/docxGenerator';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Check,
  Edit3,
  Timer,
  Clock,
  FileText,
  Bookmark,
  Layers,
  Sparkles,
  AlignLeft,
} from 'lucide-react';

interface Stage2ExamProps {
  student: StudentIdentity;
  questions: Question[];
  onFinishExam: (result: ExamResult) => void;
}

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Stage2Exam: React.FC<Stage2ExamProps> = ({
  student,
  questions,
  onFinishExam,
}) => {
  // 1. Acak urutan butir soal dan opsi jawaban saat tes dimulai
  const shuffledQuestions = useMemo<ShuffledQuestion[]>(() => {
    // Kita pertahankan urutan nomor asli jika ingin terstruktur per jenis soal atau acak
    // Untuk menjaga urutan resmi Bagian I - VI, kita urutkan berdasarkan ID
    return questions.map((q: Question) => {
      if (q.type === 'pg' || q.type === 'pgk') {
        if (q.options && q.options.length > 0) {
          const shuffledOpts: OptionItem[] = shuffleArray<OptionItem>(q.options);
          const standardLabels = ['A', 'B', 'C', 'D', 'E'];
          const remappedOptions: OptionItem[] = shuffledOpts.map((opt, idx) => ({
            id: standardLabels[idx] || opt.id,
            text: opt.text,
          }));

          return {
            ...q,
            originalQuestionId: q.id,
            shuffledOptions: remappedOptions,
          };
        }
      }
      if (q.type === 'menjodohkan' && q.matchingPairs) {
        // Acak pilihan pasangan di kolom kanan
        const matches = q.matchingPairs.map((p) => p.match);
        return {
          ...q,
          originalQuestionId: q.id,
          shuffledMatchChoices: shuffleArray<string>(matches),
        };
      }
      return {
        ...q,
        originalQuestionId: q.id,
      };
    });
  }, [questions]);

  // State navigasi & pengerjaan
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Timer 90 Menit
  const initialSeconds = (CONFIG.ALOKASI_WAKTU_MENIT || 90) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentQ = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;

  // Cek apakah butir soal tertentu sudah dijawab
  const isQuestionAnswered = (idx: number): boolean => {
    const ans = answers[idx];
    if (ans === undefined || ans === null) return false;

    const q = shuffledQuestions[idx];
    if (q.type === 'pg') {
      return typeof ans === 'string' && ans.trim().length > 0;
    }
    if (q.type === 'pgk') {
      return Array.isArray(ans) && ans.length > 0;
    }
    if (q.type === 'pgk_kategori') {
      if (typeof ans === 'object' && !Array.isArray(ans)) {
        const statements = q.statements || [];
        return statements.length > 0 && statements.every((st) => (ans as Record<string, boolean>)[st.id] !== undefined);
      }
      return false;
    }
    if (q.type === 'menjodohkan') {
      if (typeof ans === 'object' && !Array.isArray(ans)) {
        const pairs = q.matchingPairs || [];
        return pairs.length > 0 && pairs.every((p) => {
          const val = (ans as Record<string, string>)[p.id];
          return val !== undefined && val.trim().length > 0;
        });
      }
      return false;
    }
    if (q.type === 'isian') {
      return typeof ans === 'string' && ans.trim().length > 0;
    }
    if (q.type === 'uraian') {
      return typeof ans === 'string' && ans.trim().length >= 3;
    }
    return false;
  };

  // Cari daftar nomor soal yang belum dijawab (1-indexed)
  const unansweredQuestionNumbers = useMemo(() => {
    const missing: number[] = [];
    for (let i = 0; i < totalQuestions; i++) {
      if (!isQuestionAnswered(i)) {
        missing.push(i + 1);
      }
    }
    return missing;
  }, [answers, totalQuestions, shuffledQuestions]);

  const answeredCount = totalQuestions - unansweredQuestionNumbers.length;
  const allAnswered = answeredCount === totalQuestions;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Toggle tandai soal ragu-ragu
  const handleToggleMark = () => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  // Handlers untuk masing-masing tipe soal
  const handleSelectPG = (optionText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  const handleTogglePGK = (optionText: string) => {
    setAnswers((prev) => {
      const currentList = Array.isArray(prev[currentIndex]) ? (prev[currentIndex] as string[]) : [];
      if (currentList.includes(optionText)) {
        return {
          ...prev,
          [currentIndex]: currentList.filter((item) => item !== optionText),
        };
      } else {
        return {
          ...prev,
          [currentIndex]: [...currentList, optionText],
        };
      }
    });
  };

  const handleSetCategoryStatement = (statementId: string, value: boolean) => {
    setAnswers((prev) => {
      const currentMap =
        typeof prev[currentIndex] === 'object' && !Array.isArray(prev[currentIndex])
          ? { ...(prev[currentIndex] as Record<string, boolean>) }
          : {};
      currentMap[statementId] = value;
      return {
        ...prev,
        [currentIndex]: currentMap,
      };
    });
  };

  const handleSelectMatching = (pairId: string, matchChoice: string) => {
    setAnswers((prev) => {
      const currentMap =
        typeof prev[currentIndex] === 'object' && !Array.isArray(prev[currentIndex])
          ? { ...(prev[currentIndex] as Record<string, string>) }
          : {};
      currentMap[pairId] = matchChoice;
      return {
        ...prev,
        [currentIndex]: currentMap,
      };
    });
  };

  const handleInputChange = (textValue: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: textValue,
    }));
  };

  const handleEssayChange = (essayValue: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: essayValue,
    }));
  };

  // Navigasi
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  // Hitung Nilai & Rekapitulasi Berdasarkan 6 Bagian Soal
  const calculateResult = (): ExamResult => {
    let rawScore = 0;
    let benarCount = 0;
    let salahCount = 0;

    const breakdown = {
      pg: { score: 0, max: 10 },
      pgk: { score: 0, max: 5 },
      kategori: { score: 0, max: 5 },
      menjodohkan: { score: 0, max: 5 },
      isian: { score: 0, max: 5 },
      uraian: { score: 0, max: 10 },
    };

    const itemScoresMap: Record<number, number> = {};

    shuffledQuestions.forEach((sq, idx) => {
      const userAns = answers[idx];
      const origQ = questions.find((q) => q.id === sq.originalQuestionId) || sq;
      let qEarned = 0;

      if (sq.type === 'pg') {
        const correctOpt = origQ.options?.find((o) => o.id === origQ.correctAnswer);
        if (correctOpt && userAns === correctOpt.text) {
          qEarned = 1;
          rawScore += 1;
          benarCount += 1;
          breakdown.pg.score += 1;
        } else {
          salahCount += 1;
        }
      } else if (sq.type === 'pgk') {
        const correctKeys = Array.isArray(origQ.correctAnswer) ? origQ.correctAnswer : [];
        const correctTexts = (origQ.options || [])
          .filter((o) => correctKeys.includes(o.id))
          .map((o) => o.text);

        const userSelected = Array.isArray(userAns) ? userAns : [];
        const isMatch =
          correctTexts.length === userSelected.length &&
          correctTexts.every((txt) => userSelected.includes(txt));

        if (isMatch) {
          qEarned = 1;
          rawScore += 1;
          benarCount += 1;
          breakdown.pgk.score += 1;
        } else {
          // Partial credit jika ada yang benar
          const correctChosen = userSelected.filter((txt) => correctTexts.includes(txt)).length;
          const wrongChosen = userSelected.length - correctChosen;
          if (correctChosen > 0 && wrongChosen === 0) {
            qEarned = Number((correctChosen / correctTexts.length).toFixed(2));
            rawScore += qEarned;
          }
          salahCount += 1;
        }
      } else if (sq.type === 'pgk_kategori') {
        const statements = origQ.statements || [];
        const userMap = (typeof userAns === 'object' && !Array.isArray(userAns)
          ? userAns
          : {}) as Record<string, boolean>;

        let correctInQ = 0;
        statements.forEach((st) => {
          if (userMap[st.id] === st.correctAnswer) {
            correctInQ += 1;
          }
        });

        qEarned = statements.length > 0 ? Number((correctInQ / statements.length).toFixed(2)) : 0;
        rawScore += qEarned;
        breakdown.kategori.score += qEarned;
        if (correctInQ === statements.length) {
          benarCount += 1;
        } else {
          salahCount += 1;
        }
      } else if (sq.type === 'menjodohkan') {
        const pairs = origQ.matchingPairs || [];
        const userMap = (typeof userAns === 'object' && !Array.isArray(userAns)
          ? userAns
          : {}) as Record<string, string>;

        let matchCorrect = 0;
        pairs.forEach((p) => {
          if (userMap[p.id] === p.match) {
            matchCorrect += 1;
          }
        });

        qEarned = pairs.length > 0 ? Number((matchCorrect / pairs.length).toFixed(2)) : 0;
        rawScore += qEarned;
        breakdown.menjodohkan.score += qEarned;
        if (matchCorrect === pairs.length) {
          benarCount += 1;
        } else {
          salahCount += 1;
        }
      } else if (sq.type === 'isian') {
        const cleanUser = typeof userAns === 'string' ? userAns.trim().toLowerCase() : '';
        const accepted = (origQ.acceptedAnswers || [origQ.correctAnswer as string] || []).map((a) =>
          String(a).trim().toLowerCase()
        );

        if (cleanUser && accepted.includes(cleanUser)) {
          qEarned = 1;
          rawScore += 1;
          benarCount += 1;
          breakdown.isian.score += 1;
        } else {
          salahCount += 1;
        }
      } else if (sq.type === 'uraian') {
        const essayText = typeof userAns === 'string' ? userAns.trim() : '';
        let essayScore = 0;

        if (essayText.length >= 15) {
          let matchedKeywords = 0;
          const lowerText = essayText.toLowerCase();

          const defaultKeywords = [
            'makrame', 'simpul', 'tali', 'katun', 'kur', 'rami', 'serat', 'dowel', 'kayu',
            'kepala', 'lark', 'pipih', 'square', 'spiral', 'ganda', 'tunggal', 'finishing',
            'rumbai', 'sisir', 'gunting', 'meteran', 'anyaman', 'tekstur', 'kerajinan', 'kriya',
            'estetika', 'fungsi', 'terapan', 'pot', 'gantungan', 'hiasan', 'rapi', 'simetris',
            'panjang', 'cadangan', 'ikat', 'ikatan', 'bakar', 'potong', 'korek', 'pengerja', 'inti'
          ];
          const activeKeywords = [
            ...defaultKeywords,
            ...(origQ.keyPoints || []).map((kp) => kp.toLowerCase()),
          ];

          activeKeywords.forEach((kw) => {
            if (lowerText.includes(kw)) matchedKeywords += 1;
          });

          if (essayText.length >= 80 || matchedKeywords >= 3) {
            essayScore = 2;
          } else if (essayText.length >= 40 || matchedKeywords >= 1) {
            essayScore = 1.5;
          } else {
            essayScore = 1;
          }
          benarCount += 1;
        } else if (essayText.length > 0) {
          essayScore = 0.5;
          salahCount += 1;
        } else {
          essayScore = 0;
          salahCount += 1;
        }

        qEarned = essayScore;
        rawScore += essayScore;
        breakdown.uraian.score += essayScore;
      }

      itemScoresMap[origQ.id] = qEarned;
    });

    // Skala nilai akhir 0 - 100
    const maxRaw = 40;
    const finalScore = Math.min(100, Math.round((rawScore / maxRaw) * 100));
    const isLulus = finalScore >= CONFIG.KKTP;

    const elapsedSeconds = initialSeconds - secondsLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    return {
      timestamp: new Date().toISOString(),
      nama: student.nama,
      noAbsen: student.noAbsen,
      kelas: CONFIG.KELAS,
      benar: benarCount,
      salah: salahCount,
      totalSkor: Number(rawScore.toFixed(1)),
      nilai: finalScore,
      status: isLulus ? 'Tuntas' : 'Remedial',
      durasiPengerjaan: `${elapsedMinutes} Menit`,
      detailJawaban: answers,
      itemScores: itemScoresMap,
      breakdownScore: breakdown,
    };
  };

  // Submit Ujian
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = calculateResult();

    try {
      await gasService.submitExamResult(result);
    } catch (err: any) {
      console.warn('Google Apps Script sync offline fallback:', err);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      onFinishExam(result);
    }
  };

  // Tipe soal label & badge
  const getBadgeType = (type: string) => {
    switch (type) {
      case 'pg':
        return { label: 'Pilihan Ganda (PG)', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'pgk':
        return { label: 'Pilihan Ganda Kompleks (PGK)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'pgk_kategori':
        return { label: 'PGK Kategori', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'menjodohkan':
        return { label: 'Menjodohkan', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'isian':
        return { label: 'Isian Singkat', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'uraian':
        return { label: 'Uraian / Essay', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Soal', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const badge = getBadgeType(currentQ.type);
  const currentOptions = currentQ.shuffledOptions || currentQ.options || [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Bar Info Peserta, Waktu, dan Tombol Unduh */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Identitas Siswa */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{student.nama}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Absen: {student.noAbsen}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Kelas {CONFIG.KELAS} • {CONFIG.MATA_PELAJARAN} (KKTP: {CONFIG.KKTP})
            </span>
          </div>
        </div>

        {/* Countdown Timer 90 Menit */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            secondsLeft <= 600
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <Timer className="w-4 h-4 text-blue-600" />
          <span>Sisa Waktu: {formatTimer(secondsLeft)}</span>
        </div>

        {/* Tombol Unduh Naskah (.docx & PDF) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadExamDocx(questions)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            title="Unduh Naskah Soal Lengkap format Microsoft Word (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Naskah (.docx)</span>
          </button>
          <button
            type="button"
            onClick={() => downloadExamQuestionsPDF(questions)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            title="Unduh Naskah Soal format PDF"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Naskah (PDF)</span>
          </button>
        </div>
      </div>

      {/* Grid Utama Pengerjaan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Tampilan Soal Aktif */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {/* Header Soal */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900">
                Soal Nomor {currentIndex + 1} dari {totalQuestions}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}>
                {badge.label}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Tingkat: {currentQ.difficulty}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleMark}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                markedQuestions[currentIndex]
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{markedQuestions[currentIndex] ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
            </button>
          </div>

          {/* Topik & Instruksi Soal */}
          <div className="text-xs text-blue-700 font-semibold mb-2">
            Pokok Bahasan: {currentQ.topic}
          </div>

          <div className="text-xs text-slate-500 mb-4 italic">
            {currentQ.type === 'pg' && 'Pilihlah salah satu jawaban yang paling benar.'}
            {currentQ.type === 'pgk' && 'Pilihlah lebih dari satu pernyataan atau jawaban yang benar.'}
            {currentQ.type === 'pgk_kategori' && 'Tentukan respon pada setiap baris pernyataan.'}
            {currentQ.type === 'menjodohkan' && 'Pilihlah pasangan yang sesuai antara Kolom Kiri dan Kolom Kanan.'}
            {currentQ.type === 'isian' && 'Ketikkan jawaban singkat pada kolom isian di bawah ini.'}
            {currentQ.type === 'uraian' && 'Tuliskan jawaban penjelasan Anda secara lengkap dan jelas pada kotak yang disediakan.'}
          </div>

          {/* Teks Soal */}
          <div className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium whitespace-pre-line mb-4">
            {currentQ.text}
          </div>

          {/* Diagram / Peta / Ilustrasi SVG */}
          {currentQ.imageSvg && (
            <div className="mb-6 flex flex-col items-center justify-center p-4 bg-slate-50/90 border border-slate-200 rounded-2xl">
              <div
                className="flex items-center justify-center max-w-full overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: currentQ.imageSvg }}
              />
              <span className="text-[11px] text-slate-500 mt-2 font-medium">
                Diagram / Peta / Ilustrasi Sejarah
              </span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TIPE 1: PILIHAN GANDA (PG) */}
          {/* ======================================================== */}
          {currentQ.type === 'pg' && (
            <div className="space-y-2.5">
              {currentOptions.map((opt) => {
                const isSelected = answers[currentIndex] === opt.text;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPG(opt.text)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* TIPE 2: PILIHAN GANDA KOMPLEKS (PGK - MULTI SELECT) */}
          {/* ======================================================== */}
          {currentQ.type === 'pgk' && (
            <div className="space-y-2.5">
              {currentOptions.map((opt) => {
                const currentList = Array.isArray(answers[currentIndex])
                  ? (answers[currentIndex] as string[])
                  : [];
                const isChecked = currentList.includes(opt.text);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTogglePGK(opt.text)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isChecked ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isChecked ? <Check className="w-4 h-4" /> : opt.id}
                    </div>
                    <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* TIPE 3: PGK KATEGORI (BENAR/SALAH, SESUAI/TIDAK, SETUJU/TIDAK) */}
          {/* ======================================================== */}
          {currentQ.type === 'pgk_kategori' && (
            <div className="space-y-3">
              {(currentQ.statements || []).map((st, sIdx) => {
                const ansMap =
                  typeof answers[currentIndex] === 'object' && !Array.isArray(answers[currentIndex])
                    ? (answers[currentIndex] as Record<string, boolean>)
                    : {};
                const currentVal = ansMap[st.id];

                const trueLabel =
                  st.trueLabel ||
                  (currentQ.categoryType === 'setuju_tidak'
                    ? 'SETUJU'
                    : currentQ.categoryType === 'sesuai_tidak'
                    ? 'SESUAI'
                    : 'BENAR');
                const falseLabel =
                  st.falseLabel ||
                  (currentQ.categoryType === 'setuju_tidak'
                    ? 'TIDAK SETUJU'
                    : currentQ.categoryType === 'sesuai_tidak'
                    ? 'TIDAK SESUAI'
                    : 'SALAH');

                return (
                  <div
                    key={st.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                  >
                    <p className="text-xs sm:text-sm text-slate-800 font-medium mb-3 leading-relaxed">
                      <span className="font-bold text-blue-700 mr-1.5">{sIdx + 1}.</span>
                      {st.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSetCategoryStatement(st.id, true)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                          currentVal === true
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{trueLabel}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetCategoryStatement(st.id, false)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                          currentVal === false
                            ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{falseLabel}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* TIPE 4: MENJODOHKAN (MATCHING PAIRS) */}
          {/* ======================================================== */}
          {currentQ.type === 'menjodohkan' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Pasangkan setiap pernyataan di Kolom Kiri dengan pilihan jawaban yang paling tepat pada Kolom Kanan.
                </span>
              </div>

              {(currentQ.matchingPairs || []).map((pair, pIdx) => {
                const userPairMap =
                  typeof answers[currentIndex] === 'object' && !Array.isArray(answers[currentIndex])
                    ? (answers[currentIndex] as Record<string, string>)
                    : {};
                const selectedMatch = userPairMap[pair.id] || '';
                const availableChoices =
                  currentQ.shuffledMatchChoices ||
                  (currentQ.matchingPairs || []).map((p) => p.match);

                return (
                  <div
                    key={pair.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {pIdx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        {pair.premise}
                      </p>
                    </div>

                    <div className="pl-8">
                      <label className="text-[11px] font-bold text-purple-700 block mb-1">
                        Pilih Pasangan Jawaban:
                      </label>
                      <select
                        value={selectedMatch}
                        onChange={(e) => handleSelectMatching(pair.id, e.target.value)}
                        className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border font-medium transition-colors ${
                          selectedMatch
                            ? 'border-purple-500 bg-purple-50/50 text-purple-950 font-semibold'
                            : 'border-slate-300 bg-white text-slate-600'
                        }`}
                      >
                        <option value="">-- Pilih Pasangan yang Tepat --</option>
                        {availableChoices.map((choice, cIdx) => (
                          <option key={cIdx} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* TIPE 5: ISIAN SINGKAT */}
          {/* ======================================================== */}
          {currentQ.type === 'isian' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Ketikkan Jawaban Singkat Anda:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={(typeof answers[currentIndex] === 'string' ? (answers[currentIndex] as string) : '')}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Ketik jawaban di sini (contoh: Tawan Karang, Rodi, Bosch, dll)..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Tips: Gunakan ejaan baku bahasa Indonesia yang tepat.</span>
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* TIPE 6: URAIAN / ESSAY */}
          {/* ======================================================== */}
          {currentQ.type === 'uraian' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <AlignLeft className="w-4 h-4 text-rose-600" />
                  <span>Lembar Jawaban Uraian Siswa:</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-500">
                  {typeof answers[currentIndex] === 'string' ? (answers[currentIndex] as string).length : 0} karakter
                </span>
              </div>
              <textarea
                rows={7}
                value={(typeof answers[currentIndex] === 'string' ? (answers[currentIndex] as string) : '')}
                onChange={(e) => handleEssayChange(e.target.value)}
                placeholder="Tuliskan jawaban penjelasan Anda secara lengkap, runtut, dan terstruktur di sini..."
                className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs sm:text-sm font-normal text-slate-900 leading-relaxed placeholder:text-slate-400 bg-rose-50/20"
              />
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <span className="font-bold">Panduan Penilaian:</span> Jawablah setiap pertanyaan secara analitis dengan menyertakan sebab, akibat, dan contoh nyata dalam kehidupan sehari-hari.
              </div>
            </div>
          )}

          {/* Tombol Navigasi Bawah */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                currentIndex === 0
                  ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-200'
                  : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Selesai &amp; Kirim Jawaban</span>
              </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Peta Navigasi Nomor Soal */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>Peta Nomor Soal</span>
              </h3>
              <span className="text-xs font-extrabold text-blue-700">
                {answeredCount}/{totalQuestions} Terjawab
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Grid Tombol Nomor */}
            <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {shuffledQuestions.map((q, idx) => {
                const isAnswered = isQuestionAnswered(idx);
                const isCurrent = idx === currentIndex;
                const isMarked = markedQuestions[idx];

                let bgClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';

                if (isAnswered) {
                  bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                }
                if (isMarked) {
                  bgClass = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
                }
                if (isCurrent) {
                  bgClass = 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer relative ${bgClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isMarked && !isCurrent && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-1 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legenda Warna */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-[10px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-600" />
                <span>Aktif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-400" />
                <span>Terjawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400" />
                <span>Ragu</span>
              </div>
            </div>

            {/* Tombol Kirim di Panel Samping */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="mt-5 w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirimkan Jawaban Tes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Kirim */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Send className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Konfirmasi Selesai Ujian
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menyelesaikan dan mengirimkan seluruh lembar jawaban tes sumatif ini?
              </p>
            </div>

            {/* Peringatan Soal Belum Terjawab */}
            {!allAnswered && (
              <div className="my-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Ada {unansweredQuestionNumbers.length} Soal Belum Dijawab:</span>
                </div>
                <p className="text-[11px] text-amber-800 break-words">
                  Nomor: {unansweredQuestionNumbers.join(', ')}
                </p>
              </div>
            )}

            {submitError && (
              <div className="my-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ya, Kirim Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
