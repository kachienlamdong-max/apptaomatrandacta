import { SubjectQuestionBank } from './bankTypes';

export const VAN_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['đọc hiểu', 'ngữ liệu', 'thể loại'],
      level: 'Nhận biết',
      content: 'Trong văn bản văn học, yếu tố nào sau đây là đặc trưng tiêu biểu nhất của thể thơ tự do?',
      options: [
        { key: 'A', content: 'Số tiếng trong mỗi dòng thơ và số dòng trong khổ thơ không bị gò bó theo luật định.' },
        { key: 'B', content: 'Bắt buộc tuân thủ luật bằng trắc nghiêm ngặt theo thể Đường luật.' },
        { key: 'C', content: 'Mỗi câu thơ đều phải có đúng 7 hoặc 8 tiếng và gieo vần chân.' },
        { key: 'D', content: 'Chỉ được phép sử dụng các từ ngữ Hán Việt cổ kính.' }
      ],
      correctOption: 'A',
      explanation: 'Thơ tự do linh hoạt về số chữ, số dòng, nhịp điệu và cách gieo vần để bộc lộ cảm xúc tự nhiên.'
    },
    {
      topicKeywords: ['biện pháp tu từ', 'tiếng việt'],
      level: 'Nhận biết',
      content: 'Biện pháp tu từ nào được sử dụng trong câu thơ: "Ngày ngày mặt trời đi qua trên lăng / Thấy một mặt trời trong lăng rất đỏ" (Viễn Phương)?',
      options: [
        { key: 'A', content: 'Ẩn dụ.' },
        { key: 'B', content: 'Hoán dụ.' },
        { key: 'C', content: 'So sánh.' },
        { key: 'D', content: 'Nói quá.' }
      ],
      correctOption: 'A',
      explanation: 'Hình ảnh "mặt trời trong lăng" là ẩn dụ ca ngợi công lao vĩ đại và sự bất tử của Chủ tịch Hồ Chí Minh.'
    },
    {
      topicKeywords: ['liên kết', 'tiếng việt'],
      level: 'Thông hiểu',
      content: 'Phép liên kết nào được sử dụng chủ yếu trong hai câu văn sau: "Trường học của chúng ta là trường học của chế độ dân chủ nhân dân. Trường học ấy nhằm đào tạo những công dân và cán bộ tốt."?',
      options: [
        { key: 'A', content: 'Phép thế.' },
        { key: 'B', content: 'Phép lặp từ ngữ.' },
        { key: 'C', content: 'Phép nối.' },
        { key: 'D', content: 'Phép tương phản.' }
      ],
      correctOption: 'A',
      explanation: 'Cụm từ "Trường học ấy" thay thế cho "Trường học của chúng ta..." ở câu trước.'
    },
    {
      topicKeywords: ['phong cách', 'văn bản'],
      level: 'Thông hiểu',
      content: 'Phong cách ngôn ngữ nào được sử dụng trong các bản tuyên ngôn, lời kêu gọi, bài phát biểu chính luận?',
      options: [
        { key: 'A', content: 'Phong cách ngôn ngữ chính luận.' },
        { key: 'B', content: 'Phong cách ngôn ngữ sinh hoạt.' },
        { key: 'C', content: 'Phong cách ngôn ngữ nghệ thuật.' },
        { key: 'D', content: 'Phong cách ngôn ngữ khoa học.' }
      ],
      correctOption: 'A',
      explanation: 'Phong cách chính luận dùng để bày tỏ chính kiến, quan điểm chính trị - xã hội một cách chặt chẽ, thuyết phục.'
    }
  ],
  tf: [
    {
      topicKeywords: ['đọc hiểu', 'nghị luận'],
      level: 'Vận dụng',
      content: 'Đọc đoạn trích sau và xét tính đúng/sai của các nhận định:\n"Khát vọng sống là nguồn năng lượng vô tận giúp con người vượt qua nghịch cảnh. Người có khát vọng không bao giờ chấp nhận đầu hàng trước số phận. Họ biến thử thách thành cơ hội rèn luyện ý chí, biến thất bại thành bài học kinh nghiệm để từng bước tiến về phía trước."\n(Nguồn: Trích Tinh thần tự lực, NXB Trẻ, 2023)',
      items: [
        { key: 'a', statement: 'Phương thức biểu đạt chính của đoạn trích trên là phương thức nghị luận.', isCorrect: true, explanation: 'Đúng (Mức Biết): Bàn luận và làm sáng tỏ vấn đề tư tưởng khát vọng sống.' },
        { key: 'b', statement: 'Theo đoạn trích, người có khát vọng sống sẽ dễ dàng thỏa hiệp khi gặp nghịch cảnh.', isCorrect: false, explanation: 'Sai (Mức Hiểu): Đoạn văn khẳng định "không bao giờ chấp nhận đầu hàng trước số phận".' },
        { key: 'c', statement: 'Thông điệp cốt lõi của đoạn trích là khuyên con người cần nuôi dưỡng ý chí và tinh thần vượt khó.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Rút ra đúng bài học tư tưởng sống tích cực.' },
        { key: 'd', statement: 'Đoạn trích chủ yếu sử dụng phép liên kết tương phản đối lập gay gắt giữa cá nhân và xã hội.', isCorrect: false, explanation: 'Sai (Mức Vận dụng cao): Đoạn văn dùng phép lặp cấu trúc và liên kết móc xích, không đối lập cá nhân - xã hội.' }
      ],
      explanation: 'Nhận định a, c là ĐÚNG; b, d là SAI.'
    },
    {
      topicKeywords: ['văn học', 'nghệ thuật'],
      level: 'Vận dụng',
      content: 'Đọc đoạn thơ sau và xét tính đúng/sai của các mệnh đề:\n"Đất nước là nơi em đánh rơi chiếc khăn trong nỗi nhớ thầm\nĐất nước là nơi con chim phượng hoàng bay về hòn núi bạc\nNước là nơi con rồng để trứng\nĐồng bào ta làm ăn trên đất nước nghìn năm..."\n(Nguồn: Trích Trường ca Mặt đường khát vọng, Nguyễn Khoa Điềm, NXB Văn học)',
      items: [
        { key: 'a', statement: 'Đoạn thơ trên được viết theo thể thơ tự do.', isCorrect: true, explanation: 'Đúng (Mức Biết): Nhận diện đúng thể thơ tự do hiện đại.' },
        { key: 'b', statement: 'Hình ảnh "chiếc khăn trong nỗi nhớ thầm" gợi liên tưởng đến ca dao dân ca truyền thống Việt Nam.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Gợi bài ca dao "Khăn thương nhớ ai...".' },
        { key: 'c', statement: 'Tác giả định nghĩa Đất Nước gắn liền với không gian sinh hoạt gần gũi, tình yêu đôi lứa và truyền thuyết dân tộc.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Đất Nước được nhìn nhận qua lăng kính văn hóa - đời thường.' },
        { key: 'd', statement: 'Giọng điệu đoạn thơ mang tính phủ định những giá trị lịch sử quá khứ của dân tộc.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Giọng thơ tha thiết, ngợi ca và tự hào về cội nguồn nghìn năm.' }
      ],
      explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['thể thơ', 'tiếng việt'],
      level: 'Nhận biết',
      content: 'Một câu thơ có 7 chữ, một khổ thơ có 4 câu và tuân thủ luật gieo vần nghiêm ngặt. Đây là thể thơ nào? Khi trả lời, chỉ ghi số từ trong tên gọi: Thất ngôn tứ tuyệt (điền 4).',
      key: '4',
      explanation: 'Thể thơ Thất ngôn tứ tuyệt có 4 câu, mỗi câu 7 chữ.'
    },
    {
      topicKeywords: ['nghị luận', 'đoạn văn'],
      level: 'Thông hiểu',
      content: 'Dung lượng chuẩn của một đoạn văn nghị luận xã hội trong đề thi tốt nghiệp THPT theo định hướng GDPT 2018 thường khoảng bao nhiêu chữ? Điền số khoảng 200 (khi trả lời chỉ ghi số).',
      key: '200',
      explanation: 'Dung lượng chuẩn của đoạn văn NLXH khoảng 200 chữ.'
    }
  ],
  essay: [
    {
      topicKeywords: ['đọc hiểu', 'làm văn', 'nghị luận xã hội'],
      level: 'Vận dụng cao',
      content: 'I. ĐỌC HIỂU (4.0 điểm)\nĐọc văn bản sau:\n"Hành trình vạn dặm khởi đầu từ một bước chân. Không có thành công nào đến sau một đêm mà là kết quả của sự kiên trì tích lũy từng ngày. Khi bạn dám bước ra khỏi vùng an toàn, đối diện với những thử thách mới, đó là lúc bạn thực sự trưởng thành..."\n(Nguồn: Trích Dám nghĩ lớn, NXB Thế Giới)\nThực hiện các yêu cầu:\nCâu 1 (0.75đ): Xác định phương thức biểu đạt chính của văn bản.\nCâu 2 (0.75đ): Theo tác giả, thành công là kết quả của điều gì?\nCâu 3 (1.0đ): Nêu cách hiểu của em về ý kiến: "Hành trình vạn dặm khởi đầu từ một bước chân".\nCâu 4 (1.5đ): Rút ra một bài học có ý nghĩa nhất đối với bản thân và lí giải vì sao.\n\nII. VIẾT (6.0 điểm)\nCâu 1 (2.0đ): Viết một đoạn văn (khoảng 200 chữ) trình bày suy nghĩ của em về ý nghĩa của tinh thần dám bước ra khỏi vùng an toàn trong cuộc sống của người trẻ hiện nay.\nCâu 2 (4.0đ): Viết bài văn nghị luận (khoảng 600 chữ) phân tích một tác phẩm/đoạn trích văn học mà em tâm đắc để làm sáng tỏ vẻ đẹp tâm hồn và khát vọng của con người Việt Nam.',
      essayRubric: 'HƯỚNG DẪN CHẤM CHI TIẾT:\nI. PHẦN ĐỌC HIỂU (4.0 điểm):\n- Câu 1 (0.75đ): Phương thức nghị luận.\n- Câu 2 (0.75đ): Kết quả của sự kiên trì tích lũy từng ngày.\n- Câu 3 (1.0đ): Hiểu đúng nghĩa bóng: Mọi mục tiêu vĩ đại đều bắt đầu từ những hành động nhỏ bé, cụ thể đầu tiên.\n- Câu 4 (1.5đ): Nêu bài học tích cực (dám thay đổi, kiên trì, rèn luyện) và lí giải thuyết phục.\n\nII. PHẦN VIẾT (6.0 điểm):\n- Câu 1 - Đoạn văn NLXH (2.0đ):\n  + Đảm bảo cấu trúc đoạn văn 200 chữ, đúng chủ đề (0.25đ).\n  + Nêu rõ ý nghĩa: mở rộng hiểu biết, tôi luyện bản lĩnh, nắm bắt cơ hội mới (1.0đ).\n  + Dẫn chứng thực tế và liên hệ bản thân (0.5đ).\n  + Chính tả, diễn đạt mạch lạc (0.25đ).\n- Câu 2 - Bài văn NLVH (4.0đ):\n  + Mở bài giới thiệu tác phẩm, tác giả, vấn đề nghị luận (0.5đ).\n  + Thân bài: Phân tích nội dung và nghệ thuật làm nổi bật vẻ đẹp tâm hồn con người (2.5đ).\n  + Đánh giá, tổng kết giá trị tư tưởng (0.5đ).\n  + Sáng tạo và chuẩn chính tả (0.5đ).',
      explanation: 'Đề thi tự luận chuẩn 100% môn Ngữ văn theo cấu trúc Đọc hiểu 4.0đ + Làm văn 6.0đ của Bộ GD&ĐT.'
    }
  ]
};
