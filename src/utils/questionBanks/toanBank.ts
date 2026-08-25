import { SubjectQuestionBank } from './bankTypes';

export const TOAN_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['hàm số', 'đơn điệu', 'đạo hàm'],
      level: 'Nhận biết',
      content: 'Cho hàm số $y = f(x)$ có bảng biến thiên với $f\'(x) > 0$ trên $(-1; 3)$ và $f\'(x) < 0$ trên $(-\\infty; -1) \\cup (3; +\\infty)$. Hàm số đã cho đồng biến trên khoảng nào dưới đây?',
      options: [
        { key: 'A', content: '$(-1; 3)$' },
        { key: 'B', content: '$(3; +\\infty)$' },
        { key: 'C', content: '$(-\\infty; -1)$' },
        { key: 'D', content: '$(0; 4)$' }
      ],
      correctOption: 'A',
      explanation: 'Hàm số đồng biến trên khoảng $(-1; 3)$ do đạo hàm $f\'(x) > 0$ trên khoảng này.'
    },
    {
      topicKeywords: ['cực trị', 'hàm số'],
      level: 'Nhận biết',
      content: 'Điểm cực đại của đồ thị hàm số $y = x^3 - 3x + 2$ là:',
      options: [
        { key: 'A', content: '$(-1; 4)$' },
        { key: 'B', content: '$(1; 0)$' },
        { key: 'C', content: '$(0; 2)$' },
        { key: 'D', content: '$(2; 4)$' }
      ],
      correctOption: 'A',
      explanation: '$y\' = 3x^2 - 3 = 0 \\iff x = \\pm 1$. Bảng xét dấu: $x = -1$ là điểm cực đại, $y(-1) = 4 \\implies (-1; 4)$.'
    },
    {
      topicKeywords: ['tiệm cận', 'hàm số'],
      level: 'Thông hiểu',
      content: 'Đồ thị hàm số $y = \\frac{2x + 1}{x - 3}$ có đường tiệm cận đứng và tiệm cận ngang lần lượt là:',
      options: [
        { key: 'A', content: '$x = 3$ và $y = 2$' },
        { key: 'B', content: '$x = -3$ và $y = 2$' },
        { key: 'C', content: '$x = 2$ và $y = 3$' },
        { key: 'D', content: '$y = 3$ và $x = 2$' }
      ],
      correctOption: 'A',
      explanation: 'Mẫu số bằng 0 tại $x = 3$ nên tiệm cận đứng $x = 3$; bậc tử bằng bậc mẫu nên tiệm cận ngang $y = 2/1 = 2$.'
    },
    {
      topicKeywords: ['vectơ', 'oxyz', 'toạ độ'],
      level: 'Nhận biết',
      content: 'Trong không gian $Oxyz$, cho vectơ $\\vec{a} = 3\\vec{i} - 2\\vec{j} + 4\\vec{k}$. Toạ độ của vectơ $\\vec{a}$ là:',
      options: [
        { key: 'A', content: '$(3; -2; 4)$' },
        { key: 'B', content: '$(3; 2; 4)$' },
        { key: 'C', content: '$(-2; 3; 4)$' },
        { key: 'D', content: '$(4; -2; 3)$' }
      ],
      correctOption: 'A',
      explanation: 'Theo định nghĩa toạ độ vectơ: $\\vec{a} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\implies \\vec{a} = (3; -2; 4)$.'
    },
    {
      topicKeywords: ['mặt phẳng', 'oxyz'],
      level: 'Thông hiểu',
      content: 'Trong không gian $Oxyz$, mặt phẳng $(P)$ đi qua điểm $M(1; 0; -2)$ và có vectơ pháp tuyến $\\vec{n} = (2; -1; 3)$ có phương trình là:',
      options: [
        { key: 'A', content: '$2x - y + 3z + 4 = 0$' },
        { key: 'B', content: '$2x - y + 3z - 4 = 0$' },
        { key: 'C', content: '$x - 2z + 4 = 0$' },
        { key: 'D', content: '$2x - y + 3z = 0$' }
      ],
      correctOption: 'A',
      explanation: 'Phương trình $(P): 2(x - 1) - 1(y - 0) + 3(z + 2) = 0 \\iff 2x - y + 3z + 4 = 0$.'
    },
    {
      topicKeywords: ['giá trị lớn nhất', 'nhỏ nhất', 'hàm số'],
      level: 'Thông hiểu',
      content: 'Giá trị nhỏ nhất của hàm số $y = x^4 - 2x^2 + 3$ trên đoạn $[0; 2]$ bằng:',
      options: [
        { key: 'A', content: '$2$' },
        { key: 'B', content: '$3$' },
        { key: 'C', content: '$11$' },
        { key: 'D', content: '$0$' }
      ],
      correctOption: 'A',
      explanation: '$y\' = 4x^3 - 4x = 0 \\iff x = 0, x = 1, x = -1$. Trên $[0; 2]$: $y(0) = 3, y(1) = 2, y(2) = 11$. Vậy $\\min = 2$.'
    },
    {
      topicKeywords: ['xác suất', 'thống kê'],
      level: 'Vận dụng',
      content: 'Gieo một con súc sắc cân đối và đồng chất hai lần. Xác suất để tổng số chấm xuất hiện trong hai lần gieo bằng 7 là:',
      options: [
        { key: 'A', content: '$\\frac{1}{6}$' },
        { key: 'B', content: '$\\frac{1}{12}$' },
        { key: 'C', content: '$\\frac{7}{36}$' },
        { key: 'D', content: '$\\frac{5}{36}$' }
      ],
      correctOption: 'A',
      explanation: 'Không gian mẫu $n(\\Omega) = 36$. Các cặp tổng bằng 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) -> 6 biến cố. $P = 6/36 = 1/6$.'
    },
    {
      topicKeywords: ['tích phân', 'nguyên hàm'],
      level: 'Thông hiểu',
      content: 'Biết $\\int_1^2 f(x) dx = 3$ và $\\int_1^2 g(x) dx = -2$. Khi đó $\\int_1^2 [2f(x) + 3g(x)] dx$ bằng:',
      options: [
        { key: 'A', content: '$0$' },
        { key: 'B', content: '$12$' },
        { key: 'C', content: '$-5$' },
        { key: 'D', content: '$5$' }
      ],
      correctOption: 'A',
      explanation: '$I = 2(3) + 3(-2) = 6 - 6 = 0$.'
    },
    {
      topicKeywords: ['mặt cầu', 'oxyz'],
      level: 'Nhận biết',
      content: 'Trong không gian $Oxyz$, tâm và bán kính của mặt cầu $(S): (x - 2)^2 + (y + 1)^2 + (z - 4)^2 = 25$ lần lượt là:',
      options: [
        { key: 'A', content: '$I(2; -1; 4)$ và $R = 5$' },
        { key: 'B', content: '$I(-2; 1; -4)$ và $R = 5$' },
        { key: 'C', content: '$I(2; -1; 4)$ và $R = 25$' },
        { key: 'D', content: '$I(-2; 1; -4)$ và $R = 25$' }
      ],
      correctOption: 'A',
      explanation: 'Tâm $I(a; b; c) = (2; -1; 4)$ và bán kính $R = \\sqrt{25} = 5$.'
    },
    {
      topicKeywords: ['đường thẳng', 'oxyz'],
      level: 'Thông hiểu',
      content: 'Trong không gian $Oxyz$, phương trình tham số của đường thẳng $d$ đi qua $A(1; 2; -3)$ và nhận $\\vec{u} = (2; -1; 4)$ làm VTCP là:',
      options: [
        { key: 'A', content: '$\\begin{cases} x = 1 + 2t \\\\ y = 2 - t \\\\ z = -3 + 4t \\end{cases}$' },
        { key: 'B', content: '$\\begin{cases} x = 2 + t \\\\ y = -1 + 2t \\\\ z = 4 - 3t \\end{cases}$' },
        { key: 'C', content: '$\\begin{cases} x = 1 - 2t \\\\ y = 2 - t \\\\ z = -3 - 4t \\end{cases}$' },
        { key: 'D', content: '$\\begin{cases} x = 1 + t \\\\ y = 2 + 2t \\\\ z = -3 - t \\end{cases}$' }
      ],
      correctOption: 'A',
      explanation: 'Phương trình tham số qua $(x_0; y_0; z_0)$ với VTCP $(a; b; c)$: $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$.'
    },
    {
      topicKeywords: ['xác suất', 'biến cố'],
      level: 'Nhận biết',
      content: 'Cho hai biến cố xung khắc $A$ và $B$ với $P(A) = 0,3$ và $P(B) = 0,4$. Xác suất $P(A \\cup B)$ bằng:',
      options: [
        { key: 'A', content: '$0,7$' },
        { key: 'B', content: '$0,12$' },
        { key: 'C', content: '$0,1$' },
        { key: 'D', content: '$0,58$' }
      ],
      correctOption: 'A',
      explanation: 'Vì $A$ và $B$ xung khắc nên $P(A \\cup B) = P(A) + P(B) = 0,3 + 0,4 = 0,7$.'
    },
    {
      topicKeywords: ['mũ', 'logarit'],
      level: 'Nhận biết',
      content: 'Tập nghiệm của phương trình $\\log_2(x - 1) = 3$ là:',
      options: [
        { key: 'A', content: '$S = \\{9\\}$' },
        { key: 'B', content: '$S = \\{7\\}$' },
        { key: 'C', content: '$S = \\{8\\}$' },
        { key: 'D', content: '$S = \\{10\\}$' }
      ],
      correctOption: 'A',
      explanation: 'ĐK: $x > 1$. Phương trình tương đương $x - 1 = 2^3 = 8 \\iff x = 9$.'
    }
  ],
  tf: [
    {
      topicKeywords: ['hàm số', 'khảo sát'],
      level: 'Vận dụng',
      content: 'Cho hàm số $y = f(x) = \\frac{x^2 - 3x + 6}{x - 1}$ xác định trên $\\mathbb{R} \\setminus \\{1\\}$. Xét tính đúng/sai của các mệnh đề sau:',
      items: [
        { key: 'a', statement: 'Đạo hàm của hàm số là $f\'(x) = \\frac{x^2 - 2x - 3}{(x-1)^2}$.', isCorrect: true, explanation: 'Đúng (Mức Biết): $f\'(x) = \\frac{(2x-3)(x-1) - (x^2-3x+6)}{(x-1)^2} = \\frac{x^2-2x-3}{(x-1)^2}$.' },
        { key: 'b', statement: 'Hàm số đạt cực đại tại điểm $x = 3$.', isCorrect: false, explanation: 'Sai (Mức Hiểu): Nghiệm $f\'(x)=0$ là $x = -1$ (cực đại) và $x = 3$ (cực tiểu).' },
        { key: 'c', statement: 'Đồ thị hàm số có đường tiệm cận xiên là $y = x - 2$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Ta có $y = x - 2 + \\frac{4}{x - 1} \\implies$ tiệm cận xiên $y = x - 2$.' },
        { key: 'd', statement: 'Giá trị nhỏ nhất của hàm số trên khoảng $(1; +\\infty)$ bằng $3$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Tại $x = 3 \\in (1; +\\infty)$, $f(3) = \\frac{9 - 9 + 6}{2} = 3$.' }
      ],
      explanation: 'Mệnh đề a, c, d là ĐÚNG; b là SAI.'
    },
    {
      topicKeywords: ['oxyz', 'hình học'],
      level: 'Thông hiểu',
      content: 'Trong không gian $Oxyz$, cho bốn điểm $A(1; 0; 0)$, $B(0; 2; 0)$, $C(0; 0; 3)$ và $D(2; 4; 6)$. Xét tính đúng sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'Mặt phẳng $(ABC)$ có phương trình đoạn chắn là $\\frac{x}{1} + \\frac{y}{2} + \\frac{z}{3} = 1$.', isCorrect: true, explanation: 'Đúng (Mức Biết): Chuẩn công thức mặt phẳng theo đoạn chắn.' },
        { key: 'b', statement: 'Vectơ pháp tuyến của mặt phẳng $(ABC)$ là $\\vec{n} = (6; 3; 2)$.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Quy đồng $6x + 3y + 2z - 6 = 0 \\implies \\vec{n} = (6; 3; 2)$.' },
        { key: 'c', statement: 'Điểm $D(2; 4; 6)$ thuộc mặt phẳng $(ABC)$.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Thay toạ độ $D$: $6(2) + 3(4) + 2(6) - 6 = 30 \\neq 0$.' },
        { key: 'd', statement: 'Khoảng cách từ gốc toạ độ $O$ đến mặt phẳng $(ABC)$ bằng $\\frac{6}{7}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): $d(O, (ABC)) = \\frac{|-6|}{\\sqrt{6^2 + 3^2 + 2^2}} = \\frac{6}{7}$.' }
      ],
      explanation: 'Mệnh đề a, b, d là ĐÚNG; c là SAI.'
    },
    {
      topicKeywords: ['xác suất', 'thống kê'],
      level: 'Vận dụng',
      content: 'Một hộp chứa 5 quả cầu màu đỏ và 4 quả cầu màu xanh. Chọn ngẫu nhiên đồng thời 3 quả cầu từ hộp. Xét tính đúng/sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'Số phần tử của không gian mẫu là $n(\\Omega) = C_9^3 = 84$.', isCorrect: true, explanation: 'Đúng (Mức Biết): Chọn 3 từ 9 quả cầu có $C_9^3 = 84$ cách.' },
        { key: 'b', statement: 'Số cách chọn được 3 quả cầu cùng màu đỏ là $C_5^3 = 10$.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Số cách chọn 3 đỏ từ 5 đỏ là $C_5^3 = 10$.' },
        { key: 'c', statement: 'Xác suất để chọn được ít nhất 1 quả cầu màu xanh là $\\frac{37}{42}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): $P = 1 - \\frac{C_5^3}{C_9^3} = 1 - \\frac{10}{84} = \\frac{74}{84} = \\frac{37}{42}$.' },
        { key: 'd', statement: 'Xác suất để chọn được đúng 2 quả cầu màu xanh và 1 quả đỏ lớn hơn $0,5$.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): $P = \\frac{C_4^2 \\cdot C_5^1}{84} = \\frac{6 \\cdot 5}{84} = \\frac{30}{84} \\approx 0,357 < 0,5$.' }
      ],
      explanation: 'Mệnh đề a, b, c là ĐÚNG; d là SAI.'
    },
    {
      topicKeywords: ['vectơ', 'không gian'],
      level: 'Vận dụng cao',
      content: 'Cho hình lập phương $ABCD.A\'B\'C\'D\'$ có cạnh bằng $a$. Xét tính đúng/sai của các mệnh đề sau:',
      items: [
        { key: 'a', statement: 'Độ dài vectơ $\\vec{AB} + \\vec{AD} + \\vec{AA\'}$ bằng độ dài vectơ đường chéo $\\vec{AC\'}$.', isCorrect: true, explanation: 'Đúng (Mức Biết): Theo quy tắc hình hộp, $\\vec{AB} + \\vec{AD} + \\vec{AA\'} = \\vec{AC\'}$.' },
        { key: 'b', statement: 'Góc giữa hai đường thẳng $A\'C\'$ và $BD$ bằng $90^\\circ$.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): $A\'C\' \\parallel AC$ mà $AC \\perp BD$ (hai đường chéo hình vuông).' },
        { key: 'c', statement: 'Tích vô hướng $\\vec{AC\'} \\cdot \\vec{BD} = 0$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): $\\vec{AC\'} = \\vec{AC} + \\vec{AA\'} \\implies \\vec{AC\'} \\cdot \\vec{BD} = \\vec{AC} \\cdot \\vec{BD} + \\vec{AA\'} \\cdot \\vec{BD} = 0 + 0 = 0$.' },
        { key: 'd', statement: 'Khoảng cách giữa hai đường thẳng $AA\'$ và $BD\'$ bằng $a\\sqrt{2}$.', isCorrect: false, explanation: 'Sai (Mức Vận dụng cao): Khoảng cách giữa $AA\'$ và $BD\'$ là khoảng cách từ $A$ đến $(BDD\'B\')$, bằng $\\frac{a\\sqrt{2}}{2}$.' }
      ],
      explanation: 'Mệnh đề a, b, c là ĐÚNG; d là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['cực trị', 'hàm số'],
      level: 'Thông hiểu',
      content: 'Tìm giá trị cực đại của hàm số $y = -x^2 + 4x + 5$. Khi trả lời, chỉ ghi số.',
      key: '9',
      explanation: 'Đỉnh parabol tại $x = 2 \\implies y_{max} = -(2)^2 + 4(2) + 5 = 9$.'
    },
    {
      topicKeywords: ['tích phân', 'nguyên hàm'],
      level: 'Vận dụng',
      content: 'Tính tích phân $I = \\int_0^2 (3x^2 - 2x + 1) dx$. Khi trả lời, chỉ ghi số.',
      key: '6',
      explanation: '$I = [x^3 - x^2 + x]_0^2 = (8 - 4 + 2) - 0 = 6$.'
    },
    {
      topicKeywords: ['khoảng cách', 'oxyz'],
      level: 'Vận dụng',
      content: 'Trong không gian $Oxyz$, tính khoảng cách từ gốc toạ độ $O(0;0;0)$ đến mặt phẳng $(P): 2x - 2y + z - 6 = 0$. Khi trả lời, chỉ ghi số.',
      key: '2',
      explanation: '$d = \\frac{|-6|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{6}{3} = 2$.'
    },
    {
      topicKeywords: ['đạo hàm', 'tiếp tuyến'],
      level: 'Thông hiểu',
      content: 'Hệ số góc của tiếp tuyến của đồ thị hàm số $y = x^3 - 3x + 1$ tại điểm có hoành độ $x_0 = 2$ bằng bao nhiêu? Khi trả lời, chỉ ghi số.',
      key: '9',
      explanation: '$k = y\'(2) = 3(2)^2 - 3 = 12 - 3 = 9$.'
    },
    {
      topicKeywords: ['thống kê', 'phương sai'],
      level: 'Vận dụng',
      content: 'Một mẫu số liệu có phương sai $s^2 = 64$. Tính độ lệch chuẩn $s$ của mẫu số liệu trên. Khi trả lời, chỉ ghi số.',
      key: '8',
      explanation: 'Độ lệch chuẩn $s = \\sqrt{s^2} = \\sqrt{64} = 8$.'
    },
    {
      topicKeywords: ['tối ưu', 'thực tế'],
      level: 'Vận dụng cao',
      content: 'Một người nông dân muốn rào một khu đất hình chữ nhật có diện tích $200\\text{ m}^2$ sát một bờ sông thẳng (không cần rào bờ sông). Chiều dài hàng rào ngắn nhất cần dùng là bao nhiêu mét? Khi trả lời, chỉ ghi số.',
      key: '40',
      explanation: 'Gọi chiều rộng $x \\implies$ chiều dài $\\frac{200}{x}$. Chiều dài rào $L = 2x + \\frac{200}{x} \\ge 2\\sqrt{2x \\cdot \\frac{200}{x}} = 2\\sqrt{400} = 40\\text{ m}$.'
    }
  ],
  essay: [
    {
      topicKeywords: ['khảo sát', 'đồ thị'],
      level: 'Vận dụng',
      content: 'Khảo sát sự biến thiên và vẽ đồ thị của hàm số $y = x^3 - 3x^2 + 2$.',
      essayRubric: 'Ý a (1.0đ): Tập xác định $\\mathbb{R}$, đạo hàm $y\' = 3x^2 - 6x$, giải nghiệm $x = 0, x = 2$, lập bảng biến thiên đúng chiều biến thiên.\nÝ b (1.0đ): Tìm đúng cực đại $(0; 2)$, cực tiểu $(2; -2)$, tìm giao điểm trục toạ độ và vẽ đồ thị chính xác.',
      explanation: 'Thực hiện đầy đủ quy trình khảo sát và vẽ đồ thị hàm số.'
    },
    {
      topicKeywords: ['oxyz', 'hình học'],
      level: 'Vận dụng cao',
      content: 'Trong không gian $Oxyz$, cho mặt phẳng $(P): x + 2y - 2z + 5 = 0$ và điểm $A(1; -2; 3)$.\na) Tính khoảng cách từ điểm $A$ đến mặt phẳng $(P)$.\nb) Viết phương trình mặt cầu $(S)$ có tâm $A$ và tiếp xúc với mặt phẳng $(P)$.',
      essayRubric: 'Ý a (1.0đ): Sử dụng công thức $d(A, (P)) = \\frac{|1 + 2(-2) - 2(3) + 5|}{\\sqrt{1^2 + 2^2 + (-2)^2}} = \\frac{|-4|}{3} = \\frac{4}{3}$.\nÝ b (1.0đ): Mặt cầu $(S)$ tiếp xúc $(P) \\implies$ bán kính $R = d(A, (P)) = \\frac{4}{3}$. Phương trình: $(x - 1)^2 + (y + 2)^2 + (z - 3)^2 = \\frac{16}{9}$.',
      explanation: 'Tính đúng khoảng cách và viết chính xác phương trình mặt cầu tiếp xúc.'
    }
  ]
};
