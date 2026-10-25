import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  HeightRule,
} from 'docx';
import { saveAs } from 'file-saver';
import { CONFIG } from '../config';
import { Question, ExamResult } from '../types';

/**
 * Format tanggal dalam bahasa Indonesia
 */
function getIndonesianDate(dateStr?: string): string {
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
 * Buat Kop Surat Resmi dalam format .docx
 */
function createKopSuratParagraphs(): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'PEMERINTAH KABUPATEN JEMBRANA',
          bold: true,
          size: 22, // 11pt
          font: 'Times New Roman',
        }),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA',
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman',
        }),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: CONFIG.SEKOLAH.toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: 'Times New Roman',
        }),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: CONFIG.ALAMAT_SEKOLAH,
          size: 18, // 9pt
          italics: true,
          font: 'Times New Roman',
        }),
      ],
      spacing: { after: 120 },
      border: {
        bottom: {
          style: BorderStyle.DOUBLE,
          size: 12,
          color: '000000',
        },
      },
    }),
  ];
}

/**
 * Generator Naskah Soal Lengkap (.docx)
 */
export async function downloadExamDocx(questions: Question[]): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2 cm
              bottom: 1134,
              left: 1417, // ~2.5 cm
              right: 1417,
            },
          },
        },
        children: [
          // 1. KOP SURAT
          ...createKopSuratParagraphs(),

          // 2. JUDUL NASKAH
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'NASKAH SOAL TES SUMATIF (KURIKULUM MERDEKA)',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 180, after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `TAHUN AJARAN ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
                bold: true,
                size: 20,
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 200 },
          }),

          // 3. TABEL IDENTITAS UJIAN & SISWA
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Mata Pelajaran', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `: ${CONFIG.MATA_PELAJARAN}`, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Hari, Tanggal', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `: .....................`, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Kelas / Semester', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `: ${CONFIG.KELAS} (Enam) / Genap`, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Waktu / KKTP', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `: ${CONFIG.ALOKASI_WAKTU} / ${CONFIG.KKTP}`, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Materi Pokok', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    columnSpan: 3,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `: ${CONFIG.MATERI}`,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Nama Peserta', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: ': ....................................', font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Nomor Absen', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: ': ................', font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 4. PETUNJUK UMUM
          new Paragraph({
            children: [
              new TextRun({ text: 'PETUNJUK UMUM:', bold: true, font: 'Times New Roman', size: 20 }),
            ],
            spacing: { before: 200, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Berdoalah sebelum memulai mengerjakan soal.\n2. Tuliskan nama lengkap dan nomor absen Anda pada tempat yang telah disediakan.\n3. Jumlah soal sebanyak 35 butir terdiri dari: 10 Pilihan Ganda, 5 Pilihan Ganda Kompleks, 5 PGK Kategori, 5 Menjodohkan, 5 Isian Singkat, dan 5 Uraian.\n4. Dahulukan menjawab soal-soal yang Anda anggap paling mudah.\n5. Periksa kembali seluruh pekerjaan Anda sebelum diserahkan kepada Guru Pengawas.',
                font: 'Times New Roman',
                size: 19,
              }),
            ],
            spacing: { after: 240 },
          }),

          // 5. BUTIR-BUTIR SOAL
          ...generateQuestionSectionsParagraphs(questions),

          // 6. LEMBAR PENGESAHAN
          new Paragraph({
            children: [
              new TextRun({
                text: `${CONFIG.KOTA}, ${getIndonesianDate()}`,
                font: 'Times New Roman',
                size: 20,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 360, after: 120 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Mengetahui,\nKepala Sekolah', bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                      new Paragraph({ text: '', spacing: { after: 1200 } }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: CONFIG.KEPALA_SEKOLAH,
                            bold: true,
                            underline: {},
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: `NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: `Guru Mata Pelajaran ${CONFIG.MATA_PELAJARAN}`, bold: true, font: 'Times New Roman' }),
                        ],
                      }),
                      new Paragraph({ text: '', spacing: { after: 1200 } }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: CONFIG.GURU,
                            bold: true,
                            underline: {},
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: `${CONFIG.LABEL_NIP_GURU}. ${CONFIG.NIP_GURU}`, font: 'Times New Roman' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 7. LAMPIRAN: KUNCI JAWABAN & KISI-KISI
          new Paragraph({
            children: [
              new TextRun({
                text: 'LAMPIRAN 1: KISI-KISI & KUNCI JAWABAN LENGKAP',
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 400, after: 120 },
          }),
          ...generateAnswerKeyAndRubricParagraphs(questions),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Naskah_Soal_Sumatif_${CONFIG.MATA_PELAJARAN}_Kelas_6_${CONFIG.SEKOLAH.replace(/\s+/g, '_')}.docx`);
}

/**
 * Generate Paragraphs untuk setiap section soal
 */
function generateQuestionSectionsParagraphs(questions: Question[]): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  // Filter per kategori
  const pgList = questions.filter((q) => q.type === 'pg');
  const pgkList = questions.filter((q) => q.type === 'pgk');
  const kategoriList = questions.filter((q) => q.type === 'pgk_kategori');
  const menjodohkanList = questions.filter((q) => q.type === 'menjodohkan');
  const isianList = questions.filter((q) => q.type === 'isian');
  const uraianList = questions.filter((q) => q.type === 'uraian');

  // BAGIAN I: PILIHAN GANDA (10 Soal)
  if (pgList.length > 0) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'I. PILIHAN GANDA (Pilihlah salah satu jawaban A, B, C, atau D yang paling tepat!)',
            bold: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
        spacing: { before: 200, after: 120 },
      })
    );

    pgList.forEach((q) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${q.id}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: q.text, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 40 },
        })
      );

      if (q.options) {
        q.options.forEach((opt) => {
          elements.push(
            new Paragraph({
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${opt.id}. `, bold: true, font: 'Times New Roman' }),
                new TextRun({ text: opt.text, font: 'Times New Roman' }),
              ],
              spacing: { after: 20 },
            })
          );
        });
      }
    });
  }

  // BAGIAN II: PILIHAN GANDA KOMPLEKS (5 Soal)
  if (pgkList.length > 0) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'II. PILIHAN GANDA KOMPLEKS (Pilihlah lebih dari satu jawaban yang benar!)',
            bold: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );

    pgkList.forEach((q) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${q.id}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: q.text, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 40 },
        })
      );

      if (q.options) {
        q.options.forEach((opt) => {
          elements.push(
            new Paragraph({
              indent: { left: 400 },
              children: [
                new TextRun({ text: `[  ] ${opt.id}. `, bold: true, font: 'Times New Roman' }),
                new TextRun({ text: opt.text, font: 'Times New Roman' }),
              ],
              spacing: { after: 20 },
            })
          );
        });
      }
    });
  }

  // BAGIAN III: PGK KATEGORI (5 Soal)
  if (kategoriList.length > 0) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'III. PILIHAN GANDA KOMPLEKS KATEGORI (Berilah tanda centang (✓) pada respon yang sesuai!)',
            bold: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );

    kategoriList.forEach((q) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${q.id}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: q.text, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 60 },
        })
      );

      if (q.statements && q.statements.length > 0) {
        const rows = [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true, font: 'Times New Roman' })] })],
              }),
              new TableCell({
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: 'Pernyataan', bold: true, font: 'Times New Roman' })] })],
              }),
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: q.statements[0].trueLabel || 'Benar', bold: true, font: 'Times New Roman' })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: q.statements[0].falseLabel || 'Salah', bold: true, font: 'Times New Roman' })],
                  }),
                ],
              }),
            ],
          }),
        ];

        q.statements.forEach((st, idx) => {
          rows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: `${idx + 1}`, font: 'Times New Roman' })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: st.text, font: 'Times New Roman' })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '[   ]', font: 'Times New Roman' })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '[   ]', font: 'Times New Roman' })] })],
                }),
              ],
            })
          );
        });

        elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
      }
    });
  }

  // BAGIAN IV: MENJODOHKAN (5 Soal)
  if (menjodohkanList.length > 0) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'IV. MENJODOHKAN (Pasangkan pernyataan pada Kolom Kiri dengan jawaban pada Kolom Kanan!)',
            bold: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );

    menjodohkanList.forEach((q) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${q.id}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: q.text, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 60 },
        })
      );

      if (q.matchingPairs && q.matchingPairs.length > 0) {
        const rows = [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 45, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: 'Kolom A (Premis/Pernyataan)', bold: true, font: 'Times New Roman' })] })],
              }),
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pasangan', bold: true, font: 'Times New Roman' })] })],
              }),
              new TableCell({
                width: { size: 45, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: 'Kolom B (Pilihan Jawaban)', bold: true, font: 'Times New Roman' })] })],
              }),
            ],
          }),
        ];

        q.matchingPairs.forEach((pair, pIdx) => {
          rows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `${pIdx + 1}. `, bold: true, font: 'Times New Roman' }),
                        new TextRun({ text: pair.premise, font: 'Times New Roman' }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: '( .... )', font: 'Times New Roman' })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `${String.fromCharCode(65 + pIdx)}. `, bold: true, font: 'Times New Roman' }),
                        new TextRun({ text: pair.match, font: 'Times New Roman' }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          );
        });

        elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
      }
    });
  }

  // BAGIAN V: ISIAN SINGKAT (5 Soal)
  if (isianList.length > 0) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'V. ISIAN SINGKAT (Isilah titik-titik di bawah ini dengan jawaban yang benar dan tepat!)',
            bold: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );

    isianList.forEach((q) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${q.id}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: q.text, font: 'Times New Roman' }),
          ],
          spacing: { before: 60, after: 20 },
        }),
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({
              text: 'Jawaban: ..........................................................................................',
              italics: true,
              color: '475569',
              font: 'Times New Roman',
            }),
          ],
          spacing: { after: 60 },
        })
      );
    });
  }

  // BAGIAN VI: URAIAN (5 Soal)
  if (uraianList.length > 0) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'VI. URAIAN / ESSAY (Jawablah pertanyaan-pertanyaan berikut dengan jelas, lengkap, dan sistematis!)',
            bold: true,
            font: 'Times New Roman',
            size: 20,
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );

    uraianList.forEach((q) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${q.id}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: q.text, font: 'Times New Roman' }),
          ],
          spacing: { before: 80, after: 60 },
        }),
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({
              text: 'Lembar Jawaban Siswa:\n..................................................................................................................................................................................................................\n..................................................................................................................................................................................................................\n..................................................................................................................................................................................................................\n..................................................................................................................................................................................................................',
              color: '64748b',
              font: 'Times New Roman',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  return elements;
}

/**
 * Generate Lampiran Kunci Jawaban & Rubrik Penskoran
 */
function generateAnswerKeyAndRubricParagraphs(questions: Question[]): Paragraph[] {
  const elements: Paragraph[] = [];

  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'A. KUNCI JAWABAN BAGIAN I - V',
          bold: true,
          font: 'Times New Roman',
          size: 20,
        }),
      ],
      spacing: { before: 100, after: 60 },
    })
  );

  questions.forEach((q) => {
    let keyStr = '';
    if (q.type === 'pg') {
      const opt = q.options?.find((o) => o.id === q.correctAnswer);
      keyStr = `${q.correctAnswer} (${opt?.text || ''})`;
    } else if (q.type === 'pgk') {
      const keys = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
      keyStr = `Opsi benar: ${keys.join(', ')}`;
    } else if (q.type === 'pgk_kategori') {
      keyStr = (q.statements || [])
        .map((st, idx) => `Pernyataan ${idx + 1}: ${st.correctAnswer ? (st.trueLabel || 'Benar') : (st.falseLabel || 'Salah')}`)
        .join('; ');
    } else if (q.type === 'menjodohkan') {
      keyStr = (q.matchingPairs || [])
        .map((p) => `[${p.premise} -> ${p.match}]`)
        .join('; ');
    } else if (q.type === 'isian') {
      keyStr = String(q.correctAnswer).toUpperCase();
    } else if (q.type === 'uraian') {
      keyStr = `Rubrik: ${q.rubric || 'Lihat pedoman kunci poin uraian'}`;
    }

    elements.push(
      new Paragraph({
        children: [
          new TextRun({ text: `No. ${q.id} [${q.type.toUpperCase()}] (${q.difficulty}): `, bold: true, font: 'Times New Roman' }),
          new TextRun({ text: keyStr, font: 'Times New Roman' }),
        ],
        spacing: { after: 40 },
      })
    );
  });

  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'B. PEDOMAN PENSKORAN & NILAI AKHIR (KKTP: 60)',
          bold: true,
          font: 'Times New Roman',
          size: 20,
        }),
      ],
      spacing: { before: 180, after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '1. Pilihan Ganda: 10 butir x 1 poin = 10 poin maksimal\n2. Pilihan Ganda Kompleks: 5 butir x 1 poin = 5 poin maksimal\n3. PGK Kategori: 5 butir x 1 poin = 5 poin maksimal\n4. Menjodohkan: 5 butir x 1 poin = 5 poin maksimal\n5. Isian Singkat: 5 butir x 1 poin = 5 poin maksimal\n6. Uraian: 5 butir x 2 poin = 10 poin maksimal\n\nTotal Skor Maksimal = 40 Poin\nRumus Nilai Akhir = (Total Skor Perolehan / 40) x 100\nKriteria Ketuntasan (KKTP): Siswa dinyatakan TUNTAS jika memperoleh Nilai Akhir ≥ 60.',
          font: 'Times New Roman',
        }),
      ],
      spacing: { after: 120 },
    })
  );

  return elements;
}
