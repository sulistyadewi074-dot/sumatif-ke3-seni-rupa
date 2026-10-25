import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import { Question, LevelKognitif, Difficulty, QuestionType } from '../types';
import { enrichQuestion, calculateKisiKisiStats } from '../data/kisiKisiData';
import { downloadKisiKisiPDF } from '../utils/pdfGenerator';
import { downloadExamDocx } from '../utils/docxGenerator';
import {
  BookOpen,
  Download,
  Filter,
  Search,
  Brain,
  BarChart3,
  CheckCircle2,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  FileDown,
} from 'lucide-react';

interface MatriksKisiKisiTabProps {
  questions: Question[];
}

export const MatriksKisiKisiTab: React.FC<MatriksKisiKisiTabProps> = ({ questions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('Semua');
  const [filterType, setFilterType] = useState<string>('Semua');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('Semua');

  // Perkaya setiap soal dengan metadata resmi kisi-kisi Kurikulum Merdeka
  const enrichedQuestions = useMemo(() => {
    return questions.map(enrichQuestion);
  }, [questions]);

  // Statistik otomatis
  const stats = useMemo(() => {
    return calculateKisiKisiStats(questions);
  }, [questions]);

  // Filter & Search
  const filteredQuestions = useMemo(() => {
    return enrichedQuestions.filter((q) => {
      // Filter level kognitif
      if (filterLevel !== 'Semua' && q.levelKognitif !== filterLevel) {
        return false;
      }
      // Filter tipe soal
      if (filterType !== 'Semua' && q.type !== filterType) {
        return false;
      }
      // Filter kesulitan
      if (filterDifficulty !== 'Semua' && q.difficulty !== filterDifficulty) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = (q.text || '').toLowerCase().includes(query);
        const matchTopic = (q.topic || '').toLowerCase().includes(query);
        const matchIndikator = (q.indikator || '').toLowerCase().includes(query);
        const matchTP = (q.tp || '').toLowerCase().includes(query);
        const matchId = String(q.id).includes(query);
        return matchText || matchTopic || matchIndikator || matchTP || matchId;
      }
      return true;
    });
  }, [enrichedQuestions, filterLevel, filterType, filterDifficulty, searchQuery]);

  // Format label bentuk soal
  const formatBentukSoal = (type: QuestionType) => {
    switch (type) {
      case 'pg':
        return 'Pilihan Ganda';
      case 'pgk':
        return 'Pilihan Ganda Kompleks';
      case 'pgk_kategori':
        return 'PGK Kategori (Benar/Salah)';
      case 'menjodohkan':
        return 'Menjodohkan';
      case 'isian':
        return 'Isian Singkat';
      case 'uraian':
        return 'Uraian / Essay';
      default:
        return type;
    }
  };

  // Badge level kognitif
  const getLevelBadge = (lvl?: LevelKognitif) => {
    switch (lvl) {
      case 'L1':
        return {
          label: 'L1 (Pemahaman)',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'L2':
        return {
          label: 'L2 (Aplikasi)',
          badge: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'L3':
        return {
          label: 'L3 (Penalaran / HOTS)',
          badge: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      default:
        return {
          label: 'L2',
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  // Badge kesulitan
  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'Mudah':
        return 'bg-emerald-100 text-emerald-800';
      case 'Sedang':
        return 'bg-blue-100 text-blue-800';
      case 'Sukar':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tab & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
              Dokumen Perencanaan Kurikulum Merdeka
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Fase C • Kelas {CONFIG.KELAS}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Matriks Kisi-Kisi Penulisan Soal Tes Sumatif {CONFIG.MATA_PELAJARAN}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Materi: <span className="font-semibold text-slate-800">{CONFIG.MATERI}</span> ({questions.length} Butir Soal Terhubung Aktif)
          </p>
        </div>

        {/* Action Buttons: Unduh PDF & DOCX */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => downloadKisiKisiPDF(enrichedQuestions)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Unduh Dokumen Matriks Kisi-Kisi format PDF resmi kedinasan"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF Kisi-Kisi Soal</span>
          </button>
          <button
            type="button"
            onClick={() => downloadExamDocx(enrichedQuestions)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            title="Unduh Naskah Soal & Kisi-Kisi format Microsoft Word (.docx)"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Unduh .docx (Word)</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards: Distribusi Elemen, Level Kognitif, Kesukaran, dan Bentuk Soal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Elemen / Capaian Pembelajaran */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Elemen IPAS
              </span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-900 line-clamp-2">
              Pemahaman IPAS (Sejarah &amp; Sosial Budaya)
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Cakupan Soal:</span>
            <span className="font-extrabold text-blue-700">35 Soal (100%)</span>
          </div>
        </div>

        {/* Card 2: Distribusi Level Kognitif */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Level Kognitif
            </span>
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">L1 (Pemahaman):</span>
              <span className="font-bold text-emerald-700">
                {stats.levelCounts.L1.count} Soal ({stats.levelCounts.L1.percent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">L2 (Aplikasi):</span>
              <span className="font-bold text-blue-700">
                {stats.levelCounts.L2.count} Soal ({stats.levelCounts.L2.percent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">L3 (Penalaran HOTS):</span>
              <span className="font-bold text-purple-700">
                {stats.levelCounts.L3.count} Soal ({stats.levelCounts.L3.percent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Distribusi Tingkat Kesukaran */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tingkat Kesukaran
            </span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Mudah:</span>
              <span className="font-bold text-emerald-700">
                {stats.difficultyCounts.Mudah.count} Soal ({stats.difficultyCounts.Mudah.percent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sedang (Target 50%):</span>
              <span className="font-bold text-blue-700">
                {stats.difficultyCounts.Sedang.count} Soal ({stats.difficultyCounts.Sedang.percent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sukar:</span>
              <span className="font-bold text-amber-700">
                {stats.difficultyCounts.Sukar.count} Soal ({stats.difficultyCounts.Sukar.percent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Distribusi Bentuk Soal */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Bentuk Soal &amp; Skor
            </span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
            <div>PG: <strong className="text-slate-900">{stats.typeCounts.pg}</strong></div>
            <div>PGK: <strong className="text-slate-900">{stats.typeCounts.pgk}</strong></div>
            <div>Kategori: <strong className="text-slate-900">{stats.typeCounts.pgk_kategori}</strong></div>
            <div>Jodoh: <strong className="text-slate-900">{stats.typeCounts.menjodohkan}</strong></div>
            <div>Isian: <strong className="text-slate-900">{stats.typeCounts.isian}</strong></div>
            <div>Uraian: <strong className="text-slate-900">{stats.typeCounts.uraian}</strong></div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Skor Maks:</span>
            <span className="font-extrabold text-teal-700">{stats.totalSkor} Poin</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari indikator, TP, materi, atau nomor soal..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Level:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs"
            >
              <option value="Semua">Semua Level</option>
              <option value="L1">L1 (Pemahaman)</option>
              <option value="L2">L2 (Aplikasi)</option>
              <option value="L3">L3 (Penalaran HOTS)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Bentuk:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs"
            >
              <option value="Semua">Semua Bentuk</option>
              <option value="pg">Pilihan Ganda</option>
              <option value="pgk">Pilihan Ganda Kompleks</option>
              <option value="pgk_kategori">PGK Kategori</option>
              <option value="menjodohkan">Menjodohkan</option>
              <option value="isian">Isian Singkat</option>
              <option value="uraian">Uraian / Essay</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Kesukaran:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs"
            >
              <option value="Semua">Semua</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sukar">Sukar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Matriks Kisi-Kisi Soal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-3 text-center w-12 border-r border-slate-200">No.</th>
                <th className="py-3.5 px-3 w-48 border-r border-slate-200">Elemen &amp; Capaian (CP)</th>
                <th className="py-3.5 px-3 w-52 border-r border-slate-200">Tujuan Pembelajaran (TP)</th>
                <th className="py-3.5 px-3 min-w-[240px] border-r border-slate-200">Materi &amp; Indikator Soal</th>
                <th className="py-3.5 px-3 text-center w-28 border-r border-slate-200">Level Kognitif</th>
                <th className="py-3.5 px-3 w-36 border-r border-slate-200">Bentuk Soal</th>
                <th className="py-3.5 px-3 w-40">Kunci &amp; Bobot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada butir kisi-kisi soal yang sesuai dengan kriteria filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => {
                  const lvlBadge = getLevelBadge(q.levelKognitif);

                  // Kunci Jawaban display
                  let keyDisplay = '';
                  if (q.type === 'pg') {
                    keyDisplay = `Opsi ${q.correctAnswer}`;
                  } else if (q.type === 'pgk') {
                    keyDisplay = `Opsi: ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}`;
                  } else if (q.type === 'pgk_kategori') {
                    keyDisplay = 'Tabel Kategori';
                  } else if (q.type === 'menjodohkan') {
                    keyDisplay = `${q.matchingPairs?.length || 4} Pasangan`;
                  } else if (q.type === 'isian') {
                    keyDisplay = String(q.correctAnswer).toUpperCase();
                  } else if (q.type === 'uraian') {
                    keyDisplay = 'Rubrik HOTS (Skor 0-4)';
                  }

                  const scoreWeight = q.bobotSkor || (q.type === 'uraian' ? 2 : 1);

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* No Soal */}
                      <td className="py-3 px-3 text-center font-extrabold text-blue-700 border-r border-slate-200">
                        {q.id}
                      </td>

                      {/* Elemen & CP */}
                      <td className="py-3 px-3 border-r border-slate-200 text-slate-700 leading-snug">
                        <span className="font-bold text-slate-900 block text-[11px] mb-1">
                          {q.elemen}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-3">
                          {q.cp}
                        </p>
                      </td>

                      {/* Tujuan Pembelajaran (TP) */}
                      <td className="py-3 px-3 border-r border-slate-200 text-slate-700 leading-snug font-medium text-[11px]">
                        {q.tp}
                      </td>

                      {/* Materi & Indikator Soal */}
                      <td className="py-3 px-3 border-r border-slate-200 leading-snug">
                        <span className="font-bold text-blue-800 text-[11px] block mb-1">
                          {q.topic}
                        </span>
                        <p className="text-slate-800 text-xs font-normal">
                          {q.indikator}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getDifficultyBadge(q.difficulty)}`}>
                            {q.difficulty}
                          </span>
                        </div>
                      </td>

                      {/* Level Kognitif */}
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg border ${lvlBadge.badge}`}>
                          {lvlBadge.label}
                        </span>
                      </td>

                      {/* Bentuk Soal */}
                      <td className="py-3 px-3 border-r border-slate-200 font-semibold text-slate-800">
                        <span>{formatBentukSoal(q.type)}</span>
                      </td>

                      {/* Kunci & Bobot Skor */}
                      <td className="py-3 px-3 space-y-1">
                        <span className="font-extrabold text-slate-900 block text-[11px] truncate" title={keyDisplay}>
                          {keyDisplay}
                        </span>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Bobot: {scoreWeight} Poin
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Menampilkan <strong>{filteredQuestions.length}</strong> dari <strong>{questions.length}</strong> butir kisi-kisi aktif.
          </span>
          <span className="font-medium text-slate-600">
            Standar Kurikulum Merdeka • SD Negeri 3 Loloan Timur
          </span>
        </div>
      </div>
    </div>
  );
};
