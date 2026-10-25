import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { enrichQuestion } from '../data/kisiKisiData';
import { downloadAnalisisButirPDF } from '../utils/pdfGenerator';
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  Eye,
  TrendingUp,
  Brain,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

interface AnalisisButirTabProps {
  results: ExamResult[];
  questions: Question[];
  onSelectStudentForDetail: (student: ExamResult) => void;
}

export const AnalisisButirTab: React.FC<AnalisisButirTabProps> = ({
  results,
  questions,
  onSelectStudentForDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  const enrichedQuestions = useMemo(() => {
    return questions.map(enrichQuestion);
  }, [questions]);

  // Filter siswa
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (filterStatus === 'Tuntas' && (r.nilai ?? 0) < CONFIG.KKTP) return false;
      if (filterStatus === 'Remedial' && (r.nilai ?? 0) >= CONFIG.KKTP) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          r.nama.toLowerCase().includes(query) ||
          r.noAbsen.includes(query)
        );
      }
      return true;
    });
  }, [results, filterStatus, searchQuery]);

  // Statistik Keseluruhan Kelas
  const classStats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalSiswa: 0,
        rataRata: 0,
        tertinggi: 0,
        terendah: 0,
        persenTuntas: 0,
        tuntasCount: 0,
        remedialCount: 0,
      };
    }

    const scores = results.map((r) => r.nilai);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / results.length);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const tuntas = results.filter((r) => r.nilai >= CONFIG.KKTP).length;
    const remedial = results.length - tuntas;
    const pctTuntas = Math.round((tuntas / results.length) * 100);

    return {
      totalSiswa: results.length,
      rataRata: avg,
      tertinggi: max,
      terendah: min,
      persenTuntas: pctTuntas,
      tuntasCount: tuntas,
      remedialCount: remedial,
    };
  }, [results]);

  // Statistik Butir Soal Empiris (Daya Serap, Jumlah Benar, Tingkat Kesukaran Empiris)
  const itemAnalysis = useMemo(() => {
    const totalSiswa = results.length || 1;

    return enrichedQuestions.map((q) => {
      const maxScore = q.bobotSkor || (q.type === 'uraian' ? 2 : 1);
      let totalEarned = 0;
      let fullCorrectCount = 0;
      let partialCount = 0;
      let zeroCount = 0;

      results.forEach((r) => {
        const s = (r.itemScores && r.itemScores[q.id] !== undefined) ? r.itemScores[q.id] : 0;
        totalEarned += s;
        if (s >= maxScore) {
          fullCorrectCount += 1;
        } else if (s > 0) {
          partialCount += 1;
        } else {
          zeroCount += 1;
        }
      });

      // Daya serap butir (%) = (totalEarned / (totalSiswa * maxScore)) * 100
      const dayaSerapPct = Math.round((totalEarned / (totalSiswa * maxScore)) * 100);

      // Klasifikasi Empiris:
      // Mudah: > 70%
      // Sedang: 30% - 70%
      // Sukar: < 30%
      let klasifikasiEmpiris: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
      if (dayaSerapPct > 70) klasifikasiEmpiris = 'Mudah';
      else if (dayaSerapPct < 30) klasifikasiEmpiris = 'Sukar';

      return {
        id: q.id,
        topic: q.topic,
        type: q.type,
        maxScore,
        fullCorrectCount,
        partialCount,
        zeroCount,
        dayaSerapPct,
        klasifikasiEmpiris,
      };
    });
  }, [results, enrichedQuestions]);

  // Ekspor Matriks ke Excel / CSV
  const handleExportCSV = () => {
    if (results.length === 0) return;

    // Header baris
    const headerCols = ['No', 'Nama Siswa', 'Nomor Absen', 'Kelas'];
    enrichedQuestions.forEach((q) => {
      headerCols.push(`Soal ${q.id} (Maks ${q.bobotSkor || (q.type === 'uraian' ? 2 : 1)})`);
    });
    headerCols.push('Total Skor', 'Nilai Akhir (0-100)', 'Status KKTP (60)', 'Durasi Pengerjaan');

    const rows: string[][] = [headerCols];

    // Baris setiap siswa
    results.forEach((r, idx) => {
      const rowData = [
        String(idx + 1),
        `"${r.nama}"`,
        r.noAbsen,
        r.kelas,
      ];

      enrichedQuestions.forEach((q) => {
        const score = (r.itemScores && r.itemScores[q.id] !== undefined) ? r.itemScores[q.id] : 0;
        rowData.push(String(score));
      });

      const totalScore = r.totalSkor || (r.nilai * 0.4).toFixed(1);
      const isLulus = r.nilai >= CONFIG.KKTP;
      rowData.push(String(totalScore), String(r.nilai), isLulus ? 'Tuntas' : 'Remedial', r.durasiPengerjaan || '-');
      rows.push(rowData);
    });

    // Baris Statistik Bawah 1: Jumlah Siswa Benar Penuh
    const rowBenar = ['', '"JUMLAH SISWA BENAR PENUH"', '', ''];
    itemAnalysis.forEach((ia) => {
      rowBenar.push(String(ia.fullCorrectCount));
    });
    rowBenar.push('', '', '', '');
    rows.push(rowBenar);

    // Baris Statistik Bawah 2: Daya Serap (%)
    const rowDayaSerap = ['', '"DAYA SERAP BUTIR (%)"', '', ''];
    itemAnalysis.forEach((ia) => {
      rowDayaSerap.push(`${ia.dayaSerapPct}%`);
    });
    rowDayaSerap.push('', `${classStats.rataRata}% Rata Kelas`, `${classStats.persenTuntas}% Tuntas`, '');
    rows.push(rowDayaSerap);

    // Baris Statistik Bawah 3: Klasifikasi Empiris
    const rowKlasifikasi = ['', '"KLASIFIKASI KESUKARAN EMPIRIS"', '', ''];
    itemAnalysis.forEach((ia) => {
      rowKlasifikasi.push(ia.klasifikasiEmpiris);
    });
    rowKlasifikasi.push('', '', '', '');
    rows.push(rowKlasifikasi);

    // Generate CSV & trigger download
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Analisis_Butir_Soal_IPAS_Kelas_6_${CONFIG.SEKOLAH.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Tab & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Evaluasi &amp; Diagnostik Pembelajaran
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Kelas {CONFIG.KELAS} • KKTP: {CONFIG.KKTP}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Matriks Respon &amp; Analisis Butir Soal per Siswa
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Peta respon jawaban seluruh siswa terhadap 35 butir soal dengan indikator visual ketercapaian, daya serap, dan klasifikasi empiris.
          </p>
        </div>

        {/* Action Buttons: Ekspor CSV & Unduh PDF Laporan */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            title="Ekspor seluruh data matriks ke format Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Ekspor Excel (CSV)</span>
          </button>
          <button
            type="button"
            onClick={() => downloadAnalisisButirPDF(results, enrichedQuestions)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Cetak & Unduh Dokumen PDF Laporan Analisis Butir Soal Lengkap"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF Laporan Analisis</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Ringkasan Kelas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Peserta</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{classStats.totalSiswa} Siswa</div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Kelas {CONFIG.KELAS} Aktif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rata-Rata Kelas</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{classStats.rataRata} / 100</div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            Rentang: {classStats.terendah} - {classStats.tertinggi}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tingkat Ketuntasan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{classStats.persenTuntas}%</div>
          <span className="text-[11px] text-emerald-800 block mt-0.5 font-medium">
            {classStats.tuntasCount} Tuntas • {classStats.remedialCount} Remedial
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Standar Kelulusan</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">KKTP: {CONFIG.KKTP}</div>
          <span className="text-[11px] text-slate-500 block mt-0.5">35 Butir (Maks 40 Poin)</span>
        </div>
      </div>

      {/* Filter & Petunjuk Warna */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Nama / Absen */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa atau nomor absen..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
          />
        </div>

        {/* Filter Status & Petunjuk Warna */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs"
            >
              <option value="Semua">Semua Siswa</option>
              <option value="Tuntas">Tuntas (≥ 60)</option>
              <option value="Remedial">Remedial (&lt; 60)</option>
            </select>
          </div>

          {/* Legenda Warna Respon Butir */}
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span className="text-emerald-900">Benar Penuh</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded bg-amber-400" />
              <span className="text-amber-900">Sebagian</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded bg-rose-500" />
              <span className="text-rose-900">Salah</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabel Matriks Interaktif Respon Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                {/* Sticky Left Columns */}
                <th className="py-3 px-2 text-center w-10 sticky left-0 z-20 bg-slate-100 border-r border-slate-200">
                  No
                </th>
                <th className="py-3 px-3 min-w-[170px] sticky left-10 z-20 bg-slate-100 border-r border-slate-300 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                  Nama Siswa
                </th>

                {/* 35 Question Columns */}
                {enrichedQuestions.map((q) => {
                  return (
                    <th
                      key={q.id}
                      className="py-2.5 px-1 text-center w-8 border-r border-slate-200 hover:bg-slate-200/80 transition-colors cursor-default"
                      title={`No. ${q.id} [${q.type.toUpperCase()}] - ${q.topic} (Maks: ${q.bobotSkor || (q.type === 'uraian' ? 2 : 1)}p)`}
                    >
                      <span className="block font-black text-slate-800">{q.id}</span>
                      <span className="text-[8px] font-semibold text-slate-500 uppercase block">
                        {q.type === 'menjodohkan' ? 'JOD' : q.type === 'pgk_kategori' ? 'KAT' : q.type.toUpperCase()}
                      </span>
                    </th>
                  );
                })}

                {/* Sticky Right Summary Columns */}
                <th className="py-3 px-2.5 text-center min-w-[70px] border-l border-slate-300 bg-slate-100">
                  Total Skor
                </th>
                <th className="py-3 px-2.5 text-center min-w-[65px] bg-slate-100">
                  Nilai
                </th>
                <th className="py-3 px-2.5 text-center min-w-[85px] bg-slate-100">
                  Status
                </th>
                <th className="py-3 px-2 text-center min-w-[75px] bg-slate-100">
                  Durasi
                </th>
                <th className="py-3 px-3 text-center min-w-[80px] bg-slate-100">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* Table Body (Student Rows) */}
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={enrichedQuestions.length + 6} className="py-10 text-center text-slate-400">
                    Belum ada data respon siswa yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredResults.map((student, sIdx) => {
                  const isTuntas = student.nilai >= CONFIG.KKTP;
                  const itemScores = student.itemScores || {};
                  const totalScore = student.totalSkor || (student.nilai * 0.4).toFixed(1);

                  return (
                    <tr
                      key={student.id || sIdx}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectStudentForDetail(student)}
                    >
                      {/* Sticky No */}
                      <td className="py-2.5 px-2 text-center font-bold text-slate-600 sticky left-0 z-10 bg-white group-hover:bg-blue-50/60 border-r border-slate-200">
                        {sIdx + 1}
                      </td>

                      {/* Sticky Nama & Absen */}
                      <td className="py-2.5 px-3 sticky left-10 z-10 bg-white group-hover:bg-blue-50/60 border-r border-slate-300 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-bold text-slate-900 truncate max-w-[130px] block" title={student.nama}>
                            {student.nama}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                            #{student.noAbsen}
                          </span>
                        </div>
                      </td>

                      {/* 35 Question Response Cells */}
                      {enrichedQuestions.map((q) => {
                        const maxScore = q.bobotSkor || (q.type === 'uraian' ? 2 : 1);
                        const score = itemScores[q.id] !== undefined ? itemScores[q.id] : 0;

                        let cellBg = 'bg-rose-100 text-rose-900 border-rose-300';
                        let label = '0';

                        if (score >= maxScore) {
                          cellBg = 'bg-emerald-500 text-white font-bold';
                          label = maxScore === 1 ? '1' : String(maxScore);
                        } else if (score > 0) {
                          cellBg = 'bg-amber-400 text-amber-950 font-bold';
                          label = String(score);
                        } else {
                          cellBg = 'bg-rose-500 text-white font-bold';
                          label = '0';
                        }

                        return (
                          <td
                            key={q.id}
                            className="p-1 text-center border-r border-slate-200"
                            title={`Soal #${q.id}: Skor ${score}/${maxScore} (${q.topic})`}
                          >
                            <div
                              className={`w-6 h-6 mx-auto rounded flex items-center justify-center text-[10px] transition-transform group-hover:scale-105 shadow-2xs ${cellBg}`}
                            >
                              {label}
                            </div>
                          </td>
                        );
                      })}

                      {/* Summary Columns */}
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800 border-l border-slate-300 bg-slate-50/50">
                        {totalScore}
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`font-black text-xs ${
                            isTuntas ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {student.nilai}
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isTuntas
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isTuntas ? 'Tuntas' : 'Remedial'}
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center text-[11px] text-slate-600 font-medium">
                        {student.durasiPengerjaan || '55 Mnt'}
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudentForDetail(student);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Footer: Statistik Bawah per Butir Soal */}
            <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold text-[10px]">
              {/* Baris 1: Jumlah Siswa Benar Penuh */}
              <tr className="border-b border-slate-200">
                <td
                  colSpan={2}
                  className="py-2.5 px-3 sticky left-0 z-20 bg-slate-100 border-r border-slate-300 text-slate-800 uppercase tracking-wider shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jml Siswa Benar</span>
                  </span>
                </td>
                {itemAnalysis.map((ia) => (
                  <td key={ia.id} className="py-2 px-1 text-center border-r border-slate-200 text-emerald-900 font-extrabold">
                    {ia.fullCorrectCount}
                  </td>
                ))}
                <td colSpan={5} className="py-2 px-3 text-center text-slate-600 font-semibold border-l border-slate-300">
                  KKTP: {CONFIG.KKTP}
                </td>
              </tr>

              {/* Baris 2: Daya Serap (%) */}
              <tr className="border-b border-slate-200">
                <td
                  colSpan={2}
                  className="py-2.5 px-3 sticky left-0 z-20 bg-slate-100 border-r border-slate-300 text-slate-800 uppercase tracking-wider shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Daya Serap (%)</span>
                  </span>
                </td>
                {itemAnalysis.map((ia) => (
                  <td key={ia.id} className="py-2 px-1 text-center border-r border-slate-200 font-black text-slate-900">
                    {ia.dayaSerapPct}%
                  </td>
                ))}
                <td colSpan={5} className="py-2 px-3 text-center text-blue-800 font-extrabold border-l border-slate-300">
                  Rata Kelas: {classStats.rataRata}%
                </td>
              </tr>

              {/* Baris 3: Klasifikasi Empiris Kesukaran */}
              <tr>
                <td
                  colSpan={2}
                  className="py-2.5 px-3 sticky left-0 z-20 bg-slate-100 border-r border-slate-300 text-slate-800 uppercase tracking-wider shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kesukaran Empiris</span>
                  </span>
                </td>
                {itemAnalysis.map((ia) => {
                  let badge = 'bg-blue-100 text-blue-800';
                  if (ia.klasifikasiEmpiris === 'Mudah') badge = 'bg-emerald-100 text-emerald-800';
                  if (ia.klasifikasiEmpiris === 'Sukar') badge = 'bg-amber-100 text-amber-900';

                  return (
                    <td key={ia.id} className="py-2 px-0.5 text-center border-r border-slate-200">
                      <span className={`block text-[8px] font-extrabold px-1 py-0.5 rounded ${badge}`}>
                        {ia.klasifikasiEmpiris.slice(0, 3)}
                      </span>
                    </td>
                  );
                })}
                <td colSpan={5} className="py-2 px-3 text-center text-slate-600 font-medium border-l border-slate-300">
                  Mudah &gt;70% • Sedang 30-70% • Sukar &lt;30%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Petunjuk Penggunaan Matriks */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Tips Guru:</strong> Klik baris nama siswa untuk membuka <strong>Detail Analisis Diagnostik &amp; Rekomendasi Remedial</strong> perorangan.
            </span>
          </p>
          <span className="font-semibold text-slate-600">
            {filteredResults.length} Siswa Terdaftar
          </span>
        </div>
      </div>
    </div>
  );
};
