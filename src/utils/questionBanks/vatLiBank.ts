import { SubjectQuestionBank } from './bankTypes';

export const VAT_LI_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['dao động', 'điều hoà'],
      level: 'Nhận biết',
      content: 'Một vật dao động điều hoà theo phương trình $x = A\\cos(\\omega t + \\varphi)$. Đại lượng $\\omega$ được gọi là:',
      options: [
        { key: 'A', content: 'Tần số góc của dao động.' },
        { key: 'B', content: 'Biên độ dao động.' },
        { key: 'C', content: 'Pha ban đầu của dao động.' },
        { key: 'D', content: 'Chu kì dao động.' }
      ],
      correctOption: 'A',
      explanation: 'Trong phương trình dao động điều hoà, $\\omega$ là tần số góc (đơn vị: rad/s).'
    },
    {
      topicKeywords: ['sóng cơ', 'bước sóng'],
      level: 'Thông hiểu',
      content: 'Một sóng cơ lan truyền với vận tốc $v = 12\\text{ m/s}$ và tần số $f = 60\\text{ Hz}$. Bước sóng $\\lambda$ của sóng là:',
      options: [
        { key: 'A', content: '$0,2\\text{ m}$' },
        { key: 'B', content: '$5\\text{ m}$' },
        { key: 'C', content: '$720\\text{ m}$' },
        { key: 'D', content: '$2\\text{ m}$' }
      ],
      correctOption: 'A',
      explanation: 'Bước sóng $\\lambda = \\frac{v}{f} = \\frac{12}{60} = 0,2\\text{ m}$.'
    },
    {
      topicKeywords: ['nhiệt học', 'khí lí tưởng'],
      level: 'Nhận biết',
      content: 'Trong quá trình đẳng nhiệt của một lượng khí lí tưởng xác định, áp suất $p$ và thể tích $V$ tỉ lệ nghịch với nhau. Định luật này được gọi là:',
      options: [
        { key: 'A', content: 'Định luật Boyle.' },
        { key: 'B', content: 'Định luật Charles.' },
        { key: 'C', content: 'Định luật Gay-Lussac.' },
        { key: 'D', content: 'Định luật Joule - Lenz.' }
      ],
      correctOption: 'A',
      explanation: 'Định luật Boyle: Trong quá trình đẳng nhiệt, tích $p \\cdot V = \\text{hằng số}$.'
    },
    {
      topicKeywords: ['dòng điện', 'xoay chiều'],
      level: 'Thông hiểu',
      content: 'Điện áp xoay chiều $u = 220\\sqrt{2}\\cos(100\\pi t)\\text{ V}$ có giá trị hiệu dụng bằng:',
      options: [
        { key: 'A', content: '$220\\text{ V}$' },
        { key: 'B', content: '$220\\sqrt{2}\\text{ V}$' },
        { key: 'C', content: '$110\\text{ V}$' },
        { key: 'D', content: '$380\\text{ V}$' }
      ],
      correctOption: 'A',
      explanation: 'Giá trị hiệu dụng $U = \\frac{U_0}{\\sqrt{2}} = \\frac{220\\sqrt{2}}{\\sqrt{2}} = 220\\text{ V}$.'
    }
  ],
  tf: [
    {
      topicKeywords: ['dao động', 'con lắc lò xo'],
      level: 'Vận dụng',
      content: 'Một con lắc lò xo gồm vật nhỏ có khối lượng $m = 100\\text{ g}$ và lò xo có độ cứng $k = 40\\text{ N/m}$ dao động điều hòa trên mặt phẳng ngang không ma sát với biên độ $A = 5\\text{ cm}$. Lấy $\\pi^2 = 10$. Xét tính đúng/sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'Tần số góc của con lắc là $\\omega = 20\\text{ rad/s}$.', isCorrect: true, explanation: 'Đúng (Mức Biết): $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{40}{0,1}} = 20\\text{ rad/s}$.' },
        { key: 'b', statement: 'Chu kì dao động của con lắc là $T = 0,5\\text{ s}$.', isCorrect: false, explanation: 'Sai (Mức Hiểu): $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{20} = 0,1\\pi \\approx 0,314\\text{ s} \\neq 0,5\\text{ s}$.' },
        { key: 'c', statement: 'Tốc độ cực đại của vật trong quá trình dao động là $v_{max} = 1\\text{ m/s}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): $v_{max} = \\omega A = 20 \\times 0,05 = 1\\text{ m/s}$.' },
        { key: 'd', statement: 'Cơ năng của con lắc lò xo bằng $0,05\\text{ J}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): $W = \\frac{1}{2}kA^2 = \\frac{1}{2}(40)(0,05)^2 = 0,05\\text{ J}$.' }
      ],
      explanation: 'Mệnh đề a, c, d là ĐÚNG; b là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['chu kì', 'dao động'],
      level: 'Thông hiểu',
      content: 'Một vật dao động điều hoà thực hiện được 20 dao động toàn phần trong thời gian 10 giây. Tính chu kì dao động $T$ (đơn vị: giây). Khi trả lời, chỉ ghi số.',
      key: '0,5',
      explanation: '$T = \\frac{t}{N} = \\frac{10}{20} = 0,5\\text{ s}$.'
    },
    {
      topicKeywords: ['cơ năng', 'nhiệt học'],
      level: 'Vận dụng',
      content: 'Một lượng khí nhận nhiệt lượng $Q = 150\\text{ J}$ và thực hiện công $A = 100\\text{ J}$ lên môi trường ngoài. Tính độ biến thiên nội năng $\\Delta U$ của lượng khí (đơn vị: J). Khi trả lời, chỉ ghi số.',
      key: '50',
      explanation: 'Theo nguyên lí I nhiệt động lực học: $\\Delta U = Q + A\' = 150 - 100 = 50\\text{ J}$.'
    }
  ],
  essay: [
    {
      topicKeywords: ['điện xoay chiều', 'mạch rlc'],
      level: 'Vận dụng cao',
      content: 'Cho đoạn mạch xoay chiều nối tiếp gồm điện trở thuần $R = 40\\ \\Omega$, cuộn cảm thuần có độ tự cảm $L = \\frac{0,4}{\\pi}\\text{ H}$ và tụ điện có điện dung $C = \\frac{10^{-4}}{\\pi}\\text{ F}$. Đặt vào hai đầu đoạn mạch điện áp xoay chiều $u = 120\\sqrt{2}\\cos(100\\pi t)\\text{ V}$.\na) Tính tổng trở $Z$ của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện $i(t)$ tức thời chạy trong mạch.',
      essayRubric: 'Ý a (1.0đ): $Z_L = \\omega L = 100\\pi \\cdot \\frac{0,4}{\\pi} = 40\\ \\Omega$; $Z_C = \\frac{1}{\\omega C} = 100\\ \\Omega$. Tổng trở $Z = \\sqrt{R^2 + (Z_L - Z_C)^2} = \\sqrt{40^2 + (-60)^2} \\approx 72,11\\ \\Omega$.\nÝ b (1.0đ): Cường độ dòng điện cực đại $I_0 = \\frac{U_0}{Z}$, tính độ lệch pha $\\tan\\varphi = \\frac{Z_L - Z_C}{R}$, viết đúng phương trình $i(t)$.',
      explanation: 'Giải bài toán mạch RLC nối tiếp xác định tổng trở và biểu thức dòng điện.'
    }
  ]
};
