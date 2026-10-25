import React, { useState } from 'react';
import { Question, OptionItem, StatementItem, Difficulty } from '../types';
import { X, Save, Edit3, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface QuestionEditorModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !question) return null;

  const [text, setText] = useState(question.text);
  const [topic, setTopic] = useState(question.topic);
  const [difficulty, setDifficulty] = useState<Difficulty>(question.difficulty);
  const [explanation, setExplanation] = useState(question.explanation);

  // State untuk options (PG & PGK)
  const [options, setOptions] = useState<OptionItem[]>(
    question.options ? JSON.parse(JSON.stringify(question.options)) : []
  );

  // State untuk kunci jawaban PG & PGK & Isian
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>(
    question.correctAnswer || (question.type === 'pgk' ? [] : question.type === 'isian' ? '' : 'A')
  );

  // State untuk accepted answers (Isian)
  const [acceptedAnswersStr, setAcceptedAnswersStr] = useState<string>(
    (question.acceptedAnswers || []).join(', ')
  );

  // State untuk statements (PGK Kategori)
  const [statements, setStatements] = useState<StatementItem[]>(
    question.statements ? JSON.parse(JSON.stringify(question.statements)) : []
  );

  const handleOptionTextChange = (idx: number, newText: string) => {
    const updated = [...options];
    updated[idx].text = newText;
    setOptions(updated);
  };

  const handleTogglePgkCorrect = (optId: string) => {
    const currentList = Array.isArray(correctAnswer) ? [...correctAnswer] : [];
    if (currentList.includes(optId)) {
      setCorrectAnswer(currentList.filter((id) => id !== optId));
    } else {
      setCorrectAnswer([...currentList, optId]);
    }
  };

  const handleStatementTextChange = (idx: number, newText: string) => {
    const updated = [...statements];
    updated[idx].text = newText;
    setStatements(updated);
  };

  const handleStatementAnswerChange = (idx: number, val: boolean) => {
    const updated = [...statements];
    updated[idx].correctAnswer = val;
    setStatements(updated);
  };

  // State untuk matchingPairs (Menjodohkan)
  const [matchingPairs, setMatchingPairs] = useState(
    question.matchingPairs ? JSON.parse(JSON.stringify(question.matchingPairs)) : []
  );

  // State untuk keyPoints & rubric (Uraian)
  const [keyPointsStr, setKeyPointsStr] = useState(
    (question.keyPoints || []).join('\n')
  );
  const [rubric, setRubric] = useState(question.rubric || '');

  const handleMatchingPairChange = (idx: number, field: 'premise' | 'match', val: string) => {
    const updated = [...matchingPairs];
    updated[idx][field] = val;
    setMatchingPairs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const acceptedArr = acceptedAnswersStr
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const kpArr = keyPointsStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated: Question = {
      ...question,
      text: text.trim(),
      topic: topic.trim(),
      difficulty,
      explanation: explanation.trim(),
      options: question.type === 'pg' || question.type === 'pgk' ? options : undefined,
      statements: question.type === 'pgk_kategori' ? statements : undefined,
      matchingPairs: question.type === 'menjodohkan' ? matchingPairs : undefined,
      correctAnswer: question.type === 'isian' ? (typeof correctAnswer === 'string' ? correctAnswer.trim().toLowerCase() : '') : correctAnswer,
      acceptedAnswers: question.type === 'isian' ? (acceptedArr.length > 0 ? acceptedArr : [String(correctAnswer).trim().toLowerCase()]) : undefined,
      keyPoints: question.type === 'uraian' ? kpArr : undefined,
      rubric: question.type === 'uraian' ? rubric.trim() : undefined,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Edit Soal Nomor {question.id}
              </h3>
              <p className="text-xs text-slate-500">
                Tipe: {question.type.toUpperCase()} • Topik: {question.topic}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 pr-1 text-xs sm:text-sm">
          {/* Topik & Tingkat Kesulitan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topik / Materi Soal
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sukar">Sukar</option>
              </select>
            </div>
          </div>

          {/* Teks Pertanyaan Soal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teks Butir Soal
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Opsi Jawaban untuk PG */}
          {question.type === 'pg' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Jawaban &amp; Tentukan Kunci Jawaban (Pilih Radio)
              </label>
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-opt-pg"
                    id={`opt-radio-${opt.id}`}
                    checked={correctAnswer === opt.id}
                    onChange={() => setCorrectAnswer(opt.id)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="w-6 font-bold text-slate-700 text-xs">{opt.id}.</span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Opsi Jawaban untuk PGK */}
          {question.type === 'pgk' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Jawaban &amp; Tentukan Kunci Jawaban (Centang yang Benar)
              </label>
              {options.map((opt, idx) => {
                const currentArr = Array.isArray(correctAnswer) ? correctAnswer : [];
                const isChecked = currentArr.includes(opt.id);

                return (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`opt-check-${opt.id}`}
                      checked={isChecked}
                      onChange={() => handleTogglePgkCorrect(opt.id)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span className="w-6 font-bold text-slate-700 text-xs">{opt.id}.</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Pernyataan untuk PGK Kategori */}
          {question.type === 'pgk_kategori' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Deskripsi Pernyataan &amp; Respons Benar / Salah (atau Sesuai/Setuju)
              </label>
              {statements.map((st, idx) => (
                <div key={st.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">
                      Pernyataan #{idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name={`statement-${st.id}`}
                          checked={st.correctAnswer === true}
                          onChange={() => handleStatementAnswerChange(idx, true)}
                        />
                        <span className="text-emerald-700 font-bold">{st.trueLabel || 'Benar'}</span>
                      </label>
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name={`statement-${st.id}`}
                          checked={st.correctAnswer === false}
                          onChange={() => handleStatementAnswerChange(idx, false)}
                        />
                        <span className="text-rose-700 font-bold">{st.falseLabel || 'Salah'}</span>
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={st.text}
                    onChange={(e) => handleStatementTextChange(idx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Untuk Isian Singkat */}
          {question.type === 'isian' && (
            <div className="space-y-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kunci Jawaban Utama (Satu kata atau frasa)
                </label>
                <input
                  type="text"
                  value={typeof correctAnswer === 'string' ? correctAnswer : ''}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: Tawan Karang, Rodi, dsb..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Variasi Jawaban Diterima (Dipisahkan tanda koma)
                </label>
                <input
                  type="text"
                  value={acceptedAnswersStr}
                  onChange={(e) => setAcceptedAnswersStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: tawan karang, hak tawan karang"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Siswa yang mengetikkan salah satu kata di atas (tidak sensitif huruf besar/kecil) akan dinilai benar.
                </p>
              </div>
            </div>
          )}

          {/* Untuk Menjodohkan */}
          {question.type === 'menjodohkan' && (
            <div className="space-y-3 p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
              <label className="block text-xs font-bold text-purple-900">
                Daftar Pasangan Menjodohkan (Premis Kolom Kiri vs Pasangan Benar Kolom Kanan)
              </label>
              {matchingPairs.map((pair: any, idx: number) => (
                <div key={pair.id || idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-white rounded-lg border border-purple-100">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Premis #{idx + 1} (Kiri)</label>
                    <input
                      type="text"
                      value={pair.premise}
                      onChange={(e) => handleMatchingPairChange(idx, 'premise', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-purple-700 block">Pasangan Benar (Kanan)</label>
                    <input
                      type="text"
                      value={pair.match}
                      onChange={(e) => handleMatchingPairChange(idx, 'match', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-purple-300 text-xs font-semibold text-purple-900"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Untuk Uraian / Essay */}
          {question.type === 'uraian' && (
            <div className="space-y-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">
                  Poin Kunci Jawaban Benar (Satu poin per baris)
                </label>
                <textarea
                  rows={4}
                  value={keyPointsStr}
                  onChange={(e) => setKeyPointsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="Ketik poin-poin kunci jawaban di sini..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">
                  Pedoman / Rubrik Penskoran
                </label>
                <input
                  type="text"
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="Contoh: Skor 4 jika menjawab 3 unsur lengkap..."
                />
              </div>
            </div>
          )}

          {/* Pembahasan Soal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pembahasan Langkah Pengerjaan
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
