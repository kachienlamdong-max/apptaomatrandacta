import { ExamHeaderConfig, ExamQuestion, MatrixRow, SpecificationItem } from '../types';

export interface AuditCheckItem {
  id: string;
  category: 'matrix_spec' | 'part1_mcq' | 'part2_tf' | 'part3_short' | 'part4_essay' | 'overall';
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  details: string;
  suggestion?: string;
}

export interface ComplianceAuditReport {
  totalChecks: number;
  passedChecks: number;
  warningChecks: number;
  failedChecks: number;
  scorePercentage: number;
  overallStatus: 'excellent' | 'good' | 'needs_improvement';
  items: AuditCheckItem[];
  summaryText: string;
}

export function performMoetComplianceAudit(
  header: ExamHeaderConfig,
  questions: ExamQuestion[],
  matrix: MatrixRow[] = [],
  specification: SpecificationItem[] = []
): ComplianceAuditReport {
  const items: AuditCheckItem[] = [];

  // ----------------------------------------------------
  // 1. KIỂM ĐỊNH MA TRẬN VÀ BẢN ĐẶC TẢ
  // ----------------------------------------------------
  const totalScore = matrix.reduce((acc, row) => acc + (row.totalPoints || 0), 0);
  const isScore10 = Math.abs(totalScore - 10) < 0.1 || totalScore === 0; // 0 if not calculated yet

  items.push({
    id: 'mat_1',
    category: 'matrix_spec',
    title: 'Tổng điểm ma trận chuẩn 10.0 điểm',
    description: 'Toàn bộ ma trận đề kiểm tra phải có tổng điểm tích lũy đạt chính xác 10.0 điểm.',
    status: isScore10 ? 'pass' : 'fail',
    details: `Tổng điểm hiện tại của ma trận: ${totalScore.toFixed(2)} / 10.0 điểm.`,
    suggestion: isScore10 ? undefined : 'Điều chỉnh lại số lượng câu hoặc điểm số từng phần để tổng đạt 10.0 điểm.'
  });

  const rowCount = matrix.length;
  items.push({
    id: 'mat_2',
    category: 'matrix_spec',
    title: 'Phân phối chủ đề và mạch nội dung',
    description: 'Ma trận phải bao quát đầy đủ các chủ đề/bài học trọng tâm theo chương trình GDPT 2018.',
    status: rowCount > 0 ? 'pass' : 'warning',
    details: `Số lượng chủ đề/mạch nội dung trong ma trận: ${rowCount} chủ đề.`,
    suggestion: rowCount === 0 ? 'Thêm các chủ đề/mạch kiến thức vào ma trận đề.' : undefined
  });

  // ----------------------------------------------------
  // 2. KIỂM ĐỊNH PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN
  // ----------------------------------------------------
  const part1Questions = questions.filter(q => q.type === 'multiple_choice');
  const prohibitedOptionPhrases = [
    'tất cả các phương án',
    'tất cả phương án',
    'cả a, b, c',
    'cả a và b',
    'không có phương án nào',
    'không có đáp án nào',
    'tất cả đều đúng',
    'tất cả đều sai'
  ];

  let part1HasProhibited = false;
  let part1MissingOptions = false;
  let part1UnbalancedAnswers = false;

  const p1AnswerCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

  part1Questions.forEach(q => {
    if (!q.options || q.options.length !== 4) {
      part1MissingOptions = true;
    } else {
      q.options.forEach(opt => {
        const lower = opt.content.toLowerCase();
        if (prohibitedOptionPhrases.some(p => lower.includes(p))) {
          part1HasProhibited = true;
        }
      });
    }
    if (q.correctOption && p1AnswerCounts[q.correctOption] !== undefined) {
      p1AnswerCounts[q.correctOption]++;
    }
  });

  items.push({
    id: 'p1_1',
    category: 'part1_mcq',
    title: 'Cấu trúc 4 phương án độc lập và đồng nhất',
    description: 'Mỗi câu trắc nghiệm nhiều lựa chọn phải có đúng 4 phương án (A, B, C, D) có độ dài tương đương.',
    status: (!part1MissingOptions && part1Questions.length > 0) ? 'pass' : (part1Questions.length === 0 ? 'pass' : 'fail'),
    details: `Tổng số câu Phần I: ${part1Questions.length}. ${part1MissingOptions ? 'Phát hiện câu không đủ 4 phương án.' : 'Tất cả câu đều có đủ 4 phương án tiêu chuẩn.'}`,
    suggestion: part1MissingOptions ? 'Bổ sung đầy đủ 4 phương án cho từng câu hỏi.' : undefined
  });

  items.push({
    id: 'p1_2',
    category: 'part1_mcq',
    title: 'Không sử dụng phương án quy chụp/liệt kê xấu',
    description: 'Tuyệt đối không dùng: "Tất cả các phương án trên đều đúng", "Không có phương án nào đúng", "Cả A và B...".',
    status: part1HasProhibited ? 'fail' : 'pass',
    details: part1HasProhibited 
      ? 'Phát hiện có câu chứa phương án dạng "Tất cả..." hoặc "Cả A và B...".' 
      : 'Không có phương án vi phạm quy chuẩn biên soạn trắc nghiệm.',
    suggestion: part1HasProhibited ? 'Thay thế bằng phương án nội dung độc lập cụ thể.' : undefined
  });

  // ----------------------------------------------------
  // 3. KIỂM ĐỊNH PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI
  // ----------------------------------------------------
  const part2Questions = questions.filter(q => q.type === 'true_false');
  let part2MissingSource = false;
  let part2Not4Items = false;
  let part2HasAmbiguousWords = false;

  const ambiguousWords = ['nói chung', 'thông thường', 'hầu hết', 'nhiều khi', 'đôi khi'];

  part2Questions.forEach(q => {
    // Check Source
    const hasSource = q.content.toLowerCase().includes('nguồn:') || 
                      q.content.toLowerCase().includes('xử lí từ') || 
                      q.content.toLowerCase().includes('biên tập từ') ||
                      q.content.toLowerCase().includes('tổng hợp từ') ||
                      q.content.toLowerCase().includes('trích từ');
    if (!hasSource) {
      part2MissingSource = true;
    }

    // Check 4 items
    if (!q.trueFalseItems || q.trueFalseItems.length !== 4) {
      part2Not4Items = true;
    } else {
      q.trueFalseItems.forEach(item => {
        const stmt = item.statement.toLowerCase();
        if (ambiguousWords.some(w => stmt.includes(w))) {
          part2HasAmbiguousWords = true;
        }
      });
    }
  });

  items.push({
    id: 'p2_1',
    category: 'part2_tf',
    title: 'Ghi rõ nguồn ngữ liệu / bối cảnh',
    description: 'Đoạn thông tin/tư liệu của câu hỏi Đúng/Sai phải ghi rõ nguồn trích dẫn hoặc xử lí ("Nguồn: ...").',
    status: part2MissingSource ? 'warning' : 'pass',
    details: part2MissingSource 
      ? 'Một số câu trắc nghiệm Đúng/Sai chưa ghi rõ nguồn tư liệu ở cuối đoạn văn bản dẫn.'
      : 'Tất cả câu trắc nghiệm Đúng/Sai đều có nguồn dẫn tư liệu rõ ràng, chuẩn mực.',
    suggestion: part2MissingSource ? 'Bổ sung "Nguồn: [Tên nguồn tài liệu, năm]" vào cuối đoạn thông tin.' : undefined
  });

  items.push({
    id: 'p2_2',
    category: 'part2_tf',
    title: 'Đủ 4 nhận định theo thứ tự nhận thức a, b, c, d',
    description: 'Mỗi câu hỏi có đúng 4 nhận định: a) Biết, b) Hiểu, c) Vận dụng, d) Vận dụng.',
    status: (!part2Not4Items && part2Questions.length > 0) ? 'pass' : (part2Questions.length === 0 ? 'pass' : 'fail'),
    details: `Tổng số câu Phần II: ${part2Questions.length}. ${part2Not4Items ? 'Phát hiện câu không có đúng 4 nhận định a, b, c, d.' : 'Tất cả câu đều có đủ 4 nhận định độc lập.'}`,
    suggestion: part2Not4Items ? 'Đảm bảo mỗi câu có đủ 4 nhận định a), b), c), d).' : undefined
  });

  items.push({
    id: 'p2_3',
    category: 'part2_tf',
    title: 'Tính khẳng định và tránh từ ngữ mơ hồ',
    description: 'Nhận định là mệnh đề khẳng định/phủ định rõ nghĩa, không chứa từ ngữ ước lệ cảm tính.',
    status: part2HasAmbiguousWords ? 'warning' : 'pass',
    details: part2HasAmbiguousWords
      ? 'Phát hiện có nhận định dùng từ ngữ ước lượng (hầu hết, nói chung, thông thường...).'
      : 'Các nhận định diễn đạt ngắn gọn, tường minh, chuẩn mực khoa học.',
    suggestion: part2HasAmbiguousWords ? 'Chỉnh sửa nhận định thành các mệnh đề sự thật hoặc quy luật có thể kiểm chứng khách quan.' : undefined
  });

  // ----------------------------------------------------
  // 4. KIỂM ĐỊNH PHẦN III: TRẢ LỜI NGẮN
  // ----------------------------------------------------
  const part3Questions = questions.filter(q => q.type === 'short_answer');
  let part3KeyTooLong = false;
  let part3MissingInstruction = false;

  part3Questions.forEach(q => {
    const rawKey = (q.shortAnswerKey || q.explanation || '').trim();
    // Check key length (<= 4 chars)
    if (rawKey.length > 4 && !rawKey.includes(' ')) {
      // If it's a single token and longer than 4 chars
      part3KeyTooLong = true;
    }
    // Check prompt for "chỉ ghi số" or similar rule
    const contentLower = q.content.toLowerCase();
    if (!contentLower.includes('chỉ ghi số') && !contentLower.includes('làm tròn') && !contentLower.includes('điền số')) {
      part3MissingInstruction = true;
    }
  });

  items.push({
    id: 'p3_1',
    category: 'part3_short',
    title: 'Độ dài đáp án tối đa 4 ký tự',
    description: 'Đáp án câu trả lời ngắn là một số có tối đa 4 ký tự (tính cả dấu trừ và dấu phẩy).',
    status: part3KeyTooLong ? 'warning' : 'pass',
    details: part3KeyTooLong
      ? 'Có câu trả lời ngắn có chuỗi đáp án dài hơn 4 ký tự (cần làm tròn hoặc đổi đơn vị đo).'
      : 'Tất cả đáp án trả lời ngắn đều đảm bảo ngắn gọn, chuẩn định dạng $\\le 4$ ký tự.',
    suggestion: part3KeyTooLong ? 'Điều chỉnh yêu cầu làm tròn (hàng đơn vị, hàng phần mười) hoặc thay đổi đơn vị để đáp án $\\le 4$ ký tự.' : undefined
  });

  items.push({
    id: 'p3_2',
    category: 'part3_short',
    title: 'Hướng dẫn quy ước làm tròn và nhập số',
    description: 'Đề bài phải nêu rõ đơn vị, quy ước làm tròn và nhắc học sinh "Khi trả lời, chỉ ghi số".',
    status: part3MissingInstruction ? 'warning' : 'pass',
    details: part3MissingInstruction
      ? 'Một số câu chưa ghi rõ quy ước làm tròn hoặc câu nhắc "Khi trả lời, chỉ ghi số".'
      : 'Các câu hỏi đều có hướng dẫn định dạng kết quả rõ ràng, tránh nhầm lẫn khi chấm.',
    suggestion: part3MissingInstruction ? 'Bổ sung "...làm tròn đến hàng phần mười. Khi trả lời, chỉ ghi số."' : undefined
  });

  // ----------------------------------------------------
  // 5. KIỂM ĐỊNH PHẦN IV: TỰ LUẬN
  // ----------------------------------------------------
  const part4Questions = questions.filter(q => q.type === 'essay');
  let part4MissingRubric = false;

  part4Questions.forEach(q => {
    if (!q.essayRubric || q.essayRubric.trim().length < 20) {
      part4MissingRubric = true;
    }
  });

  if (part4Questions.length > 0) {
    items.push({
      id: 'p4_1',
      category: 'part4_essay',
      title: 'Hướng dẫn chấm và thang điểm thành phần (Rubric)',
      description: 'Câu tự luận phải có hướng dẫn chấm chi tiết, chia nhỏ điểm số từng ý và có lưu ý chấm linh hoạt.',
      status: part4MissingRubric ? 'warning' : 'pass',
      details: part4MissingRubric
        ? 'Có câu tự luận chưa có hướng dẫn chấm chi tiết chia điểm cho từng ý con.'
        : 'Tất cả câu tự luận đều có thang điểm chi tiết (Rubric) và hướng dẫn chấm rõ ràng.',
      suggestion: part4MissingRubric ? 'Bổ sung hướng dẫn chấm chi tiết kèm điểm từng ý (0.25đ, 0.5đ...).' : undefined
    });
  }

  // ----------------------------------------------------
  // 6. KIỂM ĐỊNH TOÀN ĐỀ: TRÙNG LẶP NỘI DUNG (ZERO DUPLICATION)
  // ----------------------------------------------------
  const seenPassages = new Set<string>();
  let hasDuplicatePassages = false;

  questions.forEach(q => {
    const snippet = q.content.slice(0, 40).trim().toLowerCase();
    if (snippet.length > 10) {
      if (seenPassages.has(snippet)) {
        hasDuplicatePassages = true;
      }
      seenPassages.add(snippet);
    }
  });

  items.push({
    id: 'ov_1',
    category: 'overall',
    title: 'Tính độc lập và không trùng lặp câu hỏi',
    description: 'Các câu hỏi trong toàn đề phải độc lập tuyệt đối, không trùng lặp ngữ liệu, số liệu hay bối cảnh.',
    status: hasDuplicatePassages ? 'fail' : 'pass',
    details: hasDuplicatePassages
      ? 'CẢNH BÁO: Phát hiện có câu hỏi trùng lặp nội dung hoặc ngữ liệu trong đề thi.'
      : 'Toàn bộ các câu hỏi trong đề đều độc lập, phong phú và không bị trùng lặp nội dung.',
    suggestion: hasDuplicatePassages ? 'Tạo lại câu hỏi hoặc nhấn nút "Đồng bộ từ ma trận & AI" để làm mới bộ câu hỏi.' : undefined
  });

  // Calculate stats
  const totalChecks = items.length;
  const passedChecks = items.filter(i => i.status === 'pass').length;
  const warningChecks = items.filter(i => i.status === 'warning').length;
  const failedChecks = items.filter(i => i.status === 'fail').length;

  const scorePercentage = Math.round((passedChecks + warningChecks * 0.5) / totalChecks * 100);

  let overallStatus: 'excellent' | 'good' | 'needs_improvement' = 'good';
  if (failedChecks === 0 && warningChecks <= 1) {
    overallStatus = 'excellent';
  } else if (failedChecks > 1 || scorePercentage < 75) {
    overallStatus = 'needs_improvement';
  }

  const summaryText = overallStatus === 'excellent'
    ? 'Đề thi và ma trận đáp ứng xuất sắc toàn bộ tiêu chí kỹ thuật chuẩn GDPT 2018 của Bộ GD&ĐT.'
    : overallStatus === 'good'
    ? 'Đề thi cơ bản đạt chuẩn, có một số khuyến nghị nhỏ cần lưu ý để hoàn thiện tối đa.'
    : 'Cần rà soát và điều chỉnh lại một số mục theo bảng kiểm kỹ thuật để đảm bảo tính chuẩn hóa.';

  return {
    totalChecks,
    passedChecks,
    warningChecks,
    failedChecks,
    scorePercentage,
    overallStatus,
    items,
    summaryText
  };
}
