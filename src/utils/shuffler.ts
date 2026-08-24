import { ExamQuestion, ShuffledExamVariant, QuestionType } from '../types';

// Pseudo-random seeded shuffle to ensure repeatable variations per exam code
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i * 37) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface ShuffledExamVariantResult {
  examCode: string;
  code?: string; // alias for convenient access
  questions: ExamQuestion[];
  answerKeySummary: {
    part?: 'part1' | 'part2' | 'part3' | 'part4';
    questionNumber: number;
    type: QuestionType;
    correctAnswer: string;
  }[];
  answerKey: Record<number, string>; // Part 1 Map: questionNumber -> correctAnswer string
  part1AnswerKeys?: Record<number, string>;
  part2AnswerKeys?: Record<number, string>;
  part3AnswerKeys?: Record<number, string>;
}

export function generateShuffledExamVariants(
  baseQuestions: ExamQuestion[],
  variantCountOrCodes: number | string[] = 4,
  startCode: number = 101
): ShuffledExamVariantResult[] {
  let codes: string[] = [];

  if (Array.isArray(variantCountOrCodes)) {
    codes = variantCountOrCodes.length > 0 ? variantCountOrCodes : ['101', '102', '103', '104'];
  } else {
    const count = Math.max(1, Math.min(12, typeof variantCountOrCodes === 'number' ? variantCountOrCodes : 4));
    codes = Array.from({ length: count }, (_, i) => String(startCode + i));
  }

  const variants: ShuffledExamVariantResult[] = [];

  codes.forEach((code, codeIdx) => {
    // If codeIdx === 0 (e.g. 101), keep base order; subsequent codes get systematic permutation
    const seed = (parseInt(code.replace(/\D/g, ''), 10) || (codeIdx + 1) * 101) * 17 + codeIdx * 31;

    // Group by section so questions don't jump across sections
    const part1Questions = baseQuestions.filter(q => q.type === 'multiple_choice');
    const part2Questions = baseQuestions.filter(q => q.type === 'true_false');
    const part3Questions = baseQuestions.filter(q => q.type === 'short_answer');
    const part4Questions = baseQuestions.filter(q => q.type === 'essay');

    // Shuffle questions within each section (for the first code, keep original order)
    const shuffledPart1 = codeIdx === 0 ? [...part1Questions] : shuffleArray(part1Questions, seed + 1);
    const shuffledPart2 = codeIdx === 0 ? [...part2Questions] : shuffleArray(part2Questions, seed + 2);
    const shuffledPart3 = codeIdx === 0 ? [...part3Questions] : shuffleArray(part3Questions, seed + 3);
    const shuffledPart4 = codeIdx === 0 ? [...part4Questions] : [...part4Questions]; // Essay questions keep standard pedagogical flow

    // Process Part 1: Shuffle A, B, C, D choices
    const processedPart1 = shuffledPart1.map((q, idx) => {
      if (!q.options || q.options.length < 4 || codeIdx === 0) {
        return { ...q, orderNumber: idx + 1 };
      }

      // Determine correct option content
      const originalCorrectOption = q.options.find(o => o.key === q.correctOption);
      const originalCorrectContent = originalCorrectOption ? originalCorrectOption.content : '';

      // Shuffle options content
      const shuffledOptionsContent = shuffleArray(q.options.map(o => o.content), seed + idx * 7);
      
      const newOptions = shuffledOptionsContent.map((content, optIdx) => ({
        key: (['A', 'B', 'C', 'D'][optIdx]) as 'A' | 'B' | 'C' | 'D',
        content,
      }));

      // Find new key for the correct option
      const newCorrectOpt = newOptions.find(o => o.content === originalCorrectContent);
      const newCorrectKey = newCorrectOpt ? newCorrectOpt.key : q.correctOption;

      return {
        ...q,
        orderNumber: idx + 1,
        options: newOptions,
        correctOption: newCorrectKey,
      };
    });

    // Process Part 2: True/False statements (orderNumber restarts from 1)
    const processedPart2 = shuffledPart2.map((q, idx) => {
      if (!q.trueFalseItems || codeIdx === 0) {
        return { ...q, orderNumber: idx + 1 };
      }

      const shuffledItems = shuffleArray(q.trueFalseItems, seed + idx * 13).map((item, itemIdx) => ({
        ...item,
        key: (['a', 'b', 'c', 'd'][itemIdx]) as 'a' | 'b' | 'c' | 'd',
      }));

      return {
        ...q,
        orderNumber: idx + 1,
        trueFalseItems: shuffledItems,
      };
    });

    // Process Part 3: Short answer (orderNumber restarts from 1)
    const processedPart3 = shuffledPart3.map((q, idx) => {
      return { ...q, orderNumber: idx + 1 };
    });

    // Process Part 4: Essay (orderNumber restarts from 1)
    const processedPart4 = shuffledPart4.map((q, idx) => {
      return { ...q, orderNumber: idx + 1 };
    });

    const allOrderedQuestions = [
      ...processedPart1,
      ...processedPart2,
      ...processedPart3,
      ...processedPart4,
    ];

    const answerKeyMap: Record<number, string> = {};
    const part1AnswerKeys: Record<number, string> = {};
    const part2AnswerKeys: Record<number, string> = {};
    const part3AnswerKeys: Record<number, string> = {};

    processedPart1.forEach((q, idx) => {
      const ans = q.correctOption || 'A';
      answerKeyMap[idx + 1] = ans;
      part1AnswerKeys[idx + 1] = ans;
    });

    processedPart2.forEach((q, idx) => {
      const ans = (q.trueFalseItems || []).map(item => `${item.key.toUpperCase()}: ${item.isCorrect ? 'Đ' : 'S'}`).join(' | ');
      part2AnswerKeys[idx + 1] = ans;
    });

    processedPart3.forEach((q, idx) => {
      const ans = q.shortAnswerKey || '';
      part3AnswerKeys[idx + 1] = ans;
    });

    // Build answerKeySummary
    const answerKeySummary = [
      ...processedPart1.map((q, idx) => ({ part: 'part1' as const, questionNumber: idx + 1, type: q.type, correctAnswer: q.correctOption || 'A' })),
      ...processedPart2.map((q, idx) => ({ part: 'part2' as const, questionNumber: idx + 1, type: q.type, correctAnswer: (q.trueFalseItems || []).map(i => `${i.key.toUpperCase()}: ${i.isCorrect ? 'Đ' : 'S'}`).join(' | ') })),
      ...processedPart3.map((q, idx) => ({ part: 'part3' as const, questionNumber: idx + 1, type: q.type, correctAnswer: q.shortAnswerKey || '' })),
      ...processedPart4.map((q, idx) => ({ part: 'part4' as const, questionNumber: idx + 1, type: q.type, correctAnswer: 'Tự luận' })),
    ];

    variants.push({
      examCode: code,
      code: code,
      questions: allOrderedQuestions,
      answerKeySummary,
      answerKey: answerKeyMap,
      part1AnswerKeys,
      part2AnswerKeys,
      part3AnswerKeys,
    });
  });

  return variants;
}
