import { ExamQuestion } from '../types';

export interface EssayRubricItem {
  subLabel?: string; // e.g. "a)", "b)", "Ý 1", "Ý 2", "- Ý chính", "Bước 1"
  content: string;   // Nội dung yêu cầu cần đạt
  points: number;    // Số điểm cho từng ý (chuẩn 0.25, 0.5, 0.75, 1.0...)
  pointsFormatted: string; // "0,25", "0,50", "0,75", "1,00"...
}

export interface StructuredEssayQuestion {
  questionIndex: number;
  questionNumber: string; // "Câu 1", "Câu 2"...
  cognitiveLevel?: string; // "Vận dụng", "Vận dụng cao"...
  content: string; // Đề bài
  totalPoints: number; // Tổng điểm câu
  totalPointsFormatted: string; // "2,0", "3,0"...
  items: EssayRubricItem[];
  explanation?: string;
}

/**
 * Format a number to standard Vietnamese point representation (e.g. 0.25 -> "0,25", 1.0 -> "1,00" or "1,0")
 */
export function formatPoint(pts: number): string {
  if (pts === 0) return '0,0';
  const fixed = pts.toFixed(2);
  if (fixed.endsWith('0')) {
    return Number(pts.toFixed(1)).toString().replace('.', ',');
  }
  return fixed.replace('.', ',');
}

/**
 * Parse an essay rubric string into structured rows for table presentation
 */
export function parseEssayQuestionRubric(
  question: ExamQuestion,
  questionIdx: number
): StructuredEssayQuestion {
  const totalPts = question.points || 2.0;
  const rawRubric = (question.essayRubric || question.explanation || '').trim();

  // If empty rubric, provide default structured guidance
  if (!rawRubric) {
    const halfPt = totalPts / 2;
    return {
      questionIndex: questionIdx,
      questionNumber: `Câu ${questionIdx + 1}`,
      cognitiveLevel: question.cognitiveLevel || 'Vận dụng',
      content: question.content,
      totalPoints: totalPts,
      totalPointsFormatted: formatPoint(totalPts),
      items: [
        {
          subLabel: 'a)',
          content: 'Nêu đúng định nghĩa, công thức hoặc các luận điểm cơ bản theo yêu cầu đề bài.',
          points: Number(halfPt.toFixed(2)),
          pointsFormatted: formatPoint(halfPt),
        },
        {
          subLabel: 'b)',
          content: 'Thực hiện biến đổi, phân tích, chứng minh hoặc tính toán ra kết quả chính xác.',
          points: Number((totalPts - halfPt).toFixed(2)),
          pointsFormatted: formatPoint(totalPts - halfPt),
        },
      ],
      explanation: question.explanation,
    };
  }

  // Split lines
  const lines = rawRubric
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const parsedItems: EssayRubricItem[] = [];

  // Regex patterns to capture point annotations like (1.5đ), (1,5 điểm), (0.75đ), [1.0đ]...
  const pointRegex = /[\(\[]\s*([0-9]+[.,]?[0-9]*)\s*(?:đ|điểm|pt|pts)?\s*[\)\]]/i;
  const leadPointRegex = /^Ý\s*([a-zA-Z0-9]+)\s*[\(\[]\s*([0-9]+[.,]?[0-9]*)\s*(?:đ|điểm)?\s*[\)\]]\s*:\s*(.*)$/i;
  const dashRegex = /^[-–*•]\s*(.*)$/;

  for (const line of lines) {
    // Check if line matches "Ý a (1.5đ): ..."
    const leadMatch = line.match(leadPointRegex);
    if (leadMatch) {
      const subLabel = `Ý ${leadMatch[1]}`;
      const linePts = parseFloat(leadMatch[2].replace(',', '.'));
      let lineBody = leadMatch[3].trim();

      // Check if lineBody contains nested bullet points with sub-points, e.g. "- Thuận lợi: ... (0.75đ). - Khó khăn: ... (0.75đ)."
      if (lineBody.includes('- ') || lineBody.includes('– ')) {
        const subParts = lineBody.split(/(?=[-–]\s+)/).filter(Boolean);
        if (subParts.length > 1) {
          subParts.forEach((part, pIdx) => {
            const pMatch = part.match(pointRegex);
            let pPts = pMatch ? parseFloat(pMatch[1].replace(',', '.')) : linePts / subParts.length;
            if (isNaN(pPts)) pPts = 0.5;
            const cleanText = part.replace(pointRegex, '').replace(/^[-–]\s*/, '').trim();
            parsedItems.push({
              subLabel: pIdx === 0 ? `${subLabel}` : '',
              content: `- ${cleanText}`,
              points: Number(pPts.toFixed(2)),
              pointsFormatted: formatPoint(pPts),
            });
          });
          continue;
        }
      }

      // Normal single line
      const cleanContent = lineBody.replace(pointRegex, '').trim();
      parsedItems.push({
        subLabel: `${subLabel}`,
        content: cleanContent || lineBody,
        points: isNaN(linePts) ? 0.5 : Number(linePts.toFixed(2)),
        pointsFormatted: formatPoint(isNaN(linePts) ? 0.5 : linePts),
      });
      continue;
    }

    // Check if line is a bullet item like "- Thuận lợi: ... (0.75đ)"
    const dashMatch = line.match(dashRegex);
    if (dashMatch) {
      const pMatch = line.match(pointRegex);
      let pPts = pMatch ? parseFloat(pMatch[1].replace(',', '.')) : 0.5;
      const cleanContent = line.replace(pointRegex, '').trim();
      parsedItems.push({
        subLabel: '-',
        content: cleanContent.replace(/^[-–*•]\s*/, ''),
        points: isNaN(pPts) ? 0.5 : Number(pPts.toFixed(2)),
        pointsFormatted: formatPoint(isNaN(pPts) ? 0.5 : pPts),
      });
      continue;
    }

    // Check if general line has point annotation inside
    const generalPtMatch = line.match(pointRegex);
    if (generalPtMatch) {
      const pPts = parseFloat(generalPtMatch[1].replace(',', '.'));
      const cleanContent = line.replace(pointRegex, '').trim();
      // Extract label if starts with a), b), 1), 2), Bước 1...
      const labelMatch = cleanContent.match(/^((?:[a-zA-Z0-9]+[).:]|Bước\s+[0-9]+:?|Ý\s+[a-zA-Z0-9]+:?))\s*(.*)$/i);
      if (labelMatch) {
        parsedItems.push({
          subLabel: labelMatch[1].trim(),
          content: labelMatch[2].trim(),
          points: isNaN(pPts) ? 0.5 : Number(pPts.toFixed(2)),
          pointsFormatted: formatPoint(isNaN(pPts) ? 0.5 : pPts),
        });
      } else {
        parsedItems.push({
          subLabel: `Ý ${parsedItems.length + 1}`,
          content: cleanContent,
          points: isNaN(pPts) ? 0.5 : Number(pPts.toFixed(2)),
          pointsFormatted: formatPoint(isNaN(pPts) ? 0.5 : pPts),
        });
      }
      continue;
    }

    // Line without explicit point
    const labelMatch = line.match(/^((?:[a-zA-Z0-9]+[).:]|Bước\s+[0-9]+:?|Ý\s+[a-zA-Z0-9]+:?))\s*(.*)$/i);
    if (labelMatch) {
      parsedItems.push({
        subLabel: labelMatch[1].trim(),
        content: labelMatch[2].trim(),
        points: 0.5,
        pointsFormatted: formatPoint(0.5),
      });
    } else {
      parsedItems.push({
        subLabel: parsedItems.length === 0 ? 'Ý chính' : `-`,
        content: line,
        points: 0.5,
        pointsFormatted: formatPoint(0.5),
      });
    }
  }

  // If no items were parsed, fallback
  if (parsedItems.length === 0) {
    parsedItems.push({
      subLabel: 'Hướng dẫn chấm',
      content: rawRubric,
      points: totalPts,
      pointsFormatted: formatPoint(totalPts),
    });
  }

  // Check point sum and normalize if needed so total matches question points
  const currentSum = parsedItems.reduce((acc, it) => acc + it.points, 0);
  if (Math.abs(currentSum - totalPts) > 0.05 && parsedItems.length > 0) {
    // If the items don't have explicit sum matching totalPts, adjust evenly in increments of 0.25
    const count = parsedItems.length;
    const basePt = Math.floor((totalPts / count) * 4) / 4; // round to nearest 0.25
    let rem = Number((totalPts - basePt * count).toFixed(2));

    parsedItems.forEach((it, idx) => {
      let allocated = basePt;
      if (rem >= 0.25) {
        allocated += 0.25;
        rem = Number((rem - 0.25).toFixed(2));
      }
      it.points = Number(allocated.toFixed(2));
      it.pointsFormatted = formatPoint(allocated);
    });
  }

  return {
    questionIndex: questionIdx,
    questionNumber: `Câu ${questionIdx + 1}`,
    cognitiveLevel: question.cognitiveLevel || 'Vận dụng cao',
    content: question.content,
    totalPoints: totalPts,
    totalPointsFormatted: formatPoint(totalPts),
    items: parsedItems,
    explanation: question.explanation,
  };
}
