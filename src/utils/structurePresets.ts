import { ExamHeaderConfig, ExamPartConfigs, MatrixRow, SpecificationItem, StructureOption } from '../types';
import { DEFAULT_PART_CONFIGS } from '../data/defaultProjects';

export interface StructureOptionMeta {
  id: StructureOption;
  title: string;
  desc: string;
  badge: string;
  lockedPartsDesc: string;
  activePartsSummary: string;
}

export const STRUCTURE_OPTIONS_METADATA: StructureOptionMeta[] = [
  {
    id: 'option_1',
    title: 'Tùy chọn 1: Chuẩn mới 2025 (Bộ GD&ĐT)',
    desc: 'Đầy đủ 4 dạng câu hỏi: Trắc nghiệm 4 lựa chọn + Đúng/Sai + Trả lời ngắn + Tự luận',
    badge: 'Khuyên dùng cho THPT & THCS',
    lockedPartsDesc: 'Không khóa phần nào (Bật cả 4 phần)',
    activePartsSummary: 'Phần I (3.0đ) • Phần II (4.0đ) • Phần III (1.0đ) • Phần IV (2.0đ)'
  },
  {
    id: 'option_2',
    title: 'Tùy chọn 2: Truyền thống kết hợp',
    desc: 'Trắc nghiệm 4 lựa chọn + Đúng/Sai + Tự luận (KHÔNG CÓ câu Trả lời ngắn)',
    badge: 'Phổ biến kiểm tra định kỳ',
    lockedPartsDesc: '🔒 Đã khóa Phần III (Trả lời ngắn)',
    activePartsSummary: 'Phần I (4.0đ) • Phần II (3.0đ) • Phần IV (3.0đ)'
  },
  {
    id: 'option_3',
    title: 'Tùy chọn 3: 100% Trắc nghiệm khách quan',
    desc: 'Trắc nghiệm 4 lựa chọn + Đúng/Sai + Trả lời ngắn (KHÔNG CÓ câu Tự luận)',
    badge: 'Chấm máy tự động 100%',
    lockedPartsDesc: '🔒 Đã khóa Phần IV (Tự luận)',
    activePartsSummary: 'Phần I (3.0đ) • Phần II (4.0đ) • Phần III (3.0đ)'
  },
  {
    id: 'option_tuluan',
    title: 'Tùy chọn 4: 100% Tự luận (Đặc thù môn Ngữ văn)',
    desc: 'Chỉ có phần Tự luận (Đọc hiểu & Viết/Làm văn), KHÔNG CÓ bất kỳ câu trắc nghiệm nào',
    badge: 'Chuẩn môn Ngữ văn & Đề tự luận',
    lockedPartsDesc: '🔒 Đã khóa Phần I, Phần II, Phần III (Trắc nghiệm)',
    activePartsSummary: 'Phần IV Tự luận (10.0đ - Đọc hiểu & Làm văn)'
  },
  {
    id: 'option_tn_tl_70_30',
    title: 'Tùy chọn 5: 70% Trắc nghiệm + 30% Tự luận',
    desc: '28 câu trắc nghiệm 4 lựa chọn (7.0đ) + 2 đến 3 câu Tự luận (3.0đ)',
    badge: 'Truyền thống GDPT 2018',
    lockedPartsDesc: '🔒 Đã khóa Phần II (Đúng/Sai) & Phần III (Trả lời ngắn)',
    activePartsSummary: 'Phần I TN (7.0đ) • Phần IV Tự luận (3.0đ)'
  },
  {
    id: 'option_tn_100',
    title: 'Tùy chọn 6: 100% Trắc nghiệm 4 lựa chọn',
    desc: '40 câu trắc nghiệm 4 lựa chọn (0.25đ/câu = 10.0đ), không có Đúng/Sai, Trả lời ngắn hay Tự luận',
    badge: 'Đề thi trắc nghiệm thuần túy',
    lockedPartsDesc: '🔒 Đã khóa Phần II, Phần III, Phần IV',
    activePartsSummary: 'Phần I TN (40 câu • 10.0đ)'
  },
  {
    id: 'option_4',
    title: 'Tùy chọn 7: Tùy chỉnh tự do (Custom)',
    desc: 'Tự do bật/tắt khóa từng phần và phân bổ số câu, thang điểm theo yêu cầu riêng của tổ chuyên môn',
    badge: 'Linh hoạt',
    lockedPartsDesc: 'Tùy chỉnh theo từng phần giáo viên bật/tắt',
    activePartsSummary: 'Theo thiết lập của giáo viên'
  }
];

/**
 * Returns the exact partConfigs configuration based on the chosen StructureOption
 */
export function getStructurePartConfigs(
  structureId: StructureOption,
  currentConfigs?: ExamPartConfigs,
  subject?: string
): ExamPartConfigs {
  const isLiterature = (subject || '').toLowerCase().includes('văn') || (subject || '').toLowerCase().includes('tiếng việt');

  switch (structureId) {
    case 'option_1': // Chuẩn 4 phần 2025
      return {
        part1: {
          name: 'Phần I: TN 4 lựa chọn',
          pointsPerQuestion: 0.25,
          targetQuestions: 12,
          enabled: true,
          description: '12 câu TN 4 lựa chọn (3.0đ)'
        },
        part2: {
          name: 'Phần II: TN Đúng / Sai',
          pointsPerQuestion: 1.0,
          targetQuestions: 4,
          enabled: true,
          description: '4 câu Đúng/Sai (4.0đ)'
        },
        part3: {
          name: 'Phần III: Trả lời ngắn',
          pointsPerQuestion: 0.25,
          targetQuestions: 4,
          enabled: true,
          description: '4 câu Trả lời ngắn (1.0đ)'
        },
        part4: {
          name: 'Phần IV: Tự luận',
          pointsPerQuestion: 1.0,
          targetQuestions: 2,
          enabled: true,
          description: '2 câu Tự luận (2.0đ)'
        }
      };

    case 'option_2': // Không có Trả lời ngắn (Phần III bị khóa)
      return {
        part1: {
          name: 'Phần I: TN 4 lựa chọn',
          pointsPerQuestion: 0.25,
          targetQuestions: 16,
          enabled: true,
          description: '16 câu TN 4 lựa chọn (4.0đ)'
        },
        part2: {
          name: 'Phần II: TN Đúng / Sai',
          pointsPerQuestion: 1.0,
          targetQuestions: 3,
          enabled: true,
          description: '3 câu Đúng/Sai (3.0đ)'
        },
        part3: {
          name: 'Phần III: Trả lời ngắn (ĐÃ KHÓA)',
          pointsPerQuestion: 0.5,
          targetQuestions: 0,
          enabled: false,
          description: 'Không áp dụng trong cấu trúc này (0 câu)'
        },
        part4: {
          name: 'Phần IV: Tự luận',
          pointsPerQuestion: 1.0,
          targetQuestions: 3,
          enabled: true,
          description: '3 câu Tự luận (3.0đ)'
        }
      };

    case 'option_3': // 100% Trắc nghiệm - Không có Tự luận (Phần IV bị khóa)
      return {
        part1: {
          name: 'Phần I: TN 4 lựa chọn',
          pointsPerQuestion: 0.25,
          targetQuestions: 12,
          enabled: true,
          description: '12 câu TN 4 lựa chọn (3.0đ)'
        },
        part2: {
          name: 'Phần II: TN Đúng / Sai',
          pointsPerQuestion: 1.0,
          targetQuestions: 4,
          enabled: true,
          description: '4 câu Đúng/Sai (4.0đ)'
        },
        part3: {
          name: 'Phần III: Trả lời ngắn',
          pointsPerQuestion: 0.5,
          targetQuestions: 6,
          enabled: true,
          description: '6 câu Trả lời ngắn (3.0đ)'
        },
        part4: {
          name: 'Phần IV: Tự luận (ĐÃ KHÓA)',
          pointsPerQuestion: 1.0,
          targetQuestions: 0,
          enabled: false,
          description: 'Không áp dụng trong cấu trúc này (0 câu)'
        }
      };

    case 'option_tuluan': // 100% Tự luận (Khóa Phần I, II, III - Chỉ mở Phần IV)
      return {
        part1: {
          name: 'Phần I: TN 4 lựa chọn (ĐÃ KHÓA)',
          pointsPerQuestion: 0.25,
          targetQuestions: 0,
          enabled: false,
          description: 'Không có trắc nghiệm trong đề tự luận (0 câu)'
        },
        part2: {
          name: 'Phần II: TN Đúng / Sai (ĐÃ KHÓA)',
          pointsPerQuestion: 1.0,
          targetQuestions: 0,
          enabled: false,
          description: 'Không có trắc nghiệm trong đề tự luận (0 câu)'
        },
        part3: {
          name: 'Phần III: Trả lời ngắn (ĐÃ KHÓA)',
          pointsPerQuestion: 0.5,
          targetQuestions: 0,
          enabled: false,
          description: 'Không có trắc nghiệm trong đề tự luận (0 câu)'
        },
        part4: {
          name: isLiterature ? 'Phần Tự luận (Đọc hiểu & Viết/Làm văn)' : 'Phần Tự luận',
          pointsPerQuestion: 2.5,
          targetQuestions: 4,
          enabled: true,
          description: '4 câu Tự luận / Câu hỏi Đọc hiểu và Làm văn (Tổng 10.0đ)'
        }
      };

    case 'option_tn_tl_70_30': // 70% TN (28 câu) + 30% TL (3 câu) (Khóa Phần II & III)
      return {
        part1: {
          name: 'Phần I: TN 4 lựa chọn',
          pointsPerQuestion: 0.25,
          targetQuestions: 28,
          enabled: true,
          description: '28 câu TN 4 lựa chọn (7.0đ)'
        },
        part2: {
          name: 'Phần II: TN Đúng / Sai (ĐÃ KHÓA)',
          pointsPerQuestion: 1.0,
          targetQuestions: 0,
          enabled: false,
          description: 'Tắt trong cấu trúc 70-30'
        },
        part3: {
          name: 'Phần III: Trả lời ngắn (ĐÃ KHÓA)',
          pointsPerQuestion: 0.5,
          targetQuestions: 0,
          enabled: false,
          description: 'Tắt trong cấu trúc 70-30'
        },
        part4: {
          name: 'Phần IV: Tự luận',
          pointsPerQuestion: 1.0,
          targetQuestions: 3,
          enabled: true,
          description: '3 câu Tự luận (3.0đ)'
        }
      };

    case 'option_tn_100': // 100% TN 4 lựa chọn (Khóa Phần II, III, IV)
      return {
        part1: {
          name: 'Phần I: TN 4 lựa chọn',
          pointsPerQuestion: 0.25,
          targetQuestions: 40,
          enabled: true,
          description: '40 câu TN 4 lựa chọn (10.0đ)'
        },
        part2: {
          name: 'Phần II: TN Đúng / Sai (ĐÃ KHÓA)',
          pointsPerQuestion: 1.0,
          targetQuestions: 0,
          enabled: false,
          description: 'Tắt trong cấu trúc 100% trắc nghiệm 4 lựa chọn'
        },
        part3: {
          name: 'Phần III: Trả lời ngắn (ĐÃ KHÓA)',
          pointsPerQuestion: 0.5,
          targetQuestions: 0,
          enabled: false,
          description: 'Tắt trong cấu trúc 100% trắc nghiệm 4 lựa chọn'
        },
        part4: {
          name: 'Phần IV: Tự luận (ĐÃ KHÓA)',
          pointsPerQuestion: 1.0,
          targetQuestions: 0,
          enabled: false,
          description: 'Tắt trong cấu trúc 100% trắc nghiệm 4 lựa chọn'
        }
      };

    case 'option_4': // Custom
    default:
      if (currentConfigs) {
        return currentConfigs;
      }
      return DEFAULT_PART_CONFIGS;
  }
}

/**
 * Sanitizes and zeros out any matrix cells for disabled / locked parts.
 * Automatically recalculates totalPoints for each row accurately.
 */
export function sanitizeMatrixForPartConfigs(
  matrix: MatrixRow[],
  partConfigs: ExamPartConfigs
): MatrixRow[] {
  const p1Enabled = (partConfigs.part1?.enabled !== false) && ((partConfigs.part1?.targetQuestions ?? 12) > 0);
  const p2Enabled = (partConfigs.part2?.enabled !== false) && ((partConfigs.part2?.targetQuestions ?? 4) > 0);
  const p3Enabled = (partConfigs.part3?.enabled !== false) && ((partConfigs.part3?.targetQuestions ?? 6) > 0);
  const p4Enabled = (partConfigs.part4?.enabled !== false) && ((partConfigs.part4?.targetQuestions ?? 2) > 0);

  const p1Pts = p1Enabled ? (partConfigs.part1?.pointsPerQuestion ?? 0.25) : 0;
  const p2Pts = p2Enabled ? (partConfigs.part2?.pointsPerQuestion ?? 1.0) : 0;
  const p3Pts = p3Enabled ? (partConfigs.part3?.pointsPerQuestion ?? 0.5) : 0;
  const p4Pts = p4Enabled ? (partConfigs.part4?.pointsPerQuestion ?? 1.0) : 0;

  return matrix.map(row => {
    const p1_nb = p1Enabled ? (row.part1_nb || 0) : 0;
    const p1_th = p1Enabled ? (row.part1_th || 0) : 0;
    const p1_vd = p1Enabled ? (row.part1_vd || 0) : 0;
    const p1_vdc = p1Enabled ? (row.part1_vdc || 0) : 0;

    const p2_nb = p2Enabled ? (row.part2_nb || 0) : 0;
    const p2_th = p2Enabled ? (row.part2_th || 0) : 0;
    const p2_vd = p2Enabled ? (row.part2_vd || 0) : 0;
    const p2_vdc = p2Enabled ? (row.part2_vdc || 0) : 0;

    const p3_nb = p3Enabled ? (row.part3_nb || 0) : 0;
    const p3_th = p3Enabled ? (row.part3_th || 0) : 0;
    const p3_vd = p3Enabled ? (row.part3_vd || 0) : 0;
    const p3_vdc = p3Enabled ? (row.part3_vdc || 0) : 0;

    const p4_nb = p4Enabled ? (row.part4_nb || 0) : 0;
    const p4_th = p4Enabled ? (row.part4_th || 0) : 0;
    const p4_vd = p4Enabled ? (row.part4_vd || 0) : 0;
    const p4_vdc = p4Enabled ? (row.part4_vdc || 0) : 0;

    const p1Total = (p1_nb + p1_th + p1_vd + p1_vdc) * p1Pts;
    const p2Total = (p2_nb + p2_th + p2_vd + p2_vdc) * p2Pts;
    const p3Total = (p3_nb + p3_th + p3_vd + p3_vdc) * p3Pts;
    const p4Total = (p4_nb + p4_th + p4_vd + p4_vdc) * p4Pts;

    const totalPoints = Number((p1Total + p2Total + p3Total + p4Total).toFixed(2));

    return {
      ...row,
      part1_nb: p1_nb,
      part1_th: p1_th,
      part1_vd: p1_vd,
      part1_vdc: p1_vdc,
      part2_nb: p2_nb,
      part2_th: p2_th,
      part2_vd: p2_vd,
      part2_vdc: p2_vdc,
      part3_nb: p3_nb,
      part3_th: p3_th,
      part3_vd: p3_vd,
      part3_vdc: p3_vdc,
      part4_nb: p4_nb,
      part4_th: p4_th,
      part4_vd: p4_vd,
      part4_vdc: p4_vdc,
      totalPoints
    };
  });
}

/**
 * Sanitizes specification questions distribution based on active parts
 */
export function sanitizeSpecificationForPartConfigs(
  spec: SpecificationItem[],
  partConfigs: ExamPartConfigs
): SpecificationItem[] {
  const p1Enabled = (partConfigs.part1?.enabled !== false) && ((partConfigs.part1?.targetQuestions ?? 12) > 0);
  const p2Enabled = (partConfigs.part2?.enabled !== false) && ((partConfigs.part2?.targetQuestions ?? 4) > 0);
  const p3Enabled = (partConfigs.part3?.enabled !== false) && ((partConfigs.part3?.targetQuestions ?? 6) > 0);
  const p4Enabled = (partConfigs.part4?.enabled !== false) && ((partConfigs.part4?.targetQuestions ?? 2) > 0);

  return spec.map(item => ({
    ...item,
    questionCount: {
      part1: p1Enabled ? (item.questionCount?.part1 || { nb: 0, th: 0, vd: 0, vdc: 0 }) : { nb: 0, th: 0, vd: 0, vdc: 0 },
      part2: p2Enabled ? (item.questionCount?.part2 || { nb: 0, th: 0, vd: 0, vdc: 0 }) : { nb: 0, th: 0, vd: 0, vdc: 0 },
      part3: p3Enabled ? (item.questionCount?.part3 || { nb: 0, th: 0, vd: 0, vdc: 0 }) : { nb: 0, th: 0, vd: 0, vdc: 0 },
      part4: p4Enabled ? (item.questionCount?.part4 || { nb: 0, th: 0, vd: 0, vdc: 0 }) : { nb: 0, th: 0, vd: 0, vdc: 0 },
    }
  }));
}

/**
 * Automatically balances and allocates target questions across matrix topics
 * based on standard MOET cognitive ratio (40% NB, 30% TH, 20% VD, 10% VDC)
 */
export function autoBalanceMatrixToTarget(
  matrix: MatrixRow[],
  partConfigs: ExamPartConfigs
): MatrixRow[] {
  if (!matrix || matrix.length === 0) return matrix;

  const p1Enabled = (partConfigs.part1?.enabled !== false) && ((partConfigs.part1?.targetQuestions ?? 0) > 0);
  const p2Enabled = (partConfigs.part2?.enabled !== false) && ((partConfigs.part2?.targetQuestions ?? 0) > 0);
  const p3Enabled = (partConfigs.part3?.enabled !== false) && ((partConfigs.part3?.targetQuestions ?? 0) > 0);
  const p4Enabled = (partConfigs.part4?.enabled !== false) && ((partConfigs.part4?.targetQuestions ?? 0) > 0);

  const p1Target = p1Enabled ? (partConfigs.part1?.targetQuestions ?? 0) : 0;
  const p2Target = p2Enabled ? (partConfigs.part2?.targetQuestions ?? 0) : 0;
  const p3Target = p3Enabled ? (partConfigs.part3?.targetQuestions ?? 0) : 0;
  const p4Target = p4Enabled ? (partConfigs.part4?.targetQuestions ?? 0) : 0;

  const p1Pts = p1Enabled ? (partConfigs.part1?.pointsPerQuestion ?? 0.25) : 0;
  const p2Pts = p2Enabled ? (partConfigs.part2?.pointsPerQuestion ?? 1.0) : 0;
  const p3Pts = p3Enabled ? (partConfigs.part3?.pointsPerQuestion ?? 0.5) : 0;
  const p4Pts = p4Enabled ? (partConfigs.part4?.pointsPerQuestion ?? 1.0) : 0;

  const rowCount = matrix.length;
  const rowAllocations = matrix.map(() => ({
    part1_nb: 0, part1_th: 0, part1_vd: 0, part1_vdc: 0,
    part2_nb: 0, part2_th: 0, part2_vd: 0, part2_vdc: 0,
    part3_nb: 0, part3_th: 0, part3_vd: 0, part3_vdc: 0,
    part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
  }));

  // Distribute Part 1 (Multiple Choice)
  if (p1Target > 0) {
    const nbTarget = Math.round(p1Target * 0.4);
    const thTarget = Math.round(p1Target * 0.3);
    const vdTarget = Math.round(p1Target * 0.2);
    const vdcTarget = Math.max(0, p1Target - nbTarget - thTarget - vdTarget);

    let assigned = 0;
    for (let i = 0; i < nbTarget; i++) {
      rowAllocations[i % rowCount].part1_nb++;
      assigned++;
    }
    for (let i = 0; i < thTarget; i++) {
      rowAllocations[(nbTarget + i) % rowCount].part1_th++;
      assigned++;
    }
    for (let i = 0; i < vdTarget; i++) {
      rowAllocations[(nbTarget + thTarget + i) % rowCount].part1_vd++;
      assigned++;
    }
    for (let i = 0; i < vdcTarget; i++) {
      rowAllocations[(nbTarget + thTarget + vdTarget + i) % rowCount].part1_vdc++;
      assigned++;
    }
    while (assigned < p1Target) {
      rowAllocations[assigned % rowCount].part1_th++;
      assigned++;
    }
  }

  // Distribute Part 2 (True/False)
  if (p2Target > 0) {
    for (let i = 0; i < p2Target; i++) {
      const rIdx = i % rowCount;
      if (i === 0) rowAllocations[rIdx].part2_nb++;
      else if (i === 1) rowAllocations[rIdx].part2_th++;
      else if (i === 2) rowAllocations[rIdx].part2_vd++;
      else rowAllocations[rIdx].part2_th++;
    }
  }

  // Distribute Part 3 (Short Answer)
  if (p3Target > 0) {
    for (let i = 0; i < p3Target; i++) {
      const rIdx = i % rowCount;
      if (i % 2 === 0) rowAllocations[rIdx].part3_th++;
      else rowAllocations[rIdx].part3_vd++;
    }
  }

  // Distribute Part 4 (Essay)
  if (p4Target > 0) {
    for (let i = 0; i < p4Target; i++) {
      const rIdx = i % rowCount;
      if (i === 0) rowAllocations[rIdx].part4_th++;
      else if (i === 1) rowAllocations[rIdx].part4_vd++;
      else if (i === 2) rowAllocations[rIdx].part4_vdc++;
      else rowAllocations[rIdx].part4_vd++;
    }
  }

  return matrix.map((row, idx) => {
    const alloc = rowAllocations[idx];
    const p1Score = (alloc.part1_nb + alloc.part1_th + alloc.part1_vd + alloc.part1_vdc) * p1Pts;
    const p2Score = (alloc.part2_nb + alloc.part2_th + alloc.part2_vd + alloc.part2_vdc) * p2Pts;
    const p3Score = (alloc.part3_nb + alloc.part3_th + alloc.part3_vd + alloc.part3_vdc) * p3Pts;
    const p4Score = (alloc.part4_nb + alloc.part4_th + alloc.part4_vd + alloc.part4_vdc) * p4Pts;
    const totalPoints = Number((p1Score + p2Score + p3Score + p4Score).toFixed(2));

    return {
      ...row,
      ...alloc,
      totalPoints
    };
  });
}

export interface MatrixWarningItem {
  id: string;
  type: 'missing_part' | 'count_mismatch' | 'score_mismatch' | 'locked_has_data';
  title: string;
  message: string;
  severity: 'error' | 'warning';
  partKey?: 'part1' | 'part2' | 'part3' | 'part4';
}

/**
 * Checks discrepancies between matrix allocation and target structure
 */
export function getMatrixMismatchWarnings(
  matrix: MatrixRow[],
  partConfigs: ExamPartConfigs
): MatrixWarningItem[] {
  const warnings: MatrixWarningItem[] = [];

  const parts = [
    { key: 'part1' as const, name: partConfigs.part1?.name || 'Phần I (TN 4 lựa chọn)', cfg: partConfigs.part1, defaultTarget: 12, defaultPts: 0.25 },
    { key: 'part2' as const, name: partConfigs.part2?.name || 'Phần II (TN Đúng/Sai)', cfg: partConfigs.part2, defaultTarget: 4, defaultPts: 1.0 },
    { key: 'part3' as const, name: partConfigs.part3?.name || 'Phần III (Trả lời ngắn)', cfg: partConfigs.part3, defaultTarget: 6, defaultPts: 0.5 },
    { key: 'part4' as const, name: partConfigs.part4?.name || 'Phần IV (Tự luận)', cfg: partConfigs.part4, defaultTarget: 2, defaultPts: 1.0 },
  ];

  let calculatedGrandScore = 0;

  parts.forEach(({ key, name, cfg, defaultTarget, defaultPts }) => {
    const isEnabled = (cfg?.enabled !== false) && ((cfg?.targetQuestions ?? defaultTarget) > 0);
    const targetQ = isEnabled ? (cfg?.targetQuestions ?? defaultTarget) : 0;
    const pts = isEnabled ? (cfg?.pointsPerQuestion ?? defaultPts) : 0;

    const currentCount = matrix.reduce((sum, r) => {
      if (key === 'part1') return sum + (r.part1_nb || 0) + (r.part1_th || 0) + (r.part1_vd || 0) + (r.part1_vdc || 0);
      if (key === 'part2') return sum + (r.part2_nb || 0) + (r.part2_th || 0) + (r.part2_vd || 0) + (r.part2_vdc || 0);
      if (key === 'part3') return sum + (r.part3_nb || 0) + (r.part3_th || 0) + (r.part3_vd || 0) + (r.part3_vdc || 0);
      if (key === 'part4') return sum + (r.part4_nb || 0) + (r.part4_th || 0) + (r.part4_vd || 0) + (r.part4_vdc || 0);
      return sum;
    }, 0);

    if (isEnabled) {
      calculatedGrandScore += currentCount * pts;
      if (currentCount === 0 && targetQ > 0) {
        warnings.push({
          id: `missing_${key}`,
          type: 'missing_part',
          title: `Chưa nhập số câu cho ${name}`,
          message: `Cấu hình mục tiêu là ${targetQ} câu (${(targetQ * pts).toFixed(2)}đ) nhưng ma trận đang có 0 câu (0.00đ).`,
          severity: 'error',
          partKey: key
        });
      } else if (currentCount !== targetQ) {
        const diff = currentCount - targetQ;
        warnings.push({
          id: `mismatch_${key}`,
          type: 'count_mismatch',
          title: `Số câu ${name} chưa khớp mục tiêu`,
          message: `Ma trận có ${currentCount} câu (${(currentCount * pts).toFixed(2)}đ), mục tiêu là ${targetQ} câu (${(targetQ * pts).toFixed(2)}đ). Đang ${diff > 0 ? `thừa ${diff}` : `thiếu ${Math.abs(diff)}`} câu.`,
          severity: 'warning',
          partKey: key
        });
      }
    }
  });

  const grandDiff = Math.abs(calculatedGrandScore - 10.0);
  if (grandDiff > 0.05 && matrix.length > 0) {
    warnings.push({
      id: 'score_grand_mismatch',
      type: 'score_mismatch',
      title: `Tổng điểm Ma trận (${calculatedGrandScore.toFixed(2)}đ) chưa đạt 10.0 điểm`,
      message: `Chuẩn Bộ GD&ĐT quy định ma trận và đề kiểm tra phải có tổng điểm tích lũy chính xác 10.0 điểm.`,
      severity: 'error'
    });
  }

  return warnings;
}
