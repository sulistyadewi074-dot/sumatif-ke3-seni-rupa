import React, { useState } from 'react';
import { GAS_SCRIPT_TEMPLATE } from '../services/gasService';
import { CONFIG } from '../config';
import { X, Copy, Check, ExternalLink, Code2, AlertCircle } from 'lucide-react';

interface GasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasGuideModal: React.FC<GasGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Panduan Integrasi Google Apps Script
              </h3>
              <p className="text-xs text-slate-500">
                Langkah menghubungkan Google Spreadsheet sebagai sumber data utama
              </p>
            </div>
          </div>
          <button
            id="btn-close-gas-guide"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-slate-700 pr-1">
          {/* Info URL Aktif */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            <span className="font-bold block mb-1">URL Endpoint Google Apps Script Terpasang:</span>
            <code className="font-mono text-[11px] break-all bg-white px-2 py-1 rounded border border-blue-200 block text-blue-800">
              {CONFIG.GOOGLE_APPS_SCRIPT_URL}
            </code>
          </div>

          {/* Callout Khusus: Fitur 1 Spreadsheet untuk Banyak Aplikasi Mapel */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs sm:text-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Bisa 1 Google Spreadsheet untuk Banyak Aplikasi Mapel Berbeda?</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>Sangat Bisa!</strong> Skrip Google Apps Script kami sudah dilengkapi fitur <em>Smart Multi-Sheet Router</em>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>
                <strong>Otomatis Membagi Tab:</strong> Jika siswa mengirim tes IPAS, data otomatis masuk ke tab <code>IPAS</code>. Jika dari aplikasi Matematika, data masuk ke tab <code>MATEMATIKA</code>.
              </li>
              <li>
                <strong>Tab Master Gabungan:</strong> Seluruh hasil ujian dari semua aplikasi juga disalin otomatis ke tab <code>SEMUA_MAPEL</code>.
              </li>
              <li>
                <strong>Cukup 1 Kali Deploy:</strong> Satu URL Web App yang sama dapat Anda pasang di semua aplikasi tes sumatif mapel lain (Seni Rupa, IPAS, Matematika, dll.).
              </li>
            </ul>
          </div>

          {/* Langkah demi langkah */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Langkah Konfigurasi di Google Spreadsheet:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed text-slate-600">
              <li>
                Buka <strong className="text-slate-800">Google Spreadsheet</strong> baru di akun Google Anda.
              </li>
              <li>
                Pada baris 1 (Header Sheet1), pastikan kolom diberi nama persis seperti berikut:
                <div className="mt-1.5 p-2 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-800 overflow-x-auto whitespace-nowrap">
                  A1: Timestamp | B1: Nama | C1: Kelas | D1: Nomor Absen | E1: Tanggal Lahir | F1: Benar | G1: Salah | H1: Nilai | I1: Status | J1: Mata Pelajaran
                </div>
              </li>
              <li>
                Klik menu <strong className="text-slate-800">Ekstensi</strong> &gt; <strong className="text-slate-800">Apps Script</strong>.
              </li>
              <li>
                Hapus kode bawaan, lalu salin dan tempel kode skrip di bawah ini ke editor Apps Script, lalu klik ikon <strong>Simpan (Disket)</strong>.
              </li>
              <li>
                <strong className="text-amber-700">Catatan:</strong> Anda <strong>TIDAK PERLU</strong> menekan tombol <em>"Jalankan" (Run)</em>. Skrip ini adalah Web App yang akan berjalan otomatis saat siswa mengirim ujian. (Namun jika ingin menguji, pilih fungsi <code>setupAwalSpreadsheet</code> di menu atas lalu klik Jalankan).
              </li>
              <li>
                Klik tombol biru di kanan atas: <strong className="text-blue-700">Terapkan (Deploy)</strong> &gt; <strong className="text-slate-800">Penerapan baru (New Deployment)</strong>.
              </li>
              <li>
                Klik ikon gerigi di sebelah kiri, pilih jenis <strong className="text-slate-800">Aplikasi Web (Web App)</strong>.
              </li>
              <li>
                <strong className="text-red-600">PENGATURAN WAJIB:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700 pl-2">
                  <li>Jalankan sebagai (Execute as): <strong>Saya (Me / email Anda)</strong></li>
                  <li>Siapa yang memiliki akses (Who has access): <strong className="text-red-700">Siapa saja (Anyone)</strong> (Wajib agar siswa bisa mengirim nilai tanpa login Google).</li>
                </ul>
              </li>
              <li>
                Klik <strong className="text-slate-800">Terapkan</strong>, klik <em>Beri Akses (Authorize access)</em> dengan akun Google Anda, lalu salin <strong>URL Aplikasi Web</strong> (berakhiran <code>/exec</code>).
              </li>
              <li>
                Kembali ke aplikasi ini $\rightarrow$ buka <strong>Panel Guru</strong> $\rightarrow$ klik <strong>Pengaturan URL Spreadsheet</strong> $\rightarrow$ tempelkan URL tersebut. Selesai!
              </li>
            </ol>
          </div>

          {/* Box Kode Skrip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">
                Kode Lengkap Google Apps Script (doGet &amp; doPost):
              </span>
              <button
                id="btn-copy-gas-script"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Skrip'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 leading-normal">
              {GAS_SCRIPT_TEMPLATE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
