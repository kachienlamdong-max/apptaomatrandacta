import { SubjectQuestionBank } from './bankTypes';

export const TIN_HOC_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['python', 'lập trình', 'biến'],
      level: 'Nhận biết',
      content: 'Trong ngôn ngữ lập trình Python, câu lệnh nào sau đây dùng để in dữ liệu ra màn hình?',
      options: [
        { key: 'A', content: 'print()' },
        { key: 'B', content: 'input()' },
        { key: 'C', content: 'output()' },
        { key: 'D', content: 'write()' }
      ],
      correctOption: 'A',
      explanation: 'Hàm print() dùng để xuất dữ liệu ra màn hình console trong Python.'
    },
    {
      topicKeywords: ['mạng', 'internet', 'giao thức'],
      level: 'Nhận biết',
      content: 'Giao thức truyền tải siêu văn bản an toàn được mã hóa bảo mật trên trình duyệt web là:',
      options: [
        { key: 'A', content: 'HTTPS' },
        { key: 'B', content: 'HTTP' },
        { key: 'C', content: 'FTP' },
        { key: 'D', content: 'SMTP' }
      ],
      correctOption: 'A',
      explanation: 'HTTPS (Hypertext Transfer Protocol Secure) là giao thức truyền thông an toàn sử dụng TLS/SSL.'
    },
    {
      topicKeywords: ['cơ sở dữ liệu', 'sql'],
      level: 'Thông hiểu',
      content: 'Trong hệ quản trị cơ sở dữ liệu quan hệ, khóa chính (Primary Key) có vai trò nào sau đây?',
      options: [
        { key: 'A', content: 'Xác định duy nhất mỗi bản ghi trong một bảng dữ liệu.' },
        { key: 'B', content: 'Liên kết dữ liệu ngẫu nhiên giữa hai bảng.' },
        { key: 'C', content: 'Lưu trữ các hình ảnh có kích thước lớn.' },
        { key: 'D', content: 'Tự động sao lưu dữ liệu máy chủ định kì.' }
      ],
      correctOption: 'A',
      explanation: 'Khóa chính bảo đảm tính toàn vẹn thực thể và phân biệt duy nhất từng hàng dữ liệu.'
    },
    {
      topicKeywords: ['thuật toán', 'sắp xếp'],
      level: 'Thông hiểu',
      content: 'Thuật toán tìm kiếm nhị phân (Binary Search) có thể áp dụng trên dãy số nào sau đây?',
      options: [
        { key: 'A', content: 'Dãy số đã được sắp xếp theo thứ tự tăng dần hoặc giảm dần.' },
        { key: 'B', content: 'Dãy số bất kì có thứ tự lộn xộn.' },
        { key: 'C', content: 'Chỉ áp dụng trên dãy chứa toàn số chẵn.' },
        { key: 'D', content: 'Chỉ áp dụng trên danh sách có tối đa 10 phần tử.' }
      ],
      correctOption: 'A',
      explanation: 'Tìm kiếm nhị phân chỉ áp dụng được trên danh sách đã được sắp xếp.'
    }
  ],
  tf: [
    {
      topicKeywords: ['python', 'thuật toán'],
      level: 'Vận dụng',
      content: 'Xét đoạn mã nguồn Python sau:\n```python\na = [3, 8, 1, 6, 2]\ns = 0\nfor x in a:\n    if x % 2 == 0:\n        s += x\n```\nXét tính đúng/sai của các mệnh đề sau:',
      items: [
        { key: 'a', statement: 'Biến `a` là một cấu trúc dữ liệu kiểu danh sách (List) gồm 5 phần tử.', isCorrect: true, explanation: 'Đúng (Mức Biết): `a` là list 5 số nguyên.' },
        { key: 'b', statement: 'Vòng lặp `for` sẽ lặp qua từng phần tử trong danh sách `a` đúng 5 lần.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Duyệt tuần tự 5 phần tử.' },
        { key: 'c', statement: 'Điều kiện `x % 2 == 0` dùng để lọc các số lẻ trong danh sách.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): `x % 2 == 0` là điều kiện kiểm tra số chẵn.' },
        { key: 'd', statement: 'Giá trị cuối cùng của biến `s` sau khi kết thúc vòng lặp bằng 16.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng cao): Tổng các số chẵn là $8 + 6 + 2 = 16$.' }
      ],
      explanation: 'Mệnh đề a, b, d là ĐÚNG; c là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['python', 'len'],
      level: 'Nhận biết',
      content: 'Trong Python, kết quả của biểu thức `len("GDPT2018")` bằng bao nhiêu? Khi trả lời, chỉ ghi số.',
      key: '8',
      explanation: 'Chuỗi "GDPT2018" có 8 kí tự.'
    },
    {
      topicKeywords: ['nhi phân', 'bit'],
      level: 'Thông hiểu',
      content: 'Số nhị phân $1011_2$ đổi sang hệ thập phân có giá trị bằng bao nhiêu? Khi trả lời, chỉ ghi số.',
      key: '11',
      explanation: '$1 \\times 2^3 + 0 \\times 2^2 + 1 \\times 2^1 + 1 \\times 2^0 = 8 + 0 + 2 + 1 = 11$.'
    }
  ],
  essay: [
    {
      topicKeywords: ['python', 'thuật toán'],
      level: 'Vận dụng cao',
      content: 'Viết chương trình Python (hoặc trình bày thuật toán bằng mã giả) thực hiện:\n- Nhập vào một danh sách các số nguyên từ bàn phím.\n- Đếm số lượng các số nguyên tố có trong danh sách và in kết quả ra màn hình.',
      essayRubric: 'Ý a (1.0đ): Viết đúng hàm kiểm tra số nguyên tố `is_prime(n)` (xử lí n < 2 và kiểm tra chia hết từ 2 đến $\\sqrt{n}$).\nÝ b (1.0đ): Nhập danh sách, duyệt qua từng phần tử, gọi hàm đếm và in kết quả chính xác.',
      explanation: 'Xây dựng thuật toán kiểm tra số nguyên tố và xử lí mảng/danh sách.'
    }
  ]
};
