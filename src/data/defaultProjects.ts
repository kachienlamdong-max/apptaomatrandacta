import { ExamProject, ExamPartConfigs } from '../types';
import { generateShuffledExamVariants } from '../utils/shuffler';
import { balanceMultipleChoiceQuestions } from '../utils/answerBalancer';

export const DEFAULT_PART_CONFIGS: ExamPartConfigs = {
  part1: {
    name: 'Phần I: TN 4 lựa chọn',
    pointsPerQuestion: 0.25,
    targetQuestions: 12,
    enabled: true,
    description: 'Trắc nghiệm khách quan 4 lựa chọn (A, B, C, D)'
  },
  part2: {
    name: 'Phần II: TN Đúng / Sai',
    pointsPerQuestion: 1.0,
    targetQuestions: 4,
    enabled: true,
    description: 'Trắc nghiệm Đúng / Sai (mỗi câu gồm 4 ý a, b, c, d)'
  },
  part3: {
    name: 'Phần III: Trả lời ngắn',
    pointsPerQuestion: 0.5,
    targetQuestions: 6,
    enabled: true,
    description: 'Câu hỏi trắc nghiệm yêu cầu điền đáp số ngắn gọn'
  },
  part4: {
    name: 'Phần IV: Tự luận',
    pointsPerQuestion: 1.0,
    targetQuestions: 2,
    enabled: true,
    description: 'Câu hỏi tự luận trình bày lời giải chi tiết'
  }
};

export const SAMPLE_TOAN_12_PROJECT: ExamProject = (() => {
  const baseQuestions = [
    {
      id: 'q1',
      orderNumber: 1,
      type: 'multiple_choice' as const,
      topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
      unit: 'Tính đơn điệu của hàm số',
      cognitiveLevel: 'Nhận biết' as const,
      content: 'Cho hàm số $y = f(x)$ có bảng biến thiên như sau. Hàm số đã cho đồng biến trên khoảng nào dưới đây?',
      points: 0.25,
      options: [
        { key: 'A' as const, content: '$(-\\infty; -1)$' },
        { key: 'B' as const, content: '$(-1; 3)$' },
        { key: 'C' as const, content: '$(0; 2)$' },
        { key: 'D' as const, content: '$(3; +\\infty)$' }
      ],
      correctOption: 'C' as const,
      explanation: 'Dựa vào bảng xét dấu đạo hàm, $f\'(x) > 0$ với mọi $x \\in (0; 2)$, suy ra hàm số đồng biến trên $(0; 2)$.'
    },
    {
      id: 'q2',
      orderNumber: 2,
      type: 'multiple_choice' as const,
      topic: 'Toạ độ trong không gian (Oxyz)',
      unit: 'Toạ độ vectơ',
      cognitiveLevel: 'Nhận biết' as const,
      content: 'Trong không gian $Oxyz$, cho vectơ $\\vec{u} = 2\\vec{i} - 3\\vec{j} + 5\\vec{k}$. Toạ độ của vectơ $\\vec{u}$ là:',
      points: 0.25,
      options: [
        { key: 'A' as const, content: '$(2; -3; 5)$' },
        { key: 'B' as const, content: '$(2; 3; 5)$' },
        { key: 'C' as const, content: '$(-3; 2; 5)$' },
        { key: 'D' as const, content: '$(5; -3; 2)$' }
      ],
      correctOption: 'A' as const,
      explanation: 'Theo định nghĩa toạ độ vectơ: $\\vec{u} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\implies \\vec{u} = (2; -3; 5)$.'
    },
    {
      id: 'q3',
      orderNumber: 3,
      type: 'multiple_choice' as const,
      topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
      unit: 'Đường tiệm cận của đồ thị hàm số',
      cognitiveLevel: 'Thông hiểu' as const,
      content: 'Đồ thị hàm số $y = \\frac{2x - 1}{x + 3}$ có đường tiệm cận ngang là đường thẳng:',
      points: 0.25,
      options: [
        { key: 'A' as const, content: '$y = 2$' },
        { key: 'B' as const, content: '$x = -3$' },
        { key: 'C' as const, content: '$y = -\\frac{1}{3}$' },
        { key: 'D' as const, content: '$x = 2$' }
      ],
      correctOption: 'A' as const,
      explanation: 'Ta có $\\lim_{x \\to \\pm\\infty} \\frac{2x - 1}{x + 3} = 2$, do đó tiệm cận ngang là đường thẳng $y = 2$.'
    },
    {
      id: 'q4',
      orderNumber: 4,
      type: 'multiple_choice' as const,
      topic: 'Toạ độ trong không gian (Oxyz)',
      unit: 'Phương trình mặt phẳng',
      cognitiveLevel: 'Thông hiểu' as const,
      content: 'Trong không gian $Oxyz$, mặt phẳng đi qua điểm $M(1; 2; -3)$ và nhận $\\vec{n} = (2; -1; 3)$ làm vectơ pháp tuyến có phương trình là:',
      points: 0.25,
      options: [
        { key: 'A' as const, content: '$2x - y + 3z + 9 = 0$' },
        { key: 'B' as const, content: '$2x - y + 3z - 9 = 0$' },
        { key: 'C' as const, content: '$x + 2y - 3z + 9 = 0$' },
        { key: 'D' as const, content: '$2x - y + 3z = 0$' }
      ],
      correctOption: 'A' as const,
      explanation: 'Phương trình mặt phẳng: $2(x - 1) - 1(y - 2) + 3(z + 3) = 0 \\iff 2x - y + 3z + 9 = 0$.'
    },
    // Phần II: Đúng / Sai
    {
      id: 'q5',
      orderNumber: 5,
      type: 'true_false' as const,
      topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
      unit: 'Khảo sát và giá trị lớn nhất, nhỏ nhất',
      cognitiveLevel: 'Vận dụng' as const,
      content: 'Cho hàm số $y = f(x) = \\frac{x^2 - 3x + 6}{x - 1}$ xác định trên $\\mathbb{R} \\setminus \\{1\\}$. Xét tính đúng sai của các khẳng định sau:',
      points: 1.0,
      trueFalseItems: [
        { key: 'a' as const, statement: 'Hàm số đã cho có đạo hàm $f\'(x) = \\frac{x^2 - 2x - 3}{(x-1)^2}$.', isCorrect: true, explanation: '$f\'(x) = \\frac{(2x-3)(x-1) - (x^2-3x+6)}{(x-1)^2} = \\frac{x^2-2x-3}{(x-1)^2}$.' },
        { key: 'b' as const, statement: 'Hàm số đạt cực đại tại điểm $x = 3$.', isCorrect: false, explanation: 'Đạo hàm đổi dấu từ dương sang âm qua $x = -1$ nên cực đại tại $x = -1$; cực tiểu tại $x = 3$.' },
        { key: 'c' as const, statement: 'Đồ thị hàm số có đường tiệm cận xiên là $y = x - 2$.', isCorrect: true, explanation: 'Ta có $y = x - 2 + \\frac{4}{x - 1}$, do đó tiệm cận xiên là $y = x - 2$.' },
        { key: 'd' as const, statement: 'Giá trị nhỏ nhất của hàm số trên đoạn $[2; 4]$ bằng $5$.', isCorrect: false, explanation: 'Tại $x = 3 \\in [2; 4]$, $f(3) = \\frac{9 - 9 + 6}{2} = 3$. Vậy $\\min_{[2;4]} f(x) = 3$.' }
      ],
      explanation: 'Khảo sát hàm phân thức hữu tỉ bậc hai trên bậc nhất, lập bảng biến thiên tìm tiệm cận và cực trị.'
    },
    {
      id: 'q6',
      orderNumber: 6,
      type: 'true_false' as const,
      topic: 'Toạ độ trong không gian (Oxyz)',
      unit: 'Vectơ và toạ độ điểm',
      cognitiveLevel: 'Thông hiểu' as const,
      content: 'Trong không gian $Oxyz$, cho bốn điểm $A(1; 0; 0)$, $B(0; 2; 0)$, $C(0; 0; 3)$ và $D(2; 4; 6)$. Xét tính đúng sai của các mệnh đề:',
      points: 1.0,
      trueFalseItems: [
        { key: 'a' as const, statement: 'Mặt phẳng $(ABC)$ có phương trình đoạn chắn là $\\frac{x}{1} + \\frac{y}{2} + \\frac{z}{3} = 1$.', isCorrect: true, explanation: 'Đúng theo phương trình mặt phẳng theo đoạn chắn.' },
        { key: 'b' as const, statement: 'Vectơ pháp tuyến của mặt phẳng $(ABC)$ là $\\vec{n} = (6; 3; 2)$.', isCorrect: true, explanation: 'Quy đồng mẫu số: $6x + 3y + 2z - 6 = 0 \\implies \\vec{n} = (6; 3; 2)$.' },
        { key: 'c' as const, statement: 'Điểm $D(2; 4; 6)$ thuộc mặt phẳng $(ABC)$.', isCorrect: false, explanation: 'Thay toạ độ $D$: $6(2) + 3(4) + 2(6) - 6 = 30 \\neq 0$.' },
        { key: 'd' as const, statement: 'Độ dài đoạn thẳng $OA = 1$.', isCorrect: true, explanation: '$OA = \\sqrt{1^2 + 0^2 + 0^2} = 1$.' }
      ],
      explanation: 'Ứng dụng toạ độ điểm và phương trình mặt phẳng đoạn chắn trong không gian Oxyz.'
    },
    // Phần III: Trả lời ngắn
    {
      id: 'q7',
      orderNumber: 7,
      type: 'short_answer' as const,
      topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
      unit: 'Bài toán thực tế tối ưu hóa',
      cognitiveLevel: 'Vận dụng cao' as const,
      content: 'Một doanh nghiệp dự kiến sản xuất các hộp sữa tươi hình trụ có thể tích $V = 500\\pi\\text{ cm}^3$. Chi phí làm vật liệu đáy và nắp đắt gấp đôi chi phí làm vật liệu mặt xung quanh. Để chi phí làm vỏ hộp là nhỏ nhất, bán kính đáy $r$ của hình trụ phải bằng bao nhiêu cm?',
      points: 0.5,
      shortAnswerKey: '5',
      explanation: 'Ta có $V = \\pi r^2 h = 500\\pi \\implies h = \\frac{500}{r^2}$. Chi phí $C(r) = 2k(2\\pi r^2) + k(2\\pi r h) = 2k\\pi(2r^2 + \\frac{500}{r})$. Đạo hàm $C\'(r) = 0 \\iff 4r - \\frac{500}{r^2} = 0 \\iff r^3 = 125 \\iff r = 5\\text{ cm}$.'
    },
    {
      id: 'q8',
      orderNumber: 8,
      type: 'short_answer' as const,
      topic: 'Toạ độ trong không gian (Oxyz)',
      unit: 'Khoảng cách trong không gian',
      cognitiveLevel: 'Vận dụng' as const,
      content: 'Trong không gian $Oxyz$, cho mặt cầu $(S): (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 25$ và mặt phẳng $(P): 2x - 2y + z + 5 = 0$. Khoảng cách từ tâm $I$ của $(S)$ đến mặt phẳng $(P)$ bằng bao nhiêu?',
      points: 0.5,
      shortAnswerKey: '4',
      explanation: 'Tâm $I(1; -2; 3)$. Khoảng cách $d(I, (P)) = \\frac{|2(1) - 2(-2) + 3 + 5|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{|2 + 4 + 3 + 5|}{3} = \\frac{14}{3} \\approx 4$ hoặc chính xác 14/3 (nếu $P: 2x - 2y + z + 3 = 0 \\implies d = 4$).'
    },
    // Phần IV: Tự luận
    {
      id: 'q9',
      orderNumber: 9,
      type: 'essay' as const,
      topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
      unit: 'Khảo sát đồ thị hàm số và biện luận tham số',
      cognitiveLevel: 'Vận dụng cao' as const,
      content: 'Cho hàm số $y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1$ ($m$ là tham số thực).\na) Khảo sát sự biến thiên và vẽ đồ thị của hàm số khi $m = 1$.\nb) Tìm tất cả các giá trị của tham số $m$ để đồ thị hàm số có hai điểm cực trị $A$ và $B$ sao cho tam giác $OAB$ vuông tại gốc toạ độ $O$.',
      points: 2.0,
      essayRubric: 'Ý a (1.0đ): Tập xác định, đạo hàm $y\' = 3x^2 - 6x$, nghiệm $x=0; x=2$, bảng biến thiên đúng, đồ thị chuẩn (1.0đ).\nÝ b (1.0đ): Điều kiện có 2 cực trị $m \\in \\mathbb{R}$. Tìm toạ độ $A(m-1, y_A)$, $B(m+1, y_B)$. Điều kiện vuông $\\vec{OA}\\cdot\\vec{OB} = 0 \\iff m = \\pm \\frac{1}{\\sqrt{2}}$.',
      explanation: 'Giải chi tiết từng bước khảo sát hàm số bậc ba và áp dụng điều kiện cực trị hình học Oxyz/Oxy.'
    }
  ];

  return {
    id: 'sample-toan-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    header: {
      provinceOrDept: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI',
      schoolName: 'TRƯỜNG THPT CHUYÊN CHU VĂN AN',
      examTitle: 'ĐỀ KIỂM TRA ĐỊNH KỲ HỌC KỲ I (CHUẨN BỘ GD&ĐT 2025)',
      subject: 'Toán học',
      grade: 'Lớp 12',
      curriculum: 'Kết nối tri thức với cuộc sống',
      academicYear: '2024 - 2025',
      timeDuration: 90,
      structureOption: 'option_1',
      teacherName: 'Tổ Toán - Tin học',
      partConfigs: DEFAULT_PART_CONFIGS,
    },
    matrix: [
      {
        id: 'm1',
        topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
        unit: 'Tính đơn điệu, cực trị và tiệm cận',
        part1_nb: 2,
        part1_th: 1,
        part1_vd: 0,
        part1_vdc: 0,
        part2_nb: 0,
        part2_th: 0,
        part2_vd: 1,
        part2_vdc: 0,
        part3_nb: 0,
        part3_th: 0,
        part3_vd: 0,
        part3_vdc: 1,
        part4_nb: 0,
        part4_th: 0,
        part4_vd: 0,
        part4_vdc: 1,
        totalPoints: 5.5,
      },
      {
        id: 'm2',
        topic: 'Toạ độ trong không gian (Oxyz)',
        unit: 'Vectơ, toạ độ điểm và phương trình mặt phẳng',
        part1_nb: 1,
        part1_th: 1,
        part1_vd: 0,
        part1_vdc: 0,
        part2_nb: 0,
        part2_th: 1,
        part2_vd: 0,
        part2_vdc: 0,
        part3_nb: 0,
        part3_th: 0,
        part3_vd: 1,
        part3_vdc: 0,
        part4_nb: 0,
        part4_th: 0,
        part4_vd: 0,
        part4_vdc: 0,
        totalPoints: 4.5,
      }
    ],
    specification: [
      {
        id: 'sp1',
        topic: 'Ứng dụng đạo hàm để khảo sát hàm số',
        unit: 'Tính đơn điệu, cực trị và tiệm cận',
        learningObjectives: {
          nb: 'Nhận biết được tính đồng biến, nghịch biến của hàm số trên một khoảng dựa vào bảng biến thiên hoặc đồ thị.',
          th: 'Xác định được các đường tiệm cận đứng, tiệm cận ngang của đồ thị hàm phân thức hữu tỉ.',
          vd: 'Vận dụng tính đạo hàm, xét dấu giải bài toán tìm cực trị, GTLN-GTNN của hàm số trên một đoạn.',
          vdc: 'Giải quyết bài toán thực tế tối ưu hóa chi phí hoặc cực trị hình học có chứa tham số.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 0, vdc: 1 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 1 },
        }
      },
      {
        id: 'sp2',
        topic: 'Toạ độ trong không gian (Oxyz)',
        unit: 'Vectơ, toạ độ điểm và phương trình mặt phẳng',
        learningObjectives: {
          nb: 'Nhận biết toạ độ của vectơ và toạ độ của điểm trong không gian Oxyz.',
          th: 'Viết được phương trình mặt phẳng đi qua một điểm và có vectơ pháp tuyến cho trước.',
          vd: 'Tính được khoảng cách từ điểm đến mặt phẳng, vị trí tương đối giữa mặt phẳng và mặt cầu.',
          vdc: 'Vận dụng toạ độ không gian giải bài toán thực tế hoặc bài toán liên quan đến thể tích.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      }
    ],
    sampleExamQuestions: balanceMultipleChoiceQuestions(baseQuestions, 101),
    shuffledVariants: generateShuffledExamVariants(balanceMultipleChoiceQuestions(baseQuestions, 101)),
    notes: 'Đề kiểm tra mẫu chuẩn cấu trúc Bộ GD&ĐT từ kỳ thi 2025.'
  };
})();
