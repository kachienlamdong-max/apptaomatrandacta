import { SubjectQuestionBank } from './bankTypes';

export const LICH_SU_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['đảng', 'thành lập', '1930'],
      level: 'Nhận biết',
      content: 'Hội nghị hợp nhất các tổ chức cộng sản Việt Nam đầu năm 1930 diễn ra tại đâu?',
      options: [
        { key: 'A', content: 'Cửu Long (Hương Cảng, Trung Quốc).' },
        { key: 'B', content: 'Quảng Châu (Trung Quốc).' },
        { key: 'C', content: 'Ma Cao (Trung Quốc).' },
        { key: 'D', content: 'Tân Trào (Tuyên Quang).' }
      ],
      correctOption: 'A',
      explanation: 'Hội nghị thành lập Đảng diễn ra từ ngày 6/1/1930 tại Cửu Long (Hương Cảng, Trung Quốc) do Nguyễn Ái Quốc chủ trì.'
    },
    {
      topicKeywords: ['cách mạng tháng tám', '1945'],
      level: 'Nhận biết',
      content: 'Sự kiện nào đánh dấu thắng lợi hoàn toàn của Cách mạng tháng Tám năm 1945 trên cả nước?',
      options: [
        { key: 'A', content: 'Vua Bảo Đại tuyên bố thoái vị tại Huế (30/8/1945).' },
        { key: 'B', content: 'Khởi nghĩa thắng lợi ở Hà Nội (19/8/1945).' },
        { key: 'C', content: 'Khởi nghĩa thắng lợi ở Sài Gòn (25/8/1945).' },
        { key: 'D', content: 'Hội nghị toàn quốc của Đảng họp tại Tân Trào (14/8/1945).' }
      ],
      correctOption: 'A',
      explanation: 'Ngày 30/8/1945, vua Bảo Đại thoái vị trao ấn kiếm cho chính quyền cách mạng, chế độ phong kiến sụp đổ hoàn toàn.'
    },
    {
      topicKeywords: ['điện biên phủ', '1954'],
      level: 'Thông hiểu',
      content: 'Ý nghĩa quốc tế to lớn của chiến thắng Điện Biên Phủ năm 1954 là:',
      options: [
        { key: 'A', content: 'Cổ vũ mạnh mẽ phong trào giải phóng dân tộc của các nước thuộc địa trên thế giới.' },
        { key: 'B', content: 'Làm sụp đổ hoàn toàn chủ nghĩa đế quốc trên phạm vi toàn cầu.' },
        { key: 'C', content: 'Buộc Mĩ phải chấm dứt can thiệp quân sự vào khu vực Đông Nam Á.' },
        { key: 'D', content: 'Tạo điều kiện để Việt Nam gia nhập tổ chức Liên Hợp Quốc.' }
      ],
      correctOption: 'A',
      explanation: 'Chiến thắng Điện Biên Phủ là nguồn cổ vũ to lớn cho phong trào giải phóng dân tộc ở Á, Phi và Mĩ Latinh.'
    },
    {
      topicKeywords: ['đổi mới', '1986'],
      level: 'Thông hiểu',
      content: 'Đại hội đại biểu toàn quốc lần thứ VI của Đảng (12/1986) đã đề ra đường lối đổi mới toàn diện đất nước, trong đó trọng tâm là đổi mới về lĩnh vực nào?',
      options: [
        { key: 'A', content: 'Kinh tế.' },
        { key: 'B', content: 'Chính trị.' },
        { key: 'C', content: 'Văn hóa - giáo dục.' },
        { key: 'D', content: 'Quốc phòng - an ninh.' }
      ],
      correctOption: 'A',
      explanation: 'Đảng xác định lấy đổi mới kinh tế làm trọng tâm, từng bước đổi mới hệ thống chính trị vững chắc.'
    }
  ],
  tf: [
    {
      topicKeywords: ['asean', 'thế giới'],
      level: 'Vận dụng',
      content: 'Đọc đoạn trích sau:\n"Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập ngày 8/8/1967 tại Băng Cốc (Thái Lan) với 5 quốc gia thành viên ban đầu. Trải qua hơn nửa thế kỉ phát triển, ASEAN đã trở thành một tổ chức hợp tác toàn diện khu vực với 10 quốc gia thành viên, đóng vai trò trung tâm trong cấu trúc an ninh và kinh tế khu vực châu Á - Thái Bình Dương."\n(Nguồn: Tư liệu Lịch sử Quan hệ Quốc tế, NXB Giáo dục)\nXét tính đúng/sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'ASEAN được thành lập vào năm 1967 với 5 quốc gia thành viên sáng lập.', isCorrect: true, explanation: 'Đúng (Mức Biết): 5 nước sáng lập: Indonesia, Malaysia, Philippines, Singapore, Thái Lan.' },
        { key: 'b', statement: 'Việt Nam chính thức gia nhập ASEAN vào năm 1995 (tại Hội nghị Bộ trưởng Ngoại giao ASEAN lần thứ 28 tại Brunei).', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Ngày 28/7/1995, Việt Nam trở thành thành viên thứ 7.' },
        { key: 'c', statement: 'Mục tiêu hàng đầu hiện nay của Cộng đồng ASEAN là xây dựng một liên minh quân sự thống nhất chung.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): ASEAN là tổ chức hợp tác kinh tế, chính trị - an ninh, văn hóa, không phải liên minh quân sự.' },
        { key: 'd', statement: 'Nguyên tắc "Đồng thuận" và "Không can thiệp vào công việc nội bộ của nhau" là nền tảng cốt lõi trong hoạt động của ASEAN.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng cao): Đây là phương cách ASEAN (ASEAN Way) xuyên suốt.' }
      ],
      explanation: 'Mệnh đề a, b, d là ĐÚNG; c là SAI.'
    },
    {
      topicKeywords: ['kháng chiến', 'hồ chí minh'],
      level: 'Vận dụng',
      content: 'Đọc đoạn tư liệu sau:\n"Chiến dịch Hồ Chí Minh lịch sử (từ 26/4 đến 30/4/1975) là đỉnh cao của cuộc Tổng tiến công và nổi dậy mùa Xuân năm 1975, giải phóng hoàn toàn miền Nam, thống nhất đất nước. Thắng lợi này đã kết thúc vẻ vang 30 năm chiến tranh giải phóng dân tộc và bảo vệ Tổ quốc của nhân dân ta."\n(Nguồn: Lịch sử Đảng Cộng sản Việt Nam, NXB Chính trị Quốc gia)\nXét tính đúng/sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'Chiến dịch Hồ Chí Minh là chiến dịch quyết chiến chiến lược cuối cùng trong cuộc kháng chiến chống Mĩ cứu nước.', isCorrect: true, explanation: 'Đúng (Mức Biết): Đỉnh cao giải phóng hoàn toàn miền Nam.' },
        { key: 'b', statement: 'Xe tăng Quân giải phóng húc đổ cổng Dinh Độc Lập vào trưa ngày 30/4/1975.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Lúc 11h30 ngày 30/4/1975, lá cờ cách mạng tung bay trên Dinh Độc Lập.' },
        { key: 'c', statement: 'Thắng lợi mùa Xuân 1975 đã mở ra kỉ nguyên đất nước độc lập, thống nhất và đi lên chủ nghĩa xã hội.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Ý nghĩa lịch sử vĩ đại của đại thắng 1975.' },
        { key: 'd', statement: 'Chiến dịch Hồ Chí Minh chỉ dựa thuần túy vào lực lượng biệt động ngầm nội đô mà không có sự phối hợp của các quân đoàn chủ lực.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Chiến dịch là sự hiệp đồng tác chiến quy mô lớn nhất của 5 cánh quân chủ lực kết hợp nổi dậy của quần chúng.' }
      ],
      explanation: 'Mệnh đề a, b, c là ĐÚNG; d là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['năm', 'sự kiện'],
      level: 'Nhận biết',
      content: 'Năm nào Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa? Khi trả lời, chỉ ghi số năm (ví dụ 1945).',
      key: '1945',
      explanation: 'Ngày 2/9/1945 tại Quảng trường Ba Đình (Hà Nội).'
    },
    {
      topicKeywords: ['đảng', 'đại hội'],
      level: 'Nhận biết',
      content: 'Đại hội đại biểu toàn quốc lần thứ mấy của Đảng Cộng sản Việt Nam đã thông qua Cương lĩnh xây dựng đất nước trong thời kì quá độ lên chủ nghĩa xã hội (năm 1991)? Điền số La Mã hoặc số 7. Khi trả lời, chỉ ghi số.',
      key: '7',
      explanation: 'Đại hội VII của Đảng họp năm 1991.'
    }
  ],
  essay: [
    {
      topicKeywords: ['cách mạng tháng tám', 'nguyên nhân thắng lợi'],
      level: 'Vận dụng cao',
      content: 'Phân tích các nguyên nhân thắng lợi và bài học kinh nghiệm của Cách mạng tháng Tám năm 1945 đối với công cuộc bảo vệ và xây dựng đất nước hiện nay.',
      essayRubric: 'Ý a (1.0đ): Trình bày 3 nguyên nhân thắng lợi: Sự lãnh đạo sáng suốt của Đảng và Chủ tịch Hồ Chí Minh, Tinh thần yêu nước và khối đại đoàn kết toàn dân tộc, Hoàn cảnh quốc tế thuận lợi (phe Đồng minh tiêu diệt chủ nghĩa phát xít).\nÝ b (1.0đ): Nêu 2 bài học kinh nghiệm lớn: Bài học nắm bắt thời cơ cách mạng, Bài học xây dựng và củng cố khối đại đoàn kết toàn dân tộc trong thời kì hội nhập.',
      explanation: 'Phân tích toàn diện nguyên nhân và bài học lịch sử của Cách mạng tháng Tám 1945.'
    }
  ]
};
