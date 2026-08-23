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

export function generateShuffledExamVariants(baseQuestions: ExamQuestion[]): ShuffledExamVariant[] {
  const codes = ['101', '102', '103', '104'];
  const variants: ShuffledExamVariant[] = [];

  codes.forEach((code, codeIdx) => {
    // If code is 101, keep base order or light shuffle, 102, 103, 104 get permutated
    const seed = parseInt(code, 10) * 17;

    // Group by section so questions don't jump across sections
    const part1Questions = baseQuestions.filter(q => q.type === 'multiple_choice');
    const part2Questions = baseQuestions.filter(q => q.type === 'true_false');
    const part3Questions = baseQuestions.filter(q => q.type === 'short_answer');
    const part4Questions = baseQuestions.filter(q => q.type === 'essay');

    // Shuffle questions within each section (for code 101, keep original order)
    const shuffledPart1 = code === '101' ? [...part1Questions] : shuffleArray(part1Questions, seed + 1);
    const shuffledPart2 = code === '101' ? [...part2Questions] : shuffleArray(part2Questions, seed + 2);
    const shuffledPart3 = code === '101' ? [...part3Questions] : shuffleArray(part3Questions, seed + 3);
    const shuffledPart4 = code === '101' ? [...part4Questions] : [...part4Questions]; // Essay questions usually keep standard progression

    // Process Part 1: Shuffle A, B, C, D choices
    const processedPart1 = shuffledPart1.map((q, idx) => {
      if (!q.options || q.options.length < 4 || code === '101') {
        return { ...q, orderNumber: idx + 1 };
      }

      // Determine correct option text
      const originalCorrectOption = q.options.find(o => o.key === q.correctOption);
      const originalCorrectContent = originalCorrectOption ? originalCorrectOption.content : '';

      // Shuffle options
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

    // Process Part 2: True/False statements (shuffle sub-items a, b, c, d for 102-104)
    let currentOrder = processedPart1.length;
    const processedPart2 = shuffledPart2.map((q, idx) => {
      currentOrder++;
      if (!q.trueFalseItems || code === '101') {
        return { ...q, orderNumber: currentOrder };
      }

      const shuffledItems = shuffleArray(q.trueFalseItems, seed + idx * 13).map((item, itemIdx) => ({
        ...item,
        key: (['a', 'b', 'c', 'd'][itemIdx]) as 'a' | 'b' | 'c' | 'd',
      }));

      return {
        ...q,
        orderNumber: currentOrder,
        trueFalseItems: shuffledItems,
      };
    });

    // Process Part 3: Short answer
    const processedPart3 = shuffledPart3.map(q => {
      currentOrder++;
      return { ...q, orderNumber: currentOrder };
    });

    // Process Part 4: Essay
    const processedPart4 = shuffledPart4.map(q => {
      currentOrder++;
      return { ...q, orderNumber: currentOrder };
    });

    const allOrderedQuestions = [
      ...processedPart1,
      ...processedPart2,
      ...processedPart3,
      ...processedPart4,
    ];

    // Build answer key summary for fast grading matrix
    const answerKeySummary = allOrderedQuestions.map(q => {
      let ans = '';
      if (q.type === 'multiple_choice') {
        ans = q.correctOption || 'A';
      } else if (q.type === 'true_false') {
        ans = (q.trueFalseItems || []).map(item => `${item.key.toUpperCase()}: ${item.isCorrect ? 'Đ' : 'S'}`).join(' | ');
      } else if (q.type === 'short_answer') {
        ans = q.shortAnswerKey || '';
      } else {
        ans = 'Tự luận';
      }

      return {
        questionNumber: q.orderNumber,
        type: q.type,
        correctAnswer: ans,
      };
    });

    variants.push({
      examCode: code,
      questions: allOrderedQuestions,
      answerKeySummary,
    });
  });

  return variants;
}
