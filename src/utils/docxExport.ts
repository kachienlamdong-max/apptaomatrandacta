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
import { ExamProject, ExamQuestion } from '../types';

export async function exportExamToDocx(project: ExamProject, targetVariantCode: string = '101'): Promise<Blob> {
  const { header, matrix, specification, shuffledVariants, sampleExamQuestions } = project;
  const currentVariant = shuffledVariants.find(v => v.examCode === targetVariantCode) || {
    examCode: targetVariantCode,
    questions: sampleExamQuestions,
    answerKeySummary: []
  };

  const questions = currentVariant.questions;

  // Clean LaTeX notation for Word (e.g. $\frac{a}{b}$ to readable text or stripped LaTeX)
  const cleanLatex = (str: string) => {
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
  };

  // 1. Header Table (Left: Department & School, Right: Exam Title, Subject, Time, Code)
  const headerTable = new Table({
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
                  new TextRun({ text: header.provinceOrDept.toUpperCase() || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO', font: 'Times New Roman', size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: header.schoolName.toUpperCase() || 'TRƯỜNG THPT CHUẨN QUỐC GIA', bold: true, font: 'Times New Roman', size: 22 }),
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
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Số báo danh: ...........................................................', font: 'Times New Roman', size: 22 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: header.examTitle.toUpperCase() || 'ĐỀ KIỂM TRA ĐỊNH KỲ', bold: true, font: 'Times New Roman', size: 24 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `MÔN: ${header.subject.toUpperCase()} - ${header.grade.toUpperCase()}`, bold: true, font: 'Times New Roman', size: 24 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Năm học: ${header.academicYear || '2024 - 2025'} (Bộ sách: ${header.curriculum})`, italics: true, font: 'Times New Roman', size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Thời gian làm bài: ${header.timeDuration} phút (không kể thời gian phát đề)`, italics: true, font: 'Times New Roman', size: 20 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: `MÃ ĐỀ THI: ${currentVariant.examCode}`, bold: true, font: 'Times New Roman', size: 24 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Build Document Sections
  const docParagraphs: (Paragraph | Table)[] = [];

  // Title: ĐỀ THI
  docParagraphs.push(headerTable);
  docParagraphs.push(new Paragraph({ text: '', spacing: { before: 200, after: 200 } }));

  // Part 1 Questions
  const part1 = questions.filter(q => q.type === 'multiple_choice');
  if (part1.length > 0) {
    docParagraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${(part1.length * 0.25).toFixed(2)} điểm)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 240, after: 120 },
      })
    );
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh trả lời từ câu 1 đến câu ' + part1.length + '. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 160 },
      })
    );

    part1.forEach(q => {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.orderNumber}: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 80 },
        })
      );

      if (q.options) {
        q.options.forEach(opt => {
          docParagraphs.push(
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

  // Part 2 Questions: Đúng / Sai
  const part2 = questions.filter(q => q.type === 'true_false');
  if (part2.length > 0) {
    docParagraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN II. Câu trắc nghiệm đúng sai (${(part2.length * 1.0).toFixed(2)} điểm)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 280, after: 120 },
      })
    );
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh trả lời từ câu 1 đến câu ' + part2.length + '. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 160 },
      })
    );

    part2.forEach(q => {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.orderNumber}: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 80 },
        })
      );

      if (q.trueFalseItems) {
        q.trueFalseItems.forEach(item => {
          docParagraphs.push(
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

  // Part 3 Questions: Trả lời ngắn
  const part3 = questions.filter(q => q.type === 'short_answer');
  if (part3.length > 0) {
    docParagraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN III. Câu trắc nghiệm trả lời ngắn (${(part3.length * 0.5).toFixed(2)} điểm)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 280, after: 120 },
      })
    );
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh trả lời từ câu 1 đến câu ' + part3.length + '. Điền đáp án hoặc kết quả tính toán vào ô tương ứng.',
            italics: true,
            font: 'Times New Roman',
            size: 22,
          }),
        ],
        spacing: { after: 160 },
      })
    );

    part3.forEach(q => {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.orderNumber}: `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 80 },
        })
      );
    });
  }

  // Part 4 Questions: Tự luận
  const part4 = questions.filter(q => q.type === 'essay');
  if (part4.length > 0) {
    docParagraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `PHẦN IV. Tự luận (${part4.reduce((acc, q) => acc + (q.points || 1), 0).toFixed(2)} điểm)`,
            bold: true,
            font: 'Times New Roman',
            size: 24,
          }),
        ],
        spacing: { before: 280, after: 120 },
      })
    );

    part4.forEach(q => {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.orderNumber} (${q.points || 1} điểm): `, bold: true, font: 'Times New Roman', size: 22 }),
            new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
          ],
          spacing: { before: 120, after: 80 },
        })
      );
    });
  }

  // Footer / End of exam
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '---------- HẾT ----------', bold: true, font: 'Times New Roman', size: 22 }),
      ],
      spacing: { before: 300, after: 200 },
    })
  );
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '(Cán bộ coi thi không giải thích gì thêm)', italics: true, font: 'Times New Roman', size: 20 }),
      ],
      spacing: { after: 400 },
    })
  );

  // SECTION 2: BẢNG ĐÁP ÁN & HƯỚNG DẪN CHẤM
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT', bold: true, font: 'Times New Roman', size: 26 }),
      ],
      spacing: { before: 400, after: 160 },
    })
  );

  // Answer key list
  questions.forEach(q => {
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
          new TextRun({ text: `Câu ${q.orderNumber} [${q.cognitiveLevel}]: `, bold: true, font: 'Times New Roman', size: 22 }),
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

  // SECTION 3: BẢNG MA TRẬN VÀ BẢN ĐẶC TẢ
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'KHUNG MA TRẬN VÀ BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ', bold: true, font: 'Times New Roman', size: 26 }),
      ],
      spacing: { before: 500, after: 200 },
    })
  );

  // Build matrix rows
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

export async function exportFullExamToDocx(project: ExamProject, targetVariantCode: string = '101'): Promise<void> {
  const blob = await exportExamToDocx(project, targetVariantCode);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `De-kiem-tra-${project.header.subject.replace(/\s+/g, '-')}-${project.header.grade.replace(/\s+/g, '-')}-Chuan-Bo-GDDT.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

