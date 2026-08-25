import { SubjectQuestionBank } from './bankTypes';

export const SINH_HOC_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['di truyền', 'adn', 'gen'],
      level: 'Nhận biết',
      content: 'Đơn phân cấu tạo nên phân tử ADN là:',
      options: [
        { key: 'A', content: 'Nucleotide (A, T, G, C).' },
        { key: 'B', content: 'Amino acid.' },
        { key: 'C', content: 'Glucose.' },
        { key: 'D', content: 'Fatty acid.' }
      ],
      correctOption: 'A',
      explanation: 'ADN được cấu tạo theo nguyên tắc đa phân, đơn phân là 4 loại nucleotide: A, T, G, C.'
    },
    {
      topicKeywords: ['mã di truyền', 'phiên mã'],
      level: 'Nhận biết',
      content: 'Bộ ba nào sau đây mang tín hiệu mở đầu quá trình dịch mã trên mARN và mã hóa cho methionine ở sinh vật nhân thực?',
      options: [
        { key: 'A', content: '5\'AUG3\'' },
        { key: 'B', content: '5\'UAA3\'' },
        { key: 'C', content: '5\'UAG3\'' },
        { key: 'D', content: '5\'UGA3\'' }
      ],
      correctOption: 'A',
      explanation: '5\'AUG3\' là codon mở đầu trên mARN, quy định Met ở sinh vật nhân thực và fMet ở sinh vật nhân sơ.'
    },
    {
      topicKeywords: ['đột biến', 'nhiễm sắc thể'],
      level: 'Thông hiểu',
      content: 'Hội chứng Đao ở người do dạng đột biến số lượng nhiễm sắc thể nào sau đây gây ra?',
      options: [
        { key: 'A', content: 'Thể ba ở cặp nhiễm sắc thể số 21 (2n + 1).' },
        { key: 'B', content: 'Thể một ở cặp nhiễm sắc thể giới tính (2n - 1).' },
        { key: 'C', content: 'Thể tam bội (3n).' },
        { key: 'D', content: 'Thể tứ bội (4n).' }
      ],
      correctOption: 'A',
      explanation: 'Hội chứng Đao xuất hiện do có 3 nhiễm sắc thể ở cặp số 21.'
    },
    {
      topicKeywords: ['sinh thái', 'quần thể'],
      level: 'Thông hiểu',
      content: 'Trong một quần xã sinh vật, mối quan hệ giữa nấm và vi khuẩn lam/tảo trong địa y thuộc kiểu quan hệ nào?',
      options: [
        { key: 'A', content: 'Cộng sinh.' },
        { key: 'B', content: 'Hội sinh.' },
        { key: 'C', content: 'Kí sinh.' },
        { key: 'D', content: 'Cạnh tranh.' }
      ],
      correctOption: 'A',
      explanation: 'Cả hai loài cùng có lợi và liên hệ chặt chẽ không thể tách rời là quan hệ cộng sinh.'
    }
  ],
  tf: [
    {
      topicKeywords: ['di truyền', 'lai một cặp'],
      level: 'Vận dụng',
      content: 'Ở một loài thực vật, alen $A$ quy định thân cao trội hoàn toàn so với alen $a$ quy định thân thấp. Cho cây thân cao dị hợp $Aa$ tự thụ phấn qua 1 thế hệ. Xét tính đúng/sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'Tỉ lệ phân li kiểu gen ở thế hệ $F_1$ là $1AA : 2Aa : 1aa$.', isCorrect: true, explanation: 'Đúng (Mức Biết): $Aa \\times Aa \\implies 1/4 AA : 2/4 Aa : 1/4 aa$.' },
        { key: 'b', statement: 'Tỉ lệ kiểu hình ở thế hệ $F_1$ là 1 cây thân cao : 1 cây thân thấp.', isCorrect: false, explanation: 'Sai (Mức Hiểu): Tỉ lệ kiểu hình là 3 thân cao : 1 thân thấp (75% cao : 25% thấp).' },
        { key: 'c', statement: 'Trong số các cây thân cao ở $F_1$, cây có kiểu gen đồng hợp chiếm tỉ lệ $\\frac{1}{3}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Số cây cao gồm $1AA$ và $2Aa \\implies AA = 1/3$.' },
        { key: 'd', statement: 'Nếu cho toàn bộ các cây thân cao $F_1$ tự thụ phấn thì tỉ lệ cây thân thấp ở đời sau là $\\frac{1}{6}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng cao): Chỉ có $2/3 Aa$ tự thụ sinh $aa$ với tỉ lệ $1/4 \\implies 2/3 \\times 1/4 = 1/6 aa$.' }
      ],
      explanation: 'Mệnh đề a, c, d là ĐÚNG; b là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['nucleotide', 'adn'],
      level: 'Thông hiểu',
      content: 'Một phân tử ADN có tổng số 3000 nucleotide, trong đó số nucleotide loại Adenine (A) là 600. Số nucleotide loại Guanine (G) của phân tử ADN này là bao nhiêu? Khi trả lời, chỉ ghi số.',
      key: '900',
      explanation: '$G = \\frac{N}{2} - A = 1500 - 600 = 900$.'
    },
    {
      topicKeywords: ['bộ ba', 'mã di truyền'],
      level: 'Nhận biết',
      content: 'Trong bảng mã di truyền có tổng cộng bao nhiêu bộ ba mã hóa cho các amino acid (không tính 3 bộ ba kết thúc)? Khi trả lời, chỉ ghi số.',
      key: '61',
      explanation: 'Có 64 bộ ba, trừ 3 bộ ba kết thúc (UAA, UAG, UGA) còn lại 61 bộ ba mã hóa amino acid.'
    }
  ],
  essay: [
    {
      topicKeywords: ['quần thể', 'cân bằng hardy-weinberg'],
      level: 'Vận dụng cao',
      content: 'Một quần thể động vật ngẫu phối có cấu trúc di truyền ban đầu: $0,49 AA + 0,42 Aa + 0,09 aa = 1$.\na) Xác định tần số các alen $A$ và $a$ trong quần thể.\nb) Quần thể trên đã đạt trạng thái cân bằng di truyền Hardy - Weinberg chưa? Vì sao?',
      essayRubric: 'Ý a (1.0đ): Tần số alen $p(A) = 0,49 + \\frac{0,42}{2} = 0,7$; $q(a) = 0,09 + \\frac{0,42}{2} = 0,3$.\nÝ b (1.0đ): Ta có $p^2 = 0,7^2 = 0,49$; $2pq = 2(0,7)(0,3) = 0,42$; $q^2 = 0,3^2 = 0,09$. Cấu trúc quần thể trùng khớp $p^2 AA + 2pq Aa + q^2 aa = 1$ nên quần thể đang ở trạng thái cân bằng di truyền.',
      explanation: 'Tính tần số alen và kiểm tra điều kiện cân bằng Hardy-Weinberg.'
    }
  ]
};
