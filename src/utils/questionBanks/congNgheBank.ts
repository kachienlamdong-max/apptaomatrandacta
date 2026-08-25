import { SubjectQuestionBank } from './bankTypes';

export const CONG_NGHE_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['trồng trọt', 'đất trồng', 'công nghệ'],
      level: 'Nhận biết',
      content: 'Trong kĩ thuật trồng trọt công nghệ cao, phương pháp trồng cây không cần dùng đất mà dùng dung dịch dinh dưỡng được gọi là:',
      options: [
        { key: 'A', content: 'Thủy canh.' },
        { key: 'B', content: 'Khí canh.' },
        { key: 'C', content: 'Thổ canh.' },
        { key: 'D', content: 'Luân canh.' }
      ],
      correctOption: 'A',
      explanation: 'Thủy canh là kĩ thuật trồng cây trong môi trường dung dịch dinh dưỡng không dùng đất.'
    },
    {
      topicKeywords: ['điện tử', 'linh kiện'],
      level: 'Nhận biết',
      content: 'Linh kiện điện tử bán dẫn chỉ cho dòng điện chạy qua theo một chiều từ Anode sang Cathode là:',
      options: [
        { key: 'A', content: 'Diode bán dẫn.' },
        { key: 'B', content: 'Điện trở.' },
        { key: 'C', content: 'Tụ điện.' },
        { key: 'D', content: 'Cuộn cảm.' }
      ],
      correctOption: 'A',
      explanation: 'Diode có tính chất dẫn điện một chiều.'
    },
    {
      topicKeywords: ['khtn', 'hóa học', 'vật lí'],
      level: 'Thông hiểu',
      content: 'Hiện tượng nào sau đây là hiện tượng hóa học?',
      options: [
        { key: 'A', content: 'Đinh sắt để ngoài không khí ẩm bị gỉ sét.' },
        { key: 'B', content: 'Nước đá tan chảy thành nước lỏng.' },
        { key: 'C', content: 'Cồn bay hơi khi mở nắp chai.' },
        { key: 'D', content: 'Hòa tan muối ăn vào nước.' }
      ],
      correctOption: 'A',
      explanation: 'Đinh sắt bị gỉ là quá trình oxy hóa tạo ra chất mới (oxit sắt).'
    },
    {
      topicKeywords: ['lịch sử - địa lí', 'bản đồ'],
      level: 'Thông hiểu',
      content: 'Để xác định phương hướng chính xác trên bản đồ không có kim chỉ nam, người ta dựa vào:',
      options: [
        { key: 'A', content: 'Hệ thống kinh tuyến và vĩ tuyến.' },
        { key: 'B', content: 'Bảng chú giải các kí hiệu.' },
        { key: 'C', content: 'Tỉ lệ xích của bản đồ.' },
        { key: 'D', content: 'Màu sắc thể hiện địa hình.' }
      ],
      correctOption: 'A',
      explanation: 'Kinh tuyến chỉ hướng Bắc - Nam, vĩ tuyến chỉ hướng Đông - Tây.'
    }
  ],
  tf: [
    {
      topicKeywords: ['nông nghiệp', 'công nghệ cao'],
      level: 'Vận dụng',
      content: 'Xét mô hình nhà màng trồng dưa lưới ứng dụng công nghệ tưới nhỏ giọt tự động Israel. Xét tính đúng/sai của các nhận định:',
      items: [
        { key: 'a', statement: 'Mô hình nhà màng giúp kiểm soát nhiệt độ, độ ẩm và hạn chế tối đa sâu bệnh gây hại.', isCorrect: true, explanation: 'Đúng (Mức Biết): Ưu điểm nổi bật của nông nghiệp trong nhà kính/nhà màng.' },
        { key: 'b', statement: 'Hệ thống tưới nhỏ giọt giúp tiết kiệm nước và cung cấp dinh dưỡng chính xác đến từng gốc cây.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Cơ chế tưới chính xác tiết kiệm nước.' },
        { key: 'c', statement: 'Mô hình này bắt buộc phải sử dụng thuốc bảo vệ thực vật hóa học liều lượng gấp đôi ngoài đồng ruộng.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Nhà màng giảm thiểu việc dùng thuốc hóa học, hướng đến sản phẩm sạch.' },
        { key: 'd', statement: 'Đầu tư nông nghiệp công nghệ cao mang lại năng suất cao và giá trị kinh tế bền vững.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng cao): Tối ưu hóa chi phí dài hạn và tăng chất lượng nông sản.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['khtn', 'nguyên tố'],
      level: 'Nhận biết',
      content: 'Khối lượng nguyên tử của nguyên tố Carbon (C) theo đơn vị amu là bao nhiêu? Khi trả lời, chỉ ghi số.',
      key: '12',
      explanation: 'Nguyên tử khối của C là 12 amu.'
    },
    {
      topicKeywords: ['điện trở', 'vạch màu'],
      level: 'Thông hiểu',
      content: 'Một điện trở có các vạch màu: Đỏ (2), Đỏ (2), Nâu ($10^1$), Hoàng kim (5%). Trị số điện trở này là bao nhiêu ôm ($\\Omega$)? Khi trả lời, chỉ ghi số.',
      key: '220',
      explanation: '$R = 22 \\times 10^1 = 220\\ \\Omega$.'
    }
  ],
  essay: [
    {
      topicKeywords: ['công nghệ', 'quy trình'],
      level: 'Vận dụng cao',
      content: 'Trình bày các bước cơ bản trong quy trình trồng rau thủy canh hồi lưu quy mô gia đình hoặc trang trại nhỏ.',
      essayRubric: 'Ý a (1.0đ): Chuẩn bị giá thể, ươm hạt giống và pha chế dung dịch dinh dưỡng đúng nồng độ ppm.\nÝ b (1.0đ): Chuyển cây con vào giàn thủy canh, cài đặt chế độ bơm tuần hoàn hồi lưu, kiểm tra độ pH và phòng ngừa sâu bệnh định kì.',
      explanation: 'Mô tả quy trình kĩ thuật trồng thủy canh chuẩn.'
    }
  ]
};
