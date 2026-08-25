import { SubjectQuestionBank } from './bankTypes';

export const GDKT_PL_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['kinh tế', 'thị trường', 'quy luật giá trị'],
      level: 'Nhận biết',
      content: 'Trong nền kinh tế thị trường, quy luật giá trị yêu cầu người sản xuất và lưu thông hàng hóa phải dựa trên cơ sở nào?',
      options: [
        { key: 'A', content: 'Thời gian lao động xã hội cần thiết.' },
        { key: 'B', content: 'Thời gian lao động cá biệt của từng chủ thể.' },
        { key: 'C', content: 'Ý muốn chủ quan của cơ quan quản lí.' },
        { key: 'D', content: 'Giá cả thị trường tự do tại thời điểm giao dịch.' }
      ],
      correctOption: 'A',
      explanation: 'Quy luật giá trị đòi hỏi việc sản xuất và trao đổi hàng hóa phải dựa trên hao phí lao động xã hội cần thiết.'
    },
    {
      topicKeywords: ['pháp luật', 'quyền con người'],
      level: 'Nhận biết',
      content: 'Mọi công dân không bị phân biệt đối xử trong việc hưởng quyền, thực hiện nghĩa vụ và chịu trách nhiệm pháp lí là biểu hiện của quyền nào?',
      options: [
        { key: 'A', content: 'Quyền bình đẳng của công dân trước pháp luật.' },
        { key: 'B', content: 'Quyền tự do ngôn luận.' },
        { key: 'C', content: 'Quyền bất khả xâm phạm về thân thể.' },
        { key: 'D', content: 'Quyền được bảo hộ về tính mạng, sức khỏe.' }
      ],
      correctOption: 'A',
      explanation: 'Điều 16 Hiến pháp 2013 quy định: Mọi người đều bình đẳng trước pháp luật.'
    },
    {
      topicKeywords: ['lạm phát', 'tiền tệ'],
      level: 'Thông hiểu',
      content: 'Hiện tượng mức giá chung của nền kinh tế tăng lên liên tục trong một khoảng thời gian xác định được gọi là:',
      options: [
        { key: 'A', content: 'Lạm phát.' },
        { key: 'B', content: 'Thiểu phát.' },
        { key: 'C', content: 'Tăng trưởng kinh tế.' },
        { key: 'D', content: 'Khủng hoảng thừa.' }
      ],
      correctOption: 'A',
      explanation: 'Lạm phát là sự gia tăng liên tục mức giá chung của hàng hóa, dịch vụ theo thời gian.'
    },
    {
      topicKeywords: ['hợp đồng', 'lao động'],
      level: 'Thông hiểu',
      content: 'Văn bản thỏa thuận giữa người lao động và người sử dụng lao động về việc làm có trả công, điều kiện làm việc, quyền và nghĩa vụ của mỗi bên được gọi là:',
      options: [
        { key: 'A', content: 'Hợp đồng lao động.' },
        { key: 'B', content: 'Nội quy công ty.' },
        { key: 'C', content: 'Thỏa ước lao động tập thể.' },
        { key: 'D', content: 'Biên bản thỏa thuận dân sự.' }
      ],
      correctOption: 'A',
      explanation: 'Theo Bộ luật Lao động, đây là định nghĩa của hợp đồng lao động.'
    }
  ],
  tf: [
    {
      topicKeywords: ['tiêu dùng', 'thông minh', 'tài chính'],
      level: 'Vận dụng',
      content: 'Đọc tình huống sau:\n"Bạn H (17 tuổi, học sinh lớp 12) nhận được học bổng và muốn lập kế hoạch chi tiêu cá nhân. H quyết định chia số tiền thành các khoản: 50% cho nhu cầu thiết yếu học tập, 30% cho tiết kiệm dài hạn và 20% cho quỹ dự phòng khẩn cấp. H cũng tìm hiểu kĩ về quyền của người tiêu dùng trước khi mua một chiếc máy tính phục vụ học tập trực tuyến."\n(Nguồn: Trích Giáo dục tài chính học đường, Bộ GD&ĐT)\nXét tính đúng/sai của các nhận định:',
      items: [
        { key: 'a', statement: 'Bạn H đã áp dụng phương pháp quản lí tài chính cá nhân khoa học và hợp lí.', isCorrect: true, explanation: 'Đúng (Mức Biết): Phân bổ ngân sách có mục đích rõ ràng và kỉ luật.' },
        { key: 'b', statement: 'Theo Luật Bảo vệ quyền lợi người tiêu dùng, H có quyền yêu cầu người bán cung cấp thông tin chính xác về xuất xứ và chế độ bảo hành sản phẩm.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Đây là quyền cơ bản của người tiêu dùng.' },
        { key: 'c', statement: 'Học sinh 17 tuổi chưa có đầy đủ năng lực hành vi dân sự để thực hiện các giao dịch phục vụ nhu cầu sinh hoạt thiết yếu hàng ngày.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Người từ đủ 15 tuổi đến chưa đủ 18 tuổi có quyền tự mình xác lập giao dịch phù hợp lứa tuổi.' },
        { key: 'd', statement: 'Lập ngân sách và duy trì thói quen tiết kiệm từ sớm giúp phòng ngừa các rủi ro tài chính phát sinh bất ngờ.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng cao): Giá trị thực tiễn của quản lí tài chính cá nhân.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['độ tuổi', 'pháp luật'],
      level: 'Nhận biết',
      content: 'Theo Hiến pháp nước CHXHCN Việt Nam, công dân đủ bao nhiêu tuổi trở lên có quyền bầu cử Quốc hội và Hội đồng nhân dân các cấp? Khi trả lời, chỉ ghi số.',
      key: '18',
      explanation: 'Điều 27 Hiến pháp 2013: Công dân đủ 18 tuổi trở lên có quyền bầu cử.'
    },
    {
      topicKeywords: ['hiến pháp', 'năm ban hành'],
      level: 'Nhận biết',
      content: 'Bản Hiến pháp hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam được Quốc hội khóa XIII thông qua vào năm nào? Khi trả lời, chỉ ghi số năm (ví dụ: 2013).',
      key: '2013',
      explanation: 'Hiến pháp năm 2013.'
    }
  ],
  essay: [
    {
      topicKeywords: ['pháp luật', 'vi phạm pháp luật', 'trách nhiệm'],
      level: 'Vận dụng cao',
      content: 'Anh K và chị M cùng mở một cơ sở sản xuất bánh kẹo. Để giảm giá thành, anh K đã tự ý mua hóa chất phụ gia không rõ nguồn gốc xuất xứ trôi nổi trên thị trường để phối trộn vào nguyên liệu. Chị M phát hiện nhưng im lặng không ngăn cản. Đội Quản lí thị trường tiến hành kiểm tra, phát hiện và lập biên bản xử phạt cơ sở 50 triệu đồng, đồng thời đình chỉ hoạt động.\na) Hành vi của anh K và chị M đã vi phạm pháp luật gì?\nb) Phân tích trách nhiệm pháp lí của các cá nhân trong tình huống trên.',
      essayRubric: 'Ý a (1.0đ): Anh K và chị M đã thực hiện hành vi vi phạm pháp luật hành chính về an toàn vệ sinh thực phẩm (nếu gây hậu quả nghiêm trọng về sức khỏe người tiêu dùng có thể bị truy cứu trách nhiệm hình sự).\nÝ b (1.0đ): \n- Anh K: Chịu trách nhiệm chính về hành vi trực tiếp sử dụng phụ gia độc hại, bị xử phạt tiền và tịch thu tang vật vi phạm.\n- Chị M: Cùng là chủ cơ sở, biết hành vi vi phạm của đồng nghiệp nhưng không ngăn cản hoặc báo cáo, phải liên đới chịu trách nhiệm xử phạt hành chính và chấp hành quyết định đình chỉ hoạt động kinh doanh.',
      explanation: 'Xác định đúng hành vi vi phạm pháp luật và phân tích trách nhiệm pháp lí.'
    }
  ]
};
