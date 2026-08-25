import { ExamQuestion, MultipleChoiceOption } from '../types';

/**
 * Seeded pseudo-random generator for consistent, reproducible shuffling
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i * 37.1) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates an evenly distributed array of 'A' | 'B' | 'C' | 'D' keys for N questions.
 * 
 * Guarantees:
 * 1. Counts of A, B, C, D differ by at most 1 (approx 25% each).
 *    (e.g., for 12 questions: 3 A, 3 B, 3 C, 3 D; for 22 questions: 6 A, 6 B, 5 C, 5 D).
 * 2. Anti-streak rule: No more than 2 consecutive identical answers (e.g. A, A is allowed, but never A, A, A).
 * 3. Seeded for reproducible, high-entropy distribution per exam code.
 */
export function generateBalancedAnswerPattern(
  count: number,
  seed: number = 42
): ('A' | 'B' | 'C' | 'D')[] {
  if (count <= 0) return [];
  
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const baseCount = Math.floor(count / 4);
  const remainder = count % 4;

  // Build the initial balanced pool
  const pool: ('A' | 'B' | 'C' | 'D')[] = [];
  letters.forEach((opt, idx) => {
    const n = baseCount + (idx < remainder ? 1 : 0);
    for (let i = 0; i < n; i++) {
      pool.push(opt);
    }
  });

  // Shuffle initial pool with seeded random
  let result = shuffleArrayWithSeed(pool, seed);

  // Break any streaks of 3 or more consecutive identical answers
  for (let pass = 0; pass < 20; pass++) {
    let streakFound = false;
    for (let i = 2; i < result.length; i++) {
      if (result[i] === result[i - 1] && result[i] === result[i - 2]) {
        streakFound = true;
        // Find a candidate to swap
        let swapIdx = -1;
        for (let j = i + 1; j < result.length; j++) {
          if (result[j] !== result[i] && (j + 1 >= result.length || result[j + 1] !== result[i])) {
            swapIdx = j;
            break;
          }
        }
        if (swapIdx === -1) {
          for (let j = 0; j < i - 2; j++) {
            if (result[j] !== result[i]) {
              swapIdx = j;
              break;
            }
          }
        }
        if (swapIdx !== -1) {
          [result[i], result[swapIdx]] = [result[swapIdx], result[i]];
        }
      }
    }
    if (!streakFound) break;
  }

  return result;
}

/**
 * Rotates/re-arranges options in a single MCQ question so that the correct answer sits at targetKey.
 * The correct option content stays strictly paired with targetKey, while the other 3 distractors
 * are distributed to the other 3 positions.
 */
export function rotateQuestionOptions(
  question: ExamQuestion,
  targetKey: 'A' | 'B' | 'C' | 'D',
  distractorSeed: number = 0
): ExamQuestion {
  if (question.type !== 'multiple_choice' || !question.options || question.options.length < 4) {
    return question;
  }

  // 1. Find the current correct option content
  const origCorrect = question.options.find(o => o.key === question.correctOption) || question.options[0];
  const correctContent = origCorrect.content;

  // 2. Find the 3 distractor contents
  const distractors = question.options
    .filter(o => o !== origCorrect)
    .map(o => o.content);

  while (distractors.length < 3) {
    distractors.push(`Phương án lựa chọn ${distractors.length + 1}`);
  }

  // 3. Shuffle distractors for diversity
  const shuffledDistractors = shuffleArrayWithSeed(distractors.slice(0, 3), distractorSeed);

  // 4. Assign new options A, B, C, D
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  let dIdx = 0;

  const newOptions: MultipleChoiceOption[] = letters.map(letter => {
    if (letter === targetKey) {
      return { key: letter, content: correctContent };
    } else {
      return { key: letter, content: shuffledDistractors[dIdx++] || '' };
    }
  });

  return {
    ...question,
    options: newOptions,
    correctOption: targetKey,
  };
}

/**
 * Balances all Part 1 Multiple Choice questions in an array so that the correct options
 * (A, B, C, D) are distributed evenly (25% each) with no consecutive streaks.
 */
export function balanceMultipleChoiceQuestions(
  questions: ExamQuestion[],
  seed: number = 101
): ExamQuestion[] {
  const mcIndices: number[] = [];
  questions.forEach((q, idx) => {
    if (q.type === 'multiple_choice' && q.options && q.options.length >= 4) {
      mcIndices.push(idx);
    }
  });

  if (mcIndices.length === 0) return questions;

  const pattern = generateBalancedAnswerPattern(mcIndices.length, seed);
  const result = [...questions];

  mcIndices.forEach((qIdx, i) => {
    const targetKey = pattern[i];
    result[qIdx] = rotateQuestionOptions(result[qIdx], targetKey, seed + i * 19);
  });

  return result;
}

/**
 * Calculates answer key distribution statistics for display and verification
 */
export function calculateAnswerDistribution(questions: ExamQuestion[]): {
  A: { count: number; percentage: number };
  B: { count: number; percentage: number };
  C: { count: number; percentage: number };
  D: { count: number; percentage: number };
  total: number;
} {
  const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
  const total = mcQuestions.length;
  const counts = { A: 0, B: 0, C: 0, D: 0 };

  mcQuestions.forEach(q => {
    const opt = q.correctOption;
    if (opt && (opt === 'A' || opt === 'B' || opt === 'C' || opt === 'D')) {
      counts[opt]++;
    }
  });

  return {
    A: { count: counts.A, percentage: total > 0 ? Math.round((counts.A / total) * 100) : 0 },
    B: { count: counts.B, percentage: total > 0 ? Math.round((counts.B / total) * 100) : 0 },
    C: { count: counts.C, percentage: total > 0 ? Math.round((counts.C / total) * 100) : 0 },
    D: { count: counts.D, percentage: total > 0 ? Math.round((counts.D / total) * 100) : 0 },
    total,
  };
}
