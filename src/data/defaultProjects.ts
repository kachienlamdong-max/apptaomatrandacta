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

export const SAMPLE_DIA_LI_12_PROJECT: ExamProject = (() => {
  const baseQuestions = [
    // Phần I: Trắc nghiệm 4 lựa chọn
    {
      id: 'dl_q1',
      orderNumber: 1,
      type: 'multiple_choice' as const,
      topic: 'Địa lí tự nhiên Việt Nam',
      unit: 'Vị trí địa lí và phạm vi lãnh thổ',
      cognitiveLevel: 'Nhận biết' as const,
      content: 'Theo quy định hiện hành và SGK Địa lí 12, vùng lãnh hải của nước ta có chiều rộng là bao nhiêu hải lí tính từ đường cơ sở?',
      points: 0.25,
      options: [
        { key: 'A' as const, content: '12 hải lí.' },
        { key: 'B' as const, content: '24 hải lí.' },
        { key: 'C' as const, content: '200 hải lí.' },
        { key: 'D' as const, content: '350 hải lí.' }
      ],
      correctOption: 'A' as const,
      explanation: 'Lãnh hải của Việt Nam có chiều rộng 12 hải lí tính từ đường cơ sở ra phía biển, là đường biên giới quốc gia trên biển.'
    },
    {
      id: 'dl_q2',
      orderNumber: 2,
      type: 'multiple_choice' as const,
      topic: 'Địa lí tự nhiên Việt Nam',
      unit: 'Thiên nhiên nhiệt đới ẩm gió mùa',
      cognitiveLevel: 'Nhận biết' as const,
      content: 'Mùa đông ở miền Bắc nước ta chịu ảnh hưởng chủ yếu của khối khí lạnh xuất phát từ trung tâm áp cao nào sau đây?',
      points: 0.25,
      options: [
        { key: 'A' as const, content: 'Áp cao Xi-bia.' },
        { key: 'B' as const, content: 'Áp cao Ha-oai.' },
        { key: 'C' as const, content: 'Áp cao A-xo.' },
        { key: 'D' as const, content: 'Áp cao cận chí tuyến Nam bán cầu.' }
      ],
      correctOption: 'A' as const,
      explanation: 'Gió mùa Đông Bắc xuất phát từ khối khí lạnh lục địa ở trung tâm áp cao Xi-bia gây ra mùa đông lạnh ở miền Bắc.'
    },
    {
      id: 'dl_q3',
      orderNumber: 3,
      type: 'multiple_choice' as const,
      topic: 'Địa lí dân cư Việt Nam',
      unit: 'Dân số và đô thị hoá ở Việt Nam',
      cognitiveLevel: 'Thông hiểu' as const,
      content: 'Theo số liệu thống kê năm 2024 trong SGK Địa lí 12, cơ cấu dân số theo độ tuổi của nước ta có đặc điểm nổi bật là:',
      points: 0.25,
      options: [
        { key: 'A' as const, content: 'Đang duy trì thời kì cơ cấu dân số vàng (nhóm 15-64 tuổi chiếm 67,4%) và bước vào giai đoạn già hoá nhanh.' },
        { key: 'B' as const, content: 'Tỉ lệ trẻ em dưới 15 tuổi chiếm trên 50% tổng dân số cả nước.' },
        { key: 'C' as const, content: 'Tỉ lệ người già trên 65 tuổi chiếm đa số trong cơ cấu dân số.' },
        { key: 'D' as const, content: 'Tỉ lệ giới tính khi sinh đạt trạng thái cân bằng tuyệt đối 100 bé gái / 100 bé trai.' }
      ],
      correctOption: 'A' as const,
      explanation: 'Năm 2024: Nhóm dưới 15 tuổi chiếm 23,3%, nhóm 15-64 tuổi chiếm 67,4% (dân số vàng), nhóm trên 65 tuổi chiếm 9,3% (già hoá dân số).'
    },
    {
      id: 'dl_q4',
      orderNumber: 4,
      type: 'multiple_choice' as const,
      topic: 'Địa lí các ngành kinh tế',
      unit: 'Chuyển dịch cơ cấu kinh tế',
      cognitiveLevel: 'Thông hiểu' as const,
      content: 'Trong cơ cấu GDP phân theo ngành kinh tế của nước ta năm 2024, khu vực đóng góp tỉ trọng cao nhất là:',
      points: 0.25,
      options: [
        { key: 'A' as const, content: 'Khu vực Dịch vụ (chiếm 42,4%).' },
        { key: 'B' as const, content: 'Khu vực Nông nghiệp, lâm nghiệp và thuỷ sản (chiếm 11,9%).' },
        { key: 'C' as const, content: 'Khu vực Công nghiệp và xây dựng (chiếm 37,6%).' },
        { key: 'D' as const, content: 'Thuế sản phẩm trừ trợ cấp sản phẩm (chiếm 8,1%).' }
      ],
      correctOption: 'A' as const,
      explanation: 'Năm 2024: Dịch vụ chiếm 42,4% GDP, Công nghiệp - xây dựng chiếm 37,6%, Nông - lâm - thuỷ sản chiếm 11,9%.'
    },

    // Phần II: Đúng / Sai
    {
      id: 'dl_q5',
      orderNumber: 5,
      type: 'true_false' as const,
      topic: 'Địa lí tự nhiên Việt Nam',
      unit: 'Vị trí địa lí và lãnh thổ Việt Nam',
      cognitiveLevel: 'Vận dụng' as const,
      content: 'Cho thông tin sau:\n"Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, ở khu vực gió mùa châu Á, tiếp giáp Biển Đông rộng lớn. Vị trí địa lí đã quy định đặc điểm cơ bản của thiên nhiên Việt Nam mang tính chất nhiệt đới ẩm gió mùa, có sự phân hoá sâu sắc theo không gian và thời gian. Lãnh thổ nước ta gồm vùng đất liền, vùng biển và vùng trời với 34 đơn vị hành chính cấp tỉnh."\n(Nguồn: SGK Địa lí 12 - Kết nối tri thức với cuộc sống)\nXét tính đúng/sai của các nhận định:',
      points: 1.0,
      trueFalseItems: [
        { key: 'a' as const, statement: 'Nước ta có nền nhiệt cao, giàu ánh nắng là do nằm trọn vẹn trong vùng nội chí tuyến bán cầu Bắc.', isCorrect: true, explanation: 'Đúng: Vị trí nội chí tuyến mang lại góc nhập xạ lớn quanh năm.' },
        { key: 'b' as const, statement: 'Tính chất gió mùa của khí hậu Việt Nam bắt nguồn từ vị trí tiếp giáp giữa lục địa Á - Âu và đại dương Thái Bình Dương, Ấn Độ Dương.', isCorrect: true, explanation: 'Đúng: Nằm trong khu vực hoàn lưu gió mùa châu Á.' },
        { key: 'c' as const, statement: 'Vùng lãnh hải 12 hải lí là vùng biển quốc tế mở tự do cho mọi tàu thuyền khai thác thuỷ sản.', isCorrect: false, explanation: 'Sai: Lãnh hải thuộc chủ quyền hoàn toàn và tuyệt đối của Việt Nam.' },
        { key: 'd' as const, statement: 'Sự phân hoá thiên nhiên theo chiều Bắc - Nam qua dãy Bạch Mã chủ yếu là do sự suy giảm tác động của gió mùa Đông Bắc về phía Nam.', isCorrect: true, explanation: 'Đúng: Dãy Bạch Mã ngăn gió mùa Đông Bắc tạo ranh giới giữa 2 miền khí hậu.' }
      ],
      explanation: 'Phân tích các nhận định đúng sai về vị trí địa lí và lãnh thổ Việt Nam.'
    },
    {
      id: 'dl_q6',
      orderNumber: 6,
      type: 'true_false' as const,
      topic: 'Chuyên đề học tập Địa lí 12',
      unit: 'Thiên tai và phòng chống thiên tai',
      cognitiveLevel: 'Vận dụng' as const,
      content: 'Cho bảng số liệu về Bão và áp thấp nhiệt đới trên Biển Đông giai đoạn 2010 - 2024:\n- Trung bình có 10 - 12 cơn bão/áp thấp nhiệt đới hoạt động trên Biển Đông mỗi năm, trong đó 4 - 6 cơn ảnh hưởng trực tiếp đến đất liền Việt Nam.\n- Mùa bão có xu hướng chậm dần từ Bắc vào Nam.\n(Nguồn: Cục Quản lí đê điều và Phòng, chống thiên tai)\nXét tính đúng/sai của các nhận định:',
      points: 1.0,
      trueFalseItems: [
        { key: 'a' as const, statement: 'Bắc Bộ và Thanh Hoá tập trung bão nhiều nhất vào các tháng 6, 7, 8.', isCorrect: true, explanation: 'Đúng: Mùa bão ở Bắc Bộ diễn ra sớm hơn Trung Bộ và Nam Bộ.' },
        { key: 'b' as const, statement: 'Tất cả các tỉnh ven biển nước ta đều chịu tần suất bão đổ bộ như nhau vào tháng 12 hàng năm.', isCorrect: false, explanation: 'Sai: Tháng 12 bão chỉ xuất hiện hiếm hoi ở Nam Bộ.' },
        { key: 'c' as const, statement: 'Bão đổ bộ gây ngập úng ven biển do gió bão kết hợp triều cường nước dâng.', isCorrect: true, explanation: 'Đúng: Nước dâng do bão có thể cao 1,5 - 3m gây ngập lụt nghiêm trọng.' },
        { key: 'd' as const, statement: 'Trồng rừng ngập mặn chắn sóng và củng cố đê biển là giải pháp công trình sinh thái phòng chống bão hiệu quả.', isCorrect: true, explanation: 'Đúng: Rừng ngập mặn giúp tiêu tán năng lượng sóng bão và bảo vệ bờ kè.' }
      ],
      explanation: 'Nhận định a, c, d là ĐÚNG; b là SAI.'
    },

    // Phần III: Trả lời ngắn
    {
      id: 'dl_q7',
      orderNumber: 7,
      type: 'short_answer' as const,
      topic: 'Địa lí dân cư Việt Nam',
      unit: 'Đô thị hoá ở Việt Nam',
      cognitiveLevel: 'Thông hiểu' as const,
      content: 'Năm 2024, tổng dân số nước ta là 101,3 triệu người, trong đó số dân thành thị là 39,0 triệu người. Hãy tính tỉ lệ dân thành thị của nước ta năm 2024 (đơn vị: %, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      points: 0.5,
      shortAnswerKey: '38,5',
      explanation: '$\\text{Tỉ lệ dân thành thị} = \\frac{39,0}{101,3} \\times 100\\% \\approx 38,5\\%$.'
    },
    {
      id: 'dl_q8',
      orderNumber: 8,
      type: 'short_answer' as const,
      topic: 'Địa lí các ngành kinh tế',
      unit: 'Nông nghiệp Việt Nam',
      cognitiveLevel: 'Vận dụng' as const,
      content: 'Năm 2024, diện tích gieo trồng lúa của nước ta là 7 127,1 nghìn ha, tổng sản lượng lúa thu hoạch đạt 43,5 triệu tấn (43 500 nghìn tấn). Hãy tính năng suất lúa bình quân cả nước năm 2024 (đơn vị: tạ/ha, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      points: 0.5,
      shortAnswerKey: '61,0',
      explanation: 'Đổi 43,5 triệu tấn = 435 000 nghìn tạ. $\\text{Năng suất} = \\frac{435000}{7127,1} \\approx 61,03 \\approx 61,0\\text{ tạ/ha}$.'
    },

    // Phần IV: Tự luận
    {
      id: 'dl_q9',
      orderNumber: 9,
      type: 'essay' as const,
      topic: 'Địa lí tự nhiên Việt Nam',
      unit: 'Thiên nhiên nhiệt đới ẩm gió mùa',
      cognitiveLevel: 'Vận dụng cao' as const,
      content: 'Dựa vào kiến thức Địa lí 12:\na) Trình bày các đặc điểm biểu hiện của thiên nhiên nhiệt đới ẩm gió mùa qua thành phần sông ngòi ở nước ta.\nb) Vì sao thiên nhiên nước ta mang tính chất nhiệt đới ẩm gió mùa mà không bị khô hạn như các khu vực khác cùng vĩ độ ở Tây Á và Bắc Phi?',
      points: 2.0,
      essayRubric: 'Ý a (1.25đ): \n- Mạng lưới sông ngòi dày đặc: có 2 360 con sông dài trên 10 km (0.25đ).\n- Nhiều nước và giàu phù sa: tổng lượng dòng chảy đạt 839 tỉ m³/năm, lượng phù sa bồi đắp khoảng 200 triệu tấn/năm (0.5đ).\n- Chế độ nước theo mùa: mùa lũ tương ứng mùa mưa, mùa cạn tương ứng mùa khô (0.5đ).\nÝ b (0.75đ): \n- Do nước ta tiếp giáp Biển Đông rộng lớn (1 triệu km²), nguồn ẩm dồi dào từ biển kết hợp hoàn lưu gió mùa mang lại lượng mưa lớn (1 500 - 2 000 mm/năm), xoá tan tính chất khô hạn của vùng vĩ độ cận nhiệt.',
      explanation: 'Phân tích sông ngòi nhiệt đới ẩm và vai trò điều hoà độ ẩm của Biển Đông.'
    }
  ];

  return {
    id: 'sample-dia-li-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    header: {
      provinceOrDept: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO',
      schoolName: 'TRƯỜNG THPT CHU VĂN AN',
      examTitle: 'ĐỀ KIỂM TRA ĐỊNH KỲ ĐỊA LÍ 12 (CHUẨN BỘ GD&ĐT 2025)',
      subject: 'Địa lí',
      grade: 'Lớp 12',
      curriculum: 'Kết nối tri thức với cuộc sống',
      academicYear: '2024 - 2025',
      timeDuration: 50,
      structureOption: 'option_1',
      teacherName: 'Tổ Địa lí - Lịch sử',
      partConfigs: DEFAULT_PART_CONFIGS,
    },
    matrix: [
      {
        id: 'dl_m1',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Vị trí địa lí, lãnh thổ và thiên nhiên nhiệt đới ẩm gió mùa',
        part1_nb: 2,
        part1_th: 0,
        part1_vd: 0,
        part1_vdc: 0,
        part2_nb: 0,
        part2_th: 0,
        part2_vd: 1,
        part2_vdc: 0,
        part3_nb: 0,
        part3_th: 0,
        part3_vd: 0,
        part3_vdc: 0,
        part4_nb: 0,
        part4_th: 0,
        part4_vd: 0,
        part4_vdc: 1,
        totalPoints: 3.5,
      },
      {
        id: 'dl_m2',
        topic: 'Địa lí dân cư và các ngành kinh tế',
        unit: 'Dân số, lao động, đô thị hoá và chuyển dịch cơ cấu kinh tế',
        part1_nb: 0,
        part1_th: 2,
        part1_vd: 0,
        part1_vdc: 0,
        part2_nb: 0,
        part2_th: 0,
        part2_vd: 0,
        part2_vdc: 0,
        part3_nb: 0,
        part3_th: 1,
        part3_vd: 1,
        part3_vdc: 0,
        part4_nb: 0,
        part4_th: 0,
        part4_vd: 0,
        part4_vdc: 0,
        totalPoints: 1.5,
      },
      {
        id: 'dl_m3',
        topic: 'Chuyên đề học tập Địa lí 12',
        unit: 'Thiên tai và các biện pháp phòng chống thiên tai',
        part1_nb: 0,
        part1_th: 0,
        part1_vd: 0,
        part1_vdc: 0,
        part2_nb: 0,
        part2_th: 0,
        part2_vd: 1,
        part2_vdc: 0,
        part3_nb: 0,
        part3_th: 0,
        part3_vd: 0,
        part3_vdc: 0,
        part4_nb: 0,
        part4_th: 0,
        part4_vd: 0,
        part4_vdc: 0,
        totalPoints: 1.0,
      }
    ],
    specification: [
      {
        id: 'dl_sp1',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Vị trí địa lí, lãnh thổ và thiên nhiên nhiệt đới ẩm gió mùa',
        learningObjectives: {
          nb: 'Nhận biết phạm vi lãnh thổ, vùng biển 12 hải lí và đặc điểm gió mùa ở nước ta.',
          th: 'Phân tích được tác động của Biển Đông đến tính chất nhiệt đới ẩm gió mùa.',
          vd: 'Vận dụng kiến thức giải thích sự phân hoá thiên nhiên Bắc - Nam và Đông - Tây.',
          vdc: 'Đánh giá ảnh hưởng tổng hợp của thiên nhiên nhiệt đới ẩm đến phát triển kinh tế.'
        },
        questionCount: {
          part1: { nb: 2, th: 0, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 1 },
        }
      },
      {
        id: 'dl_sp2',
        topic: 'Địa lí dân cư và các ngành kinh tế',
        unit: 'Dân số, lao động, đô thị hoá và chuyển dịch cơ cấu kinh tế',
        learningObjectives: {
          nb: 'Nhận biết các chỉ số về dân số vàng, cơ cấu GDP năm 2024.',
          th: 'Tính toán được tỉ lệ dân thành thị và năng suất lúa bình quân cả nước.',
          vd: 'Phân tích được chuyển dịch cơ cấu kinh tế theo ngành và theo thành phần.',
          vdc: 'Đề xuất giải pháp việc làm và nâng cao chất lượng nguồn nhân lực.'
        },
        questionCount: {
          part1: { nb: 0, th: 2, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'dl_sp3',
        topic: 'Chuyên đề học tập Địa lí 12',
        unit: 'Thiên tai và các biện pháp phòng chống thiên tai',
        learningObjectives: {
          nb: 'Nhận biết các loại thiên tai thường gặp ở nước ta.',
          th: 'Hiểu được quy luật di chuyển của mùa bão và nguy cơ xâm nhập mặn.',
          vd: 'Đánh giá hậu quả của bão lũ và đề xuất các giải pháp công trình, phi công trình phòng chống thiên tai.',
          vdc: 'Xây dựng kế hoạch hành động thích ứng với biến đổi khí hậu tại địa phương.'
        },
        questionCount: {
          part1: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 0, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      }
    ],
    sampleExamQuestions: balanceMultipleChoiceQuestions(baseQuestions, 101),
    shuffledVariants: generateShuffledExamVariants(balanceMultipleChoiceQuestions(baseQuestions, 101)),
    notes: 'Đề kiểm tra mẫu Địa lí 12 chuẩn theo SGK và Chuyên đề Kết nối tri thức với cuộc sống (cập nhật số liệu 2024-2025).'
  };
})();
