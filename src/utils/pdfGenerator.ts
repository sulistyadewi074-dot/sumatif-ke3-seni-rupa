import { jsPDF } from 'jspdf';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { enrichQuestion, calculateKisiKisiStats } from '../data/kisiKisiData';

/**
 * Format tanggal dalam bahasa Indonesia
 */
export function formatIndonesianDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * 1. Download Lembar Hasil Tes Siswa (Tanda Tangan Guru & Orang Tua/Wali)
 */
export function downloadStudentResultPDF(result: ExamResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // --- KOP SURAT SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(14);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineWidth(0.2);
  doc.line(15, y + 0.8, pageWidth - 15, y + 0.8);
  y += 8;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LEMBAR LAPORAN HASIL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tahun Ajaran 2025/2026`, pageWidth / 2, y, { align: 'center' });
  y += 9;

  // --- DATA IDENTITAS SISWA ---
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 36, 2, 2, 'FD');

  doc.setFontSize(10);
  const leftX = 20;
  const col2X = 58;
  const rightX = 115;
  const col4X = 150;

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nama Peserta', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.nama}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Mata Pelajaran', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATA_PELAJARAN}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nomor Absen', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.noAbsen}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Materi / Pokok', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATERI_SHORT}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Kelas', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.kelas || CONFIG.KELAS}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Standar KKTP', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.KKTP} (Skala 100)`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Waktu Pengerjaan', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.timestamp}`, col2X, y);

  y += 12;

  // --- TABEL PEROLEHAN HASIL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('A. Hasil Perolehan Nilai Tes', 15, y);
  y += 5;

  // Header Tabel
  doc.setFillColor(30, 58, 138); // Dark Navy Blue
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Komponen Penilaian', 20, y + 5.5);
  doc.text('Jumlah / Nilai', pageWidth - 45, y + 5.5, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Baris-baris tabel
  const totalQuestionsCount = (result.benar || 0) + (result.salah || 0) > 0 ? (result.benar || 0) + (result.salah || 0) : 30;
  const tableRows = [
    { label: 'Jumlah Soal Keseluruhan', value: `${totalQuestionsCount} Butir Soal` },
    { label: 'Jumlah Jawaban Benar', value: `${result.benar} Soal` },
    { label: 'Jumlah Jawaban Salah / Tidak Tepat', value: `${result.salah} Soal` },
    { label: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)', value: `${CONFIG.KKTP}` },
  ];

  doc.setFont('helvetica', 'normal');
  tableRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    doc.rect(15, y, pageWidth - 30, 7.5, 'S');
    doc.text(row.label, 20, y + 5);
    doc.text(row.value, pageWidth - 45, y + 5, { align: 'right' });
    y += 7.5;
  });

  // Baris Nilai Akhir & Status
  const isPass = result.status === 'Lulus' || result.nilai >= CONFIG.KKTP;
  doc.setFillColor(isPass ? 240 : 254, isPass ? 253 : 242, isPass ? 244 : 242);
  doc.rect(15, y, pageWidth - 30, 10, 'F');
  doc.rect(15, y, pageWidth - 30, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NILAI AKHIR TES SUMATIF (Skala 0 - 100)', 20, y + 6.5);
  doc.setFontSize(13);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(String(result.nilai), pageWidth - 45, y + 7, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // Status Baris
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 9, 'F');
  doc.rect(15, y, pageWidth - 30, 9, 'S');
  doc.setFontSize(10);
  doc.text('Keterangan Kelulusan', 20, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(isPass ? 'LULUS (Mencapai KKTP)' : 'BELUM LULUS (Perlu Remedial)', pageWidth - 45, y + 6, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  y += 14;

  // --- CATATAN GURU ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('B. Catatan Pembelajaran Guru Kelas:', 15, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const note = isPass
    ? 'Selamat atas pencapaian yang memuaskan. Tingkatkan terus semangat belajar dan ketelitian dalam menyelesaikan soal matematika.'
    : 'Perlu bimbingan dan pengulangan materi terutama pada konsep soal kompleks dan pemecahan masalah (remedial). Tetap semangat belajar.';
  doc.text(note, 15, y, { maxWidth: pageWidth - 30 });
  y += 16;

  // --- TANDA TANGAN (HANYA GURU & ORANG TUA/WALI) ---
  // Syarat eksplisit dari pengguna: "hanya ditandatangi oleh guru dan orang tua/wali"
  const ttdY = Math.max(y, 220);
  const colLeft = 20;
  const colRight = pageWidth - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  // Kolom Kiri: Orang Tua / Wali
  doc.text('Mengetahui,', colLeft, ttdY);
  doc.text('Orang Tua / Wali Siswa,', colLeft, ttdY + 5);

  // Kolom Kanan: Guru Kelas VI
  const tglFormatted = formatIndonesianDate();
  doc.text(`Jembrana, ${tglFormatted}`, colRight, ttdY);
  doc.text('Guru Mata Pelajaran / Kelas VI,', colRight, ttdY + 5);

  // Area tanda tangan (spasi vertikal)
  const lineY = ttdY + 27;

  // Garis nama Orang Tua
  doc.line(colLeft, lineY, colLeft + 45, lineY);
  doc.text('( ......................................... )', colLeft, lineY + 4);

  // Garis nama Guru
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.GURU, colRight, lineY - 1);
  doc.line(colRight, lineY, colRight + 48, lineY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${CONFIG.LABEL_NIP_GURU || 'NIP'}. ${CONFIG.NIP_GURU}`, colRight, lineY + 4);

  // Simpan PDF
  const safeName = (result.nama || 'siswa').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Hasil_Tes_Sumatif_${safeName}_Absen_${result.noAbsen}.pdf`);
}

/**
 * 2. Download Naskah Soal Ujian (PDF)
 */
export function downloadExamQuestionsPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${CONFIG.SEKOLAH} | Naskah Soal Tes Sumatif ${CONFIG.MATA_PELAJARAN} Kelas ${CONFIG.KELAS}`,
      pageWidth / 2,
      9,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  // --- KOP SOAL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(13);
  doc.text('NASKAH SOAL TES SUMATIF SEMESTER', pageWidth / 2, y, { align: 'center' });
  y += 3;

  doc.setLineWidth(0.6);
  doc.line(15, y, pageWidth - 15, y);
  y += 6;

  // Metadata Soal
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mata Pelajaran : ${CONFIG.MATA_PELAJARAN}`, 16, y);
  doc.text(`Kelas / Semester : Kelas ${CONFIG.KELAS}`, 120, y);
  y += 4.5;
  doc.text(`Materi Pokok    : ${CONFIG.MATERI_SHORT}`, 16, y);
  doc.text(`Alokasi Waktu    : ${CONFIG.ALOKASI_WAKTU}`, 120, y);
  y += 4.5;
  doc.text(`Kriteria KKTP   : ${CONFIG.KKTP}`, 16, y);
  doc.text(`Jumlah Soal      : ${questions.length} Butir`, 120, y);
  y += 6;

  doc.setDrawColor(180, 180, 180);
  doc.setFillColor(245, 247, 250);
  doc.rect(15, y, pageWidth - 30, 11, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('PETUNJUK UMUM:', 18, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    '1. Tulislah identitas pada lembar jawaban. 2. Kerjakan soal dengan teliti dan jujur. 3. Periksa kembali jawaban sebelum dikirimkan.',
    18,
    y + 8,
    { maxWidth: pageWidth - 36 }
  );
  y += 16;

  // Iterasi Soal
  questions.forEach((q, idx) => {
    checkPageBreak(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);

    let typeLabel = 'Pilihan Ganda';
    if (q.type === 'pgk') typeLabel = 'Pilihan Ganda Kompleks (Bisa >1 jawaban benar)';
    if (q.type === 'pgk_kategori') {
      const cat =
        q.categoryType === 'setuju_tidak'
          ? 'Setuju / Tidak Setuju'
          : q.categoryType === 'sesuai_tidak'
          ? 'Sesuai / Tidak Sesuai'
          : 'Benar / Salah';
      typeLabel = `Pilihan Ganda Kompleks Kategori (${cat})`;
    }
    if (q.type === 'menjodohkan') typeLabel = 'Menjodohkan (Memasangkan Pernyataan)';
    if (q.type === 'isian') typeLabel = 'Isian Singkat (Short Answer)';
    if (q.type === 'uraian') typeLabel = 'Uraian / Essay (Analisis C4-C6)';

    doc.setTextColor(14, 116, 144);
    doc.text(`Soal No. ${idx + 1} [${typeLabel}] (${q.difficulty})`, 15, y);
    doc.setTextColor(0, 0, 0);
    y += 5;

    // Teks Soal
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(q.text, pageWidth - 32);
    checkPageBreak(textLines.length * 4.5 + 15);
    doc.text(textLines, 16, y);
    y += textLines.length * 4.5 + 2;

    if (q.imageSvg) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('[Lihat ilustrasi diagram / peta sejarah pada aplikasi ujian]', 16, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
    }

    // Opsi Jawaban (PG & PGK)
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        checkPageBreak(8);
        const optLines = doc.splitTextToSize(`${opt.id}. ${opt.text}`, pageWidth - 36);
        doc.text(optLines, 20, y);
        y += optLines.length * 4.2 + 1;
      });
      y += 3;
    }

    // Pernyataan Kategori
    if (q.statements && q.statements.length > 0) {
      const tLbl = q.categoryType === 'setuju_tidak' ? 'Setuju' : q.categoryType === 'sesuai_tidak' ? 'Sesuai' : 'Benar';
      const fLbl = q.categoryType === 'setuju_tidak' ? 'Tidak Setuju' : q.categoryType === 'sesuai_tidak' ? 'Tidak Sesuai' : 'Salah';
      q.statements.forEach((st, sIdx) => {
        checkPageBreak(10);
        const stLines = doc.splitTextToSize(
          `Pernyataan ${sIdx + 1}: ${st.text}   [  ] ${st.trueLabel || tLbl}   [  ] ${st.falseLabel || fLbl}`,
          pageWidth - 36
        );
        doc.text(stLines, 20, y);
        y += stLines.length * 4.5 + 1.5;
      });
      y += 3;
    }

    // Menjodohkan
    if (q.type === 'menjodohkan' && q.matchingPairs && q.matchingPairs.length > 0) {
      checkPageBreak(q.matchingPairs.length * 6 + 10);
      q.matchingPairs.forEach((pair, pIdx) => {
        const line = `${pIdx + 1}. ${pair.premise}  --->  ( ... )  ${String.fromCharCode(65 + pIdx)}. ${pair.match}`;
        const pairLines = doc.splitTextToSize(line, pageWidth - 36);
        doc.text(pairLines, 20, y);
        y += pairLines.length * 4.2 + 1;
      });
      y += 3;
    }

    // Isian Singkat
    if (q.type === 'isian') {
      checkPageBreak(12);
      doc.text('Jawaban Siswa: ............................................................................................', 20, y);
      y += 6;
    }

    // Uraian
    if (q.type === 'uraian') {
      checkPageBreak(25);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Lembar Jawaban Uraian:', 20, y);
      y += 5;
      doc.line(20, y, pageWidth - 20, y);
      y += 5;
      doc.line(20, y, pageWidth - 20, y);
      y += 5;
      doc.line(20, y, pageWidth - 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
    }
  });

  doc.save(`Naskah_Soal_${CONFIG.MATA_PELAJARAN.replace(/[^a-zA-Z0-9]/g, '_')}_Kelas_${CONFIG.KELAS}_${CONFIG.SEKOLAH.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 3. Export Rekap Nilai ke Format CSV (Bisa dibuka langsung di Microsoft Excel)
 */
export function exportResultsToCSV(results: ExamResult[]): void {
  const headers = ['Timestamp', 'Nama Siswa', 'Kelas', 'Nomor Absen', 'Tanggal Lahir', 'Benar', 'Salah', 'Nilai', 'Status'];

  const rows = results.map((r) => [
    `"${r.timestamp || ''}"`,
    `"${r.nama || ''}"`,
    `"${r.kelas || CONFIG.KELAS}"`,
    `"${r.noAbsen || ''}"`,
    `"${r.tglLahir || ''}"`,
    r.benar,
    r.salah,
    r.nilai,
    `"${r.status}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Tes_Sumatif_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 4. Download Rekapitulasi Data Nilai Siswa (PDF Resmi Berkop dan Bertanda Tangan)
 */
export function downloadResultsRecapPDF(results: ExamResult[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 12;
  const marginRight = 12;
  const contentWidth = pageWidth - marginLeft - marginRight; // 186mm

  // Hitung Statistik
  const total = results.length;
  const lulus = results.filter((r) => r.status === 'Lulus' || r.nilai >= CONFIG.KKTP).length;
  const belumLulus = total - lulus;
  const persenLulus = total > 0 ? Math.round((lulus / total) * 100) : 0;
  const rataRata = total > 0 ? (results.reduce((acc, r) => acc + (r.nilai || 0), 0) / total).toFixed(1) : '0';
  const nilaiTertinggi = total > 0 ? Math.max(...results.map((r) => r.nilai || 0)) : 0;
  const nilaiTerendah = total > 0 ? Math.min(...results.map((r) => r.nilai || 0)) : 0;

  let y = 14;

  // --- KOP DOKUMEN SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Garis Pembatas Kop Ganda
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DAFTAR REKAPITULASI NILAI HASIL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Materi: ${CONFIG.MATERI} • Kelas ${CONFIG.KELAS} • KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // --- KOTAK RINGKASAN STATISTIK ---
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 14, 1.5, 1.5, 'FD');

  const statCols = [
    { label: 'Total Peserta', val: `${total} Siswa` },
    { label: 'Jumlah Lulus', val: `${lulus} Siswa (${persenLulus}%)` },
    { label: 'Belum Lulus', val: `${belumLulus} Siswa` },
    { label: 'Rata-rata Nilai', val: `${rataRata}` },
    { label: 'Tertinggi / Terendah', val: `${nilaiTertinggi} / ${nilaiTerendah}` },
  ];
  const colW = contentWidth / statCols.length;
  statCols.forEach((col, idx) => {
    const cx = marginLeft + idx * colW + colW / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(col.label, cx, y + 5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(col.val, cx, y + 10.5, { align: 'center' });
  });

  doc.setTextColor(0, 0, 0);
  y += 18;

  // Definisi Kolom Tabel
  const cols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'noAbsen', title: 'Absen', width: 13, align: 'center' as const },
    { key: 'nama', title: 'Nama Siswa', width: 56, align: 'left' as const },
    { key: 'kelas', title: 'Kelas', width: 12, align: 'center' as const },
    { key: 'benar', title: 'Benar', width: 13, align: 'center' as const },
    { key: 'salah', title: 'Salah', width: 13, align: 'center' as const },
    { key: 'nilai', title: 'Nilai', width: 14, align: 'center' as const },
    { key: 'status', title: 'Keterangan', width: 24, align: 'center' as const },
    { key: 'timestamp', title: 'Waktu Submit', width: 32, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let curX = marginLeft;
    cols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  if (results.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Belum ada data nilai siswa yang tersimpan.', pageWidth / 2, y + 8, { align: 'center' });
    y += 16;
  } else {
    results.forEach((r, idx) => {
      // Check for page break
      if (y + 6.5 > pageHeight - 38) {
        doc.addPage();
        y = 15;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Lanjutan Rekapitulasi Nilai Siswa:', marginLeft, y - 2);
        drawTableHeader(y);
        y += 7;
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(marginLeft, y, contentWidth, 6.5, 'S');

      let curX = marginLeft;
      const isLulus = r.status === 'Lulus' || r.nilai >= CONFIG.KKTP;

      cols.forEach((col) => {
        let val = '';
        if (col.key === 'no') val = String(idx + 1);
        else if (col.key === 'noAbsen') val = String(r.noAbsen || '-');
        else if (col.key === 'nama') val = r.nama || '-';
        else if (col.key === 'kelas') val = r.kelas || CONFIG.KELAS;
        else if (col.key === 'benar') val = String(r.benar ?? 0);
        else if (col.key === 'salah') val = String(r.salah ?? 0);
        else if (col.key === 'nilai') val = String(r.nilai ?? 0);
        else if (col.key === 'status') val = isLulus ? 'Lulus' : 'Remedial';
        else if (col.key === 'timestamp') val = (r.timestamp || '-').substring(0, 16);

        doc.setFont('helvetica', col.key === 'nilai' ? 'bold' : 'normal');
        doc.setFontSize(7.8);

        if (col.key === 'status') {
          doc.setTextColor(isLulus ? 22 : 185, isLulus ? 101 : 28, isLulus ? 52 : 28);
        } else if (col.key === 'nilai') {
          doc.setTextColor(isLulus ? 15 : 185, isLulus ? 23 : 28, isLulus ? 42 : 28);
        } else {
          doc.setTextColor(30, 41, 59);
        }

        const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;

        if (col.key === 'nama') {
          const truncated = doc.splitTextToSize(val, col.width - 3)[0] || val;
          doc.text(truncated, textX, y + 4.5);
        } else {
          doc.text(val, textX, y + 4.5, { align: col.align });
        }

        curX += col.width;
      });

      doc.setTextColor(0, 0, 0);
      y += 6.5;
    });
  }

  // Cek apakah muat untuk tanda tangan (perlu ~38mm)
  if (y + 38 > pageHeight - 16) {
    doc.addPage();
    y = 18;
  } else {
    y += 8;
  }

  // --- TANDA TANGAN (KEPALA SEKOLAH & GURU) ---
  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 8;
  const colRightX = pageWidth - marginRight - 55;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Mata Pelajaran,', colRightX, y + 4.5);

  const sigLineY = y + 23;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIP Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`${CONFIG.LABEL_NIP_GURU || 'NIP'}. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  // --- FOOTER DI SETIAP HALAMAN ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Rekapitulasi Nilai Resmi • ${CONFIG.SEKOLAH} • Dicetak otomatis sistem`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Rekap_Nilai_Tes_Sumatif_${CONFIG.MATA_PELAJARAN}_Kelas_${CONFIG.KELAS}.pdf`);
}

/**
 * 5. Download Matriks Kisi-Kisi Penulisan Soal (PDF Kedinasan Resmi Format Landscape)
 */
export function downloadKisiKisiPDF(rawQuestions: Question[]): void {
  const questions = rawQuestions.map(enrichQuestion);
  const stats = calculateKisiKisiStats(questions);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 269mm

  let y = 14;

  const drawHeaderKop = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
    y += 5.5;
    doc.setFontSize(13);
    doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
    y += 3;

    // Garis Kop Ganda
    doc.setLineWidth(0.8);
    doc.line(marginLeft, y, pageWidth - marginRight, y);
    doc.setLineWidth(0.2);
    doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
    y += 6;
  };

  drawHeaderKop();

  // Judul Dokumen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('KISI-KISI PENULISAN SOAL TES SUMATIF KURIKULUM MERDEKA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Kelas/Fase: ${CONFIG.KELAS}/Fase C • Tahun Ajaran: 2025/2026 • Alokasi Waktu: ${CONFIG.ALOKASI_WAKTU} • KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Kotak Ringkasan Distribusi Kisi-Kisi
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 12, 1.5, 1.5, 'FD');

  const summaryItems = [
    { label: 'Jumlah Soal', val: `${questions.length} Butir (Skor Maks 40)` },
    { label: 'Level Kognitif', val: `L1: ${stats.levelCounts.L1.count} (${stats.levelCounts.L1.percent}%) | L2: ${stats.levelCounts.L2.count} (${stats.levelCounts.L2.percent}%) | L3: ${stats.levelCounts.L3.count} (${stats.levelCounts.L3.percent}%)` },
    { label: 'Bentuk Soal', val: `PG: 10 | PGK: 5 | Kategori: 5 | Menjodohkan: 5 | Isian: 5 | Uraian: 5` },
    { label: 'Tingkat Kesukaran', val: `Mudah: ${stats.difficultyCounts.Mudah.count} | Sedang: ${stats.difficultyCounts.Sedang.count} | Sukar: ${stats.difficultyCounts.Sukar.count}` },
  ];

  const sColWidth = contentWidth / summaryItems.length;
  summaryItems.forEach((item, idx) => {
    const sx = marginLeft + idx * sColWidth + sColWidth / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, sx, y + 4.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.val, sx, y + 9.5, { align: 'center' });
  });

  y += 15;

  // Definisi Kolom Tabel Kisi-Kisi
  const tableCols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'cp', title: 'Capaian Pembelajaran (CP)', width: 44, align: 'left' as const },
    { key: 'tp', title: 'Tujuan Pembelajaran (TP)', width: 48, align: 'left' as const },
    { key: 'indikator', title: 'Materi & Indikator Soal', width: 84, align: 'left' as const },
    { key: 'level', title: 'Level', width: 14, align: 'center' as const },
    { key: 'bentuk', title: 'Bentuk', width: 26, align: 'center' as const },
    { key: 'kunci', title: 'Kunci / Skor', width: 24, align: 'center' as const },
    { key: 'kesukaran', title: 'Kesukaran', width: 20, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138); // Navy Blue
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    let curX = marginLeft;
    tableCols.forEach((col) => {
      const tx = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, tx, curY + 4.8, { align: col.align });
      curX += col.width;
    });

    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  // Gambar Setiap Baris Butir Soal
  questions.forEach((q, idx) => {
    // Siapkan teks multi baris
    const cpText = q.cp || 'Pemahaman IPAS (Sejarah & Sosial Budaya)';
    const tpText = q.tp || 'Menganalisis perjuangan bangsa Indonesia pada masa kolonial Belanda.';
    const indText = q.indikator || q.text;

    doc.setFontSize(6.5);
    const cpLines = doc.splitTextToSize(cpText, 41);
    const tpLines = doc.splitTextToSize(tpText, 45);
    const indLines = doc.splitTextToSize(indText, 80);

    const maxLineCount = Math.max(cpLines.length, tpLines.length, indLines.length, 2);
    const rowHeight = Math.max(8, maxLineCount * 3.2 + 3);

    // Cek batas halaman
    if (y + rowHeight > pageHeight - 16) {
      doc.addPage();
      y = 14;
      drawTableHeader(y);
      y += 7;
    }

    // Zebra striping
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginLeft, y, contentWidth, rowHeight, 'F');
    }

    // Garis pembatas bawah baris
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, rowHeight, 'S');

    // Render kolom teks
    let curX = marginLeft;
    tableCols.forEach((col) => {
      doc.setDrawColor(226, 232, 240);
      doc.line(curX, y, curX, y + rowHeight);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(30, 41, 59);

      if (col.key === 'no') {
        doc.setFont('helvetica', 'bold');
        doc.text(String(q.id), curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'cp') {
        doc.text(cpLines, curX + 1.5, y + 3.8);
      } else if (col.key === 'tp') {
        doc.text(tpLines, curX + 1.5, y + 3.8);
      } else if (col.key === 'indikator') {
        doc.text(indLines, curX + 1.5, y + 3.8);
      } else if (col.key === 'level') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(q.levelKognitif === 'L3' ? 180 : 30, q.levelKognitif === 'L3' ? 83 : 41, q.levelKognitif === 'L3' ? 9 : 59);
        doc.text(q.levelKognitif || 'L2', curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'bentuk') {
        const typeLabel =
          q.type === 'pg'
            ? 'Pilihan Ganda'
            : q.type === 'pgk'
            ? 'PG Kompleks'
            : q.type === 'pgk_kategori'
            ? 'PGK Kategori'
            : q.type === 'menjodohkan'
            ? 'Menjodohkan'
            : q.type === 'isian'
            ? 'Isian Singkat'
            : 'Uraian';
        doc.text(typeLabel, curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'kunci') {
        const kunciText =
          q.type === 'pg'
            ? `Kunci: ${q.correctAnswer} (${q.bobotSkor || 1} pt)`
            : q.type === 'pgk'
            ? `(PGK) ${q.bobotSkor || 1} pt`
            : q.type === 'uraian'
            ? `Rubrik (${q.bobotSkor || 2} pt)`
            : `${q.bobotSkor || 1} pt`;
        doc.setFont('helvetica', 'bold');
        doc.text(kunciText, curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'kesukaran') {
        doc.text(q.difficulty, curX + col.width / 2, y + 4.5, { align: 'center' });
      }

      curX += col.width;
    });

    // Garis kanan tabel
    doc.line(marginLeft + contentWidth, y, marginLeft + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  // Tanda Tangan Resmi
  if (y + 35 > pageHeight - 16) {
    doc.addPage();
    y = 16;
  } else {
    y += 8;
  }

  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 10;
  const colRightX = pageWidth - marginRight - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala SD Negeri 3 Loloan Timur,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text(`Guru Kelas VI / Pengampu ${CONFIG.MATA_PELAJARAN},`, colRightX, y + 4.5);

  const sigY = y + 22;
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigY);
  doc.line(colLeftX, sigY + 1, colLeftX + 55, sigY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(CONFIG.GURU, colRightX, sigY);
  doc.line(colRightX, sigY + 1, colRightX + 55, sigY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${CONFIG.LABEL_NIP_GURU || 'NIP'}. ${CONFIG.NIP_GURU}`, colRightX, sigY + 5);

  // Footer di semua halaman
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Matriks Kisi-Kisi Resmi Kurikulum Merdeka • ${CONFIG.SEKOLAH} • Mata Pelajaran ${CONFIG.MATA_PELAJARAN} Kelas VI`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Kisi_Kisi_Soal_${CONFIG.MATA_PELAJARAN}_Kelas_${CONFIG.KELAS}_SDN_3_Loloan_Timur.pdf`);
}

/**
 * 6. Download Laporan Analisis Butir Soal & Daya Serap Siswa (PDF Landscape)
 */
export function downloadAnalisisButirPDF(results: ExamResult[], rawQuestions: Question[]): void {
  const questions = rawQuestions.map(enrichQuestion);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 269mm

  let y = 14;

  // Header Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Garis Kop Ganda
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // Judul Dokumen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LAPORAN ANALISIS BUTIR SOAL & MATRIKS DAYA SERAP SISWA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Kelas ${CONFIG.KELAS} • Tahun Ajaran: 2025/2026 • Standar KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Hitung Statistik Kelas
  const totalSiswa = results.length;
  const tuntas = results.filter((r) => (r.nilai || 0) >= CONFIG.KKTP).length;
  const remedial = totalSiswa - tuntas;
  const persenTuntas = totalSiswa > 0 ? Math.round((tuntas / totalSiswa) * 100) : 0;
  const rataRata = totalSiswa > 0 ? (results.reduce((a, b) => a + (b.nilai || 0), 0) / totalSiswa).toFixed(1) : '0';

  // Kotak Ringkasan
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 12, 1.5, 1.5, 'FD');

  const metricItems = [
    { label: 'Total Peserta Tes', val: `${totalSiswa} Siswa` },
    { label: 'Tuntas KKTP (>= 60)', val: `${tuntas} Siswa (${persenTuntas}%)` },
    { label: 'Perlu Remedial (< 60)', val: `${remedial} Siswa` },
    { label: 'Rata-rata Nilai Kelas', val: `${rataRata} / 100` },
    { label: 'Ketuntasan Klasikal', val: persenTuntas >= 85 ? 'Tuntas Klasikal (>= 85%)' : 'Belum Tuntas Klasikal' },
  ];

  const mColWidth = contentWidth / metricItems.length;
  metricItems.forEach((m, idx) => {
    const mx = marginLeft + idx * mColWidth + mColWidth / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, mx, y + 4.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(m.val, mx, y + 9.5, { align: 'center' });
  });

  y += 16;

  // TABEL 1: ANALISIS BUTIR SOAL
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('I. Analisis Ketercapaian & Klasifikasi Empiris Tingkat Kesukaran Soal', marginLeft, y);
  y += 4;

  const itemCols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'topik', title: 'Materi Pokok / Indikator Singkat', width: 85, align: 'left' as const },
    { key: 'tipe', title: 'Bentuk', width: 26, align: 'center' as const },
    { key: 'level', title: 'Level', width: 14, align: 'center' as const },
    { key: 'bobot', title: 'Maks', width: 14, align: 'center' as const },
    { key: 'benar', title: 'Siswa Benar', width: 26, align: 'center' as const },
    { key: 'dayaSerap', title: 'Daya Serap (%)', width: 28, align: 'center' as const },
    { key: 'kesukaran', title: 'Kesukaran Empiris', width: 33, align: 'center' as const },
    { key: 'tindakLanjut', title: 'Rekomendasi Tindak Lanjut', width: 34, align: 'left' as const },
  ];

  const drawItemHeader = (curY: number) => {
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(marginLeft, curY, contentWidth, 6.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    let curX = marginLeft;
    itemCols.forEach((col) => {
      const tx = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, tx, curY + 4.5, { align: col.align });
      curX += col.width;
    });

    doc.setTextColor(0, 0, 0);
  };

  drawItemHeader(y);
  y += 6.5;

  // Analisis per butir soal
  questions.forEach((q, idx) => {
    const maxScore = q.bobotSkor || (q.type === 'uraian' ? 2 : 1);
    let totalScoreEarned = 0;
    let fullCorrectCount = 0;

    results.forEach((r) => {
      const studentScore = (r.itemScores && typeof r.itemScores[q.id] === 'number')
        ? r.itemScores[q.id]
        : 0;

      totalScoreEarned += studentScore;
      if (studentScore === maxScore) fullCorrectCount++;
    });

    const totalPossibleScore = (totalSiswa || 1) * maxScore;
    const dayaSerapPct = totalSiswa > 0 ? Math.round((totalScoreEarned / totalPossibleScore) * 100) : 0;

    let klasifikasi: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
    let rekomendasi = 'Dikuasai baik oleh sebagian besar siswa.';
    if (dayaSerapPct > 70) {
      klasifikasi = 'Mudah';
      rekomendasi = 'Daya serap sangat baik; pertahankan materi.';
    } else if (dayaSerapPct < 30) {
      klasifikasi = 'Sukar';
      rekomendasi = 'Perlu remedial klasikal & penguatan konsep.';
    }

    const rowH = 6;
    if (y + rowH > pageHeight - 16) {
      doc.addPage();
      y = 14;
      drawItemHeader(y);
      y += 6.5;
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginLeft, y, contentWidth, rowH, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, rowH, 'S');

    let curX = marginLeft;
    itemCols.forEach((col) => {
      doc.setDrawColor(226, 232, 240);
      doc.line(curX, y, curX, y + rowH);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);

      if (col.key === 'no') {
        doc.setFont('helvetica', 'bold');
        doc.text(String(q.id), curX + col.width / 2, y + 4.2, { align: 'center' });
      } else if (col.key === 'topik') {
        const shortTopic = doc.splitTextToSize(q.topic || q.text, 82)[0] || '';
        doc.text(shortTopic, curX + 1.5, y + 4.2);
      } else if (col.key === 'tipe') {
        doc.text(q.type.toUpperCase(), curX + col.width / 2, y + 4.2, { align: 'center' });
      } else if (col.key === 'level') {
        doc.setFont('helvetica', 'bold');
        doc.text(q.levelKognitif || 'L2', curX + col.width / 2, y + 4.2, { align: 'center' });
      } else if (col.key === 'bobot') {
        doc.text(`${maxScore} pt`, curX + col.width / 2, y + 4.2, { align: 'center' });
      } else if (col.key === 'benar') {
        doc.text(`${fullCorrectCount} / ${totalSiswa}`, curX + col.width / 2, y + 4.2, { align: 'center' });
      } else if (col.key === 'dayaSerap') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(dayaSerapPct >= 70 ? 22 : dayaSerapPct < 30 ? 225 : 30, dayaSerapPct >= 70 ? 101 : dayaSerapPct < 30 ? 29 : 41, dayaSerapPct >= 70 ? 52 : dayaSerapPct < 30 ? 72 : 59);
        doc.text(`${dayaSerapPct}%`, curX + col.width / 2, y + 4.2, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      } else if (col.key === 'kesukaran') {
        doc.text(klasifikasi, curX + col.width / 2, y + 4.2, { align: 'center' });
      } else if (col.key === 'tindakLanjut') {
        doc.text(doc.splitTextToSize(rekomendasi, 32)[0] || '', curX + 1.5, y + 4.2);
      }

      curX += col.width;
    });

    y += rowH;
  });

  // Tanda Tangan Resmi
  if (y + 35 > pageHeight - 16) {
    doc.addPage();
    y = 16;
  } else {
    y += 8;
  }

  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 10;
  const colRightX = pageWidth - marginRight - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala SD Negeri 3 Loloan Timur,', colLeftX, y + 4.5);

  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text(`Guru Kelas VI / Pengampu ${CONFIG.MATA_PELAJARAN},`, colRightX, y + 4.5);

  const sigY = y + 22;
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigY);
  doc.line(colLeftX, sigY + 1, colLeftX + 55, sigY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(CONFIG.GURU, colRightX, sigY);
  doc.line(colRightX, sigY + 1, colRightX + 55, sigY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${CONFIG.LABEL_NIP_GURU || 'NIP'}. ${CONFIG.NIP_GURU}`, colRightX, sigY + 5);

  // Footer di semua halaman
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Laporan Resmi Analisis Butir Soal • ${CONFIG.SEKOLAH} • Kurikulum Merdeka ${CONFIG.MATA_PELAJARAN} Kelas VI`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Laporan_Analisis_Butir_Soal_${CONFIG.MATA_PELAJARAN}_Kelas_${CONFIG.KELAS}.pdf`);
}
