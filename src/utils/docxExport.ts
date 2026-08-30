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
  HeadingLevel,
  VerticalAlign 
} from 'docx';
import { 
  ExamProject, 
  ExamQuestion, 
  ExamHeaderConfig, 
  ShuffledExamVariant, 
  MatrixRow, 
  SpecificationItem,
  StudyGuideData,
  StudyGuideQuestionSlot 
} from '../types';
import { generateShuffledExamVariants } from './shuffler';
import { parseEssayQuestionRubric, formatPoint } from './rubricParser';

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

/**
 * Standard National Exam Layout for Multiple-Choice Options:
 * - If 4 options and short (<= 38 chars): 2 columns (A, B on row 1; C, D on row 2) in borderless table.
 * - Otherwise: standard 1 option per line.
 */
function createDocxMCOptionsElements(options?: { key: string; content: string }[], fontSize: number = 22): (Paragraph | Table)[] {
  if (!options || options.length === 0) return [];
  
  const maxLen = Math.max(...options.map(o => (o.content || '').length));
  
  if (options.length === 4 && maxLen <= 38) {
    const optA = options[0];
    const optB = options[1];
    const optC = options[2];
    const optD = options[3];

    const borderNone = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const bordersNone = {
      top: borderNone,
      bottom: borderNone,
      left: borderNone,
      right: borderNone,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    };

    return [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: bordersNone,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: bordersNone,
                margins: { top: 20, bottom: 20, left: 360, right: 60 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${optA.key}. `, bold: true, font: 'Times New Roman', size: fontSize }),
                      new TextRun({ text: cleanLatex(optA.content), font: 'Times New Roman', size: fontSize }),
                    ],
                    spacing: { after: 20 },
                  }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: bordersNone,
                margins: { top: 20, bottom: 20, left: 120, right: 60 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${optB.key}. `, bold: true, font: 'Times New Roman', size: fontSize }),
                      new TextRun({ text: cleanLatex(optB.content), font: 'Times New Roman', size: fontSize }),
                    ],
                    spacing: { after: 20 },
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: bordersNone,
                margins: { top: 20, bottom: 20, left: 360, right: 60 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${optC.key}. `, bold: true, font: 'Times New Roman', size: fontSize }),
                      new TextRun({ text: cleanLatex(optC.content), font: 'Times New Roman', size: fontSize }),
                    ],
                    spacing: { after: 20 },
                  }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: bordersNone,
                margins: { top: 20, bottom: 20, left: 120, right: 60 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${optD.key}. `, bold: true, font: 'Times New Roman', size: fontSize }),
                      new TextRun({ text: cleanLatex(optD.content), font: 'Times New Roman', size: fontSize }),
                    ],
                    spacing: { after: 20 },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];
  }

  return options.map(opt =>
    new Paragraph({
      indent: { left: 360 },
      children: [
        new TextRun({ text: `${opt.key}. `, bold: true, font: 'Times New Roman', size: fontSize }),
        new TextRun({ text: cleanLatex(opt.content), font: 'Times New Roman', size: fontSize }),
      ],
      spacing: { after: 40 },
    })
  );
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

      if (q.options && q.options.length > 0) {
        const optionElements = createDocxMCOptionsElements(q.options, 22);
        optionElements.forEach(el => paragraphs.push(el as any));
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

  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const cellMargins = { top: 80, bottom: 80, left: 100, right: 100 };

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

  const generateEssayRubricDocxTable = (partList: ExamQuestion[]): (Paragraph | Table)[] => {
    if (partList.length === 0) return [];
    const elements: (Paragraph | Table)[] = [];

    elements.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'PHẦN IV. HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM TỰ LUẬN', bold: true, font: 'Times New Roman', size: 22, color: '1e3a8a' }),
        ],
        spacing: { before: 200, after: 60 },
      })
    );

    elements.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: '(Hướng dẫn chấm gồm các ý chấm chi tiết, mỗi ý tính điểm 0,25đ hoặc 0,5đ theo quy định khảo thí)', 
            italics: true, 
            font: 'Times New Roman', 
            size: 20, 
            color: '4B5563' 
          }),
        ],
        spacing: { after: 120 },
      })
    );

    const tableRows: TableRow[] = [];

    // Header row: 3 columns (Câu, Nội dung / Yêu cầu cần đạt, Điểm)
    tableRows.push(
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: allBorders,
            margins: cellMargins,
            shading: { fill: 'E2E8F0' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Câu', bold: true, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: allBorders,
            margins: cellMargins,
            shading: { fill: 'E2E8F0' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Nội dung / Yêu cầu cần đạt', bold: true, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: allBorders,
            margins: cellMargins,
            shading: { fill: 'E2E8F0' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Điểm', bold: true, font: 'Times New Roman', size: 20 })],
              }),
            ],
          }),
        ],
      })
    );

    let totalEssayPts = 0;

    partList.forEach((q, qIdx) => {
      const structured = parseEssayQuestionRubric(q, qIdx);
      totalEssayPts += structured.totalPoints;
      const itemCount = structured.items.length;

      structured.items.forEach((item, itemIdx) => {
        const rowChildren: TableCell[] = [];

        // For the first item in the question, render the Question Cell with rowSpan
        if (itemIdx === 0) {
          rowChildren.push(
            new TableCell({
              rowSpan: itemCount,
              borders: allBorders,
              margins: cellMargins,
              shading: { fill: 'F8FAFC' },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Câu ${qIdx + 1}`, bold: true, font: 'Times New Roman', size: 20 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `(${structured.totalPointsFormatted} điểm)`, italics: true, font: 'Times New Roman', size: 18 })],
                  spacing: { before: 30, after: 30 },
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `[${q.cognitiveLevel || 'Vận dụng cao'}]`, font: 'Times New Roman', size: 16, color: '64748B' })],
                }),
              ],
            })
          );
        }

        // Column 2: Nội dung của từng ý
        const contentParas: Paragraph[] = [
          new Paragraph({
            children: [
              ...(item.subLabel ? [new TextRun({ text: `${item.subLabel} `, bold: true, font: 'Times New Roman', size: 20 })] : []),
              new TextRun({ text: cleanLatex(item.content), font: 'Times New Roman', size: 20 }),
            ],
            spacing: { before: 20, after: 20 },
          }),
        ];

        // If this is the last item and question has additional explanation, append it
        if (itemIdx === itemCount - 1 && q.explanation) {
          contentParas.push(
            new Paragraph({
              children: [
                new TextRun({ text: '• Lời giải chi tiết / Ghi chú: ', italics: true, bold: true, color: '1E40AF', font: 'Times New Roman', size: 18 }),
                new TextRun({ text: cleanLatex(q.explanation), italics: true, color: '334155', font: 'Times New Roman', size: 18 }),
              ],
              spacing: { before: 40, after: 20 },
            })
          );
        }

        rowChildren.push(
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: contentParas,
          })
        );

        // Column 3: Điểm của từng ý
        rowChildren.push(
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: item.pointsFormatted, bold: true, font: 'Times New Roman', size: 20 })],
              }),
            ],
          })
        );

        tableRows.push(new TableRow({ children: rowChildren }));
      });

      // Dòng chốt tổng điểm cho từng câu
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: allBorders,
              margins: cellMargins,
              shading: { fill: 'F1F5F9' },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: `Tổng điểm Câu ${qIdx + 1}: `, bold: true, italics: true, font: 'Times New Roman', size: 19 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: allBorders,
              margins: cellMargins,
              shading: { fill: 'F1F5F9' },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: `${structured.totalPointsFormatted}`, bold: true, font: 'Times New Roman', size: 20, color: '1E3A8A' }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });

    // Dòng tổng điểm toàn bộ phần tự luận
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            borders: allBorders,
            margins: cellMargins,
            shading: { fill: 'E2E8F0' },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'TỔNG ĐIỂM TOÀN BỘ PHẦN TỰ LUẬN: ', bold: true, font: 'Times New Roman', size: 20 }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            shading: { fill: 'E2E8F0' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `${formatPoint(totalEssayPts)} điểm`, bold: true, font: 'Times New Roman', size: 20, color: 'B91C1C' }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    const rubricTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });

    elements.push(rubricTable);
    return elements;
  };

  const part1Base = sampleExamQuestions.filter(q => q.type === 'multiple_choice');
  const part2Base = sampleExamQuestions.filter(q => q.type === 'true_false');
  const part3Base = sampleExamQuestions.filter(q => q.type === 'short_answer');
  const part4Base = sampleExamQuestions.filter(q => q.type === 'essay');

  renderPartSolutions('PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN', part1Base);
  renderPartSolutions('PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI', part2Base);
  renderPartSolutions('PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN', part3Base);
  
  // Phần IV: Tự luận được trình bày dưới dạng BẢNG HƯỚNG DẪN CHẤM & BIỂU ĐIỂM CHUẨN 3 CỘT
  if (part4Base.length > 0) {
    docParagraphs.push(...generateEssayRubricDocxTable(part4Base));
  }

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

    // Thêm dòng thống kê tỉ lệ phân bổ A, B, C, D cho từng mã đề trong file Word
    const statsCells: TableCell[] = [
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tỉ lệ A/B/C/D', bold: true, italics: true, font: 'Times New Roman' })] })],
      }),
    ];

    activeVariants.forEach(v => {
      const p1Questions = v.questions.filter(q => q.type === 'multiple_choice');
      const countA = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'A').length;
      const countB = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'B').length;
      const countC = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'C').length;
      const countD = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'D').length;
      statsCells.push(
        new TableCell({
          children: [
            new Paragraph({ 
              alignment: AlignmentType.CENTER, 
              children: [
                new TextRun({ text: `${countA}A-${countB}B-${countC}C-${countD}D`, bold: true, font: 'Times New Roman' })
              ] 
            })
          ],
        })
      );
    });

    keyTableRows.push(new TableRow({ children: statsCells }));

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
  // PHẦN D: KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (THEO MẪU BỘ GD&ĐT)
  // =========================================================================
  docParagraphs.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );
  docParagraphs.push(...generateMatrixDocxElements(header, matrix));

  // =========================================================================
  // PHẦN E: BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (THEO MẪU BỘ GD&ĐT)
  // =========================================================================
  docParagraphs.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );
  docParagraphs.push(...generateSpecificationDocxElements(header, matrix, specification));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2 cm = ~1134 dxa
              bottom: 1134,
              left: 1134, // 2 cm
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

// Generate Matrix Table and Header DOCX elements (Template Layout)
export function generateMatrixDocxElements(header: ExamHeaderConfig, matrix: MatrixRow[]): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };
  const cellMargins = { top: 60, bottom: 60, left: 60, right: 60 };

  const schoolTitle = header.schoolName ? `TRƯỜNG ${header.schoolName.toUpperCase()}` : 'TRƯỜNG ....................................';
  const deptTitle = header.dept ? `TỔ: ${header.dept.toUpperCase()}` : 'TỔ: ....................................';
  const examTitle = `MA TRẬN KIỂM TRA ${header.examTitle ? header.examTitle.toUpperCase() : 'ĐỊNH KỲ'}`;
  const yearTitle = `NĂM HỌC ${header.academicYear || '2024 - 2025'}`;
  const subjectGradeTitle = `MÔN: ${header.subject?.toUpperCase() || 'ĐỊA LÍ'}. KHỐI: ${header.grade?.toUpperCase() || '11'}`;

  // Top header (2 columns: left school/dept, right examTitle/year/subject)
  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: noBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: schoolTitle, bold: true, font: 'Times New Roman', size: 22 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: deptTitle, bold: true, font: 'Times New Roman', size: 22 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: noBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: examTitle, bold: true, font: 'Times New Roman', size: 22 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: yearTitle, bold: true, font: 'Times New Roman', size: 22 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: subjectGradeTitle, bold: true, font: 'Times New Roman', size: 22 })],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  elements.push(new Paragraph({ text: '', spacing: { before: 120, after: 120 } }));

  // Color shading constants matching template
  const fillGrey = 'D1D5DB'; // Gray for "Hiểu"
  const fillGreen = '86EFAC'; // Light green for "VD"
  const fillBlue = '2563EB'; // Blue highlight for total cell

  const matrixRows: TableRow[] = [];

  // Header Row 1:
  matrixRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'STT', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nội dung kiến thức/ kĩ năng', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 12,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mức độ nhận thức', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tổng\nđiểm', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Số\ntiết', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  // Header Row 2:
  matrixRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TN nhiều lựa chọn', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Đúng/Sai', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Trả lời ngắn', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tự luận', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  // Header Row 3:
  const row3Cells: TableCell[] = [];
  for (let i = 0; i < 4; i++) {
    row3Cells.push(
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Biết', font: 'Times New Roman', size: 18 })] })],
      }),
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        shading: { fill: fillGrey },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hiểu', font: 'Times New Roman', size: 18 })] })],
      }),
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        shading: { fill: fillGreen },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VD', font: 'Times New Roman', size: 18 })] })],
      })
    );
  }
  matrixRows.push(new TableRow({ tableHeader: true, children: row3Cells }));

  // Helper for matrix value cell
  const createMatrixCell = (val: number, isGrey = false, isGreen = false) => {
    const shading = isGrey ? { fill: fillGrey } : isGreen ? { fill: fillGreen } : undefined;
    return new TableCell({
      borders: allBorders,
      margins: cellMargins,
      shading,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: val > 0 ? String(val) : '', font: 'Times New Roman', size: 18 })],
        }),
      ],
    });
  };

  let sum_p1_nb = 0, sum_p1_th = 0, sum_p1_vd = 0;
  let sum_p2_nb = 0, sum_p2_th = 0, sum_p2_vd = 0;
  let sum_p3_nb = 0, sum_p3_th = 0, sum_p3_vd = 0;
  let sum_p4_nb = 0, sum_p4_th = 0, sum_p4_vd = 0;
  let sum_total_points = 0;
  let sum_periods = 0;

  matrix.forEach((row, idx) => {
    const p1_nb = row.part1_nb || 0;
    const p1_th = row.part1_th || 0;
    const p1_vd = (row.part1_vd || 0) + (row.part1_vdc || 0);

    const p2_nb = row.part2_nb || 0;
    const p2_th = row.part2_th || 0;
    const p2_vd = (row.part2_vd || 0) + (row.part2_vdc || 0);

    const p3_nb = row.part3_nb || 0;
    const p3_th = row.part3_th || 0;
    const p3_vd = (row.part3_vd || 0) + (row.part3_vdc || 0);

    const p4_nb = row.part4_nb || 0;
    const p4_th = row.part4_th || 0;
    const p4_vd = (row.part4_vd || 0) + (row.part4_vdc || 0);

    sum_p1_nb += p1_nb;
    sum_p1_th += p1_th;
    sum_p1_vd += p1_vd;

    sum_p2_nb += p2_nb;
    sum_p2_th += p2_th;
    sum_p2_vd += p2_vd;

    sum_p3_nb += p3_nb;
    sum_p3_th += p3_th;
    sum_p3_vd += p3_vd;

    sum_p4_nb += p4_nb;
    sum_p4_th += p4_th;
    sum_p4_vd += p4_vd;

    sum_total_points += row.totalPoints || 0;
    sum_periods += row.numPeriods || 0;

    const rowTitle = row.topic 
      ? (row.unit && row.unit !== row.topic ? `${row.topic} - ${row.unit}` : row.topic)
      : (row.unit || `Chủ đề ${idx + 1}`);

    matrixRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman', size: 18 })] })],
          }),
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: rowTitle, font: 'Times New Roman', size: 18 })] })],
          }),
          // TN nhiều lựa chọn
          createMatrixCell(p1_nb, false, false),
          createMatrixCell(p1_th, true, false),
          createMatrixCell(p1_vd, false, true),
          // Đúng/Sai
          createMatrixCell(p2_nb, false, false),
          createMatrixCell(p2_th, true, false),
          createMatrixCell(p2_vd, false, true),
          // Trả lời ngắn
          createMatrixCell(p3_nb, false, false),
          createMatrixCell(p3_th, true, false),
          createMatrixCell(p3_vd, false, true),
          // Tự luận
          createMatrixCell(p4_nb, false, false),
          createMatrixCell(p4_th, true, false),
          createMatrixCell(p4_vd, false, true),
          // Tổng điểm
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.totalPoints ? `${row.totalPoints}` : '', font: 'Times New Roman', size: 18 })] })],
          }),
          // Số tiết
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.numPeriods ? `${row.numPeriods}` : '', font: 'Times New Roman', size: 18 })] })],
          }),
        ],
      })
    );
  });

  // Footer Row 1: Mức độ
  const foot1Cells: TableCell[] = [
    new TableCell({
      columnSpan: 2,
      borders: allBorders,
      margins: cellMargins,
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mức độ', bold: true, font: 'Times New Roman', size: 18 })] })],
    }),
  ];
  for (let i = 0; i < 4; i++) {
    foot1Cells.push(
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Biết', font: 'Times New Roman', size: 18 })] })],
      }),
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        shading: { fill: fillGrey },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hiểu', font: 'Times New Roman', size: 18 })] })],
      }),
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        shading: { fill: fillGreen },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'VD', font: 'Times New Roman', size: 18 })] })],
      })
    );
  }
  foot1Cells.push(
    new TableCell({ borders: allBorders, margins: cellMargins, children: [new Paragraph({ text: '' })] }),
    new TableCell({ borders: allBorders, margins: cellMargins, children: [new Paragraph({ text: '' })] })
  );
  matrixRows.push(new TableRow({ children: foot1Cells }));

  // Footer Row 2: TỔNG
  const createSumCell = (val: number, isBlue = false) => {
    return new TableCell({
      borders: allBorders,
      margins: cellMargins,
      shading: isBlue ? { fill: fillBlue } : undefined,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: val > 0 ? String(val) : '', bold: true, color: isBlue ? 'FFFFFF' : undefined, font: 'Times New Roman', size: 18 })],
        }),
      ],
    });
  };

  matrixRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TỔNG', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        createSumCell(sum_p1_nb),
        createSumCell(sum_p1_th, true),
        createSumCell(sum_p1_vd),
        createSumCell(sum_p2_nb),
        createSumCell(sum_p2_th),
        createSumCell(sum_p2_vd),
        createSumCell(sum_p3_nb),
        createSumCell(sum_p3_th),
        createSumCell(sum_p3_vd),
        createSumCell(sum_p4_nb),
        createSumCell(sum_p4_th),
        createSumCell(sum_p4_vd),
        new TableCell({
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: sum_total_points > 0 ? Number(sum_total_points.toFixed(2)).toString() : '10.0', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: sum_periods > 0 ? String(sum_periods) : '', font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  // Footer Row 3: Số câu tổng từng phần
  const total_p1 = sum_p1_nb + sum_p1_th + sum_p1_vd;
  const total_p2 = sum_p2_nb + sum_p2_th + sum_p2_vd;
  const total_p3 = sum_p3_nb + sum_p3_th + sum_p3_vd;
  const total_p4 = sum_p4_nb + sum_p4_th + sum_p4_vd;

  matrixRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ text: '' })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: total_p1 > 0 ? String(total_p1) : '', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: total_p2 > 0 ? String(total_p2) : '', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: total_p3 > 0 ? String(total_p3) : '', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: total_p4 > 0 ? String(total_p4) : '', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({ borders: allBorders, margins: cellMargins, children: [new Paragraph({ text: '' })] }),
        new TableCell({ borders: allBorders, margins: cellMargins, children: [new Paragraph({ text: '' })] }),
      ],
    })
  );

  // Footer Row 4: Tỉ lệ
  matrixRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tỉ lệ', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '40%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '30%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '10%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '20%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 2,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '100%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: matrixRows }));
  return elements;
}

// Generate Specification Table and Header DOCX elements (Template Layout)
export function generateSpecificationDocxElements(
  header: ExamHeaderConfig, 
  matrix: MatrixRow[], 
  specification: SpecificationItem[]
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const cellMargins = { top: 60, bottom: 60, left: 60, right: 60 };

  const examTitle = `BẢN ĐẶC TẢ`;
  const subTitle = `ĐỀ KIỂM TRA ${header.examTitle ? header.examTitle.toUpperCase() : 'ĐỊNH KỲ'} - MÔN: ${header.subject?.toUpperCase() || 'ĐỊA LÍ'} ${header.grade?.toUpperCase() || '11'}`;

  // Title block
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: examTitle, bold: true, font: 'Times New Roman', size: 26 }),
      ],
      spacing: { before: 200, after: 60 },
    })
  );
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: subTitle, bold: true, font: 'Times New Roman', size: 20 }),
      ],
      spacing: { after: 180 },
    })
  );

  // If specification items are empty, generate default list from matrix
  const effectiveSpecs: SpecificationItem[] = (specification && specification.length > 0)
    ? specification
    : matrix.map((row, idx) => ({
        id: `spec-${idx}`,
        topic: row.topic,
        unit: row.unit,
        learningObjectives: {
          nb: `Nhận biết và nêu được các kiến thức cơ bản về ${row.unit || row.topic}.`,
          th: `Hiểu và giải thích được các nội dung cốt lõi của ${row.unit || row.topic}.`,
          vd: `Vận dụng kiến thức ${row.unit || row.topic} để giải quyết bài tập và tình huống thực tiễn.`,
          vdc: '',
        },
        questionCount: {
          part1: { nb: row.part1_nb, th: row.part1_th, vd: row.part1_vd, vdc: row.part1_vdc },
          part2: { nb: row.part2_nb, th: row.part2_th, vd: row.part2_vd, vdc: row.part2_vdc },
          part3: { nb: row.part3_nb, th: row.part3_th, vd: row.part3_vd, vdc: row.part3_vdc },
          part4: { nb: row.part4_nb, th: row.part4_th, vd: row.part4_vd, vdc: row.part4_vdc },
        },
      }));

  const specRows: TableRow[] = [];

  // Header Row 1:
  specRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TT', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CHỦ ĐỀ/\nCHƯƠNG', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NỘI DUNG/\nĐƠN VỊ KIẾN THỨC', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          rowSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Yêu cầu cần đạt', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 12,
          borders: allBorders,
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Số câu hỏi ở các mức độ đánh giá', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  // Header Row 2:
  specRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TRẮC NGHIỆM NHIỀU LỰA CHỌN', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TRẮC NGHIỆM ĐÚNG/SAI', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TRẢ LỜI NGẮN', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TỰ LUẬN', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  // Header Row 3:
  const row3Cells: TableCell[] = [];
  for (let i = 0; i < 4; i++) {
    row3Cells.push(
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Biết', font: 'Times New Roman', size: 18 })] })],
      }),
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hiểu', font: 'Times New Roman', size: 18 })] })],
      }),
      new TableCell({
        borders: allBorders,
        margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Vận\ndụng', font: 'Times New Roman', size: 18 })] })],
      })
    );
  }
  specRows.push(new TableRow({ tableHeader: true, children: row3Cells }));

  // Helper for count cell
  const createCountCell = (cnt: number) => {
    return new TableCell({
      borders: allBorders,
      margins: cellMargins,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: cnt > 0 ? String(cnt) : '', font: 'Times New Roman', size: 18 })],
        }),
      ],
    });
  };

  let sum_p1_nb = 0, sum_p1_th = 0, sum_p1_vd = 0;
  let sum_p2_nb = 0, sum_p2_th = 0, sum_p2_vd = 0;
  let sum_p3_nb = 0, sum_p3_th = 0, sum_p3_vd = 0;
  let sum_p4_nb = 0, sum_p4_th = 0, sum_p4_vd = 0;

  matrix.forEach((row, idx) => {
    const spec = (specification && specification.length > 0)
      ? (specification.find(s => s.id === row.id || (s.topic === row.topic && s.unit === row.unit)) || specification[idx])
      : null;

    const p1_nb = row.part1_nb || 0;
    const p1_th = row.part1_th || 0;
    const p1_vd = (row.part1_vd || 0) + (row.part1_vdc || 0);

    const p2_nb = row.part2_nb || 0;
    const p2_th = row.part2_th || 0;
    const p2_vd = (row.part2_vd || 0) + (row.part2_vdc || 0);

    const p3_nb = row.part3_nb || 0;
    const p3_th = row.part3_th || 0;
    const p3_vd = (row.part3_vd || 0) + (row.part3_vdc || 0);

    const p4_nb = row.part4_nb || 0;
    const p4_th = row.part4_th || 0;
    const p4_vd = (row.part4_vd || 0) + (row.part4_vdc || 0);

    sum_p1_nb += p1_nb;
    sum_p1_th += p1_th;
    sum_p1_vd += p1_vd;

    sum_p2_nb += p2_nb;
    sum_p2_th += p2_th;
    sum_p2_vd += p2_vd;

    sum_p3_nb += p3_nb;
    sum_p3_th += p3_th;
    sum_p3_vd += p3_vd;

    sum_p4_nb += p4_nb;
    sum_p4_th += p4_th;
    sum_p4_vd += p4_vd;

    const totalNb = p1_nb + p2_nb + p3_nb + p4_nb;
    const totalTh = p1_th + p2_th + p3_th + p4_th;
    const totalVd = p1_vd + p2_vd + p3_vd + p4_vd;

    const objParas: Paragraph[] = [];
    if (spec?.learningObjectives?.nb || totalNb > 0) {
      const text = spec?.learningObjectives?.nb || `Nhận biết và nêu được các kiến thức cơ bản về ${row.unit || row.topic}.`;
      objParas.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Nhận biết: ', bold: true, font: 'Times New Roman', size: 18 }),
            new TextRun({ text, font: 'Times New Roman', size: 18 }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    if (spec?.learningObjectives?.th || totalTh > 0) {
      const text = spec?.learningObjectives?.th || `Hiểu và giải thích được các nội dung cốt lõi của ${row.unit || row.topic}.`;
      objParas.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Thông hiểu: ', bold: true, font: 'Times New Roman', size: 18 }),
            new TextRun({ text, font: 'Times New Roman', size: 18 }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    if (spec?.learningObjectives?.vd || spec?.learningObjectives?.vdc || totalVd > 0) {
      const vdText = [spec?.learningObjectives?.vd, spec?.learningObjectives?.vdc].filter(Boolean).join(' ') ||
        `Vận dụng kiến thức ${row.unit || row.topic} để giải quyết bài tập và tình huống thực tiễn.`;
      objParas.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Vận dụng: ', bold: true, font: 'Times New Roman', size: 18 }),
            new TextRun({ text: vdText, font: 'Times New Roman', size: 18 }),
          ],
          spacing: { after: 40 },
        })
      );
    }

    if (objParas.length === 0) {
      objParas.push(new Paragraph({ children: [new TextRun({ text: 'Theo chuẩn kiến thức kĩ năng.', font: 'Times New Roman', size: 18 })] }));
    }

    specRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Times New Roman', size: 18 })] })],
          }),
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: row.topic || `Chủ đề ${idx + 1}`, bold: true, font: 'Times New Roman', size: 18 })] })],
          }),
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: row.unit || '', font: 'Times New Roman', size: 18 })] })],
          }),
          new TableCell({
            borders: allBorders,
            margins: cellMargins,
            children: objParas,
          }),
          createCountCell(p1_nb),
          createCountCell(p1_th),
          createCountCell(p1_vd),
          createCountCell(p2_nb),
          createCountCell(p2_th),
          createCountCell(p2_vd),
          createCountCell(p3_nb),
          createCountCell(p3_th),
          createCountCell(p3_vd),
          createCountCell(p4_nb),
          createCountCell(p4_th),
          createCountCell(p4_vd),
        ],
      })
    );
  });

  // Footer Row 1: Tổng số câu
  specRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: 'Tổng số câu', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        createCountCell(sum_p1_nb),
        createCountCell(sum_p1_th),
        createCountCell(sum_p1_vd),
        createCountCell(sum_p2_nb),
        createCountCell(sum_p2_th),
        createCountCell(sum_p2_vd),
        createCountCell(sum_p3_nb),
        createCountCell(sum_p3_th),
        createCountCell(sum_p3_vd),
        createCountCell(sum_p4_nb),
        createCountCell(sum_p4_th),
        createCountCell(sum_p4_vd),
      ],
    })
  );

  // Footer Row 2: Tổng số điểm
  const formatPoint = (pts: number) => {
    if (pts === 0) return '0';
    return Number(pts.toFixed(1)).toString();
  };

  const createPtCell = (pts: number) => {
    return new TableCell({
      borders: allBorders,
      margins: cellMargins,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: formatPoint(pts), bold: true, font: 'Times New Roman', size: 18 })],
        }),
      ],
    });
  };

  specRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: 'Tổng số điểm', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        createPtCell(sum_p1_nb * 0.25),
        createPtCell(sum_p1_th * 0.25),
        createPtCell(sum_p1_vd * 0.25),
        createPtCell(sum_p2_nb * 1.0),
        createPtCell(sum_p2_th * 1.0),
        createPtCell(sum_p2_vd * 1.0),
        createPtCell(sum_p3_nb * 0.5),
        createPtCell(sum_p3_th * 0.5),
        createPtCell(sum_p3_vd * 0.5),
        createPtCell(sum_p4_nb * 1.0),
        createPtCell(sum_p4_th * 1.0),
        createPtCell(sum_p4_vd * 1.0),
      ],
    })
  );

  // Footer Row 3: Tỷ lệ %
  specRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: 'Tỷ lệ %', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '40%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '30%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '10%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
        new TableCell({
          columnSpan: 3,
          borders: allBorders,
          margins: cellMargins,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '20%', bold: true, font: 'Times New Roman', size: 18 })] })],
        }),
      ],
    })
  );

  elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: specRows }));
  return elements;
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

  docParagraphs.push(...generateMatrixDocxElements(header, matrix));
  docParagraphs.push(new Paragraph({ text: '', spacing: { before: 300, after: 150 }, pageBreakBefore: true }));
  docParagraphs.push(...generateSpecificationDocxElements(header, matrix, specification));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, bottom: 900, left: 900, right: 900 },
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

// Export Compliance Audit Checklist to DOCX
export async function exportComplianceReportToDocx(project: ExportProjectInput): Promise<void> {
  const { header, sampleExamQuestions = [], matrix = [], specification = [] } = project;
  const { performMoetComplianceAudit } = await import('./complianceAudit');
  const report = performMoetComplianceAudit(header, sampleExamQuestions, matrix, specification);

  const docParagraphs: (Paragraph | Table)[] = [];

  // Header Title
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `BẢNG KIỂM TRA ĐÁNH GIÁ CHUẨN KỸ THUẬT ĐỀ THI`,
          bold: true,
          font: 'Times New Roman',
          size: 28,
          color: '1E3A8A'
        }),
      ],
      spacing: { before: 100, after: 60 },
    })
  );
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `(Thẩm định theo Quy chuẩn Chương trình GDPT 2018 - Bộ Giáo dục và Đào tạo)`,
          italics: true,
          font: 'Times New Roman',
          size: 22,
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Info Block
  docParagraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Môn: `, bold: true, font: 'Times New Roman', size: 22 }),
        new TextRun({ text: `${header.subject || 'Địa lí'} - Khối ${header.grade || '12'} | `, font: 'Times New Roman', size: 22 }),
        new TextRun({ text: `Kỳ thi: `, bold: true, font: 'Times New Roman', size: 22 }),
        new TextRun({ text: `${header.examTitle || 'Kiểm tra định kỳ'} | `, font: 'Times New Roman', size: 22 }),
        new TextRun({ text: `Điểm đánh giá tuân thủ: `, bold: true, font: 'Times New Roman', size: 22 }),
        new TextRun({ text: `${report.scorePercentage}% (${report.overallStatus === 'excellent' ? 'XUẤT SẮC - ĐẠT CHUẨN 100%' : 'ĐẠT YÊU CẦU'})`, bold: true, color: '15803D', font: 'Times New Roman', size: 22 }),
      ],
      spacing: { after: 180 },
    })
  );

  // Table of Audit Criteria
  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 600, type: WidthType.DXA },
          shading: { fill: '1E3A8A' },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'STT', bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
        }),
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: '1E3A8A' },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tiêu chí đánh giá', bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
        }),
        new TableCell({
          width: { size: 1400, type: WidthType.DXA },
          shading: { fill: '1E3A8A' },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kết quả', bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
        }),
        new TableCell({
          width: { size: 4500, type: WidthType.DXA },
          shading: { fill: '1E3A8A' },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chi tiết thẩm định & Khuyến nghị', bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
        }),
      ],
    }),
  ];

  report.items.forEach((item, idx) => {
    const statusText = item.status === 'pass' ? 'ĐẠT CHUẨN' : item.status === 'warning' ? 'LƯU Ý' : 'CHƯA ĐẠT';
    const statusColor = item.status === 'pass' ? '15803D' : item.status === 'warning' ? 'B45309' : 'B91C1C';

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, font: 'Times New Roman', size: 20 })] })],
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: item.title, bold: true, font: 'Times New Roman', size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: item.description, italics: true, color: '4B5563', font: 'Times New Roman', size: 18 })] }),
            ],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: statusText, bold: true, color: statusColor, font: 'Times New Roman', size: 20 })] })],
          }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: item.details, font: 'Times New Roman', size: 20 })] }),
              item.suggestion ? new Paragraph({ children: [new TextRun({ text: `Khuyến nghị: ${item.suggestion}`, italics: true, color: '2563EB', font: 'Times New Roman', size: 18 })] }) : new Paragraph({ text: '' }),
            ],
          }),
        ],
      })
    );
  });

  const auditTable = new Table({
    width: { size: 9500, type: WidthType.DXA },
    alignment: AlignmentType.CENTER,
    rows: tableRows,
  });

  docParagraphs.push(auditTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, bottom: 900, left: 900, right: 900 },
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
  const fileName = `Bang-kiem-tra-chuan-Bộ-GDDT-${project.header.subject.replace(/\s+/g, '-')}-${project.header.grade.replace(/\s+/g, '-')}.docx`;
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

// =========================================================================
// EXPORT STUDY GUIDE / REVIEW QUESTION BANK (x4 MULTIPLIER) TO DOCX
// =========================================================================

export interface ExportStudyGuideOptions {
  mode?: 'full' | 'student' | 'answers_only'; // 'full' (câu hỏi + đáp án chi tiết), 'student' (chỉ câu hỏi làm bài), 'answers_only' (chỉ bảng đáp án & hướng dẫn chấm)
}

export async function exportStudyGuideToDocx(
  project: ExportProjectInput,
  studyGuide: StudyGuideData,
  options: ExportStudyGuideOptions = { mode: 'full' }
): Promise<void> {
  const header = project.header;
  const mode = options.mode || 'full';
  const docParagraphs: (Paragraph | Table)[] = [];

  const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
  const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
  const cellMargins = { top: 120, bottom: 120, left: 140, right: 140 };

  // 1. Official Ministry Header Table
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
            width: { size: 50, type: WidthType.PERCENTAGE },
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
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, font: 'Times New Roman', size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', font: 'Times New Roman', size: 22, italics: true }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: '-----------------------', font: 'Times New Roman', size: 20 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docParagraphs.push(headerTable);
  docParagraphs.push(new Paragraph({ text: '', spacing: { before: 120, after: 120 } }));

  // Main Title
  let titleSuffix = 'VÀ NGÂN HÀNG CÂU HỎI RÈN LUYỆN THEO MA TRẬN ĐẶC TẢ';
  if (mode === 'student') {
    titleSuffix = '- PHIẾU ÔN TẬP TỰ LUYỆN DÀNH CHO HỌC SINH';
  } else if (mode === 'answers_only') {
    titleSuffix = '- BẢNG ĐÁP ÁN & HƯỚNG DẪN CHẤM CHI TIẾT';
  }

  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `BỘ ĐỀ CƯƠNG ÔN TẬP ${titleSuffix}`, 
          bold: true, 
          font: 'Times New Roman', 
          size: 26, 
          color: '1E3A8A' 
        }),
      ],
      spacing: { before: 160, after: 80 },
    })
  );

  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `Môn: ${header.subject.toUpperCase()} - ${header.grade} | Bộ sách: ${header.curriculum} | Năm học: ${header.academicYear}`, 
          bold: true, 
          font: 'Times New Roman', 
          size: 22, 
          italics: true 
        }),
      ],
      spacing: { after: 80 },
    })
  );

  // Methodology info banner
  const mult = studyGuide.multiplier || 4;
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `(Quy mô: ${studyGuide.totalSlots} vị trí ma trận × ${mult} câu hỏi tương đương = ${studyGuide.totalQuestions} câu hỏi rèn luyện chuẩn GDPT 2018)`, 
          font: 'Times New Roman', 
          size: 20, 
          italics: true,
          color: '2563EB'
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // If mode != 'answers_only', output the study guide questions organized by Parts
  if (mode !== 'answers_only') {
    // -------------------------------------------------------------
    // PART I: MULTIPLE CHOICE
    // -------------------------------------------------------------
    const p1Slots = studyGuide.slots.filter(s => s.part === 'part1');
    if (p1Slots.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: `PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (${p1Slots.length} vị trí ma trận × ${mult} = ${p1Slots.length * mult} câu rèn luyện)`,
              bold: true,
              font: 'Times New Roman',
              size: 24,
              color: '1E40AF'
            }),
          ],
          spacing: { before: 240, after: 80 },
        })
      );
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Ghi chú: Mỗi vị trí câu trong ma trận được phát triển thành ${mult} câu hỏi tương đương hoàn toàn khác nhau (ký hiệu dạng .1, .2, .3, .4) cùng mức độ nhận thức để học sinh rèn luyện thuần thục.`,
              italics: true,
              font: 'Times New Roman',
              size: 20,
              color: '4B5563'
            }),
          ],
          spacing: { after: 140 },
        })
      );

      p1Slots.forEach((slot) => {
        // Slot Header Box
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `◆ Vị trí Ma trận #${slot.slotNumber} - Chủ đề: ${slot.topic} | Nội dung: ${slot.unit} [Mức độ: ${slot.cognitiveLevel.toUpperCase()}]`, 
                bold: true, 
                font: 'Times New Roman', 
                size: 21,
                color: '0F172A'
              }),
            ],
            spacing: { before: 180, after: 60 },
          })
        );
        if (slot.learningObjective) {
          docParagraphs.push(
            new Paragraph({
              indent: { left: 240 },
              children: [
                new TextRun({ text: '• Yêu cầu cần đạt: ', bold: true, italics: true, font: 'Times New Roman', size: 19, color: '4338CA' }),
                new TextRun({ text: slot.learningObjective, italics: true, font: 'Times New Roman', size: 19, color: '475569' }),
              ],
              spacing: { after: 80 },
            })
          );
        }

        // Render each variant question
        slot.questions.forEach((q, qIndex) => {
          const qLabel = `Câu ${slot.slotNumber}.${qIndex + 1}`;
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${qLabel}: `, bold: true, font: 'Times New Roman', size: 22 }),
                new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
              ],
              spacing: { before: 100, after: 60 },
            })
          );

          if (q.options && q.options.length > 0) {
            const optionElements = createDocxMCOptionsElements(q.options, 21);
            optionElements.forEach(el => docParagraphs.push(el as any));
          }

          if (mode === 'full' && q.explanation) {
            docParagraphs.push(
              new Paragraph({
                indent: { left: 240 },
                children: [
                  new TextRun({ text: `[Đáp án: ${q.correctOption}] `, bold: true, color: '15803D', font: 'Times New Roman', size: 20 }),
                  new TextRun({ text: `Lời giải: ${cleanLatex(q.explanation)}`, italics: true, font: 'Times New Roman', size: 20, color: '334155' }),
                ],
                spacing: { before: 40, after: 100 },
              })
            );
          }
        });
      });
    }

    // -------------------------------------------------------------
    // PART II: TRUE / FALSE
    // -------------------------------------------------------------
    const p2Slots = studyGuide.slots.filter(s => s.part === 'part2');
    if (p2Slots.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: `PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI (${p2Slots.length} vị trí ma trận × ${mult} = ${p2Slots.length * mult} câu rèn luyện)`,
              bold: true,
              font: 'Times New Roman',
              size: 24,
              color: '1E40AF'
            }),
          ],
          spacing: { before: 260, after: 80 },
        })
      );

      p2Slots.forEach((slot) => {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `◆ Vị trí Ma trận #${slot.slotNumber} - Chủ đề: ${slot.topic} | Nội dung: ${slot.unit} [Mức độ: ${slot.cognitiveLevel.toUpperCase()}]`, 
                bold: true, 
                font: 'Times New Roman', 
                size: 21,
                color: '0F172A'
              }),
            ],
            spacing: { before: 180, after: 60 },
          })
        );
        if (slot.learningObjective) {
          docParagraphs.push(
            new Paragraph({
              indent: { left: 240 },
              children: [
                new TextRun({ text: '• Yêu cầu cần đạt: ', bold: true, italics: true, font: 'Times New Roman', size: 19, color: '4338CA' }),
                new TextRun({ text: slot.learningObjective, italics: true, font: 'Times New Roman', size: 19, color: '475569' }),
              ],
              spacing: { after: 80 },
            })
          );
        }

        slot.questions.forEach((q, qIndex) => {
          const qLabel = `Câu ${slot.slotNumber}.${qIndex + 1}`;
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${qLabel}: `, bold: true, font: 'Times New Roman', size: 22 }),
                new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
              ],
              spacing: { before: 100, after: 60 },
            })
          );

          if (q.trueFalseItems && q.trueFalseItems.length > 0) {
            q.trueFalseItems.forEach((sub) => {
              docParagraphs.push(
                new Paragraph({
                  indent: { left: 320 },
                  children: [
                    new TextRun({ text: `${sub.key}) `, bold: true, font: 'Times New Roman', size: 21 }),
                    new TextRun({ text: cleanLatex(sub.statement), font: 'Times New Roman', size: 21 }),
                    mode === 'full' ? new TextRun({ text: ` [${sub.isCorrect ? 'ĐÚNG' : 'SAI'}]`, bold: true, color: sub.isCorrect ? '15803D' : 'B91C1C', font: 'Times New Roman', size: 20 }) : new TextRun({ text: '' }),
                  ],
                  spacing: { after: 40 },
                })
              );
            });
          }

          if (mode === 'full' && q.explanation) {
            docParagraphs.push(
              new Paragraph({
                indent: { left: 240 },
                children: [
                  new TextRun({ text: `Lời giải & Nhận định: ${cleanLatex(q.explanation)}`, italics: true, font: 'Times New Roman', size: 20, color: '334155' }),
                ],
                spacing: { before: 40, after: 100 },
              })
            );
          }
        });
      });
    }

    // -------------------------------------------------------------
    // PART III: SHORT ANSWER
    // -------------------------------------------------------------
    const p3Slots = studyGuide.slots.filter(s => s.part === 'part3');
    if (p3Slots.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: `PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN (${p3Slots.length} vị trí ma trận × ${mult} = ${p3Slots.length * mult} câu rèn luyện)`,
              bold: true,
              font: 'Times New Roman',
              size: 24,
              color: '1E40AF'
            }),
          ],
          spacing: { before: 260, after: 80 },
        })
      );

      p3Slots.forEach((slot) => {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `◆ Vị trí Ma trận #${slot.slotNumber} - Chủ đề: ${slot.topic} | Nội dung: ${slot.unit} [Mức độ: ${slot.cognitiveLevel.toUpperCase()}]`, 
                bold: true, 
                font: 'Times New Roman', 
                size: 21,
                color: '0F172A'
              }),
            ],
            spacing: { before: 180, after: 60 },
          })
        );
        if (slot.learningObjective) {
          docParagraphs.push(
            new Paragraph({
              indent: { left: 240 },
              children: [
                new TextRun({ text: '• Yêu cầu cần đạt: ', bold: true, italics: true, font: 'Times New Roman', size: 19, color: '4338CA' }),
                new TextRun({ text: slot.learningObjective, italics: true, font: 'Times New Roman', size: 19, color: '475569' }),
              ],
              spacing: { after: 80 },
            })
          );
        }

        slot.questions.forEach((q, qIndex) => {
          const qLabel = `Câu ${slot.slotNumber}.${qIndex + 1}`;
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${qLabel}: `, bold: true, font: 'Times New Roman', size: 22 }),
                new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
              ],
              spacing: { before: 100, after: 60 },
            })
          );

          if (mode === 'full') {
            docParagraphs.push(
              new Paragraph({
                indent: { left: 240 },
                children: [
                  new TextRun({ text: `[Đáp số: ${q.shortAnswerKey || ''}] `, bold: true, color: '15803D', font: 'Times New Roman', size: 20 }),
                  new TextRun({ text: `Hướng dẫn giải: ${cleanLatex(q.explanation)}`, italics: true, font: 'Times New Roman', size: 20, color: '334155' }),
                ],
                spacing: { before: 40, after: 100 },
              })
            );
          }
        });
      });
    }

    // -------------------------------------------------------------
    // PART IV: ESSAY
    // -------------------------------------------------------------
    const p4Slots = studyGuide.slots.filter(s => s.part === 'part4');
    if (p4Slots.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: `PHẦN IV. CÂU HỎI TỰ LUẬN (${p4Slots.length} vị trí ma trận × ${mult} = ${p4Slots.length * mult} câu rèn luyện)`,
              bold: true,
              font: 'Times New Roman',
              size: 24,
              color: '1E40AF'
            }),
          ],
          spacing: { before: 260, after: 80 },
        })
      );

      p4Slots.forEach((slot) => {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `◆ Vị trí Ma trận #${slot.slotNumber} - Chủ đề: ${slot.topic} | Nội dung: ${slot.unit} [Mức độ: ${slot.cognitiveLevel.toUpperCase()}]`, 
                bold: true, 
                font: 'Times New Roman', 
                size: 21,
                color: '0F172A'
              }),
            ],
            spacing: { before: 180, after: 60 },
          })
        );
        if (slot.learningObjective) {
          docParagraphs.push(
            new Paragraph({
              indent: { left: 240 },
              children: [
                new TextRun({ text: '• Yêu cầu cần đạt: ', bold: true, italics: true, font: 'Times New Roman', size: 19, color: '4338CA' }),
                new TextRun({ text: slot.learningObjective, italics: true, font: 'Times New Roman', size: 19, color: '475569' }),
              ],
              spacing: { after: 80 },
            })
          );
        }

        slot.questions.forEach((q, qIndex) => {
          const qLabel = `Câu ${slot.slotNumber}.${qIndex + 1}`;
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${qLabel}: `, bold: true, font: 'Times New Roman', size: 22 }),
                new TextRun({ text: cleanLatex(q.content), font: 'Times New Roman', size: 22 }),
              ],
              spacing: { before: 100, after: 60 },
            })
          );

          if (mode === 'full' && (q.explanation || q.essayRubric)) {
            docParagraphs.push(
              new Paragraph({
                indent: { left: 240 },
                children: [
                  new TextRun({ text: 'Hướng dẫn chấm & Đáp án gợi ý:\n', bold: true, font: 'Times New Roman', size: 20, color: '1E3A8A' }),
                  new TextRun({ text: cleanLatex(q.explanation || q.essayRubric || ''), font: 'Times New Roman', size: 20, color: '334155' }),
                ],
                spacing: { before: 40, after: 100 },
              })
            );
          }
        });
      });
    }
  }

  // If mode === 'full' or 'answers_only', append Comprehensive Answer Key Summary Table
  if (mode === 'full' || mode === 'answers_only') {
    docParagraphs.push(
      new Paragraph({
        children: [],
        pageBreakBefore: true,
      })
    );

    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({ 
            text: 'BẢNG TỔNG HỢP ĐÁP ÁN BỘ ĐỀ CƯƠNG ÔN TẬP', 
            bold: true, 
            font: 'Times New Roman', 
            size: 24, 
            color: '1E3A8A' 
          }),
        ],
        spacing: { before: 160, after: 120 },
      })
    );

    // Summary Table for Part 1 & Part 3
    const tableKeyRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: '1E3A8A' },
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Vị trí ma trận', bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: '1E3A8A' },
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dạng thức / Mức độ', bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            shading: { fill: '1E3A8A' },
            borders: allBorders,
            margins: cellMargins,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Đáp án ${mult} câu rèn luyện tương đương`, bold: true, color: 'FFFFFF', font: 'Times New Roman', size: 20 })] })],
          }),
        ],
      }),
    ];

    studyGuide.slots.forEach((slot) => {
      let answersFormatted = '';
      if (slot.part === 'part1') {
        answersFormatted = slot.questions.map((q, idx) => `Câu ${slot.slotNumber}.${idx + 1}: ${q.correctOption || 'A'}`).join('   |   ');
      } else if (slot.part === 'part2') {
        answersFormatted = slot.questions.map((q, idx) => {
          const tfStr = q.trueFalseItems?.map(i => `${i.key}:${i.isCorrect ? 'Đ' : 'S'}`).join(' ') || '';
          return `Câu ${slot.slotNumber}.${idx + 1} (${tfStr})`;
        }).join('   |   ');
      } else if (slot.part === 'part3') {
        answersFormatted = slot.questions.map((q, idx) => `Câu ${slot.slotNumber}.${idx + 1}: ${q.shortAnswerKey || ''}`).join('   |   ');
      } else {
        answersFormatted = slot.questions.map((_, idx) => `Câu ${slot.slotNumber}.${idx + 1}: Xem biểu điểm chi tiết`).join('   |   ');
      }

      tableKeyRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: allBorders,
              margins: cellMargins,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Câu ${slot.slotNumber}`, bold: true, font: 'Times New Roman', size: 20 })] })],
            }),
            new TableCell({
              borders: allBorders,
              margins: cellMargins,
              children: [
                new Paragraph({ children: [new TextRun({ text: slot.partName, bold: true, font: 'Times New Roman', size: 19 })] }),
                new Paragraph({ children: [new TextRun({ text: `[${slot.cognitiveLevel}]`, italics: true, color: '4B5563', font: 'Times New Roman', size: 18 })] }),
              ],
            }),
            new TableCell({
              borders: allBorders,
              margins: cellMargins,
              children: [
                new Paragraph({ children: [new TextRun({ text: answersFormatted, bold: true, color: '15803D', font: 'Times New Roman', size: 20 })] }),
              ],
            }),
          ],
        })
      );
    });

    const keyTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      rows: tableKeyRows,
    });

    docParagraphs.push(keyTable);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, bottom: 900, left: 900, right: 900 },
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
  
  let filePrefix = 'De-cuong-on-tap';
  if (mode === 'student') filePrefix = 'Phieu-on-tap-hoc-sinh';
  if (mode === 'answers_only') filePrefix = 'Bang-dap-an-de-cuong';

  const fileName = `${filePrefix}-${header.subject.replace(/\s+/g, '-')}-${header.grade.replace(/\s+/g, '-')}-x${mult}-Cau.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
