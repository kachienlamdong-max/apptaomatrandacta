import { 
  ExamQuestion, 
  ExamHeaderConfig, 
  MatrixRow, 
  SpecificationItem, 
  MultipleChoiceOption, 
  TrueFalseSubItem,
  StudyGuideData,
  StudyGuideQuestionSlot
} from '../types';
import { getQuestionBankForSubject, RawMCQ, RawTF, RawShort, RawEssay } from './questionBanks';
import { balanceMultipleChoiceQuestions } from './answerBalancer';

export function normalizeSubjectKey(subjectName: string): string {
  const s = (subjectName || '').toLowerCase().trim();
  if (s.includes('toán')) return 'toan';
  if (s.includes('văn') || s.includes('tiếng việt')) return 'ngu-van';
  if (s.includes('anh') || s.includes('english')) return 'tieng-anh';
  if (s.includes('vật lí') || s.includes('vật lý')) return 'vat-li';
  if (s.includes('hóa')) return 'hoa-hoc';
  if (s.includes('sinh')) return 'sinh-hoc';
  if (s.includes('địa')) return 'dia-li';
  if (s.includes('lịch sử và địa lí') || s.includes('ls&đl')) return 'lich-su-dia-li';
  if (s.includes('sử') || s.includes('lịch sử')) return 'lich-su';
  if (s.includes('kinh tế') || s.includes('gdcd') || s.includes('pháp luật')) return 'gdkt-pl';
  if (s.includes('tin')) return 'tin-hoc';
  if (s.includes('tự nhiên') || s.includes('khtn')) return 'khtn';
  if (s.includes('công nghệ')) return 'cong-nghe';
  return 'toan';
}

// =========================================================================
// MAIN DISPATCHER: BUILD UNIQUE QUESTIONS GUARANTEED
// =========================================================================

import { sanitizeMatrixForPartConfigs, autoBalanceMatrixToTarget } from './structurePresets';

export function generateConsistentQuestionsFromMatrixAndSpec(
  header: ExamHeaderConfig,
  matrix: MatrixRow[],
  specification: SpecificationItem[] = []
): ExamQuestion[] {
  const subjectKey = normalizeSubjectKey(header.subject);
  const questions: ExamQuestion[] = [];

  const partConfigs = header.partConfigs || {
    part1: { name: 'Phần I (TN 4 lựa chọn)', pointsPerQuestion: 0.25, targetQuestions: 12, enabled: true },
    part2: { name: 'Phần II (Đúng/Sai)', pointsPerQuestion: 1.0, targetQuestions: 4, enabled: true },
    part3: { name: 'Phần III (Trả lời ngắn)', pointsPerQuestion: 0.5, targetQuestions: 6, enabled: true },
    part4: { name: 'Phần IV (Tự luận)', pointsPerQuestion: 1.0, targetQuestions: 0, enabled: false },
  };

  const isP1Active = (partConfigs.part1?.enabled !== false) && ((partConfigs.part1?.targetQuestions ?? 12) > 0);
  const isP2Active = (partConfigs.part2?.enabled !== false) && ((partConfigs.part2?.targetQuestions ?? 4) > 0);
  const isP3Active = (partConfigs.part3?.enabled !== false) && ((partConfigs.part3?.targetQuestions ?? 6) > 0);
  const isP4Active = (partConfigs.part4?.enabled !== false) && ((partConfigs.part4?.targetQuestions ?? 2) > 0);

  const p1Pts = isP1Active ? (partConfigs.part1?.pointsPerQuestion ?? 0.25) : 0;
  const p2Pts = isP2Active ? (partConfigs.part2?.pointsPerQuestion ?? 1.0) : 0;
  const p3Pts = isP3Active ? (partConfigs.part3?.pointsPerQuestion ?? 0.5) : 0;
  const p4Pts = isP4Active ? (partConfigs.part4?.pointsPerQuestion ?? 1.0) : 0;

  // First, clean matrix: strictly zero-out any locked parts so that disabled parts NEVER generate questions
  let activeMatrix = sanitizeMatrixForPartConfigs(matrix, partConfigs);

  // Check if an active part has 0 questions allocated in matrix, if so auto-balance that part across topics
  const p1Count = activeMatrix.reduce((s, r) => s + r.part1_nb + r.part1_th + r.part1_vd + r.part1_vdc, 0);
  const p2Count = activeMatrix.reduce((s, r) => s + r.part2_nb + r.part2_th + r.part2_vd + r.part2_vdc, 0);
  const p3Count = activeMatrix.reduce((s, r) => s + r.part3_nb + r.part3_th + r.part3_vd + r.part3_vdc, 0);
  const p4Count = activeMatrix.reduce((s, r) => s + r.part4_nb + r.part4_th + r.part4_vd + r.part4_vdc, 0);

  const needsAutoFill = 
    (isP1Active && p1Count === 0 && (partConfigs.part1?.targetQuestions ?? 0) > 0) ||
    (isP2Active && p2Count === 0 && (partConfigs.part2?.targetQuestions ?? 0) > 0) ||
    (isP3Active && p3Count === 0 && (partConfigs.part3?.targetQuestions ?? 0) > 0) ||
    (isP4Active && p4Count === 0 && (partConfigs.part4?.targetQuestions ?? 0) > 0);

  if (needsAutoFill && activeMatrix.length > 0) {
    activeMatrix = autoBalanceMatrixToTarget(activeMatrix, partConfigs);
  }

  // Track used signatures across the entire test paper to strictly prevent duplicate questions
  const usedContents = new Set<string>();

  // 1. GENERATE PART I (Multiple Choice - ONLY if Part 1 is active)
  if (isP1Active) {
    let p1Order = 1;
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part1_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part1_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part1_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part1_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const q = getUniqueMCQuestion({
            subjectKey,
            subjectName: header.subject,
            grade: header.grade,
            topic: row.topic,
            unit: row.unit,
            level,
            objective: obj,
            orderNumber: p1Order++,
            points: p1Pts,
            index: i,
            rowIndex,
            usedContents
          });
          questions.push(q);
        }
      });
    });
  }

  // 2. GENERATE PART II (True/False - ONLY if Part 2 is active)
  if (isP2Active) {
    let p2Order = 1;
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part2_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part2_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part2_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part2_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const q = getUniqueTFQuestion({
            subjectKey,
            subjectName: header.subject,
            grade: header.grade,
            topic: row.topic,
            unit: row.unit,
            level,
            objective: obj,
            orderNumber: p2Order++,
            points: p2Pts,
            index: i,
            rowIndex,
            usedContents
          });
          questions.push(q);
        }
      });
    });
  }

  // 3. GENERATE PART III (Short Answer - ONLY if Part 3 is active)
  if (isP3Active) {
    let p3Order = 1;
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part3_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part3_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part3_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part3_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const q = getUniqueShortQuestion({
            subjectKey,
            subjectName: header.subject,
            grade: header.grade,
            topic: row.topic,
            unit: row.unit,
            level,
            objective: obj,
            orderNumber: p3Order++,
            points: p3Pts,
            index: i,
            rowIndex,
            usedContents
          });
          questions.push(q);
        }
      });
    });
  }

  // 4. GENERATE PART IV (Essay - ONLY if Part 4 is active)
  if (isP4Active) {
    let p4Order = 1;
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part4_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part4_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part4_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part4_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const q = getUniqueEssayQuestion({
            subjectKey,
            subjectName: header.subject,
            grade: header.grade,
            topic: row.topic,
            unit: row.unit,
            level,
            objective: obj,
            orderNumber: p4Order++,
            points: p4Pts,
            index: i,
            rowIndex,
            usedContents
          });
          questions.push(q);
        }
      });
    });
  }

  // Fallback if matrix was completely 0
  if (questions.length === 0) {
    return generateFallbackQuestionsForSubject(header);
  }

  // Ensure Part 1 Multiple Choice questions have balanced A, B, C, D distribution (approx 25% each)
  const balancedQuestions = balanceMultipleChoiceQuestions(questions, 101);

  return balancedQuestions;
}

// =========================================================================
// STUDY GUIDE / REVIEW QUESTION BANK GENERATOR (x4 VARIANT EQUIVALENTS)
// =========================================================================

export function generateStudyGuideFromMatrixAndSpec(
  header: ExamHeaderConfig,
  matrix: MatrixRow[],
  specification: SpecificationItem[] = [],
  multiplier: number = 4
): StudyGuideData {
  const subjectKey = normalizeSubjectKey(header.subject);
  const slots: StudyGuideQuestionSlot[] = [];

  const partConfigs = header.partConfigs || {
    part1: { name: 'Phần I (TN 4 lựa chọn)', pointsPerQuestion: 0.25, targetQuestions: 12, enabled: true },
    part2: { name: 'Phần II (Đúng/Sai)', pointsPerQuestion: 1.0, targetQuestions: 4, enabled: true },
    part3: { name: 'Phần III (Trả lời ngắn)', pointsPerQuestion: 0.5, targetQuestions: 6, enabled: true },
    part4: { name: 'Phần IV (Tự luận)', pointsPerQuestion: 1.0, targetQuestions: 0, enabled: false },
  };

  const isP1Active = (partConfigs.part1?.enabled !== false) && ((partConfigs.part1?.targetQuestions ?? 12) > 0);
  const isP2Active = (partConfigs.part2?.enabled !== false) && ((partConfigs.part2?.targetQuestions ?? 4) > 0);
  const isP3Active = (partConfigs.part3?.enabled !== false) && ((partConfigs.part3?.targetQuestions ?? 6) > 0);
  const isP4Active = (partConfigs.part4?.enabled !== false) && ((partConfigs.part4?.targetQuestions ?? 2) > 0);

  const p1Pts = isP1Active ? (partConfigs.part1?.pointsPerQuestion ?? 0.25) : 0;
  const p2Pts = isP2Active ? (partConfigs.part2?.pointsPerQuestion ?? 1.0) : 0;
  const p3Pts = isP3Active ? (partConfigs.part3?.pointsPerQuestion ?? 0.5) : 0;
  const p4Pts = isP4Active ? (partConfigs.part4?.pointsPerQuestion ?? 1.0) : 0;

  let activeMatrix = sanitizeMatrixForPartConfigs(matrix, partConfigs);
  const p1Count = activeMatrix.reduce((s, r) => s + r.part1_nb + r.part1_th + r.part1_vd + r.part1_vdc, 0);
  const p2Count = activeMatrix.reduce((s, r) => s + r.part2_nb + r.part2_th + r.part2_vd + r.part2_vdc, 0);
  const p3Count = activeMatrix.reduce((s, r) => s + r.part3_nb + r.part3_th + r.part3_vd + r.part3_vdc, 0);
  const p4Count = activeMatrix.reduce((s, r) => s + r.part4_nb + r.part4_th + r.part4_vd + r.part4_vdc, 0);

  const needsAutoFill = 
    (isP1Active && p1Count === 0 && (partConfigs.part1?.targetQuestions ?? 0) > 0) ||
    (isP2Active && p2Count === 0 && (partConfigs.part2?.targetQuestions ?? 0) > 0) ||
    (isP3Active && p3Count === 0 && (partConfigs.part3?.targetQuestions ?? 0) > 0) ||
    (isP4Active && p4Count === 0 && (partConfigs.part4?.targetQuestions ?? 0) > 0);

  if (needsAutoFill && activeMatrix.length > 0) {
    activeMatrix = autoBalanceMatrixToTarget(activeMatrix, partConfigs);
  }

  const globalUsed = new Set<string>();
  let globalSlotNumber = 1;

  // PART 1 (MCQ)
  if (isP1Active) {
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part1_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part1_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part1_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part1_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const slotNum = globalSlotNumber++;
          const slotQuestions: ExamQuestion[] = [];
          for (let m = 0; m < multiplier; m++) {
            const q = getUniqueMCQuestion({
              subjectKey,
              subjectName: header.subject,
              grade: header.grade,
              topic: row.topic,
              unit: row.unit,
              level,
              objective: obj,
              orderNumber: slotNum * 100 + m + 1,
              points: p1Pts,
              index: (i * multiplier + m) % 50,
              rowIndex,
              usedContents: globalUsed
            });
            q.orderNumber = slotNum;
            slotQuestions.push(q);
          }
          const balancedSlotQuestions = balanceMultipleChoiceQuestions(slotQuestions, slotNum * 19 + 7);
          slots.push({
            slotId: `slot-p1-${slotNum}`,
            slotNumber: slotNum,
            part: 'part1',
            partName: 'Phần I (Trắc nghiệm nhiều lựa chọn)',
            topic: row.topic,
            unit: row.unit,
            cognitiveLevel: level,
            learningObjective: obj,
            points: p1Pts,
            questions: balancedSlotQuestions
          });
        }
      });
    });
  }

  // PART 2 (True/False)
  if (isP2Active) {
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part2_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part2_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part2_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part2_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const slotNum = globalSlotNumber++;
          const slotQuestions: ExamQuestion[] = [];
          for (let m = 0; m < multiplier; m++) {
            const q = getUniqueTFQuestion({
              subjectKey,
              subjectName: header.subject,
              grade: header.grade,
              topic: row.topic,
              unit: row.unit,
              level,
              objective: obj,
              orderNumber: slotNum * 100 + m + 1,
              points: p2Pts,
              index: (i * multiplier + m) % 50,
              rowIndex,
              usedContents: globalUsed
            });
            q.orderNumber = slotNum;
            slotQuestions.push(q);
          }
          slots.push({
            slotId: `slot-p2-${slotNum}`,
            slotNumber: slotNum,
            part: 'part2',
            partName: 'Phần II (Trắc nghiệm Đúng/Sai)',
            topic: row.topic,
            unit: row.unit,
            cognitiveLevel: level,
            learningObjective: obj,
            points: p2Pts,
            questions: slotQuestions
          });
        }
      });
    });
  }

  // PART 3 (Short Answer)
  if (isP3Active) {
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part3_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part3_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part3_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part3_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const slotNum = globalSlotNumber++;
          const slotQuestions: ExamQuestion[] = [];
          for (let m = 0; m < multiplier; m++) {
            const q = getUniqueShortQuestion({
              subjectKey,
              subjectName: header.subject,
              grade: header.grade,
              topic: row.topic,
              unit: row.unit,
              level,
              objective: obj,
              orderNumber: slotNum * 100 + m + 1,
              points: p3Pts,
              index: (i * multiplier + m) % 50,
              rowIndex,
              usedContents: globalUsed
            });
            q.orderNumber = slotNum;
            slotQuestions.push(q);
          }
          slots.push({
            slotId: `slot-p3-${slotNum}`,
            slotNumber: slotNum,
            part: 'part3',
            partName: 'Phần III (Trắc nghiệm Trả lời ngắn)',
            topic: row.topic,
            unit: row.unit,
            cognitiveLevel: level,
            learningObjective: obj,
            points: p3Pts,
            questions: slotQuestions
          });
        }
      });
    });
  }

  // PART 4 (Essay)
  if (isP4Active) {
    activeMatrix.forEach((row, rowIndex) => {
      const spec = specification[rowIndex];
      const rowCounts = [
        { level: 'Nhận biết' as const, count: row.part4_nb || 0, obj: spec?.learningObjectives?.nb },
        { level: 'Thông hiểu' as const, count: row.part4_th || 0, obj: spec?.learningObjectives?.th },
        { level: 'Vận dụng' as const, count: row.part4_vd || 0, obj: spec?.learningObjectives?.vd },
        { level: 'Vận dụng cao' as const, count: row.part4_vdc || 0, obj: spec?.learningObjectives?.vdc },
      ];

      rowCounts.forEach(({ level, count, obj }) => {
        for (let i = 0; i < count; i++) {
          const slotNum = globalSlotNumber++;
          const slotQuestions: ExamQuestion[] = [];
          for (let m = 0; m < multiplier; m++) {
            const q = getUniqueEssayQuestion({
              subjectKey,
              subjectName: header.subject,
              grade: header.grade,
              topic: row.topic,
              unit: row.unit,
              level,
              objective: obj,
              orderNumber: slotNum * 100 + m + 1,
              points: p4Pts,
              index: (i * multiplier + m) % 50,
              rowIndex,
              usedContents: globalUsed
            });
            q.orderNumber = slotNum;
            slotQuestions.push(q);
          }
          slots.push({
            slotId: `slot-p4-${slotNum}`,
            slotNumber: slotNum,
            part: 'part4',
            partName: 'Phần IV (Tự luận)',
            topic: row.topic,
            unit: row.unit,
            cognitiveLevel: level,
            learningObjective: obj,
            points: p4Pts,
            questions: slotQuestions
          });
        }
      });
    });
  }

  const totalQuestions = slots.reduce((sum, s) => sum + s.questions.length, 0);

  return {
    header,
    multiplier,
    totalSlots: slots.length,
    totalQuestions,
    slots,
    generatedAt: new Date().toISOString()
  };
}

// -------------------------------------------------------------
// SELECTION HELPERS THAT STRICTLY ENFORCE UNIQUENESS & GRADE SCOPE
// -------------------------------------------------------------

export function extractGradeNumber(gradeStr?: string): string {
  if (!gradeStr) return '';
  const match = gradeStr.match(/\b(10|11|12|6|7|8|9)\b/);
  return match ? match[1] : '';
}

interface SelectionContext {
  subjectKey: string;
  subjectName: string;
  grade: string;
  topic: string;
  unit: string;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  objective?: string;
  orderNumber: number;
  points: number;
  index: number;
  rowIndex: number;
  usedContents: Set<string>;
}

function getUniqueMCQuestion(ctx: SelectionContext): ExamQuestion {
  const bank = getQuestionBankForSubject(ctx.subjectKey);
  const id = `q-mc-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;
  const tKeywords = (ctx.topic + ' ' + ctx.unit).toLowerCase();
  const targetGrade = extractGradeNumber(ctx.grade);

  // 1. Strict match: same grade + topic keywords match + unused
  let candidates = bank.mcq.filter(item => {
    if (ctx.usedContents.has(item.content)) return false;
    if (targetGrade && item.grade && item.grade !== targetGrade) return false;
    if (item.topicKeywords && item.topicKeywords.some(kw => tKeywords.includes(kw))) return true;
    return false;
  });

  // 2. Secondary match: same grade + unused
  if (candidates.length === 0) {
    candidates = bank.mcq.filter(item => {
      if (ctx.usedContents.has(item.content)) return false;
      if (targetGrade && item.grade && item.grade !== targetGrade) return false;
      return true;
    });
  }

  // 3. Fallback if bank has no items for this grade (only for non-grade-tagged banks)
  if (candidates.length === 0 && !targetGrade) {
    candidates = bank.mcq.filter(item => !ctx.usedContents.has(item.content));
  }

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'multiple_choice',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      options: chosen.options,
      correctOption: chosen.correctOption,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  // Synthesize subject-specific, highly pedagogical MCQ question with variation
  const unit = ctx.unit || ctx.topic;
  const v = ctx.orderNumber;

  let synthContent = '';
  let options: MultipleChoiceOption[] = [
    { key: 'A', content: '' },
    { key: 'B', content: '' },
    { key: 'C', content: '' },
    { key: 'D', content: '' }
  ];
  let correctOpt: 'A' | 'B' | 'C' | 'D' = 'A';
  let explanation = '';

  if (ctx.subjectKey === 'toan') {
    const k = (v * 3 + 1);
    const m = (v * 2 + 3);
    synthContent = `Cho hàm số bậc ba $y = f(x) = x^3 - ${k}x + ${m}$. Đạo hàm của hàm số đã cho là:`;
    options = [
      { key: 'A', content: `$y\' = 3x^2 - ${k}$` },
      { key: 'B', content: `$y\' = 3x^2 - ${k}x$` },
      { key: 'C', content: `$y\' = x^2 - ${k}$` },
      { key: 'D', content: `$y\' = 3x^2 + ${m}$` }
    ];
    correctOpt = 'A';
    explanation = `Áp dụng công thức tính đạo hàm $(x^n)\' = n x^{n-1} \\implies y\' = 3x^2 - ${k}$.`;
  } else if (ctx.subjectKey === 'vat-li') {
    const freq = 50 + (v % 5) * 10;
    synthContent = `Một vật dao động điều hòa với tần số $f = ${freq}\\text{ Hz}$. Chu kì dao động $T$ của vật bằng:`;
    const period = (1 / freq).toFixed(3);
    options = [
      { key: 'A', content: `$${period}\\text{ s}$` },
      { key: 'B', content: `$${freq}\\text{ s}$` },
      { key: 'C', content: `$${(freq * 2)}\\text{ s}$` },
      { key: 'D', content: `$${(freq / 2).toFixed(1)}\\text{ s}$` }
    ];
    correctOpt = 'A';
    explanation = `Chu kì dao động $T = \\frac{1}{f} = \\frac{1}{${freq}} \\approx ${period}\\text{ s}$.`;
  } else if (ctx.subjectKey === 'hoa-hoc') {
    const num = v + 1;
    synthContent = `Chất hữu cơ $X$ có công thức cấu tạo $\\text{CH}_3(\\text{CH}_2)_{${num}}\\text{COOCH}_3$. Tên gọi hoặc tính chất cơ bản của $X$ thuộc nhóm hợp chất nào?`;
    options = [
      { key: 'A', content: 'Este no, đơn chức, mạch hở.' },
      { key: 'B', content: 'Axit cacboxylic không no.' },
      { key: 'C', content: 'Ancol đa chức.' },
      { key: 'D', content: 'Hợp chất amin thơm.' }
    ];
    correctOpt = 'A';
    explanation = `$X$ có nhóm chức -COO- liên kết gốc hiđrocacbon no nên thuộc loại este no, đơn chức, mạch hở.`;
  } else if (ctx.subjectKey === 'dia-li') {
    const leadIns = [
      `Đặc điểm nổi bật của ${unit} ở nước ta hiện nay là:`,
      `Nguyên nhân chủ yếu thúc đẩy sự phát triển của ${unit} ở nước ta là:`,
      `Ý nghĩa kinh tế - xã hội quan trọng nhất của việc phát triển ${unit} là:`,
      `Giải pháp chủ yếu để nâng cao hiệu quả và giá trị của ${unit} hiện nay là:`
    ];
    synthContent = leadIns[v % leadIns.length];
    options = [
      { key: 'A', content: `Đẩy mạnh ứng dụng khoa học kĩ thuật, gắn liền chế biến với mở rộng thị trường.` },
      { key: 'B', content: `Chỉ tập trung khai thác tài nguyên tự nhiên dạng thô với quy mô phân tán.` },
      { key: 'C', content: `Hạn chế liên kết vùng và giảm bớt thu hút các nguồn vốn đầu tư bên ngoài.` },
      { key: 'D', content: `Duy trì phương thức sản xuất truyền thống, không cần đổi mới quy trình công nghệ.` }
    ];
    correctOpt = 'A';
    explanation = `Khẳng định A đúng vì định hướng nâng cao hiệu quả ${unit} luôn gắn với ứng dụng công nghệ, chế biến sâu và mở rộng thị trường tiêu thụ.`;
  } else if (ctx.subjectKey === 'lich-su') {
    const leadIns = [
      `Nội dung nào sau đây phản ánh đúng ý nghĩa lịch sử của ${unit}?`,
      `Nguyên nhân mang tính quyết định thắng lợi của ${unit} là:`,
      `Bài học kinh nghiệm quý báu được rút ra từ ${unit} đối với công cuộc đổi mới hiện nay là:`
    ];
    synthContent = leadIns[v % leadIns.length];
    options = [
      { key: 'A', content: `Phát huy sức mạnh khối đại đoàn kết toàn dân tộc dưới sự lãnh đạo đúng đắn, sáng tạo.` },
      { key: 'B', content: `Chỉ trông chờ vào sự viện trợ giúp đỡ trực tiếp từ bên ngoài mà thiếu tính tự lực.` },
      { key: 'C', content: 'Không chú trọng xây dựng và củng cố căn cứ địa cách mạng ở hậu phương.' },
      { key: 'D', content: 'Rời bỏ mục tiêu độc lập dân tộc gắn liền với tiến bộ xã hội.' }
    ];
    correctOpt = 'A';
    explanation = `Khẳng định A phản ánh đúng bài học lịch sử cốt lõi về khối đại đoàn kết toàn dân và vai trò lãnh đạo đường lối.`;
  } else if (ctx.subjectKey === 'gdkt-pl') {
    synthContent = `Theo quy định của pháp luật hiện hành, hành vi nào sau đây thể hiện việc thực hiện đúng quyền và nghĩa vụ liên quan đến ${unit}?`;
    options = [
      { key: 'A', content: `Chủ động tìm hiểu, tuân thủ đúng quy định và có ý thức bảo vệ lợi ích công cộng.` },
      { key: 'B', content: `Tự ý thay đổi quy trình pháp lí mà không thông qua cơ quan chức năng có thẩm quyền.` },
      { key: 'C', content: `Từ chối thực hiện nghĩa vụ công dân khi gặp các trở ngại khách quan trong đời sống.` },
      { key: 'D', content: `Chỉ thực hiện quyền lợi cá nhân mà bỏ qua nghĩa vụ và trách nhiệm đối với xã hội.` }
    ];
    correctOpt = 'A';
    explanation = `Khẳng định A thể hiện công dân gương mẫu, kết hợp hài hòa quyền lợi và trách nhiệm pháp lí.`;
  } else {
    const leadIns = [
      `Phát biểu nào sau đây là đúng khi nói về đặc điểm của ${unit}?`,
      `Nội dung nào sau đây phản ánh chính xác bản chất của ${unit}?`,
      `Giải pháp trọng tâm để nâng cao hiệu quả ứng dụng của ${unit} trong thực tiễn là:`
    ];
    synthContent = leadIns[v % leadIns.length];
    options = [
      { key: 'A', content: `Nắm vững nguyên lí cốt lõi và vận dụng linh hoạt, sáng tạo vào thực tiễn.` },
      { key: 'B', content: `Chỉ học thuộc lòng máy móc định nghĩa mà không cần liên hệ kiểm chứng thực tế.` },
      { key: 'C', content: `Bỏ qua các quy luật vận động khách quan và tính hệ thống của tri thức.` },
      { key: 'D', content: `Không tuân thủ các chuẩn mực và quy trình khoa học đã được kiểm định.` }
    ];
    correctOpt = 'A';
    explanation = `Khẳng định A đúng vì yêu cầu cốt lõi của "${unit}" là hiểu sâu bản chất và vận dụng linh hoạt, hiệu quả vào thực tiễn.`;
  }

  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'multiple_choice',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    options,
    correctOption: correctOpt,
    points: ctx.points,
    explanation
  };
}

function getUniqueTFQuestion(ctx: SelectionContext): ExamQuestion {
  const bank = getQuestionBankForSubject(ctx.subjectKey);
  const id = `q-tf-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;
  const tKeywords = (ctx.topic + ' ' + ctx.unit).toLowerCase();
  const targetGrade = extractGradeNumber(ctx.grade);

  let candidates = bank.tf.filter(item => {
    if (ctx.usedContents.has(item.content)) return false;
    if (targetGrade && item.grade && item.grade !== targetGrade) return false;
    if (item.topicKeywords && item.topicKeywords.some(kw => tKeywords.includes(kw))) return true;
    return false;
  });

  if (candidates.length === 0) {
    candidates = bank.tf.filter(item => {
      if (ctx.usedContents.has(item.content)) return false;
      if (targetGrade && item.grade && item.grade !== targetGrade) return false;
      return true;
    });
  }

  if (candidates.length === 0 && !targetGrade) {
    candidates = bank.tf.filter(item => !ctx.usedContents.has(item.content));
  }

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'true_false',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      trueFalseItems: chosen.items,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  // Synthesize rich, non-repeating True/False questions with distinct contexts
  const unit = ctx.unit || ctx.topic;
  
  const synthContent = `Cho thông tin sau:\n"Nội dung ${unit} đóng vai trò quan trọng trong việc phân tích các quy luật khoa học, kiểm chứng số liệu thực nghiệm và giải quyết các bài toán thực tiễn gắn liền với đời sống kinh tế - xã hội."\nXét tính đúng/sai của các nhận định:`;

  const items: TrueFalseSubItem[] = [
    {
      key: 'a',
      statement: `Nội dung ${unit} cung cấp các khái niệm và nguyên lí nền tảng cần đạt.`,
      isCorrect: true,
      explanation: 'Đúng (Mức Biết): Khái niệm cơ bản được quy định rõ trong chuẩn kiến thức.'
    },
    {
      key: 'b',
      statement: `Mọi quy luật khoa học thuộc bài học ${unit} đều bất biến và không cần xét đến điều kiện môi trường áp dụng.`,
      isCorrect: false,
      explanation: 'Sai (Mức Hiểu): Mỗi định luật hay quy luật khoa học đều có giới hạn nghiệm đúng và điều kiện xác định.'
    },
    {
      key: 'c',
      statement: `Việc vận dụng linh hoạt kiến thức của ${unit} giúp tối ưu hóa phương pháp giải quyết vấn đề và thích ứng với yêu cầu thực tiễn.`,
      isCorrect: true,
      explanation: 'Đúng (Mức Vận dụng): Đạt mục tiêu rèn luyện năng lực giải quyết vấn đề.'
    },
    {
      key: 'd',
      statement: `Kiến thức ${unit} hoàn toàn biệt lập, không có bất kì mối liên hệ nào với các chủ đề khác trong chương trình.`,
      isCorrect: false,
      explanation: 'Sai (Mức Vận dụng cao): Chương trình GDPT 2018 mang tính tích hợp và liên môn cao.'
    }
  ];

  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'true_false',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    trueFalseItems: items,
    points: ctx.points,
    explanation: 'Nhận định a, c là ĐÚNG; b, d là SAI.'
  };
}

function getUniqueShortQuestion(ctx: SelectionContext): ExamQuestion {
  const bank = getQuestionBankForSubject(ctx.subjectKey);
  const id = `q-sa-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;
  const tKeywords = (ctx.topic + ' ' + ctx.unit).toLowerCase();
  const targetGrade = extractGradeNumber(ctx.grade);

  let candidates = bank.short.filter(item => {
    if (ctx.usedContents.has(item.content)) return false;
    if (targetGrade && item.grade && item.grade !== targetGrade) return false;
    if (item.topicKeywords && item.topicKeywords.some(kw => tKeywords.includes(kw))) return true;
    return false;
  });

  if (candidates.length === 0) {
    candidates = bank.short.filter(item => {
      if (ctx.usedContents.has(item.content)) return false;
      if (targetGrade && item.grade && item.grade !== targetGrade) return false;
      return true;
    });
  }

  if (candidates.length === 0 && !targetGrade) {
    candidates = bank.short.filter(item => !ctx.usedContents.has(item.content));
  }

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'short_answer',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      shortAnswerKey: chosen.key,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  // Synthesize subject-specific unique quantitative calculations with valid short answers (<=4 chars)
  const v = ctx.orderNumber;
  let synthContent = '';
  let key = '';
  let explanation = '';

  if (ctx.subjectKey === 'toan') {
    const a = v + 2;
    const b = a * 3;
    synthContent = `Tìm nghiệm nguyên dương $x$ của phương trình $\\log_2(x + ${a}) = \\log_2(${b})$. Khi trả lời, chỉ ghi số.`;
    const ans = (b - a).toString();
    key = ans;
    explanation = `Phương trình tương đương: $x + ${a} = ${b} \\implies x = ${ans}$.`;
  } else if (ctx.subjectKey === 'dia-li') {
    const pop = (1200 + v * 300);
    const area = (300 + v * 50);
    const density = Math.round(pop / area);
    synthContent = `Một địa phương có diện tích là $${area}\\text{ km}^2$, số dân là $${pop * 1000}$ người. Tính mật độ dân số của địa phương đó (đơn vị: người/km²), làm tròn đến hàng đơn vị. Khi trả lời, chỉ ghi số.`;
    key = String(density);
    explanation = `$\\text{Mật độ} = \\frac{${pop * 1000}}{${area}} \\approx ${density}\\text{ người/km}^2$.`;
  } else if (ctx.subjectKey === 'vat-li') {
    const u = 100 + v * 20;
    const r = 20 + v * 5;
    const i = (u / r).toFixed(1).replace('.', ',');
    synthContent = `Đặt điện áp $U = ${u}\\text{ V}$ vào hai đầu điện trở $R = ${r}\\ \\Omega$. Tính cường độ dòng điện $I$ (đơn vị: A) chạy qua điện trở. Khi trả lời, chỉ ghi số.`;
    key = i;
    explanation = `$I = \\frac{U}{R} = \\frac{${u}}{${r}} = ${i}\\text{ A}$.`;
  } else {
    const valA = 10 + v * 5;
    const valB = 50 + v * 10;
    const pct = Math.round((valA / valB) * 100);
    synthContent = `Trong một khảo sát thực nghiệm về "${ctx.unit || ctx.topic}", đại lượng $X$ đạt giá trị $${valA}$ trên tổng dung sai định mức $${valB}$. Tính tỉ lệ (%) của $X$ so với định mức (làm tròn đến hàng đơn vị). Khi trả lời, chỉ ghi số.`;
    key = String(pct);
    explanation = `$\\text{Tỉ lệ} = \\frac{${valA}}{${valB}} \\times 100\\% = ${pct}\\%$.`;
  }

  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'short_answer',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    shortAnswerKey: key,
    points: ctx.points,
    explanation
  };
}

function getUniqueEssayQuestion(ctx: SelectionContext): ExamQuestion {
  const bank = getQuestionBankForSubject(ctx.subjectKey);
  const id = `q-es-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;
  const tKeywords = (ctx.topic + ' ' + ctx.unit).toLowerCase();
  const targetGrade = extractGradeNumber(ctx.grade);

  let candidates = bank.essay.filter(item => {
    if (ctx.usedContents.has(item.content)) return false;
    if (targetGrade && item.grade && item.grade !== targetGrade) return false;
    if (item.topicKeywords && item.topicKeywords.some(kw => tKeywords.includes(kw))) return true;
    return false;
  });

  if (candidates.length === 0) {
    candidates = bank.essay.filter(item => {
      if (ctx.usedContents.has(item.content)) return false;
      if (targetGrade && item.grade && item.grade !== targetGrade) return false;
      return true;
    });
  }

  if (candidates.length === 0 && !targetGrade) {
    candidates = bank.essay.filter(item => !ctx.usedContents.has(item.content));
  }

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'essay',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      essayRubric: chosen.essayRubric,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  const v = ctx.orderNumber;
  const synthContent = `Dựa trên kiến thức về "${ctx.topic} - ${ctx.unit}":\na) Trình bày các đặc điểm bản chất và nguyên lí khoa học cốt lõi của nội dung trên.\nb) Phân tích 02 ứng dụng thực tiễn hoặc đề xuất giải pháp nhằm nâng cao hiệu quả vận dụng kiến thức này trong học tập và đời sống.`;
  
  const essayRubric = `Ý a (1.0đ): Nêu chính xác các khái niệm, cơ chế hoạt động và bản chất lí thuyết của ${ctx.unit || ctx.topic}.\nÝ b (1.0đ): Phân tích cụ thể 02 ứng dụng thực tế có tính khả thi, lập luận chặt chẽ và thuyết phục.`;

  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'essay',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    essayRubric,
    points: ctx.points,
    explanation: 'Học sinh trình bày đầy đủ bản chất khoa học và 02 ứng dụng thực tiễn logic.'
  };
}

// -------------------------------------------------------------
// INITIAL MATRIX AND SPEC GENERATION BY SUBJECT
// -------------------------------------------------------------

export function generateInitialMatrixAndSpecForSubject(subject: string, grade: string = 'Lớp 12'): {
  matrix: MatrixRow[];
  specification: SpecificationItem[];
} {
  const subjectKey = normalizeSubjectKey(subject);

  if (subjectKey === 'ngu-van') {
    const matrix: MatrixRow[] = [
      {
        id: 'mat-van-1',
        topic: 'Đọc hiểu văn bản văn học và văn bản nghị luận',
        unit: 'Đọc hiểu ngữ liệu ngoài SGK',
        part1_nb: 0, part1_th: 0, part1_vd: 0, part1_vdc: 0,
        part2_nb: 0, part2_th: 0, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 0, part3_vdc: 0,
        part4_nb: 1, part4_th: 1, part4_vd: 1, part4_vdc: 1,
        totalPoints: 4.0
      },
      {
        id: 'mat-van-2',
        topic: 'Viết văn bản nghị luận xã hội và nghị luận văn học',
        unit: 'Đoạn văn NLXH (200 chữ) và Bài văn NLVH (600 chữ)',
        part1_nb: 0, part1_th: 0, part1_vd: 0, part1_vdc: 0,
        part2_nb: 0, part2_th: 0, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 0, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 1, part4_vdc: 1,
        totalPoints: 6.0
      }
    ];

    const specification: SpecificationItem[] = [
      {
        id: 'spec-van-1',
        topic: 'Đọc hiểu văn bản văn học và văn bản nghị luận',
        unit: 'Đọc hiểu ngữ liệu ngoài SGK',
        learningObjectives: {
          nb: 'Nhận biết được thể loại, phương thức biểu đạt, các biện pháp tu từ và thông tin trực tiếp trong văn bản.',
          th: 'Hiểu được nội dung, tư tưởng, ý nghĩa của các hình ảnh, chi tiết và từ ngữ trong ngữ cảnh.',
          vd: 'Rút ra được thông điệp, bài học nhân sinh và quan điểm của bản thân về vấn đề đặt ra trong văn bản.',
          vdc: 'Đánh giá được nét đặc sắc về nghệ thuật và ý nghĩa thời đại của văn bản đối với cuộc sống hôm nay.'
        },
        questionCount: {
          part1: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part4: { nb: 1, th: 1, vd: 1, vdc: 1 },
        }
      },
      {
        id: 'spec-van-2',
        topic: 'Viết văn bản nghị luận xã hội và nghị luận văn học',
        unit: 'Đoạn văn NLXH (200 chữ) và Bài văn NLVH (600 chữ)',
        learningObjectives: {
          nb: 'Xác định đúng vấn đề nghị luận, đảm bảo cấu trúc đoạn văn/bài văn theo quy chuẩn.',
          th: 'Giải thích và bàn luận thấu đáo các khía cạnh của vấn đề với hệ thống luận điểm rõ ràng.',
          vd: 'Vận dụng các thao tác lập luận, đưa ra dẫn chứng thực tế xác thực để làm sáng tỏ vấn đề NLXH (2.0đ).',
          vdc: 'Phân tích sâu sắc giá trị nội dung, nghệ thuật của tác phẩm văn học và thể hiện phong cách sáng tạo cá nhân (4.0đ).'
        },
        questionCount: {
          part1: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 1, vdc: 1 },
        }
      }
    ];

    return { matrix, specification };
  }

  if (subjectKey === 'dia-li') {
    const targetGrade = extractGradeNumber(grade);

    if (targetGrade === '10') {
      const matrix: MatrixRow[] = [
        {
          id: 'mat-dl10-1',
          topic: 'Sử dụng bản đồ và Ứng dụng công nghệ GPS, GIS',
          unit: 'Phương pháp biểu hiện bản đồ và ứng dụng công nghệ địa lí',
          part1_nb: 2, part1_th: 1, part1_vd: 0, part1_vdc: 0,
          part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
          part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 2.25
        },
        {
          id: 'mat-dl10-2',
          topic: 'Thạch quyển và Khí quyển',
          unit: 'Thạch quyển, nội lực, ngoại lực và sự phân bố nhiệt ẩm',
          part1_nb: 2, part1_th: 1, part1_vd: 1, part1_vdc: 0,
          part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
          part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 3.0
        },
        {
          id: 'mat-dl10-3',
          topic: 'Thuỷ quyển và Sinh quyển',
          unit: 'Nước trên lục địa, dòng chảy sông ngòi và các đới sinh vật',
          part1_nb: 1, part1_th: 1, part1_vd: 0, part1_vdc: 0,
          part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
          part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 2.0
        },
        {
          id: 'mat-dl10-4',
          topic: 'Địa lí dân cư và các ngành kinh tế',
          unit: 'Cơ cấu dân số, nông nghiệp và dịch vụ thế giới',
          part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
          part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
          part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 2.75
        }
      ];

      const specification: SpecificationItem[] = [
        {
          id: 'spec-dl10-1',
          topic: 'Sử dụng bản đồ và Ứng dụng công nghệ GPS, GIS',
          unit: 'Phương pháp biểu hiện bản đồ và ứng dụng công nghệ địa lí',
          learningObjectives: {
            nb: 'Nêu được các phương pháp biểu hiện đối tượng địa lí trên bản đồ và chức năng cơ bản của GPS.',
            th: 'Giải thích được nguyên lí hoạt động và ý nghĩa của công nghệ GIS trong giám sát tài nguyên.',
            vd: 'Xác định tọa độ địa lí, cự li thực tế và phân tích thông tin từ hệ thống thông tin địa lí GIS.',
            vdc: 'Đề xuất giải pháp ứng dụng GPS và viễn thám trong cảnh báo sớm thiên tai và cứu hộ cứu nạn.'
          },
          questionCount: {
            part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
            part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
            part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        },
        {
          id: 'spec-dl10-2',
          topic: 'Thạch quyển và Khí quyển',
          unit: 'Thạch quyển, nội lực, ngoại lực và sự phân bố nhiệt ẩm',
          learningObjectives: {
            nb: 'Trình bày được cấu trúc của thạch quyển, các mảng kiến tạo và các đai khí áp trên Trái Đất.',
            th: 'Phân tích được tác động của nội lực, ngoại lực và nguyên nhân hình thành các mùa khí hậu.',
            vd: 'Tính toán và phân tích bảng số liệu về nhiệt độ không khí theo độ cao, lượng mưa các tháng.',
            vdc: 'Giải thích mối liên hệ giữa các hiện tượng thời tiết cực đoan (El Nino, La Nina) với biến đổi khí quyển.'
          },
          questionCount: {
            part1: { nb: 2, th: 1, vd: 1, vdc: 0 },
            part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
            part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        },
        {
          id: 'spec-dl10-3',
          topic: 'Thuỷ quyển và Sinh quyển',
          unit: 'Nước trên lục địa, dòng chảy sông ngòi và các đới sinh vật',
          learningObjectives: {
            nb: 'Nêu được các nguồn cung cấp nước cho sông ngòi và đặc điểm các đới sinh vật chính.',
            th: 'Giải thích được các nhân tố ảnh hưởng đến chế độ nước sông và sự phân bố của sinh vật.',
            vd: 'Xử lí số liệu và vẽ/nhận xét biểu đồ lưu lượng nước sông và lượng mưa theo các tháng trong năm.',
            vdc: 'Đánh giá nguy cơ suy thoái tài nguyên nước ngọt và đề xuất giải pháp quản lí tổng hợp lưu vực sông.'
          },
          questionCount: {
            part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
            part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
            part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        },
        {
          id: 'spec-dl10-4',
          topic: 'Địa lí dân cư và các ngành kinh tế',
          unit: 'Cơ cấu dân số, nông nghiệp và dịch vụ thế giới',
          learningObjectives: {
            nb: 'Trình bày được cơ cấu dân số theo giới tính, độ tuổi và vai trò của các ngành kinh tế.',
            th: 'Phân tích được các nhân tố ảnh hưởng đến sự phân bố nông nghiệp, công nghiệp và dịch vụ.',
            vd: 'Phân tích bảng số liệu về cơ cấu lao động và tính toán tỉ suất gia tăng dân số tự nhiên.',
            vdc: 'Đánh giá xu hướng chuyển đổi số và phát triển kinh tế xanh trong các ngành kinh tế hiện đại.'
          },
          questionCount: {
            part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
            part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
            part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        }
      ];

      return { matrix, specification };
    }

    if (targetGrade === '11') {
      const matrix: MatrixRow[] = [
        {
          id: 'mat-dl11-1',
          topic: 'Toàn cầu hoá kinh tế và Các nhóm nước',
          unit: 'Toàn cầu hoá, khu vực hoá và sự phân chia nhóm nước thế giới',
          part1_nb: 2, part1_th: 1, part1_vd: 0, part1_vdc: 0,
          part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
          part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 2.25
        },
        {
          id: 'mat-dl11-2',
          topic: 'Liên minh Châu Âu (EU) và Khu vực Mỹ La-tinh',
          unit: 'Vị thế kinh tế EU và đặc điểm đô thị hoá Mỹ La-tinh',
          part1_nb: 2, part1_th: 1, part1_vd: 1, part1_vdc: 0,
          part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
          part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 3.0
        },
        {
          id: 'mat-dl11-3',
          topic: 'Khu vực Đông Nam Á & ASEAN',
          unit: 'Tự nhiên, dân cư, kinh tế Đông Nam Á và hợp tác ASEAN',
          part1_nb: 1, part1_th: 1, part1_vd: 0, part1_vdc: 0,
          part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
          part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 2.0
        },
        {
          id: 'mat-dl11-4',
          topic: 'Hợp tác phát triển kinh tế biển và Tiểu vùng sông Mê Công',
          unit: 'Bảo vệ môi trường biển đảo và liên kết kinh tế tiểu vùng',
          part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
          part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
          part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
          part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
          totalPoints: 2.75
        }
      ];

      const specification: SpecificationItem[] = [
        {
          id: 'spec-dl11-1',
          topic: 'Toàn cầu hoá kinh tế và Các nhóm nước',
          unit: 'Toàn cầu hoá, khu vực hoá và sự phân chia nhóm nước thế giới',
          learningObjectives: {
            nb: 'Nêu được biểu hiện của toàn cầu hoá, khu vực hoá và các chỉ số phân chia nhóm nước (GNI/người, HDI).',
            th: 'Phân tích được cơ hội và thách thức của toàn cầu hoá đối với các nước đang phát triển.',
            vd: 'Xử lí số liệu GDP, GNI bình quân đầu người để phân loại trình độ phát triển của các quốc gia.',
            vdc: 'Đánh giá tác động của cuộc cách mạng công nghiệp lần thứ tư đến chuỗi cung ứng toàn cầu.'
          },
          questionCount: {
            part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
            part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
            part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        },
        {
          id: 'spec-dl11-2',
          topic: 'Liên minh Châu Âu (EU) và Khu vực Mỹ La-tinh',
          unit: 'Vị thế kinh tế EU và đặc điểm đô thị hoá Mỹ La-tinh',
          learningObjectives: {
            nb: 'Trình bày được quy mô kinh tế, thị trường chung châu Âu và các ngành kinh tế trọng điểm của EU.',
            th: 'Giải thích được đặc điểm đô thị hoá tự phát và tình trạng bất bình đẳng thu nhập ở Mỹ La-tinh.',
            vd: 'Phân tích bảng số liệu về cán cân xuất nhập khẩu và kim ngạch thương mại của EU với thế giới.',
            vdc: 'Rút ra bài học kinh nghiệm từ mô hình liên kết kinh tế EU cho tiến trình hội nhập khu vực.'
          },
          questionCount: {
            part1: { nb: 2, th: 1, vd: 1, vdc: 0 },
            part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
            part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        },
        {
          id: 'spec-dl11-3',
          topic: 'Khu vực Đông Nam Á & ASEAN',
          unit: 'Tự nhiên, dân cư, kinh tế Đông Nam Á và hợp tác ASEAN',
          learningObjectives: {
            nb: 'Nêu được vị trí địa lí, điều kiện tự nhiên và các mục tiêu chính của Cộng đồng ASEAN.',
            th: 'Phân tích được thế mạnh và hạn chế của tự nhiên, dân cư Đông Nam Á đối với phát triển kinh tế.',
            vd: 'Tính toán tốc độ tăng trưởng kinh tế và cơ cấu GDP của các quốc gia Đông Nam Á từ bảng số liệu.',
            vdc: 'Đề xuất giải pháp tăng cường vai trò trung tâm của ASEAN trong duy trì an ninh khu vực Biển Đông.'
          },
          questionCount: {
            part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
            part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
            part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        },
        {
          id: 'spec-dl11-4',
          topic: 'Hợp tác phát triển kinh tế biển và Tiểu vùng sông Mê Công',
          unit: 'Bảo vệ môi trường biển đảo và liên kết kinh tế tiểu vùng',
          learningObjectives: {
            nb: 'Trình bày được các tiềm năng tài nguyên biển đảo và các chương trình hợp tác tiểu vùng Mê Công.',
            th: 'Giải thích được tính cấp thiết của hợp tác quốc tế trong quản lí, khai thác bền vững nguồn nước sông Mê Công.',
            vd: 'Phân tích biểu đồ và số liệu về sản lượng khai thác hải sản, du lịch biển đảo khu vực Đông Nam Á.',
            vdc: 'Đánh giá triển vọng kinh tế biển xanh và các giải pháp giảm thiểu rác thải nhựa đại dương.'
          },
          questionCount: {
            part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
            part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
            part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
            part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
          }
        }
      ];

      return { matrix, specification };
    }

    // Default: Grade 12
    const matrix: MatrixRow[] = [
      {
        id: 'mat-dl-1',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Vị trí địa lí và phạm vi lãnh thổ',
        part1_nb: 2, part1_th: 1, part1_vd: 0, part1_vdc: 0,
        part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.25
      },
      {
        id: 'mat-dl-2',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Đặc điểm tự nhiên, địa hình và khí hậu nhiệt đới ẩm',
        part1_nb: 2, part1_th: 1, part1_vd: 1, part1_vdc: 0,
        part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 3.0
      },
      {
        id: 'mat-dl-3',
        topic: 'Địa lí dân cư và đô thị hóa',
        unit: 'Đặc điểm dân số, phân bố dân cư và lao động',
        part1_nb: 1, part1_th: 1, part1_vd: 0, part1_vdc: 0,
        part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.0
      },
      {
        id: 'mat-dl-4',
        topic: 'Địa lí các ngành kinh tế',
        unit: 'Nông nghiệp, công nghiệp và dịch vụ phát triển bền vững',
        part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
        part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.75
      }
    ];

    const specification: SpecificationItem[] = [
      {
        id: 'spec-dl-1',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Vị trí địa lí và phạm vi lãnh thổ',
        learningObjectives: {
          nb: 'Trình bày được vị trí địa lí, tọa độ và phạm vi lãnh thổ trên đất liền, vùng biển và vùng trời Việt Nam.',
          th: 'Phân tích được ý nghĩa tự nhiên, kinh tế, văn hóa - xã hội và quốc phòng an ninh của vị trí địa lí.',
          vd: 'Đánh giá được thời cơ và thách thức của vị trí địa lí trong bối cảnh hội nhập quốc tế.',
          vdc: 'Liên hệ được vai trò chiến lược của biển đảo trong công cuộc bảo vệ chủ quyền quốc gia.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-dl-2',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Đặc điểm tự nhiên, địa hình và khí hậu nhiệt đới ẩm',
        learningObjectives: {
          nb: 'Nhận biết được tính chất nhiệt đới ẩm gió mùa và đặc điểm các đai cao tự nhiên ở nước ta.',
          th: 'Giải thích được nguyên nhân tạo nên sự phân hóa đa dạng của khí hậu và cảnh quan thiên nhiên.',
          vd: 'Vận dụng kiến thức tự nhiên để giải thích sự phân bố mùa vụ nông nghiệp và biện pháp phòng chống thiên tai.',
          vdc: 'Đề xuất giải pháp thích ứng với biến đổi khí hậu tại các vùng sinh thái đặc thù.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 1, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-dl-3',
        topic: 'Địa lí dân cư và đô thị hóa',
        unit: 'Đặc điểm dân số, phân bố dân cư và lao động',
        learningObjectives: {
          nb: 'Nêu được đặc điểm dân số, cơ cấu nhóm tuổi và xu hướng già hóa dân số ở nước ta.',
          th: 'Phân tích được tác động của quá trình đô thị hóa đến chuyển dịch cơ cấu kinh tế và việc làm.',
          vd: 'Tính toán và xử lí số liệu thống kê về tỉ lệ dân thành thị, mật độ dân số và cơ cấu lao động.',
          vdc: 'Đề xuất giải pháp nâng cao chất lượng nguồn nhân lực và giải quyết việc làm cho thanh niên.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-dl-4',
        topic: 'Địa lí các ngành kinh tế',
        unit: 'Nông nghiệp, công nghiệp và dịch vụ phát triển bền vững',
        learningObjectives: {
          nb: 'Trình bày được cơ cấu và tình hình phát triển các ngành kinh tế trọng điểm.',
          th: 'Giải thích được sự chuyển dịch cơ cấu kinh tế theo ngành và theo lãnh thổ.',
          vd: 'Phân tích biểu đồ và bảng số liệu về giá trị sản xuất công nghiệp, nông nghiệp công nghệ cao.',
          vdc: 'Đánh giá triển vọng phát triển kinh tế xanh và kinh tế tuần hoàn tại các vùng kinh tế trọng điểm.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      }
    ];

    return { matrix, specification };
  }

  // Default for Mathematics / other natural & social sciences
  const matrix: MatrixRow[] = [
    {
      id: 'mat-gen-1',
      topic: `${subject} - Chủ đề 1`,
      unit: 'Khái niệm, định lí và tính chất cơ bản',
      part1_nb: 3, part1_th: 1, part1_vd: 0, part1_vdc: 0,
      part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
      part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 2.5
    },
    {
      id: 'mat-gen-2',
      topic: `${subject} - Chủ đề 2`,
      unit: 'Phương pháp giải toán và phân tích hiện tượng',
      part1_nb: 2, part1_th: 2, part1_vd: 0, part1_vdc: 0,
      part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
      part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 3.0
    },
    {
      id: 'mat-gen-3',
      topic: `${subject} - Chủ đề 3`,
      unit: 'Vận dụng quy luật và mô hình hóa bài toán',
      part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
      part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
      part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 2.25
    },
    {
      id: 'mat-gen-4',
      topic: `${subject} - Chủ đề 4`,
      unit: 'Bài toán thực tiễn và tư duy nâng cao',
      part1_nb: 0, part1_th: 1, part1_vd: 1, part1_vdc: 0,
      part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
      part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 2.25
    }
  ];

  const specification: SpecificationItem[] = [
    {
      id: 'spec-gen-1',
      topic: `${subject} - Chủ đề 1`,
      unit: 'Khái niệm, định lí và tính chất cơ bản',
      learningObjectives: {
        nb: 'Nhận biết được các khái niệm, định nghĩa, công thức và quy tắc cơ bản.',
        th: 'Hiểu và giải thích được bản chất của các định lí, mối liên hệ giữa các khái niệm.',
        vd: 'Áp dụng các công thức để giải quyết các bài toán ở mức độ cơ bản.',
        vdc: 'Vận dụng tổng hợp các kiến thức nền tảng để xử lí các bài toán phức hợp.'
      },
      questionCount: {
        part1: { nb: 3, th: 1, vd: 0, vdc: 0 },
        part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
        part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    },
    {
      id: 'spec-gen-2',
      topic: `${subject} - Chủ đề 2`,
      unit: 'Phương pháp giải toán và phân tích hiện tượng',
      learningObjectives: {
        nb: 'Liệt kê được các bước thực hiện và quy trình giải quyết vấn đề.',
        th: 'Phân tích được các dữ kiện, biểu đồ, sơ đồ và bảng số liệu.',
        vd: 'Vận dụng linh hoạt các thuật toán, phương pháp tư duy để tìm đáp số chính xác.',
        vdc: 'Tìm ra các cách giải tối ưu, sáng tạo và biện luận kết quả.'
      },
      questionCount: {
        part1: { nb: 2, th: 2, vd: 0, vdc: 0 },
        part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
        part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    },
    {
      id: 'spec-gen-3',
      topic: `${subject} - Chủ đề 3`,
      unit: 'Vận dụng quy luật và mô hình hóa bài toán',
      learningObjectives: {
        nb: 'Nhận dạng được mô hình bài toán và đối tượng khảo sát.',
        th: 'Mô tả được quá trình biến đổi và quy luật vận động của hệ thống.',
        vd: 'Xây dựng được mô hình toán học / khoa học cho các tình huống thực tiễn.',
        vdc: 'Đánh giá độ tin cậy của mô hình và tối ưu hóa các tham số.'
      },
      questionCount: {
        part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
        part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
        part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    },
    {
      id: 'spec-gen-4',
      topic: `${subject} - Chủ đề 4`,
      unit: 'Bài toán thực tiễn và tư duy nâng cao',
      learningObjectives: {
        nb: 'Nêu được các ứng dụng thực tế phổ biến của môn học trong đời sống.',
        th: 'Giải thích được các hiện tượng thực tế dựa trên nguyên lí khoa học.',
        vd: 'Giải quyết các vấn đề thực tiễn gắn với đời sống, kinh tế và môi trường.',
        vdc: 'Đề xuất giải pháp khoa học mới mang tính đột phá và bền vững.'
      },
      questionCount: {
        part1: { nb: 0, th: 1, vd: 1, vdc: 0 },
        part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
        part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    }
  ];

  return { matrix, specification };
}

function generateFallbackQuestionsForSubject(header: ExamHeaderConfig): ExamQuestion[] {
  return [
    {
      id: `fallback-1-${Date.now()}`,
      orderNumber: 1,
      type: 'multiple_choice',
      topic: `${header.subject} - Kiến thức trọng tâm`,
      unit: 'Tổng quan chương trình',
      cognitiveLevel: 'Nhận biết',
      content: `Nội dung cốt lõi của môn ${header.subject} (${header.grade}) nhằm phát triển năng lực đặc thù nào cho học sinh?`,
      points: 0.25,
      options: [
        { key: 'A', content: 'Năng lực nhận thức, tư duy logic và vận dụng kiến thức vào thực tiễn cuộc sống.' },
        { key: 'B', content: 'Chỉ học thuộc lòng các định nghĩa mà không cần liên hệ thực tế.' },
        { key: 'C', content: 'Hạn chế việc tự học và giải quyết vấn đề sáng tạo.' },
        { key: 'D', content: 'Không cần phát triển kĩ năng làm việc nhóm và giao tiếp khoa học.' }
      ],
      correctOption: 'A',
      explanation: 'Chương trình GDPT 2018 chú trọng phát triển toàn diện phẩm chất và năng lực giải quyết vấn đề thực tiễn.'
    }
  ];
}
