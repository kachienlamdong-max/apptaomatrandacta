import { 
  Document, 
  Packer, 
  Paragraph, 
  Table, 
  TableCell, 
  TableRow, 
  TextRun, 
  AlignmentType, 
  WidthType, 
  BorderStyle, 
  HeadingLevel 
} from 'docx';
import { ExamProject, ExamQuestion, ExamHeaderConfig, ShuffledExamVariant, MatrixRow, SpecificationItem } from '../types';
import { generateShuffledExamVariants } from './shuffler';

export type ExportProjectInput = Partial<ExamProject> & {
  header: ExamHeaderConfig;
  sampleExamQuestions: ExamQuestion[];
};

// Clean LaTeX notation for Word (e.g. $\frac{a}{b}$ to readable text or stripped LaTeX)
function cleanLatex(str: string): string {
  if (!str) return '';
  return str
    .replace(/\$\$(.*?)\$\$/g, '$1')
    .replace(/\$(.*?)\$/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\pm/g, '±')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\pi/g, 'π')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\infty/g, '∞')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\uparrow/g, '↑')
    .replace(/\\downarrow/g, '↓')
    .replace(/\\in/g, '∈')
    .replace(/\\subset/g, '⊂')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\text\{([^}]+)\}/g, '$1');
}

// Generate the official Ministry/School Header Table for a given Exam Code
function createOfficialHeaderTable(header: ExamHeaderConfig, examCode: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 48, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ 
                    text: header.provinceOrDept ? header.provinceOrDept.toUpperCase() : 'SỞ GIÁO DỤC VÀ ĐÀO TẠO', 
                    font: 'Times New Roman', 
                    size: 22 
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ 
                    text: header.schoolName ? header.schoolName.toUpperCase() : 'TRƯỜNG THPT CHU VĂN AN', 
                    bold: true, 
                    font: 'Times New Roman', 
                    size: 22 
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: '-----------------------', font: 'Times New Roman', size: 20 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Họ và tên thí sinh: .................................................', font: 'Times New Roman', size: 22 }),
                ],
                spacing: { before: 80 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Số báo danh: ...........................................................', font: 'Times New Roman', size: 22 }),
                ],
                spacing: { before: 40 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ 
                    text: header.examTitle ? header.examTitle.toUpperCase() : 'ĐỀ KIỂM TRA ĐỊNH KỲ', 
                    bold: true, 
                    font: 'Times New Roman', 
                    size: 24 
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ 
                    text: `MÔN: ${header.subject.toUpperCase()} - KHỐI ${header.grade.toUpperCase()}`, 
                    bold: true, 
                    font: 'Times New Roman', 
                    size: 24 
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ 
                    text: `Năm học: ${header.academicYear || '2024 - 2025'} (Bộ sách: ${header.curriculum || 'Chân trời sáng tạo'})`, 
                    italics: true, 
                    font: 'Times New Roman', 
                    size: 20 
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ 
                    text: `Thời gian làm bài: ${header.timeDuration} phút (không kể thời gian phát đề)`, 
                    italics: true, 
                    font: 'Times New Roman', 
                    size: 20 
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: `MÃ ĐỀ THI: ${examCode}`, bold: true, font: 'Times New Roman', size: 24 }),
                ],
                spacing: { before: 80 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Generate the paragraphs for an individual Exam Variant paper
function generateVariantParagraphs(
  header: ExamHeaderConfig, 
  variantQuestions: ExamQuestion[], 
  examCode: string,
  isFirstPage: boolean = false
): (Paragraph | Table)[] {
  const paragraphs: (Paragraph | Table)[] = [];

  const partConfigs = header.partConfigs || {
    part1: { name: 'Phần I (TN 4 lựa chọn)', pointsPerQuestion: 0.25, targetQuestions: 12 },
    part2: { name: 'Phần II (Đúng/Sai)', pointsPerQuestion: 1.0, targetQuestions: 4 },
    part3: { name: 'Phần III (Trả lời ngắn)', pointsPerQuestion: 0.5, targetQuestions: 6 },
    part4: { name: 'Phần IV (Tự luận)', pointsPerQuestion: 1.0, targetQuestions: 0 },
  };

  const p1_pts = partConfigs.part1?.pointsPerQuestion ?? 0.25;
  const p2_pts = partConfigs.part2?.pointsPerQuestion ?? 1.0;
  const p3_pts = partConfigs.part3?.pointsPerQuestion ?? 0.5;
  const p4_pts = partConfigs.part4?.pointsPerQuestion ?? 1.0;

  // Header Table
  const headerTable = createOfficialHeaderTable(header, examCode);

  if (!isFirstPage) {
    paragraphs.push(
      new Paragraph({
        children: [],
        pageBreakBefore: true,
      })
    );
  }

  paragraphs.push(headerTable);
  paragraphs.push(new Paragraph({ text: '', spacing: { before: 160, after: 120 } }));

  // Part 1 Questions
  const part1 = variantQuestions.filter(q => q.type === 'multiple_choice');
  if (part1.length > 0) {
    const p1TotalPts = (part1.length * p1_pts).toFixed(2);
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${p1TotalPts} điểm - ${p1_pts}đ/câu)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 80 },
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu 1 đến câu ${part1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất.`,
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 120 },
      })
    );

    part1.forEach((q, idx) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${idx + 1}: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 60 },
        })
      );

      if (q.options) {
        q.options.forEach(opt => {
          paragraphs.push(
            new Paragraph({
              indent: { left: 360 },
              children: [
                new TextRun({ text: `${opt.key}. `, bold: true, font: 'Times New Roman', size: 22 }),
                new TextRun({ text: cleanLatex(opt.content), font: 'Times New Roman', size: 22 }),
              ],
              spacing: { after: 40 },
            })
          );
        });
      }
    });
  }

  // Part 2 Questions: Đúng / Sai (Đếm lại từ câu 1)
  const part2 = variantQuestions.filter(q => q.type === 'true_false');
  if (part2.length > 0) {
    const p2TotalPts = (part2.length * p2_pts).toFixed(2);
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN II. Câu trắc nghiệm đúng sai (${p2TotalPts} điểm - ${p2_pts}đ/câu)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 240, after: 80 },
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu 1 đến câu ${part2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`,
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 120 },
      })
    );

    part2.forEach((q, idx) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${idx + 1}: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 60 },
        })
      );

      if (q.trueFalseItems) {
        q.trueFalseItems.forEach(item => {
          paragraphs.push(
            new Paragraph({
              indent: { left: 360 },
              children: [
                new TextRun({ text: `${item.key}) `, bold: true, font: 'Times New Roman', size: 22 }),
                new TextRun({ text: cleanLatex(item.statement), font: 'Times New Roman', size: 22 }),
              ],
              spacing: { after: 40 },
            })
          );
        });
      }
    });
  }

  // Part 3 Questions: Trả lời ngắn (Đếm lại từ câu 1)
  const part3 = variantQuestions.filter(q => q.type === 'short_answer');
  if (part3.length > 0) {
    const p3TotalPts = (part3.length * p3_pts).toFixed(2);
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN III. Câu trắc nghiệm trả lời ngắn (${p3TotalPts} điểm - ${p3_pts}đ/câu)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 240, after: 80 },
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu 1 đến câu ${part3.length}. Điền kết quả vào ô tương ứng trên phiếu trả lời.`,
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 120 },
      })
    );

    part3.forEach((q, idx) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${idx + 1}: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 60 },
        })
      );
    });
  }

  // Part 4 Questions: Tự luận (Đếm lại từ câu 1)
  const part4 = variantQuestions.filter(q => q.type === 'essay');
  if (part4.length > 0) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN IV. Tự luận`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 240, after: 80 },
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Thí sinh trình bày lời giải chi tiết vào giấy thi.`,
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 120 },
      })
    );

    part4.forEach((q, idx) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${idx + 1} (${q.points || 1} điểm): `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 60 },
        })
      );
    });
  }

  // Footer / End of this exam variant
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '---------- HẾT ----------', bold: true, font: 'Times New Roman', size: 22 }),
      ],
      spacing: { before: 240, after: 120 },
    })
  );
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '(Cán bộ coi thi không giải thích gì thêm)', italics: true, font: 'Times New Roman', size: 20 }),
      ],
      spacing: { after: 300 },
    })
  );

  return paragraphs;
}

// Master Export Function: Generates the full Word document containing ALL shuffled variants + answers + matrix + spec
export async function exportExamToDocx(project: ExportProjectInput): Promise<Blob> {
  const { header, matrix = [], specification = [], sampleExamQuestions } = project;
  
  // Ensure variants exist: If empty or less than requested, generate default 4 variants
  const activeVariants = (project.shuffledVariants && project.shuffledVariants.length > 0)
    ? project.shuffledVariants
    : generateShuffledExamVariants(sampleExamQuestions, 4, 101);

  const docParagraphs: (Paragraph | Table)[] = [];

  // =========================================================================
  // PHẦN A: CÁC MÃ ĐỀ THI ĐÃ TRỘN (XUẤT TOÀN BỘ CÁC MÃ ĐỀ GIÁO VIÊN YÊU CẦU: 2, 3, 4, 6, 8...)
  // Mỗi mã đề là 1 bài thi chuẩn có đầy đủ Quốc hiệu/Sở/Trường/Họ tên/SBD/Mã đề riêng biệt
  // =========================================================================
  activeVariants.forEach((variant, vIdx) => {
    const vCode = variant.examCode || (variant as any).code || String(101 + vIdx);
    const vQuestions = variant.questions && variant.questions.length > 0 ? variant.questions : sampleExamQuestions;
    const isFirst = vIdx === 0;
    const vParas = generateVariantParagraphs(header, vQuestions, vCode, isFirst);
    docParagraphs.push(...vParas);
  });

  // =========================================================================
  // PHẦN B: HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT (ĐỀ GỐC)
  // =========================================================================
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT', bold: true, font: 'Times New Roman', size: 26, color: '1e3a8a' }),
      ],
      spacing: { before: 400, after: 160 },
      pageBreakBefore: true,
    })
  );

  const renderPartSolutions = (partTitle: string, partList: ExamQuestion[]) => {
    if (partList.length === 0) return;
    docParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: partTitle, bold: true, font: 'Times New Roman', size: 22, color: '1e3a8a' })],
        spacing: { before: 160, after: 80 },
      })
    );

    partList.forEach((q, idx) => {
      let ansText = '';
      if (q.type === 'multiple_choice') {
        ansText = `Đáp án: ${q.correctOption}`;
      } else if (q.type === 'true_false') {
        ansText = `Đáp án: ${(q.trueFalseItems || []).map(i => `${i.key}) ${i.isCorrect ? 'Đúng' : 'Sai'}`).join(' | ')}`;
      } else if (q.type === 'short_answer') {
        ansText = `Đáp án: ${q.shortAnswerKey || ''}`;
      } else {
        ansText = `Biểu điểm & Hướng dẫn chấm: ${q.essayRubric || ''}`;
      }

      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${idx + 1} [${q.cognitiveLevel}]: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: ansText, bold: true, color: '1e40af', font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 80, after: 40 },
        })
      );

      if (q.explanation) {
        docParagraphs.push(
          new Paragraph({
            indent: { left: 280 },
            children: [
              new TextRun({ text: 'Lời giải chi tiết: ', italics: true, font: 'Times New Roman', size: 20 }),
              new TextRun({ text: cleanLatex(q.explanation), font: 'Times New Roman', size: 20 }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });
  };

  const part1Base = sampleExamQuestions.filter(q => q.type === 'multiple_choice');
  const part2Base = sampleExamQuestions.filter(q => q.type === 'true_false');
  const part3Base = sampleExamQuestions.filter(q => q.type === 'short_answer');
  const part4Base = sampleExamQuestions.filter(q => q.type === 'essay');

  renderPartSolutions('PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN', part1Base);
  renderPartSolutions('PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI', part2Base);
  renderPartSolutions('PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN', part3Base);
  renderPartSolutions('PHẦN IV. TỰ LUẬN', part4Base);

  // =========================================================================
  // PHẦN C: BẢNG SOI ĐÁP ÁN CÁC MÃ ĐỀ TRỘN (TẤT CẢ CÁC MÃ ĐỀ)
  // =========================================================================
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `BẢNG SOI ĐÁP ÁN CÁC MÃ ĐỀ (${activeVariants.map(v => v.examCode || (v as any).code).join(' - ')})`, bold: true, font: 'Times New Roman', size: 26, color: '1e3a8a' }),
      ],
      spacing: { before: 500, after: 200 },
      pageBreakBefore: true,
    })
  );

  // Bảng Phần I: Trắc nghiệm 4 lựa chọn
  if (part1Base.length > 0) {
    docParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '1. BẢNG ĐÁP ÁN PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN', bold: true, font: 'Times New Roman', size: 22 })],
        spacing: { before: 120, after: 80 },
      })
    );

    const keyHeaderCells: TableCell[] = [
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu số', bold: true, font: 'Times New Roman' })] })],
      }),
    ];

    activeVariants.forEach(v => {
      const vCode = v.examCode || (v as any).code || '101';
      keyHeaderCells.push(
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Mã ${vCode}`, bold: true, font: 'Times New Roman' })] })],
        })
      );
    });

    const keyTableRows: TableRow[] = [
      new TableRow({ children: keyHeaderCells }),
    ];

    part1Base.forEach((_, qIdx) => {
      const rowCells: TableCell[] = [
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Câu ${qIdx + 1}`, font: 'Times New Roman' })] })],
        }),
      ];

      activeVariants.forEach(v => {
        const ans = v.part1AnswerKeys?.[qIdx + 1] || v.answerKey?.[qIdx + 1] || '—';
        rowCells.push(
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ans, bold: true, font: 'Times New Roman' })] })],
          })
        );
      });

      keyTableRows.push(new TableRow({ children: rowCells }));
    });

    const keyDocxTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: keyTableRows,
    });

    docParagraphs.push(keyDocxTable);
  }

  // Bảng Phần II: Đúng / Sai
  if (part2Base.length > 0) {
    docParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '2. BẢNG ĐÁP ÁN PHẦN II: TRẮC NGHIỆM ĐÚNG SAI (ĐẾM TỪ CÂU 1)', bold: true, font: 'Times New Roman', size: 22 })],
        spacing: { before: 200, after: 80 },
      })
    );

    const p2HeaderCells: TableCell[] = [
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu số', bold: true, font: 'Times New Roman' })] })],
      }),
    ];

    activeVariants.forEach(v => {
      const vCode = v.examCode || (v as any).code || '101';
      p2HeaderCells.push(
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Mã ${vCode}`, bold: true, font: 'Times New Roman' })] })],
        })
      );
    });

    const p2TableRows: TableRow[] = [
      new TableRow({ children: p2HeaderCells }),
    ];

    part2Base.forEach((_, qIdx) => {
      const rowCells: TableCell[] = [
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Câu ${qIdx + 1}`, font: 'Times New Roman' })] })],
        }),
      ];

      activeVariants.forEach(v => {
        const ans = v.part2AnswerKeys?.[qIdx + 1] || '—';
        rowCells.push(
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ans, font: 'Times New Roman', size: 20 })] })],
          })
        );
      });

      p2TableRows.push(new TableRow({ children: rowCells }));
    });

    const p2DocxTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: p2TableRows,
    });

    docParagraphs.push(p2DocxTable);
  }

  // Bảng Phần III: Trả lời ngắn
  if (part3Base.length > 0) {
    docParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: '3. BẢNG ĐÁP ÁN PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN (ĐẾM TỪ CÂU 1)', bold: true, font: 'Times New Roman', size: 22 })],
        spacing: { before: 200, after: 80 },
      })
    );

    const p3HeaderCells: TableCell[] = [
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu số', bold: true, font: 'Times New Roman' })] })],
      }),
    ];

    activeVariants.forEach(v => {
      const vCode = v.examCode || (v as any).code || '101';
      p3HeaderCells.push(
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Mã ${vCode}`, bold: true, font: 'Times New Roman' })] })],
        })
      );
    });

    const p3TableRows: TableRow[] = [
      new TableRow({ children: p3HeaderCells }),
    ];

    part3Base.forEach((_, qIdx) => {
      const rowCells: TableCell[] = [
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Câu ${qIdx + 1}`, font: 'Times New Roman' })] })],
        }),
      ];

      activeVariants.forEach(v => {
        const ans = v.part3AnswerKeys?.[qIdx + 1] || '—';
        rowCells.push(
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ans, bold: true, font: 'Times New Roman' })] })],
          })
        );
      });

      p3TableRows.push(new TableRow({ children: rowCells }));
    });

    const p3DocxTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: p3TableRows,
    });

    docParagraphs.push(p3DocxTable);
  }

  // =========================================================================
  // PHẦN D: KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
  // =========================================================================
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ', bold: true, font: 'Times New Roman', size: 26, color: '1e3a8a' }),
      ],
      spacing: { before: 500, after: 200 },
      pageBreakBefore: true,
    })
  );

  const matrixTableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chủ đề / Chương', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nội dung kiến thức', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nhận biết (NB)', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Thông hiểu (TH)', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Vận dụng (VD)', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VD Cao (VDC)', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tổng điểm', bold: true, font: 'Times New Roman' })] })] }),
      ],
    }),
  ];

  matrix.forEach((row, idx) => {
    const totalNb = row.part1_nb + row.part2_nb + row.part3_nb + row.part4_nb;
    const totalTh = row.part1_th + row.part2_th + row.part3_th + row.part4_th;
    const totalVd = row.part1_vd + row.part2_vd + row.part3_vd + row.part4_vd;
    const totalVdc = row.part1_vdc + row.part2_vdc + row.part3_vdc + row.part4_vdc;

    matrixTableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.topic, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.unit, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalNb), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalTh), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalVd), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalVdc), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${row.totalPoints || '—'} đ`, font: 'Times New Roman' })] })] }),
        ],
      })
    );
  });

  const matrixDocxTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: matrixTableRows,
  });

  docParagraphs.push(matrixDocxTable);

  // =========================================================================
  // PHẦN E: BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
  // =========================================================================
  if (specification && specification.length > 0) {
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ', bold: true, font: 'Times New Roman', size: 26, color: '1e3a8a' }),
        ],
        spacing: { before: 500, after: 200 },
        pageBreakBefore: true,
      })
    );

    const specTableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chủ đề / Đơn vị kiến thức', bold: true, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mức độ đánh giá (Yêu cầu cần đạt)', bold: true, font: 'Times New Roman' })] })] }),
        ],
      }),
    ];

    specification.forEach((spec, idx) => {
      const objParagraphs: Paragraph[] = [];
      if (spec.learningObjectives.nb) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Nhận biết: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.nb, font: 'Times New Roman' })] }));
      }
      if (spec.learningObjectives.th) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Thông hiểu: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.th, font: 'Times New Roman' })] }));
      }
      if (spec.learningObjectives.vd) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Vận dụng: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.vd, font: 'Times New Roman' })] }));
      }
      if (spec.learningObjectives.vdc) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Vận dụng cao: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.vdc, font: 'Times New Roman' })] }));
      }

      specTableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${spec.topic}\n- ${spec.unit}`, font: 'Times New Roman', bold: true })] })] }),
            new TableCell({ children: objParagraphs }),
          ],
        })
      );
    });

    const specDocxTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: specTableRows,
    });

    docParagraphs.push(specDocxTable);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2 cm = ~1134 dxa
              bottom: 1134,
              left: 1418, // 2.5 cm
              right: 1134,
            },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

// Export ONLY the Shuffled Variant Exam Papers (ready to print for students)
export async function exportAllVariantsOnlyToDocx(project: ExportProjectInput): Promise<void> {
  const { header, sampleExamQuestions } = project;
  const activeVariants = (project.shuffledVariants && project.shuffledVariants.length > 0)
    ? project.shuffledVariants
    : generateShuffledExamVariants(sampleExamQuestions, 4, 101);

  const docParagraphs: (Paragraph | Table)[] = [];

  activeVariants.forEach((variant, vIdx) => {
    const vCode = variant.examCode || (variant as any).code || String(101 + vIdx);
    const vQuestions = variant.questions && variant.questions.length > 0 ? variant.questions : sampleExamQuestions;
    const isFirst = vIdx === 0;
    const vParas = generateVariantParagraphs(header, vQuestions, vCode, isFirst);
    docParagraphs.push(...vParas);
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              bottom: 1134,
              left: 1418,
              right: 1134,
            },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `Tap-de-thi-${activeVariants.length}-ma-de-${project.header.subject.replace(/\s+/g, '-')}-${project.header.grade.replace(/\s+/g, '-')}.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export a single Variant (e.g. Mã 101 or Mã 102)
export async function exportSingleVariantToDocx(project: ExportProjectInput, targetVariantCode: string): Promise<void> {
  const { header, sampleExamQuestions, shuffledVariants } = project;
  const targetVariant = (shuffledVariants || []).find(v => (v.examCode || (v as any).code) === targetVariantCode);
  const questions = targetVariant?.questions && targetVariant.questions.length > 0 
    ? targetVariant.questions 
    : sampleExamQuestions;
  const vCode = targetVariantCode || targetVariant?.examCode || '101';

  const docParagraphs = generateVariantParagraphs(header, questions, vCode, true);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              bottom: 1134,
              left: 1418,
              right: 1134,
            },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `De-thi-Ma-${vCode}-${project.header.subject.replace(/\s+/g, '-')}-${project.header.grade.replace(/\s+/g, '-')}.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Matrix & Spec only
export async function exportMatrixAndSpecToDocx(project: ExportProjectInput): Promise<void> {
  const { header, matrix = [], specification = [] } = project;
  const docParagraphs: (Paragraph | Table)[] = [];

  // Title
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `KHUNG MA TRẬN & BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ`, 
          bold: true, 
          font: 'Times New Roman', 
          size: 26, 
          color: '1e3a8a' 
        }),
      ],
      spacing: { before: 200, after: 80 },
    })
  );
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `MÔN: ${header.subject.toUpperCase()} - KHỐI ${header.grade.toUpperCase()} | Năm học: ${header.academicYear || '2024 - 2025'}`, 
          bold: true, 
          font: 'Times New Roman', 
          size: 22 
        }),
      ],
      spacing: { after: 240 },
    })
  );

  // Matrix Table
  const matrixTableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chủ đề / Chương', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nội dung kiến thức', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nhận biết', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Thông hiểu', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Vận dụng', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VD Cao', bold: true, font: 'Times New Roman' })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tổng điểm', bold: true, font: 'Times New Roman' })] })] }),
      ],
    }),
  ];

  matrix.forEach((row, idx) => {
    const totalNb = row.part1_nb + row.part2_nb + row.part3_nb + row.part4_nb;
    const totalTh = row.part1_th + row.part2_th + row.part3_th + row.part4_th;
    const totalVd = row.part1_vd + row.part2_vd + row.part3_vd + row.part4_vd;
    const totalVdc = row.part1_vdc + row.part2_vdc + row.part3_vdc + row.part4_vdc;

    matrixTableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.topic, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.unit, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalNb), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalTh), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalVd), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(totalVdc), font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${row.totalPoints || '—'} đ`, font: 'Times New Roman' })] })] }),
        ],
      })
    );
  });

  docParagraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: matrixTableRows }));

  // Specification
  if (specification && specification.length > 0) {
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA', bold: true, font: 'Times New Roman', size: 24, color: '1e3a8a' }),
        ],
        spacing: { before: 400, after: 160 },
        pageBreakBefore: true,
      })
    );

    const specTableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chủ đề / Đơn vị kiến thức', bold: true, font: 'Times New Roman' })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Yêu cầu cần đạt (Chuẩn KT-KN)', bold: true, font: 'Times New Roman' })] })] }),
        ],
      }),
    ];

    specification.forEach((spec, idx) => {
      const objParagraphs: Paragraph[] = [];
      if (spec.learningObjectives.nb) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Nhận biết: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.nb, font: 'Times New Roman' })] }));
      }
      if (spec.learningObjectives.th) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Thông hiểu: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.th, font: 'Times New Roman' })] }));
      }
      if (spec.learningObjectives.vd) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Vận dụng: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.vd, font: 'Times New Roman' })] }));
      }
      if (spec.learningObjectives.vdc) {
        objParagraphs.push(new Paragraph({ children: [new TextRun({ text: '- Vận dụng cao: ', bold: true, font: 'Times New Roman' }), new TextRun({ text: spec.learningObjectives.vdc, font: 'Times New Roman' })] }));
      }

      specTableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${spec.topic}\n- ${spec.unit}`, font: 'Times New Roman', bold: true })] })] }),
            new TableCell({ children: objParagraphs }),
          ],
        })
      );
    });

    docParagraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: specTableRows }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1418, right: 1134 },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `Ma-tran-va-Ban-dac-ta-${project.header.subject.replace(/\s+/g, '-')}-${project.header.grade.replace(/\s+/g, '-')}.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download Full Exam DOCX trigger
export async function exportFullExamToDocx(project: ExportProjectInput): Promise<void> {
  const blob = await exportExamToDocx(project);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const count = project.shuffledVariants?.length || 4;
  const fileName = `Ho-so-de-kiem-tra-${count}-ma-de-${project.header.subject.replace(/\s+/g, '-')}-${project.header.grade.replace(/\s+/g, '-')}-Chuan-Bo-GDDT.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
