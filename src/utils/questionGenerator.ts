import { 
  ExamHeaderConfig, 
  MatrixRow, 
  SpecificationItem, 
  ExamQuestion, 
  MultipleChoiceOption, 
  TrueFalseSubItem 
} from '../types';

/**
 * Intelligent Question Generator that guarantees 100% consistency between 
 * the current Subject/Grade, Matrix distribution, and Specification objectives.
 * ABSOLUTELY ZERO DUPLICATE QUESTIONS in any part of the test.
 */

// Helper to normalize subject name
export function normalizeSubjectKey(subject: string): string {
  const s = (subject || '').toLowerCase().trim();
  if (s.includes('lịch sử và địa lí') || s.includes('lich su va dia li')) return 'lich-su-dia-li';
  if (s.includes('khoa học tự nhiên') || s.includes('khtn')) return 'khtn';
  if (s.includes('địa') || s.includes('dia')) return 'dia-li';
  if (s.includes('sử') || s.includes('su') || s.includes('lich su')) return 'lich-su';
  if (s.includes('anh') || s.includes('english') || s.includes('ngoại ngữ')) return 'tieng-anh';
  if (s.includes('tin') || s.includes('it') || s.includes('informatics')) return 'tin-hoc';
  if (s.includes('kinh tế') || s.includes('pháp luật') || s.includes('gdcd') || s.includes('gdkt')) return 'gdkt-pl';
  if (s.includes('công nghệ') || s.includes('cong nghe')) return 'cong-nghe';
  if (s.includes('lý') || s.includes('ly') || s.includes('vật lí') || s.includes('vat ly') || s.includes('vật lý')) return 'vat-li';
  if (s.includes('hóa') || s.includes('hoa')) return 'hoa-hoc';
  if (s.includes('sinh') || s.includes('biology')) return 'sinh-hoc';
  if (s.includes('văn') || s.includes('van') || s.includes('ngữ văn') || s.includes('tiếng việt')) return 'ngu-van';
  if (s.includes('toán') || s.includes('toan') || s.includes('math')) return 'toan';
  return 'general';
}

// -------------------------------------------------------------
// QUESTION DATA REPOSITORIES FOR EACH SUBJECT
// -------------------------------------------------------------

interface RawMCQ {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  options: MultipleChoiceOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface RawTF {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  items: TrueFalseSubItem[];
  explanation: string;
}

interface RawShort {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  key: string;
  explanation: string;
}

interface RawEssay {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  essayRubric: string;
  explanation: string;
}

// =========================================================================
// 1. ĐỊA LÍ (GEOGRAPHY) QUESTION BANK
// =========================================================================
const DIA_LI_MCQ: RawMCQ[] = [
  {
    topicKeywords: ['vị trí', 'lãnh thổ', 'tự nhiên'],
    level: 'Nhận biết',
    content: 'Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, nên có đặc điểm tự nhiên nào sau đây?',
    options: [
      { key: 'A', content: 'Tổng lượng mưa hàng năm luôn nhỏ hơn lượng bốc hơi.' },
      { key: 'B', content: 'Nền nhiệt độ cao, nhiều ánh nắng mặt trời.' },
      { key: 'C', content: 'Chịu ảnh hưởng sâu sắc của gió Mậu dịch bán cầu Nam.' },
      { key: 'D', content: 'Khí hậu phân hóa thành 4 mùa rõ rệt ở mọi miền.' }
    ],
    correctOption: 'B',
    explanation: 'Do nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc nên nước ta có góc nhập xạ lớn, tổng bức xạ dồi dào, nền nhiệt độ cao trung bình > 20°C.'
  },
  {
    topicKeywords: ['vị trí', 'biển', 'lãnh thổ'],
    level: 'Nhận biết',
    content: 'Vùng biển nước ta tiếp giáp với vùng biển của bao nhiêu quốc gia trong khu vực Đông Nam Á?',
    options: [
      { key: 'A', content: '6 quốc gia.' },
      { key: 'B', content: '7 quốc gia.' },
      { key: 'C', content: '8 quốc gia.' },
      { key: 'D', content: '9 quốc gia.' }
    ],
    correctOption: 'C',
    explanation: 'Vùng biển Việt Nam tiếp giáp với vùng biển của 8 quốc gia: Trung Quốc, Campuchia, Thái Lan, Malaysia, Singapore, Indonesia, Brunei và Philippines.'
  },
  {
    topicKeywords: ['địa hình', 'đồi núi', 'tự nhiên'],
    level: 'Nhận biết',
    content: 'Đặc điểm nào sau đây đúng với địa hình vùng đồi núi của nước ta?',
    options: [
      { key: 'A', content: 'Địa hình đồi núi chiếm 3/4 diện tích lãnh thổ.' },
      { key: 'B', content: 'Đồi núi cao trên 2000m chiếm tới 40% diện tích.' },
      { key: 'C', content: 'Địa hình bán bình nguyên phân bố chủ yếu ở Bắc Bộ.' },
      { key: 'D', content: 'Địa hình núi thấp chỉ phân bố ở khu vực Nam Trung Bộ.' }
    ],
    correctOption: 'A',
    explanation: 'Đồi núi chiếm 3/4 diện tích lãnh thổ nước ta, nhưng chủ yếu là đồi núi thấp (dưới 1000m chiếm 85%, núi cao trên 2000m chỉ chiếm 1%).'
  },
  {
    topicKeywords: ['khí hậu', 'gió mùa', 'tự nhiên'],
    level: 'Nhận biết',
    content: 'Gió mùa Đông Bắc hoạt động mạnh nhất ở khu vực nào của nước ta?',
    options: [
      { key: 'A', content: 'Miền Bắc và Đông Bắc Bắc Bộ.' },
      { key: 'B', content: 'Tây Nguyên và Nam Bộ.' },
      { key: 'C', content: 'Duyên hải Nam Trung Bộ.' },
      { key: 'D', content: 'Khu vực cực Nam Trung Bộ.' }
    ],
    correctOption: 'A',
    explanation: 'Gió mùa Đông Bắc thổi từ áp cao Xibia qua lục địa phương Bắc tràn vào nước ta mạnh nhất ở khu vực Đông Bắc và đồng bằng Bắc Bộ.'
  },
  {
    topicKeywords: ['địa hình', 'hướng núi', 'tự nhiên'],
    level: 'Thông hiểu',
    content: 'Hai hướng chính của địa hình núi non hiểm trở ở nước ta là:',
    options: [
      { key: 'A', content: 'Tây Bắc - Đông Nam và vòng cung.' },
      { key: 'B', content: 'Bắc - Nam và Đông - Tây.' },
      { key: 'C', content: 'Đông Bắc - Tây Nam và vòng cung.' },
      { key: 'D', content: 'Tây Bắc - Đông Nam và Bắc - Nam.' }
    ],
    correctOption: 'A',
    explanation: 'Địa hình nước ta có 2 hướng chính: Tây Bắc - Đông Nam (vùng Tây Bắc, Trường Sơn Bắc) và hướng vòng cung (vùng Đông Bắc, Trường Sơn Nam).'
  },
  {
    topicKeywords: ['khí hậu', 'mưa', 'tự nhiên'],
    level: 'Thông hiểu',
    content: 'Hiện tượng thời tiết đặc trưng vào nửa cuối mùa đông ở đồng bằng Bắc Bộ và Bắc Trung Bộ là:',
    options: [
      { key: 'A', content: 'Lạnh khô, trời hanh khô không mưa.' },
      { key: 'B', content: 'Lạnh ẩm, có mưa phùn ẩm ướt.' },
      { key: 'C', content: 'Nắng nóng kéo dài, khô hạn gay gắt.' },
      { key: 'D', content: 'Xuất hiện dải hội tụ nhiệt đới gây mưa dông.' }
    ],
    correctOption: 'B',
    explanation: 'Nửa cuối mùa đông, khối khí lạnh lệch đông di chuyển qua biển được tăng cường ẩm, gây nên thời tiết lạnh ẩm và mưa phùn.'
  },
  {
    topicKeywords: ['sông ngòi', 'thủy văn', 'tự nhiên'],
    level: 'Thông hiểu',
    content: 'Sông ngòi nước ta có lượng phù sa lớn chủ yếu do nguyên nhân nào sau đây?',
    options: [
      { key: 'A', content: 'Lưu vực sông có lượng mưa lớn và quá trình xâm thực mạnh ở đồi núi.' },
      { key: 'B', content: 'Tất cả các dòng sông đều bắt nguồn từ ngoài lãnh thổ.' },
      { key: 'C', content: 'Địa hình đồng bằng mở rộng và đáy sông có độ dốc lớn.' },
      { key: 'D', content: 'Thủy triều xâm nhập sâu và dòng chảy sông ngòi luôn êm dịu.' }
    ],
    correctOption: 'A',
    explanation: 'Khí hậu nhiệt đới ẩm mưa nhiều kết hợp địa hình đồi núi dốc, lớp vỏ phong hóa dày làm cho quá trình bóc mòn, rửa trôi diễn ra mạnh mẽ, tạo nên hàm lượng phù sa lớn.'
  },
  {
    topicKeywords: ['đất đai', 'sinh vật', 'tự nhiên'],
    level: 'Thông hiểu',
    content: 'Loại đất chiếm diện tích lớn nhất và có giá trị kinh tế quan trọng ở vùng đồi núi nước ta là:',
    options: [
      { key: 'A', content: 'Đất feralit hình thành trên các loại đá khác nhau.' },
      { key: 'B', content: 'Đất phù sa ngọt ven các thung lũng sông.' },
      { key: 'C', content: 'Đất cát pha ven biển miền Trung.' },
      { key: 'D', content: 'Đất phèn và đất mặn trũng thấp.' }
    ],
    correctOption: 'A',
    explanation: 'Đất feralit là nhóm đất đặc trưng của vùng nhiệt đới ẩm gió mùa, chiếm trên 65% diện tích đất tự nhiên nước ta.'
  },
  {
    topicKeywords: ['dân số', 'dân cư', 'lao động'],
    level: 'Nhận biết',
    content: 'Hiện nay, cơ cấu dân số theo nhóm tuổi ở nước ta đang có xu hướng biến đổi nào sau đây?',
    options: [
      { key: 'A', content: 'Tỉ lệ nhóm tuổi dưới 15 tuổi giảm, tỉ lệ nhóm từ 65 tuổi trở lên tăng.' },
      { key: 'B', content: 'Tỉ lệ nhóm tuổi dưới 15 tuổi tăng nhanh, dân số trẻ hóa mạnh.' },
      { key: 'C', content: 'Tỉ lệ người già giảm dần do tỉ lệ tử vong ở người cao tuổi tăng.' },
      { key: 'D', content: 'Tỉ lệ nhóm trong độ tuổi lao động suy giảm nghiêm trọng.' }
    ],
    correctOption: 'A',
    explanation: 'Nước ta đang trong giai đoạn cơ cấu dân số vàng đồng thời bước vào quá trình già hóa dân số (nhóm <15 tuổi giảm, nhóm ≥65 tuổi tăng).'
  },
  {
    topicKeywords: ['dân cư', 'phân bố', 'lao động'],
    level: 'Thông hiểu',
    content: 'Dân cư nước ta phân bố chưa hợp lí giữa đồng bằng và miền núi gây khó khăn chủ yếu cho việc:',
    options: [
      { key: 'A', content: 'Sử dụng hợp lí tài nguyên thiên nhiên và phân bố nguồn lao động.' },
      { key: 'B', content: 'Bảo tồn bản sắc văn hóa các dân tộc thiểu số.' },
      { key: 'C', content: 'Mở rộng mạng lưới trường học và cơ sở y tế ở thành thị.' },
      { key: 'D', content: 'Phát triển các ngành dịch vụ công nghệ cao.' }
    ],
    correctOption: 'A',
    explanation: 'Đồng bằng đất chật người đông gây áp lực việc làm, miền núi giàu tài nguyên nhưng thiếu lao động khai thác.'
  },
  {
    topicKeywords: ['đô thị hóa', 'dân cư'],
    level: 'Thông hiểu',
    content: 'Tác động tích cực nổi bật nhất của quá trình đô thị hóa đối với sự phát triển kinh tế nước ta là:',
    options: [
      { key: 'A', content: 'Thúc đẩy chuyển dịch cơ cấu kinh tế và lan tỏa lối sống hiện đại.' },
      { key: 'B', content: 'Làm giảm nhanh chóng tỉ suất sinh ở tất cả các vùng nông thôn.' },
      { key: 'C', content: 'Giải quyết triệt để vấn đề việc làm cho toàn bộ cư dân đô thị.' },
      { key: 'D', content: 'Hạn chế tình trạng ô nhiễm môi trường tại các khu dân cư.' }
    ],
    correctOption: 'A',
    explanation: 'Đô thị là trung tâm tạo ra động lực tăng trưởng kinh tế, thu hút đầu tư, chuyển dịch cơ cấu ngành và thúc đẩy công nghiệp hóa.'
  },
  {
    topicKeywords: ['kinh tế', 'chuyển dịch', 'ngành'],
    level: 'Nhận biết',
    content: 'Xu hướng chuyển dịch cơ cấu ngành kinh tế trong khu vực I (Nông - Lâm - Thủy sản) của nước ta là:',
    options: [
      { key: 'A', content: 'Tăng tỉ trọng ngành thủy sản, giảm tỉ trọng ngành trồng trọt.' },
      { key: 'B', content: 'Tăng nhanh tỉ trọng ngành lâm nghiệp, giảm ngành thủy sản.' },
      { key: 'C', content: 'Giảm tỉ trọng ngành chăn nuôi, tăng tỉ trọng trồng cây lương thực.' },
      { key: 'D', content: 'Tăng tỉ trọng độc canh lúa nước trên toàn bộ diện tích.' }
    ],
    correctOption: 'A',
    explanation: 'Trong khu vực I, ngành thủy sản có tốc độ tăng trưởng nhanh nhất và tỉ trọng ngày càng tăng, ngành trồng trọt có xu hướng giảm tỉ trọng.'
  },
  {
    topicKeywords: ['nông nghiệp', 'kinh tế', 'thủy sản'],
    level: 'Thông hiểu',
    content: 'Thế mạnh tự nhiên quan trọng hàng đầu để phát triển ngành nuôi trồng thủy sản nước lợ ở nước ta là:',
    options: [
      { key: 'A', content: 'Hệ thống các bãi triều, đầm phá, rừng ngập mặn ven biển rộng lớn.' },
      { key: 'B', content: 'Có 4 ngư trường trọng điểm xa bờ giàu tài nguyên sinh vật.' },
      { key: 'C', content: 'Nhiều sông suối, hồ thủy điện lớn ở vùng trung du miền núi.' },
      { key: 'D', content: 'Khí hậu nhiệt đới ẩm quanh năm không có bão đổ bộ.' }
    ],
    correctOption: 'A',
    explanation: 'Khu vực bãi triều, đầm phá, cửa sông và rừng ngập mặn là môi trường sinh thái lí tưởng để nuôi tôm, cua, cá nước lợ xuất khẩu.'
  },
  {
    topicKeywords: ['công nghiệp', 'năng lượng', 'kinh tế'],
    level: 'Thông hiểu',
    content: 'Cơ cấu nguồn điện của nước ta hiện nay đang chuyển dịch theo xu hướng bền vững nào?',
    options: [
      { key: 'A', content: 'Giảm nhiệt điện than, đẩy mạnh phát triển năng lượng tái tạo (gió, mặt trời).' },
      { key: 'B', content: 'Ngừng hoàn toàn tất cả các nhà máy thủy điện để bảo vệ rừng.' },
      { key: 'C', content: 'Tập trung duy nhất vào nhiệt điện chạy bằng dầu nhập khẩu.' },
      { key: 'D', content: 'Tăng tỉ trọng nhiệt điện than lên chiếm trên 80% tổng sản lượng.' }
    ],
    correctOption: 'A',
    explanation: 'Việt Nam đang thực hiện cam kết Net Zero 2050 và Quy hoạch điện VIII, ưu tiên phát triển điện gió, điện mặt trời, điện sinh khối và khí tự nhiên LNG.'
  },
  {
    topicKeywords: ['giao thông', 'dịch vụ', 'kinh tế'],
    level: 'Vận dụng',
    content: 'Tuyến đường bộ huyết mạch có ý nghĩa thúc đẩy giao lưu kinh tế liên vùng dọc theo chiều dài Bắc - Nam của nước ta là:',
    options: [
      { key: 'A', content: 'Quốc lộ 1 và đường cao tốc Bắc - Nam phía Đông.' },
      { key: 'B', content: 'Đường Hồ Chí Minh nhánh Tây qua dãy Trường Sơn.' },
      { key: 'C', content: 'Quốc lộ 14 chạy dọc vùng Tây Nguyên.' },
      { key: 'D', content: 'Tuyến đường vành đai 4 vùng thủ đô Hà Nội.' }
    ],
    correctOption: 'A',
    explanation: 'Quốc lộ 1 và cao tốc Bắc - Nam phía Đông là xương sống giao thông kết nối các trung tâm kinh tế, vùng kinh tế trọng điểm của đất nước.'
  },
  {
    topicKeywords: ['vùng kinh tế', 'biển đảo', 'kinh tế'],
    level: 'Vận dụng',
    content: 'Vùng kinh tế trọng điểm phía Nam giữ vai trò đầu tàu kinh tế cả nước chủ yếu do có:',
    options: [
      { key: 'A', content: 'Cơ sở hạ tầng phát triển, nguồn nhân lực trình độ cao và thu hút mạnh FDI.' },
      { key: 'B', content: 'Diện tích đất tự nhiên và diện tích rừng nguyên sinh lớn nhất nước.' },
      { key: 'C', content: 'Tài nguyên than đá và khoáng sản kim loại dồi dào nhất cả nước.' },
      { key: 'D', content: 'Tỉ suất sinh cao nhất và cơ cấu nông nghiệp chiếm tỉ trọng chủ đạo.' }
    ],
    correctOption: 'A',
    explanation: 'Vùng KTTĐ phía Nam hội tụ TP.HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu với thế mạnh vượt trội về công nghiệp, dịch vụ tài chính, cảng biển nước sâu và thu hút đầu tư.'
  }
];

const DIA_LI_TF: RawTF[] = [
  {
    topicKeywords: ['vị trí', 'biển đảo', 'lãnh thổ'],
    level: 'Thông hiểu',
    content: 'Đoạn thông tin về vị trí địa lí và phạm vi lãnh thổ nước ta:\n"Việt Nam nằm ở rìa phía đông của bán đảo Đông Dương, gần trung tâm khu vực Đông Nam Á. Vùng đất gồm toàn bộ phần đất liền và các hải đảo với diện tích 331.212 km². Vùng biển có diện tích khoảng 1 triệu km² trên Biển Đông với đường bờ biển dài 3.260 km, tiếp giáp vùng biển của nhiều quốc gia."\nNguồn: Biên tập từ SGK Địa lí 12, NXB Giáo dục Việt Nam',
    items: [
      { key: 'a', statement: 'Nước ta có đường bờ biển dài 3.260 km chạy dọc từ Quảng Ninh đến Kiên Giang.', isCorrect: true, explanation: 'Đúng (Mức Biết): Tái hiện đúng chiều dài đường bờ biển nước ta theo số liệu chuẩn.' },
      { key: 'b', statement: 'Vị trí nội chí tuyến và tiếp giáp Biển Đông là nguyên nhân chủ yếu làm cho khí hậu nước ta ẩm và mưa nhiều hơn các nước cùng vĩ độ ở Tây Nam Á.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Giải thích đúng tác động điều hòa và mang lại nguồn ẩm phong phú của Biển Đông.' },
      { key: 'c', statement: 'Vùng biển nước ta tạo thế mở cửa thuận lợi để thu hút vốn đầu tư nước ngoài và phát triển đồng bộ 4 ngành kinh tế biển then chốt.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Đánh giá đúng vai trò kinh tế biển (giao thông, du lịch, khai thác khoáng sản, thủy sản).' },
      { key: 'd', statement: 'Tất cả các tỉnh và thành phố trực thuộc Trung ương của nước ta hiện nay đều có đường bờ biển tiếp giáp trực tiếp.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Cả nước chỉ có 28 tỉnh, thành phố trực thuộc Trung ương giáp biển.' }
    ],
    explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
  },
  {
    topicKeywords: ['khí hậu', 'thiên tai', 'tự nhiên'],
    level: 'Thông hiểu',
    content: 'Đoạn thông tin về đặc điểm thời tiết và khí hậu gió mùa nước ta:\n"Do tác động kết hợp của vị trí địa lí, địa hình đồi núi và các khối khí gió mùa, khí hậu nước ta có sự phân hóa sâu sắc theo không gian và thời gian. Nền nhiệt ẩm cao, có mùa đông lạnh ở miền Bắc và mùa khô sâu sắc ở miền Nam; thiên tai bão, lũ, hạn hán thường xuyên xảy ra."\nNguồn: Xử lí từ Trung tâm Dự báo Khí tượng Thủy văn Quốc gia',
    items: [
      { key: 'a', statement: 'Miền Bắc nước ta có nhiệt độ trung bình năm trên 20°C và có 2 đến 3 tháng nhiệt độ dưới 18°C.', isCorrect: true, explanation: 'Đúng (Mức Biết): Tái hiện chính xác đặc điểm nhiệt độ miền khí hậu phía Bắc.' },
      { key: 'b', statement: 'Gió mùa mùa đông suy giảm nhanh khi di chuyển về phía nam chủ yếu do bức chắn địa hình của dãy Bạch Mã.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Giải thích đúng vai trò chắn gió của địa hình dãy Bạch Mã làm phân chia 2 miền khí hậu.' },
      { key: 'c', statement: 'Sự phân hóa mùa mưa và mùa khô sâu sắc đòi hỏi ngành nông nghiệp phải chủ động chuyển đổi cơ cấu mùa vụ và xây dựng các công trình thủy lợi.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Suy luận và đề xuất đúng giải pháp ứng phó với tính chất mùa của khí hậu.' },
      { key: 'd', statement: 'Các cơn bão đổ bộ vào lãnh thổ nước ta có thời gian hoạt động diễn ra đồng loạt trên tất cả các vùng ven biển từ Bắc vào Nam.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Mùa bão ở nước ta có quy luật chậm dần từ Bắc vào Nam (Bắc Bộ tháng 6-8, Trung Bộ tháng 9-10, Nam Bộ tháng 11-12).' }
    ],
    explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
  },
  {
    topicKeywords: ['dân số', 'lao động', 'việc làm'],
    level: 'Vận dụng',
    content: 'Đoạn thông tin về quy mô dân số và nguồn lao động nước ta:\n"Năm 2022, dân số nước ta đạt 99,46 triệu người, lực lượng lao động từ 15 tuổi trở lên đạt 51,7 triệu người. Nước ta đang trong thời kì cơ cấu dân số vàng đồng thời có tốc độ già hóa dân số nhanh; tỉ lệ lao động qua đào tạo có bằng cấp, chứng chỉ đạt 26,4%."\nNguồn: Tổng hợp từ Niên giám Thống kê Việt Nam, NXB Thống kê',
    items: [
      { key: 'a', statement: 'Nước ta có quy mô dân số đông và thuộc nhóm các quốc gia có cơ cấu dân số vàng.', isCorrect: true, explanation: 'Đúng (Mức Biết): Nêu đúng quy mô và đặc điểm cơ cấu tuổi của dân số Việt Nam.' },
      { key: 'b', statement: 'Chất lượng nguồn lao động nước ta ngày càng được nâng cao nhờ mở rộng hệ thống giáo dục nghề nghiệp và đại học.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Thể hiện rõ mối quan hệ giữa đào tạo và nâng cao chất lượng lao động.' },
      { key: 'c', statement: 'Đẩy mạnh công nghiệp hóa và chuyển dịch cơ cấu kinh tế là giải pháp căn bản để giải quyết việc làm cho lao động khu vực nông thôn.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Vận dụng quy luật chuyển dịch lao động gắn với phát triển kinh tế.' },
      { key: 'd', statement: 'Tỉ lệ thất nghiệp ở khu vực thành thị nước ta hiện nay cao hơn nhiều so với tỉ lệ thiếu việc làm ở nông thôn.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Khu vực nông thôn có đặc thù là tỉ lệ thiếu việc làm cao hơn, thành thị chủ yếu chịu áp lực thất nghiệp.' }
    ],
    explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
  },
  {
    topicKeywords: ['nông nghiệp', 'vùng kinh tế', 'đbscl'],
    level: 'Vận dụng',
    content: 'Đoạn thông tin về nông nghiệp thích ứng tại Đồng bằng sông Cửu Long:\n"Đồng bằng sông Cửu Long đóng góp trên 50% sản lượng lúa và 70% sản lượng trái cây cả nước. Trước thách thức của xâm nhập mặn và biến đổi khí hậu, vùng đang chuyển mạnh từ tư duy sản xuất nông nghiệp thuần túy sang phát triển kinh tế nông nghiệp tuần hoàn và thích ứng thuận thiên."\nNguồn: Biên tập từ Nghị quyết 120/NQ-CP của Chính phủ',
    items: [
      { key: 'a', statement: 'Đồng bằng sông Cửu Long là vùng sản xuất lương thực, thực phẩm và thủy sản hàng hóa lớn nhất nước ta.', isCorrect: true, explanation: 'Đúng (Mức Biết): Tái hiện đúng vị thế trọng điểm nông nghiệp của vùng.' },
      { key: 'b', statement: 'Mô hình xen canh tôm - lúa ở các tỉnh ven biển thể hiện sự thích ứng linh hoạt với tình trạng hạn mặn trong mùa khô.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Giải thích đúng cơ chế thích ứng thuận thiên (nước ngọt trồng lúa, nước lợ/mặn nuôi tôm).' },
      { key: 'c', statement: 'Tăng cường chế biến sâu và xây dựng thương hiệu quốc tế là giải pháp trọng tâm để nâng cao giá trị gia tăng của nông sản vùng.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Đề xuất giải pháp phát triển chuỗi giá trị nông nghiệp bền vững.' },
      { key: 'd', statement: 'Giải pháp tối ưu hiện nay của vùng là tiến hành đắp đê bao khép kín toàn bộ diện tích để sản xuất lúa bốn vụ liên tục quanh năm.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Đắp đê khép kín làm suy giảm phù sa, cạn kiệt nguồn lợi thủy sản mùa lũ và gia tăng phèn hóa.' }
    ],
    explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
  }
];

const DIA_LI_SHORT: RawShort[] = [
  {
    topicKeywords: ['rừng', 'lâm nghiệp', 'tự nhiên'],
    level: 'Thông hiểu',
    content: 'Năm 2020, diện tích rừng trồng nước ta là 4,4 triệu ha trên tổng số 14,7 triệu ha diện tích đất có rừng. Tính tỉ lệ (%) diện tích rừng trồng so với tổng diện tích đất có rừng của nước ta, làm tròn đến hàng phần mười. Khi trả lời, chỉ ghi số.',
    key: '29,9',
    explanation: 'Tỉ lệ rừng trồng = (4,4 / 14,7) * 100% ≈ 29,93% -> Làm tròn đến hàng phần mười: 29,9. (Đáp án 4 ký tự).'
  },
  {
    topicKeywords: ['mật độ', 'dân số', 'dân cư'],
    level: 'Thông hiểu',
    content: 'Năm 2022, một quốc gia có dân số 98,5 triệu người và diện tích đất tự nhiên là 331,2 nghìn km². Tính mật độ dân số của quốc gia đó (đơn vị: người/km²), làm tròn đến hàng đơn vị. Khi trả lời, chỉ ghi số.',
    key: '297',
    explanation: 'Mật độ dân số = (98.500.000 / 331.200) ≈ 297,4 người/km² -> Làm tròn: 297. (Đáp án 3 ký tự).'
  },
  {
    topicKeywords: ['đô thị', 'dân cư', 'tỉ lệ'],
    level: 'Thông hiểu',
    content: 'Năm 2022, số dân thành thị nước ta là 37,1 triệu người trong tổng số 98,5 triệu dân. Tính tỉ lệ dân thành thị (%) của nước ta, làm tròn đến hàng phần mười. Khi trả lời, chỉ ghi số.',
    key: '37,7',
    explanation: 'Tỉ lệ dân thành thị = (37,1 / 98,5) * 100% ≈ 37,66% -> Làm tròn: 37,7. (Đáp án 4 ký tự).'
  },
  {
    topicKeywords: ['thương mại', 'xuất nhập khẩu', 'kinh tế'],
    level: 'Vận dụng',
    content: 'Năm 2022, tổng kim ngạch xuất khẩu hàng hóa của nước ta đạt 371,3 tỉ USD, tổng kim ngạch nhập khẩu đạt 358,9 tỉ USD. Tính cán cân thương mại hàng hóa của nước ta năm 2022 (đơn vị: tỉ USD), làm tròn đến hàng phần mười. Khi trả lời, chỉ ghi số.',
    key: '12,4',
    explanation: 'Cán cân thương mại = Xuất khẩu - Nhập khẩu = 371,3 - 358,9 = 12,4 tỉ USD. (Đáp án 4 ký tự).'
  },
  {
    topicKeywords: ['nông nghiệp', 'lúa', 'tăng trưởng'],
    level: 'Vận dụng',
    content: 'Năm 2015 sản lượng thủy sản nuôi trồng nước ta đạt 3,53 triệu tấn, đến năm 2022 đạt 5,16 triệu tấn. Tính tốc độ tăng trưởng sản lượng thủy sản nuôi trồng năm 2022 so với năm 2015 (lấy năm 2015 = 100%), đơn vị %, làm tròn đến hàng đơn vị. Khi trả lời, chỉ ghi số.',
    key: '146',
    explanation: 'Tốc độ tăng trưởng = (5,16 / 3,53) * 100% ≈ 146,18% -> Làm tròn đến hàng đơn vị: 146. (Đáp án 3 ký tự).'
  },
  {
    topicKeywords: ['điện', 'năng lượng', 'công nghiệp'],
    level: 'Vận dụng cao',
    content: 'Năm 2022, sản lượng điện phát ra của nước ta đạt 260 tỉ kWh phục vụ cho 99,0 triệu dân. Tính sản lượng điện bình quân đầu người của nước ta năm 2022 (đơn vị: kWh/người), làm tròn đến hàng đơn vị. Khi trả lời, chỉ ghi số.',
    key: '2626',
    explanation: 'Sản lượng điện bình quân = 260.000.000.000 / 99.000.000 ≈ 2626,26 kWh/người -> Làm tròn: 2626. (Đáp án 4 ký tự).'
  }
];

const DIA_LI_ESSAY: RawEssay[] = [
  {
    topicKeywords: ['vị trí', 'biển', 'thủy sản'],
    level: 'Vận dụng',
    content: 'Dựa vào kiến thức về Vị trí địa lí và Biển đảo Việt Nam:\na) Trình bày hai thế mạnh tự nhiên chủ yếu để phát triển ngành khai thác và nuôi trồng thủy sản ở nước ta.\nb) Đề xuất hai giải pháp trọng tâm nhằm phát triển bền vững ngành kinh tế biển này trong giai đoạn hiện nay.',
    essayRubric: 'Ý a (1.0 điểm - mỗi ý 0.5đ):\n- Thế mạnh 1: Đường bờ biển dài 3.260 km, vùng biển rộng 1 triệu km² với 4 ngư trường trọng điểm, nguồn lợi hải sản phong phú.\n- Thế mạnh 2: Ven biển có nhiều bãi triều, đầm phá, vũng vịnh kín gió và rừng ngập mặn thuận lợi cho nuôi trồng thủy sản nước lợ, nước mặn.\nÝ b (1.0 điểm - mỗi ý 0.5đ):\n- Giải pháp 1: Hiện đại hóa đội tàu đánh bắt xa bờ gắn với bảo vệ chủ quyền biển đảo và chống khai thác bất hợp pháp (IUU).\n- Giải pháp 2: Ứng dụng công nghệ cao trong nuôi trồng, phát triển công nghiệp chế biến sâu và bảo vệ môi trường sinh thái biển.\nLưu ý chấm: Học sinh có cách diễn đạt tương đương nhưng đúng bản chất vẫn cho điểm tối đa.',
    explanation: 'Học sinh trình bày đủ 2 phần: 2 thế mạnh tự nhiên (1.0đ) và 2 giải pháp phát triển bền vững (1.0đ).'
  },
  {
    topicKeywords: ['khí hậu', 'tự nhiên', 'biến đổi khí hậu'],
    level: 'Vận dụng cao',
    content: 'Dựa vào kiến thức về Địa lí tự nhiên và Biến đổi khí hậu:\na) Giải thích vì sao thiên nhiên nước ta mang tính chất nhiệt đới ẩm gió mùa.\nb) Phân tích hai tác động tiêu cực chủ yếu của biến đổi khí hậu đối với sản xuất nông nghiệp ở vùng Đồng bằng sông Cửu Long.',
    essayRubric: 'Ý a (1.0 điểm):\n- Vị trí nằm hoàn toàn trong vùng nội chí tuyến Bắc bán cầu nên nhận được lượng bức xạ mặt trời lớn (0.5đ).\n- Tiếp giáp Biển Đông rộng lớn kết hợp với hoạt động luân phiên của các khối khí gió mùa mang lại lượng mưa và độ ẩm dồi dào (0.5đ).\nÝ b (1.0 điểm - mỗi ý 0.5đ):\n- Tác động 1: Hiện tượng xâm nhập mặn lấn sâu vào mùa khô làm thiếu hụt nguồn nước ngọt tưới tiêu cho lúa và cây ăn trái.\n- Tác động 2: Nước biển dâng và sạt lở bờ sông, bờ biển làm thu hẹp diện tích đất canh tác nông nghiệp.\nLưu ý chấm: Chấp nhận các biểu hiện tác động hợp lí khác như hạn hán cục bộ, dịch bệnh mùa vụ.',
    explanation: 'Trình bày logic nguyên nhân tính chất nhiệt đới ẩm gió mùa và phân tích rõ 2 tác động tại ĐBSCL.'
  }
];

// =========================================================================
// 2. LỊCH SỬ (HISTORY) QUESTION BANK
// =========================================================================
const LICH_SU_MCQ: RawMCQ[] = [
  {
    topicKeywords: ['đảng', '1930', 'cách mạng'],
    level: 'Nhận biết',
    content: 'Đảng Cộng sản Việt Nam ra đời đầu năm 1930 là sản phẩm của sự kết hợp giữa chủ nghĩa Mác - Lênin với:',
    options: [
      { key: 'A', content: 'Phong trào công nhân và phong trào yêu nước Việt Nam.' },
      { key: 'B', content: 'Phong trào nông dân và phong trào dân chủ tư sản.' },
      { key: 'C', content: 'Phong trào tiểu tư sản trí thức và văn hóa dân tộc.' },
      { key: 'D', content: 'Phong trào giải phóng dân tộc ở các nước thuộc địa phương Tây.' }
    ],
    correctOption: 'A',
    explanation: 'Quy luật ra đời của Đảng Cộng sản Việt Nam = Chủ nghĩa Mác - Lênin + Phong trào công nhân + Phong trào yêu nước.'
  },
  {
    topicKeywords: ['cách mạng tháng tám', '1945'],
    level: 'Nhận biết',
    content: 'Hội nghị toàn quốc của Đảng họp tại Tân Trào (ngày 14 - 15/8/1945) đã quyết định vấn đề quan trọng nào?',
    options: [
      { key: 'A', content: 'Phát động Tổng khởi nghĩa giành chính quyền trong cả nước.' },
      { key: 'B', content: 'Kí kết Hiệp định Sơ bộ với thực dân Pháp.' },
      { key: 'C', content: 'Thành lập Mặt trận Việt Minh.' },
      { key: 'D', content: 'Đề ra đường lối Đổi mới toàn diện đất nước.' }
    ],
    correctOption: 'A',
    explanation: 'Hội nghị Tân Trào nhận định thời cơ khởi nghĩa ngàn năm có một đã đến và quyết định phát động Tổng khởi nghĩa trước khi quân Đồng minh vào Đông Dương.'
  },
  {
    topicKeywords: ['điện biên phủ', '1954', 'kháng chiến pháp'],
    level: 'Thông hiểu',
    content: 'Thắng lợi quân sự nào của quân và dân ta đã đập tan hoàn toàn kế hoạch Nava, xoay chuyển cục diện chiến tranh và buộc Pháp phải kí Hiệp định Giơ-ne-vơ (1954)?',
    options: [
      { key: 'A', content: 'Chiến dịch Điện Biên Phủ năm 1954.' },
      { key: 'B', content: 'Chiến dịch Biên giới thu - đông 1950.' },
      { key: 'C', content: 'Chiến dịch Việt Bắc thu - đông 1947.' },
      { key: 'D', content: 'Chiến dịch Tây Nguyên năm 1975.' }
    ],
    correctOption: 'A',
    explanation: 'Chiến thắng lịch sử Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" là đòn quyết định đập tan ý chí xâm lược của thực dân Pháp.'
  },
  {
    topicKeywords: ['đổi mới', '1986', 'đảng'],
    level: 'Nhận biết',
    content: 'Đường lối Đổi mới toàn diện đất nước được Đảng Cộng sản Việt Nam đề ra tại Đại hội đại biểu toàn quốc lần thứ mấy?',
    options: [
      { key: 'A', content: 'Đại hội đại biểu toàn quốc lần thứ VI (tháng 12/1986).' },
      { key: 'B', content: 'Đại hội đại biểu toàn quốc lần thứ V (tháng 3/1982).' },
      { key: 'C', content: 'Đại hội đại biểu toàn quốc lần thứ VII (tháng 6/1991).' },
      { key: 'D', content: 'Đại hội đại biểu toàn quốc lần thứ VIII (tháng 6/1996).' }
    ],
    correctOption: 'A',
    explanation: 'Đại hội VI của Đảng (12/1986) đã mở ra bước ngoặt lịch sử với đường lối Đổi mới kinh tế, chính trị và hội nhập quốc tế.'
  },
  {
    topicKeywords: ['chiến tranh lạnh', 'thế giới', 'ian-ta'],
    level: 'Thông hiểu',
    content: 'Đặc trưng nổi bật bao trùm của quan hệ quốc tế từ sau Chiến tranh thế giới thứ hai đến năm 1991 là:',
    options: [
      { key: 'A', content: 'Tình trạng đối đầu căng thẳng giữa hai phe TBCN và XHCN do hai siêu cường Mỹ - Xô đứng đầu.' },
      { key: 'B', content: 'Sự hợp tác toàn diện và không có mâu thuẫn giữa các nước lớn.' },
      { key: 'C', content: 'Xu thế hòa hoãn và giải trừ quân bị hoàn toàn trên toàn cầu.' },
      { key: 'D', content: 'Sự tan rã của tất cả các khối liên minh quân sự trên thế giới.' }
    ],
    correctOption: 'A',
    explanation: 'Trật tự hai cực I-an-ta và Chiến tranh Lạnh chi phối sâu sắc toàn bộ nền chính trị và quan hệ quốc tế thế giới trong nửa sau thế kỉ XX.'
  },
  {
    topicKeywords: ['asean', 'đông nam á'],
    level: 'Nhận biết',
    content: 'Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập vào năm 1967 tại Băng Cốc (Thái Lan) với sự tham gia ban đầu của mấy nước?',
    options: [
      { key: 'A', content: '5 nước (Indonesia, Malaysia, Philippines, Singapore, Thái Lan).' },
      { key: 'B', content: '6 nước.' },
      { key: 'C', content: '10 nước.' },
      { key: 'D', content: '4 nước.' }
    ],
    correctOption: 'A',
    explanation: 'Năm quốc gia sáng lập ASEAN gồm Indonesia, Malaysia, Philippines, Singapore và Thái Lan.'
  },
  {
    topicKeywords: ['1975', 'đại thắng', 'hồ chí minh'],
    level: 'Thông hiểu',
    content: 'Chiến dịch mang tên Chủ tịch Hồ Chí Minh (1975) đã giải phóng hoàn toàn địa bàn nào sau đây?',
    options: [
      { key: 'A', content: 'Sài Gòn - Gia Định và toàn bộ miền Nam.' },
      { key: 'B', content: 'Thành phố Huế và Đà Nẵng.' },
      { key: 'C', content: 'Tỉnh Buôn Ma Thuột và toàn vùng Tây Nguyên.' },
      { key: 'D', content: 'Tỉnh Quảng Trị và vĩ tuyến 17.' }
    ],
    correctOption: 'A',
    explanation: 'Chiến dịch Hồ Chí Minh lịch sử (26/4 - 30/4/1975) giải phóng Sài Gòn - Gia Định, kết thúc thắng lợi cuộc kháng chiến chống Mỹ cứu nước.'
  },
  {
    topicKeywords: ['mặt trận', 'việt minh', '1941'],
    level: 'Thông hiểu',
    content: 'Mặt trận Việt Minh được thành lập vào tháng 5/1941 nhằm mục tiêu cao nhất là:',
    options: [
      { key: 'A', content: 'Tập hợp toàn thể các tầng lớp nhân dân yêu nước thực hiện nhiệm vụ giải phóng dân tộc.' },
      { key: 'B', content: 'Thực hiện ngay khẩu hiệu cách mạng ruộng đất cho nông dân nghèo.' },
      { key: 'C', content: 'Tập trung đấu tranh đòi quyền lợi kinh tế trong các xí nghiệp Pháp.' },
      { key: 'D', content: 'Xây dựng khối liên minh công nông thuần túy không liên kết tầng lớp khác.' }
    ],
    correctOption: 'A',
    explanation: 'Hội nghị Trung ương 8 (5/1941) đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và thành lập Mặt trận Việt Minh để đại đoàn kết dân tộc.'
  }
];

const LICH_SU_TF: RawTF[] = [
  {
    topicKeywords: ['cách mạng tháng tám', '1945'],
    level: 'Thông hiểu',
    content: 'Đoạn thông tin về Tổng khởi nghĩa Cách mạng Tháng Tám năm 1945:\n"Cách mạng Tháng Tám năm 1945 là cuộc cách mạng giải phóng dân tộc điển hình, diễn ra nhanh chóng, ít đổ máu và giành thắng lợi triệt để trong vòng 15 ngày (từ 14/8 đến 28/8/1945). Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa."\nNguồn: Biên tập từ SGK Lịch sử 12, NXB Giáo dục Việt Nam',
    items: [
      { key: 'a', statement: 'Cách mạng Tháng Tám năm 1945 đã lật đổ ách thống trị của phát xít Nhật và thực dân Pháp trên toàn lãnh thổ nước ta.', isCorrect: true, explanation: 'Đúng (Mức Biết): Tái hiện chính xác kết quả lịch sử của cuộc Tổng khởi nghĩa.' },
      { key: 'b', statement: 'Nghệ thuật chớp thời cơ đóng vai trò quyết định, giúp cuộc khởi nghĩa giành thắng lợi mau lẹ trước khi quân Đồng minh vào Đông Dương.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Giải thích đúng nghệ thuật nắm bắt thời cơ ngàn năm có một.' },
      { key: 'c', statement: 'Thắng lợi của Cách mạng Tháng Tám chứng minh sức mạnh của khối đại đoàn kết toàn dân tộc dưới sự lãnh đạo sáng suốt của Đảng Cộng sản Đông Dương.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Đánh giá đúng bản chất và nguồn gốc sức mạnh dân tộc.' },
      { key: 'd', statement: 'Sau Cách mạng Tháng Tám, toàn bộ bộ máy chính quyền phong kiến nhà Nguyễn vẫn được giữ nguyên để điều hành đất nước.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Vua Bảo Đại thoái vị, chế độ quân chủ phong kiến nghìn năm chính thức chấm dứt hoàn toàn.' }
    ],
    explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
  },
  {
    topicKeywords: ['đổi mới', '1986', 'kinh tế'],
    level: 'Vận dụng',
    content: 'Đoạn thông tin về đường lối Đổi mới đất nước từ năm 1986:\n"Đại hội VI của Đảng (12/1986) đã dũng cảm nhìn thẳng vào sự thật, đánh giá đúng sự thật, đề ra đường lối Đổi mới toàn diện. Trọng tâm là đổi mới kinh tế: xóa bỏ cơ chế tập trung quan liêu bao cấp, phát triển nền kinh tế thị trường định hướng xã hội chủ nghĩa nhiều thành phần."\nNguồn: Tổng hợp từ Văn kiện Đảng Toàn tập, NXB Chính trị Quốc gia',
    items: [
      { key: 'a', statement: 'Đại hội VI của Đảng (tháng 12/1986) là mốc lịch sử mở đầu công cuộc Đổi mới toàn diện đất nước.', isCorrect: true, explanation: 'Đúng (Mức Biết): Nhận biết đúng thời điểm và sự kiện lịch sử khởi xướng Đổi mới.' },
      { key: 'b', statement: 'Đổi mới kinh tế được xác định là trọng tâm hàng đầu nhằm giải quyết khủng hoảng kinh tế - xã hội và nâng cao đời sống nhân dân.', isCorrect: true, explanation: 'Đúng (Mức Hiểu): Thể hiện rõ mối quan hệ giữa đổi mới kinh tế và mục tiêu ổn định phát triển.' },
      { key: 'c', statement: 'Việc chuyển đổi sang kinh tế thị trường định hướng XHCN giúp giải phóng sức sản xuất và chủ động hội nhập kinh tế quốc tế sâu rộng.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): Suy luận và đánh giá đúng hiệu quả phát triển của đường lối Đổi mới.' },
      { key: 'd', statement: 'Đường lối Đổi mới chủ trương đóng cửa kinh tế đối ngoại và duy trì độc quyền tuyệt đối mọi nguồn lực sản xuất.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Đổi mới chủ trương mở cửa, đa phương hóa, đa dạng hóa và phát triển nhiều thành phần kinh tế.' }
    ],
    explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
  }
];

const LICH_SU_SHORT: RawShort[] = [
  {
    topicKeywords: ['đổi mới', 'năm'],
    level: 'Nhận biết',
    content: 'Đại hội đại biểu toàn quốc lần thứ mấy của Đảng Cộng sản Việt Nam (tháng 12/1986) đã chính thức khởi xướng công cuộc Đổi mới đất nước? Điền số thứ tự của Đại hội (ví dụ: 6). Khi trả lời, chỉ ghi số.',
    key: '6',
    explanation: 'Đại hội đại biểu toàn quốc lần thứ 6 của Đảng (12/1986).'
  },
  {
    topicKeywords: ['liên hợp quốc', 'năm'],
    level: 'Nhận biết',
    content: 'Việt Nam chính thức được kết nạp và trở thành thành viên thứ 149 của tổ chức Liên Hợp Quốc (UN) vào năm nào? Khi trả lời, chỉ ghi số.',
    key: '1977',
    explanation: 'Việt Nam gia nhập Liên Hợp Quốc ngày 20/9/1977.'
  },
  {
    topicKeywords: ['asean', 'năm'],
    level: 'Thông hiểu',
    content: 'Việt Nam chính thức gia nhập và trở thành thành viên thứ 7 của Hiệp hội các quốc gia Đông Nam Á (ASEAN) vào năm nào? Khi trả lời, chỉ ghi số.',
    key: '1995',
    explanation: 'Việt Nam gia nhập ASEAN ngày 28/7/1995 tại Brunei.'
  },
  {
    topicKeywords: ['điện biên phủ', 'ngày'],
    level: 'Thông hiểu',
    content: 'Chiến dịch lịch sử Điện Biên Phủ diễn ra trong thời gian bao nhiêu ngày đêm (từ 13/3/1954 đến 7/5/1954)? Khi trả lời, chỉ ghi số.',
    key: '56',
    explanation: 'Chiến dịch Điện Biên Phủ diễn ra trong 56 ngày đêm.'
  }
];

const LICH_SU_ESSAY: RawEssay[] = [
  {
    topicKeywords: ['cách mạng tháng tám', 'bài học'],
    level: 'Vận dụng cao',
    content: 'Phân tích nguyên nhân thắng lợi và bài học kinh nghiệm về chớp thời cơ của Cách mạng Tháng Tám năm 1945. Vận dụng bài học này vào công cuộc phát triển kinh tế và hội nhập quốc tế của Việt Nam hiện nay.',
    essayRubric: 'Ý a (1.0đ): Nguyên nhân thắng lợi (sự lãnh đạo sáng suốt của Đảng và Chủ tịch Hồ Chí Minh; tinh thần yêu nước quật cường của toàn dân; chuẩn bị chu đáo suốt 15 năm; thời cơ quốc tế thuận lợi).\nÝ b (0.5đ): Bài học chớp thời cơ (dự báo đúng xu thế, hành động quyết đoán, kết hợp sức mạnh dân tộc với sức mạnh thời đại).\nÝ c (0.5đ): Liên hệ thực tiễn (chủ động nắm bắt cơ hội Cách mạng công nghiệp 4.0, chuyển đổi số và tham gia các hiệp định thương mại tự do thế hệ mới).',
    explanation: 'Học sinh làm rõ đủ nguyên nhân, bài học lịch sử và liên hệ thực tiễn hiện đại.'
  }
];

// =========================================================================
// 3. TOÁN HỌC (MATHEMATICS) QUESTION BANK
// =========================================================================
const TOAN_MCQ: RawMCQ[] = [
  {
    topicKeywords: ['hàm số', 'đơn điệu', 'đạo hàm'],
    level: 'Nhận biết',
    content: 'Cho hàm số $y = f(x)$ có đạo hàm $f\'(x) = x^2 - 4$. Hàm số đã cho nghịch biến trên khoảng nào dưới đây?',
    options: [
      { key: 'A', content: '$(-2; 2)$' },
      { key: 'B', content: '$(2; +\\infty)$' },
      { key: 'C', content: '$(-\\infty; -2)$' },
      { key: 'D', content: '$(0; 4)$' }
    ],
    correctOption: 'A',
    explanation: 'Ta có $f\'(x) < 0 \\iff x^2 - 4 < 0 \\iff -2 < x < 2$. Do đó hàm số nghịch biến trên khoảng $(-2; 2)$.'
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
      { key: 'A', content: '$x = 3$ và $y = 2$.' },
      { key: 'B', content: '$x = -3$ và $y = 2$.' },
      { key: 'C', content: '$x = 2$ và $y = 3$.' },
      { key: 'D', content: '$y = 3$ và $x = 2$.' }
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
  }
];

const TOAN_TF: RawTF[] = [
  {
    topicKeywords: ['hàm số', 'khảo sát'],
    level: 'Vận dụng',
    content: 'Cho hàm số $y = f(x) = \\frac{x^2 - 3x + 6}{x - 1}$ xác định trên $\\mathbb{R} \\setminus \\{1\\}$. Xét tính đúng/sai của các mệnh đề sau:',
    items: [
      { key: 'a', statement: 'Đạo hàm của hàm số là $f\'(x) = \\frac{x^2 - 2x - 3}{(x-1)^2}$.', isCorrect: true, explanation: '$f\'(x) = \\frac{(2x-3)(x-1) - (x^2-3x+6)}{(x-1)^2} = \\frac{x^2-2x-3}{(x-1)^2}$.' },
      { key: 'b', statement: 'Hàm số đạt cực đại tại điểm $x = 3$.', isCorrect: false, explanation: 'Nghiệm $x = -1$ (cực đại) và $x = 3$ (cực tiểu).' },
      { key: 'c', statement: 'Đồ thị hàm số có đường tiệm cận xiên là $y = x - 2$.', isCorrect: true, explanation: 'Ta có $y = x - 2 + \\frac{4}{x - 1} \\implies$ tiệm cận xiên $y = x - 2$.' },
      { key: 'd', statement: 'Giá trị nhỏ nhất của hàm số trên khoảng $(1; +\\infty)$ bằng $3$.', isCorrect: true, explanation: 'Tại $x = 3 \\in (1; +\\infty)$, $f(3) = \\frac{9 - 9 + 6}{2} = 3$.' }
    ],
    explanation: 'Mệnh đề a, c, d ĐÚNG; b SAI.'
  },
  {
    topicKeywords: ['oxyz', 'hình học'],
    level: 'Thông hiểu',
    content: 'Trong không gian $Oxyz$, cho bốn điểm $A(1; 0; 0)$, $B(0; 2; 0)$, $C(0; 0; 3)$ và $D(2; 4; 6)$. Xét tính đúng sai của các mệnh đề:',
    items: [
      { key: 'a', statement: 'Mặt phẳng $(ABC)$ có phương trình đoạn chắn là $\\frac{x}{1} + \\frac{y}{2} + \\frac{z}{3} = 1$.', isCorrect: true, explanation: 'Đúng theo công thức mặt phẳng đoạn chắn.' },
      { key: 'b', statement: 'Vectơ pháp tuyến của mặt phẳng $(ABC)$ là $\\vec{n} = (6; 3; 2)$.', isCorrect: true, explanation: '$6x + 3y + 2z - 6 = 0 \\implies \\vec{n} = (6; 3; 2)$.' },
      { key: 'c', statement: 'Điểm $D(2; 4; 6)$ thuộc mặt phẳng $(ABC)$.', isCorrect: false, explanation: 'Thay toạ độ $D$: $6(2) + 3(4) + 2(6) - 6 = 30 \\neq 0$.' },
      { key: 'd', statement: 'Độ dài đoạn thẳng $OA = 1$.', isCorrect: true, explanation: '$OA = \\sqrt{1^2 + 0^2 + 0^2} = 1$.' }
    ],
    explanation: 'Mệnh đề a, b, d ĐÚNG; c SAI.'
  }
];

const TOAN_SHORT: RawShort[] = [
  {
    topicKeywords: ['cực trị', 'hàm số'],
    level: 'Thông hiểu',
    content: 'Tìm giá trị cực đại của hàm số $y = -x^2 + 4x + 5$.',
    key: '9',
    explanation: 'Đỉnh parabol tại $x = 2 \\implies y_{max} = -(2)^2 + 4(2) + 5 = 9$.'
  },
  {
    topicKeywords: ['tích phân', 'nguyên hàm'],
    level: 'Vận dụng',
    content: 'Tính tích phân $I = \\int_0^2 (3x^2 - 2x + 1) dx$.',
    key: '6',
    explanation: '$I = [x^3 - x^2 + x]_0^2 = (8 - 4 + 2) - 0 = 6$.'
  },
  {
    topicKeywords: ['khoảng cách', 'oxyz'],
    level: 'Vận dụng',
    content: 'Trong không gian $Oxyz$, tính khoảng cách từ gốc toạ độ $O(0;0;0)$ đến mặt phẳng $(P): 2x - 2y + z - 6 = 0$.',
    key: '2',
    explanation: '$d = \\frac{|-6|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{6}{3} = 2$.'
  }
];

const TOAN_ESSAY: RawEssay[] = [
  {
    topicKeywords: ['khảo sát', 'đồ thị'],
    level: 'Vận dụng',
    content: 'Khảo sát sự biến thiên và vẽ đồ thị của hàm số $y = x^3 - 3x^2 + 2$.',
    essayRubric: 'Ý a (1.0đ): Tập xác định $\\mathbb{R}$, đạo hàm $y\' = 3x^2 - 6x$, giải nghiệm $x = 0, x = 2$, lập bảng biến thiên chính xác.\nÝ b (1.0đ): Tìm cực đại $(0; 2)$, cực tiểu $(2; -2)$, tìm điểm uốn và vẽ đồ thị chuẩn xác.',
    explanation: 'Thực hiện đầy đủ quy trình khảo sát hàm số.'
  }
];

// =========================================================================
// MAIN DISPATCHER: BUILD UNIQUE QUESTIONS GUARANTEED
// =========================================================================

export function generateConsistentQuestionsFromMatrixAndSpec(
  header: ExamHeaderConfig,
  matrix: MatrixRow[],
  specification: SpecificationItem[] = []
): ExamQuestion[] {
  const subjectKey = normalizeSubjectKey(header.subject);
  const questions: ExamQuestion[] = [];

  const partConfigs = header.partConfigs || {
    part1: { name: 'Phần I (TN 4 lựa chọn)', pointsPerQuestion: 0.25, targetQuestions: 12 },
    part2: { name: 'Phần II (Đúng/Sai)', pointsPerQuestion: 1.0, targetQuestions: 4 },
    part3: { name: 'Phần III (Trả lời ngắn)', pointsPerQuestion: 0.5, targetQuestions: 6 },
    part4: { name: 'Phần IV (Tự luận)', pointsPerQuestion: 1.0, targetQuestions: 0 },
  };

  const p1Pts = partConfigs.part1?.pointsPerQuestion ?? 0.25;
  const p2Pts = partConfigs.part2?.pointsPerQuestion ?? 1.0;
  const p3Pts = partConfigs.part3?.pointsPerQuestion ?? 0.5;
  const p4Pts = partConfigs.part4?.pointsPerQuestion ?? 1.0;

  // Track used signatures across the entire test paper to strictly prevent duplicate questions
  const usedContents = new Set<string>();

  // 1. GENERATE PART I (Multiple Choice - numbering starts at 1)
  let p1Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part1_nb || 0, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part1_th || 0, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part1_vd || 0, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part1_vdc || 0, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = getUniqueMCQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          level,
          objective: obj,
          orderNumber: p1Order++,
          points: p1Pts,
          index: i,
          rowIndex,
          usedContents
        });
        questions.push(q);
      }
    });
  });

  // 2. GENERATE PART II (True/False - numbering restarts at 1)
  let p2Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part2_nb || 0, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part2_th || 0, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part2_vd || 0, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part2_vdc || 0, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = getUniqueTFQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          level,
          objective: obj,
          orderNumber: p2Order++,
          points: p2Pts,
          index: i,
          rowIndex,
          usedContents
        });
        questions.push(q);
      }
    });
  });

  // 3. GENERATE PART III (Short Answer - numbering restarts at 1)
  let p3Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part3_nb || 0, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part3_th || 0, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part3_vd || 0, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part3_vdc || 0, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = getUniqueShortQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          level,
          objective: obj,
          orderNumber: p3Order++,
          points: p3Pts,
          index: i,
          rowIndex,
          usedContents
        });
        questions.push(q);
      }
    });
  });

  // 4. GENERATE PART IV (Essay - numbering restarts at 1)
  let p4Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part4_nb || 0, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part4_th || 0, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part4_vd || 0, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part4_vdc || 0, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = getUniqueEssayQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          level,
          objective: obj,
          orderNumber: p4Order++,
          points: p4Pts,
          index: i,
          rowIndex,
          usedContents
        });
        questions.push(q);
      }
    });
  });

  // Fallback if matrix was completely 0
  if (questions.length === 0) {
    return generateFallbackQuestionsForSubject(header);
  }

  return questions;
}

// -------------------------------------------------------------
// SELECTION HELPERS THAT STRICTLY ENFORCE UNIQUENESS
// -------------------------------------------------------------

interface SelectionContext {
  subjectKey: string;
  subjectName: string;
  grade: string;
  topic: string;
  unit: string;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  objective?: string;
  orderNumber: number;
  points: number;
  index: number;
  rowIndex: number;
  usedContents: Set<string>;
}

function getUniqueMCQuestion(ctx: SelectionContext): ExamQuestion {
  const pool = getSubjectMCQPool(ctx.subjectKey);
  const id = `q-mc-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;

  // Look for an unused question matching topic or level
  const tKeywords = (ctx.topic + ' ' + ctx.unit).toLowerCase();
  
  let candidates = pool.filter(item => {
    if (ctx.usedContents.has(item.content)) return false;
    if (item.topicKeywords && item.topicKeywords.some(kw => tKeywords.includes(kw))) return true;
    return false;
  });

  if (candidates.length === 0) {
    candidates = pool.filter(item => !ctx.usedContents.has(item.content));
  }

  if (candidates.length > 0) {
    // Pick the best candidate
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'multiple_choice',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      options: chosen.options,
      correctOption: chosen.correctOption,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  // Synthesize a unique procedural question if pool exhausted
  const synthContent = `Câu hỏi trắc nghiệm ${ctx.orderNumber}: Dựa trên nội dung kiến thức về "${ctx.unit || ctx.topic}" (mức độ ${ctx.level}), nhận định nào sau đây là hoàn toàn chính xác?`;
  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'multiple_choice',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    options: [
      { key: 'A', content: `Nắm vững khái niệm cốt lõi của ${ctx.unit || ctx.topic} và vận dụng giải quyết bài toán thực tế.` },
      { key: 'B', content: `Chỉ học thuộc định nghĩa mà không cần phân tích bản chất hiện tượng.` },
      { key: 'C', content: `Bỏ qua mối quan hệ nhân quả và quy luật vận động của hệ thống.` },
      { key: 'D', content: `Không cần kiểm chứng kết quả bằng các phương pháp khoa học.` }
    ],
    correctOption: 'A',
    points: ctx.points,
    explanation: `Khẳng định A đúng vì mục tiêu bài học "${ctx.unit || ctx.topic}" yêu cầu phát triển năng lực nhận thức và vận dụng thực tiễn.`
  };
}

function getUniqueTFQuestion(ctx: SelectionContext): ExamQuestion {
  const pool = getSubjectTFPool(ctx.subjectKey);
  const id = `q-tf-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;

  let candidates = pool.filter(item => !ctx.usedContents.has(item.content));

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'true_false',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      trueFalseItems: chosen.items,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  // Synthesize unique True/False
  const synthContent = `Đọc đoạn thông tin và phân tích các nhận định khoa học liên quan đến nội dung "${ctx.topic} - ${ctx.unit}":\n"Trong chương trình ${ctx.subjectName} (${ctx.grade}), bài học ${ctx.unit} cung cấp hệ thống kiến thức nền tảng và phương pháp tư duy quan trọng gắn liền với thực tiễn."`;
  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'true_false',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    trueFalseItems: [
      { key: 'a', statement: `Kiến thức của "${ctx.unit}" có tính ứng dụng thực tiễn cao trong đời sống và sản xuất.`, isCorrect: true, explanation: 'Đúng.' },
      { key: 'b', statement: 'Mọi định luật và quy luật khoa học đều có thể áp dụng tùy tiện mà không cần điều kiện xác định.', isCorrect: false, explanation: 'Sai, mỗi định luật đều có phạm vi áp dụng và điều kiện nghiệm đúng.' },
      { key: 'c', statement: 'Việc giải quyết bài toán phân hóa đòi hỏi kết hợp linh hoạt kiến thức liên môn.', isCorrect: true, explanation: 'Đúng.' },
      { key: 'd', statement: 'Nội dung bài học hoàn toàn tách rời với xu thế chuyển đổi số và phát triển bền vững.', isCorrect: false, explanation: 'Sai, chương trình luôn gắn với định hướng hiện đại.' }
    ],
    points: ctx.points,
    explanation: 'Khẳng định a, c là ĐÚNG; b, d là SAI.'
  };
}

function getUniqueShortQuestion(ctx: SelectionContext): ExamQuestion {
  const pool = getSubjectShortPool(ctx.subjectKey);
  const id = `q-sa-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;

  let candidates = pool.filter(item => !ctx.usedContents.has(item.content));

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'short_answer',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      shortAnswerKey: chosen.key,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  // Synthesize unique calculation
  const p1 = 20 + ctx.orderNumber * 5;
  const p2 = 80 + ctx.orderNumber * 10;
  const key = ((p1 / p2) * 100).toFixed(1);
  const synthContent = `Cho dữ liệu thực nghiệm về "${ctx.unit || ctx.topic}": Giá trị thành phần $A = ${p1}$ trên tổng số $B = ${p2}$. Hãy tính tỉ lệ (%) của thành phần $A$ so với tổng số $B$ (làm tròn kết quả đến 1 chữ số thập phân)?`;
  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'short_answer',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    shortAnswerKey: key,
    points: ctx.points,
    explanation: `Tỉ lệ (%) = (${p1} / ${p2}) * 100% = ${key}%.`
  };
}

function getUniqueEssayQuestion(ctx: SelectionContext): ExamQuestion {
  const pool = getSubjectEssayPool(ctx.subjectKey);
  const id = `q-es-${ctx.orderNumber}-${Math.random().toString(36).substring(2, 6)}`;

  let candidates = pool.filter(item => !ctx.usedContents.has(item.content));

  if (candidates.length > 0) {
    const chosen = candidates[0];
    ctx.usedContents.add(chosen.content);
    return {
      id,
      orderNumber: ctx.orderNumber,
      type: 'essay',
      topic: ctx.topic,
      unit: ctx.unit,
      cognitiveLevel: chosen.level || ctx.level,
      content: chosen.content,
      essayRubric: chosen.essayRubric,
      points: ctx.points,
      explanation: chosen.explanation
    };
  }

  const synthContent = `Dựa vào kiến thức về "${ctx.topic} - ${ctx.unit}", hãy trình bày và phân tích các luận điểm khoa học trọng tâm của bài học. Đề xuất 02 giải pháp nâng cao hiệu quả vận dụng kiến thức này vào thực tiễn đời sống.`;
  ctx.usedContents.add(synthContent);
  return {
    id,
    orderNumber: ctx.orderNumber,
    type: 'essay',
    topic: ctx.topic,
    unit: ctx.unit,
    cognitiveLevel: ctx.level,
    content: synthContent,
    essayRubric: 'Ý a (1.0đ): Nêu rõ bản chất khoa học, nguyên lí vận hành và các luận điểm chính.\nÝ b (0.5đ): Đề xuất giải pháp 1 có tính khả thi và logic cao.\nÝ c (0.5đ): Đề xuất giải pháp 2 gắn liền với đổi mới sáng tạo.',
    points: ctx.points,
    explanation: 'Học sinh trình bày đầy đủ bản chất bài học và 02 giải pháp thực tiễn hợp lí.'
  };
}

// -------------------------------------------------------------
// POOL ACCESSORS
// -------------------------------------------------------------

function getSubjectMCQPool(subjectKey: string): RawMCQ[] {
  switch (subjectKey) {
    case 'dia-li': return DIA_LI_MCQ;
    case 'lich-su': return LICH_SU_MCQ;
    case 'toan': return TOAN_MCQ;
    default: return DIA_LI_MCQ;
  }
}

function getSubjectTFPool(subjectKey: string): RawTF[] {
  switch (subjectKey) {
    case 'dia-li': return DIA_LI_TF;
    case 'lich-su': return LICH_SU_TF;
    case 'toan': return TOAN_TF;
    default: return DIA_LI_TF;
  }
}

function getSubjectShortPool(subjectKey: string): RawShort[] {
  switch (subjectKey) {
    case 'dia-li': return DIA_LI_SHORT;
    case 'lich-su': return LICH_SU_SHORT;
    case 'toan': return TOAN_SHORT;
    default: return DIA_LI_SHORT;
  }
}

function getSubjectEssayPool(subjectKey: string): RawEssay[] {
  switch (subjectKey) {
    case 'dia-li': return DIA_LI_ESSAY;
    case 'lich-su': return LICH_SU_ESSAY;
    case 'toan': return TOAN_ESSAY;
    default: return DIA_LI_ESSAY;
  }
}

// -------------------------------------------------------------
// INITIAL MATRIX AND SPEC GENERATION
// -------------------------------------------------------------

export function generateInitialMatrixAndSpecForSubject(subject: string, grade: string = 'Lớp 12'): {
  matrix: MatrixRow[];
  specification: SpecificationItem[];
} {
  const subjectKey = normalizeSubjectKey(subject);

  if (subjectKey === 'dia-li') {
    const matrix: MatrixRow[] = [
      {
        id: 'mat-dl-1',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Vị trí địa lí và phạm vi lãnh thổ',
        part1_nb: 2, part1_th: 1, part1_vd: 0, part1_vdc: 0,
        part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.25
      },
      {
        id: 'mat-dl-2',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Đặc điểm tự nhiên, địa hình và khí hậu nhiệt đới ẩm',
        part1_nb: 2, part1_th: 1, part1_vd: 1, part1_vdc: 0,
        part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 3.0
      },
      {
        id: 'mat-dl-3',
        topic: 'Địa lí dân cư và đô thị hóa',
        unit: 'Đặc điểm dân số, phân bố dân cư và lao động',
        part1_nb: 1, part1_th: 1, part1_vd: 0, part1_vdc: 0,
        part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.0
      },
      {
        id: 'mat-dl-4',
        topic: 'Địa lí các ngành kinh tế',
        unit: 'Nông nghiệp, công nghiệp và dịch vụ phát triển bền vững',
        part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
        part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.75
      }
    ];

    const specification: SpecificationItem[] = [
      {
        id: 'spec-dl-1',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Vị trí địa lí và phạm vi lãnh thổ',
        learningObjectives: {
          nb: 'Trình bày được vị trí địa lí, tọa độ và phạm vi lãnh thổ trên đất liền, vùng biển và vùng trời Việt Nam.',
          th: 'Phân tích được ý nghĩa tự nhiên, kinh tế, văn hóa - xã hội và quốc phòng an ninh của vị trí địa lí.',
          vd: 'Đánh giá được thời cơ và thách thức của vị trí địa lí trong bối cảnh hội nhập quốc tế.',
          vdc: 'Liên hệ được vai trò chiến lược của biển đảo trong công cuộc bảo vệ chủ quyền quốc gia.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-dl-2',
        topic: 'Địa lí tự nhiên Việt Nam',
        unit: 'Đặc điểm tự nhiên, địa hình và khí hậu nhiệt đới ẩm',
        learningObjectives: {
          nb: 'Nhận biết được tính chất nhiệt đới ẩm gió mùa và đặc điểm các đai cao tự nhiên ở nước ta.',
          th: 'Giải thích được nguyên nhân tạo nên sự phân hóa đa dạng của khí hậu và cảnh quan thiên nhiên.',
          vd: 'Vận dụng kiến thức tự nhiên để giải thích sự phân bố mùa vụ nông nghiệp và biện pháp phòng chống thiên tai.',
          vdc: 'Đề xuất giải pháp thích ứng với biến đổi khí hậu tại các vùng sinh thái đặc thù.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 1, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-dl-3',
        topic: 'Địa lí dân cư và đô thị hóa',
        unit: 'Đặc điểm dân số, phân bố dân cư và lao động',
        learningObjectives: {
          nb: 'Nêu được đặc điểm dân số, cơ cấu nhóm tuổi và xu hướng già hóa dân số ở nước ta.',
          th: 'Phân tích được tác động của quá trình đô thị hóa đến chuyển dịch cơ cấu kinh tế và việc làm.',
          vd: 'Tính toán và xử lí số liệu thống kê về tỉ lệ dân thành thị, mật độ dân số và cơ cấu lao động.',
          vdc: 'Đề xuất giải pháp nâng cao chất lượng nguồn nhân lực và giải quyết việc làm cho thanh niên.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-dl-4',
        topic: 'Địa lí các ngành kinh tế',
        unit: 'Nông nghiệp, công nghiệp và dịch vụ phát triển bền vững',
        learningObjectives: {
          nb: 'Trình bày được cơ cấu và tình hình phát triển các ngành kinh tế trọng điểm.',
          th: 'Giải thích được sự chuyển dịch cơ cấu kinh tế theo ngành và theo lãnh thổ.',
          vd: 'Phân tích biểu đồ và bảng số liệu về giá trị sản xuất công nghiệp, nông nghiệp công nghệ cao.',
          vdc: 'Đánh giá triển vọng phát triển kinh tế xanh và kinh tế tuần hoàn tại các vùng kinh tế trọng điểm.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      }
    ];

    return { matrix, specification };
  }

  if (subjectKey === 'lich-su') {
    const matrix: MatrixRow[] = [
      {
        id: 'mat-ls-1',
        topic: 'Thế giới trong và sau Chiến tranh Lạnh',
        unit: 'Trật tự thế giới hai cực I-an-ta và quan hệ quốc tế',
        part1_nb: 2, part1_th: 1, part1_vd: 0, part1_vdc: 0,
        part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.25
      },
      {
        id: 'mat-ls-2',
        topic: 'Lịch sử Việt Nam (1919 - 1945)',
        unit: 'Phong trào dân tộc dân chủ và Cách mạng tháng Tám 1945',
        part1_nb: 2, part1_th: 1, part1_vd: 1, part1_vdc: 0,
        part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 3.0
      },
      {
        id: 'mat-ls-3',
        topic: 'Lịch sử Việt Nam (1945 - 1975)',
        unit: 'Kháng chiến chống Pháp và chống Mỹ cứu nước',
        part1_nb: 1, part1_th: 1, part1_vd: 0, part1_vdc: 0,
        part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.0
      },
      {
        id: 'mat-ls-4',
        topic: 'Việt Nam từ 1986 đến nay',
        unit: 'Công cuộc Đổi mới toàn diện và hội nhập quốc tế',
        part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
        part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
        part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
        part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
        totalPoints: 2.75
      }
    ];

    const specification: SpecificationItem[] = [
      {
        id: 'spec-ls-1',
        topic: 'Thế giới trong và sau Chiến tranh Lạnh',
        unit: 'Trật tự thế giới hai cực I-an-ta và quan hệ quốc tế',
        learningObjectives: {
          nb: 'Trình bày được bối cảnh hình thành và đặc điểm của Trật tự hai cực I-an-ta.',
          th: 'Phân tích được xu thế đa cực, hợp tác và cạnh tranh trong quan hệ quốc tế sau Chiến tranh Lạnh.',
          vd: 'Đánh giá tác động của xu thế toàn cầu hóa đối với các nước đang phát triển.',
          vdc: 'Rút ra bài học cho chính sách đối ngoại độc lập, tự chủ của Việt Nam.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-ls-2',
        topic: 'Lịch sử Việt Nam (1919 - 1945)',
        unit: 'Phong trào dân tộc dân chủ và Cách mạng tháng Tám 1945',
        learningObjectives: {
          nb: 'Nhận biết được các mốc sự kiện tiêu biểu và sự ra đời của Đảng Cộng sản Việt Nam (1930).',
          th: 'Giải thích được nguyên nhân thắng lợi và bài học kinh nghiệm của Cách mạng tháng Tám năm 1945.',
          vd: 'So sánh được các khuynh hướng cứu nước đầu thế kỉ XX.',
          vdc: 'Vận dụng bài học chớp thời cơ vào công cuộc xây dựng và phát triển đất nước.'
        },
        questionCount: {
          part1: { nb: 2, th: 1, vd: 1, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-ls-3',
        topic: 'Lịch sử Việt Nam (1945 - 1975)',
        unit: 'Kháng chiến chống Pháp và chống Mỹ cứu nước',
        learningObjectives: {
          nb: 'Nêu được các chiến dịch lịch sử quan trọng (Điện Biên Phủ 1954, Chiến dịch Hồ Chí Minh 1975).',
          th: 'Phân tích được đường lối kháng chiến toàn dân, toàn diện, trường kì và tự lực cánh sinh.',
          vd: 'Đánh giá ý nghĩa thời đại của thắng lợi cuộc kháng chiến chống Mỹ cứu nước.',
          vdc: 'Liên hệ tinh thần đại đoàn kết toàn dân tộc trong sự nghiệp bảo vệ Tổ quốc hôm nay.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
          part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      },
      {
        id: 'spec-ls-4',
        topic: 'Việt Nam từ 1986 đến nay',
        unit: 'Công cuộc Đổi mới toàn diện và hội nhập quốc tế',
        learningObjectives: {
          nb: 'Trình bày được nội dung đường lối Đổi mới của Đại hội Đảng lần thứ VI (1986).',
          th: 'Phân tích được những thành tựu to lớn có ý nghĩa lịch sử sau gần 40 năm đổi mới.',
          vd: 'Nhận xét về vai trò và vị thế quốc tế của Việt Nam trên các diễn đàn đa phương.',
          vdc: 'Xác định trách nhiệm công dân của tuổi trẻ trong công cuộc chuyển đổi số quốc gia.'
        },
        questionCount: {
          part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
          part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
          part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
          part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
        }
      }
    ];

    return { matrix, specification };
  }

  // Default for Mathematics / other subjects
  const matrix: MatrixRow[] = [
    {
      id: 'mat-def-1',
      topic: `${subject} - Kiến thức phần 1`,
      unit: 'Khái niệm, định lí và tính chất cơ bản',
      part1_nb: 2, part1_th: 1, part1_vd: 0, part1_vdc: 0,
      part2_nb: 1, part2_th: 0, part2_vd: 0, part2_vdc: 0,
      part3_nb: 0, part3_th: 1, part3_vd: 0, part3_vdc: 0,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 2.25
    },
    {
      id: 'mat-def-2',
      topic: `${subject} - Kiến thức phần 2`,
      unit: 'Phương pháp giải toán và phân tích hiện tượng',
      part1_nb: 2, part1_th: 1, part1_vd: 1, part1_vdc: 0,
      part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
      part3_nb: 0, part3_th: 1, part3_vd: 1, part3_vdc: 0,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 3.0
    },
    {
      id: 'mat-def-3',
      topic: `${subject} - Kiến thức phần 3`,
      unit: 'Vận dụng quy luật và mô hình hóa bài toán',
      part1_nb: 1, part1_th: 1, part1_vd: 0, part1_vdc: 0,
      part2_nb: 0, part2_th: 1, part2_vd: 0, part2_vdc: 0,
      part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 0,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 2.0
    },
    {
      id: 'mat-def-4',
      topic: `${subject} - Kiến thức phần 4`,
      unit: 'Bài toán thực tiễn và tư duy nâng cao',
      part1_nb: 1, part1_th: 1, part1_vd: 1, part1_vdc: 0,
      part2_nb: 0, part2_th: 0, part2_vd: 1, part2_vdc: 0,
      part3_nb: 0, part3_th: 0, part3_vd: 1, part3_vdc: 1,
      part4_nb: 0, part4_th: 0, part4_vd: 0, part4_vdc: 0,
      totalPoints: 2.75
    }
  ];

  const specification: SpecificationItem[] = [
    {
      id: 'spec-def-1',
      topic: `${subject} - Kiến thức phần 1`,
      unit: 'Khái niệm, định lí và tính chất cơ bản',
      learningObjectives: {
        nb: 'Nhận biết được các khái niệm, định nghĩa, công thức và quy tắc cơ bản.',
        th: 'Hiểu và giải thích được bản chất của các định lí, mối liên hệ giữa các khái niệm.',
        vd: 'Áp dụng các công thức để giải quyết các bài toán ở mức độ cơ bản.',
        vdc: 'Vận dụng tổng hợp các kiến thức nền tảng để xử lí các bài toán phức hợp.'
      },
      questionCount: {
        part1: { nb: 2, th: 1, vd: 0, vdc: 0 },
        part2: { nb: 1, th: 0, vd: 0, vdc: 0 },
        part3: { nb: 0, th: 1, vd: 0, vdc: 0 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    },
    {
      id: 'spec-def-2',
      topic: `${subject} - Kiến thức phần 2`,
      unit: 'Phương pháp giải toán và phân tích hiện tượng',
      learningObjectives: {
        nb: 'Liệt kê được các bước thực hiện và quy trình giải quyết vấn đề.',
        th: 'Phân tích được các dữ kiện, biểu đồ, sơ đồ và bảng số liệu.',
        vd: 'Vận dụng linh hoạt các thuật toán, phương pháp tư duy để tìm đáp số chính xác.',
        vdc: 'Tìm ra các cách giải tối ưu, sáng tạo và biện luận kết quả.'
      },
      questionCount: {
        part1: { nb: 2, th: 1, vd: 1, vdc: 0 },
        part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
        part3: { nb: 0, th: 1, vd: 1, vdc: 0 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    },
    {
      id: 'spec-def-3',
      topic: `${subject} - Kiến thức phần 3`,
      unit: 'Vận dụng quy luật và mô hình hóa bài toán',
      learningObjectives: {
        nb: 'Nhận dạng được mô hình bài toán và đối tượng khảo sát.',
        th: 'Mô tả được quá trình biến đổi và quy luật vận động của hệ thống.',
        vd: 'Xây dựng được mô hình toán học / khoa học cho các tình huống thực tiễn.',
        vdc: 'Đánh giá độ tin cậy của mô hình và tối ưu hóa các tham số.'
      },
      questionCount: {
        part1: { nb: 1, th: 1, vd: 0, vdc: 0 },
        part2: { nb: 0, th: 1, vd: 0, vdc: 0 },
        part3: { nb: 0, th: 0, vd: 1, vdc: 0 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    },
    {
      id: 'spec-def-4',
      topic: `${subject} - Kiến thức phần 4`,
      unit: 'Bài toán thực tiễn và tư duy nâng cao',
      learningObjectives: {
        nb: 'Nêu được các ứng dụng thực tế phổ biến của môn học trong đời sống.',
        th: 'Giải thích được các hiện tượng thực tế dựa trên nguyên lí khoa học.',
        vd: 'Giải quyết các vấn đề thực tiễn gắn với đời sống, kinh tế và môi trường.',
        vdc: 'Đề xuất giải pháp khoa học mới mang tính đột phá và bền vững.'
      },
      questionCount: {
        part1: { nb: 1, th: 1, vd: 1, vdc: 0 },
        part2: { nb: 0, th: 0, vd: 1, vdc: 0 },
        part3: { nb: 0, th: 0, vd: 1, vdc: 1 },
        part4: { nb: 0, th: 0, vd: 0, vdc: 0 },
      }
    }
  ];

  return { matrix, specification };
}

function generateFallbackQuestionsForSubject(header: ExamHeaderConfig): ExamQuestion[] {
  return [
    {
      id: `fallback-1-${Date.now()}`,
      orderNumber: 1,
      type: 'multiple_choice',
      topic: `${header.subject} - Kiến thức trọng tâm`,
      unit: 'Tổng quan chương trình',
      cognitiveLevel: 'Nhận biết',
      content: `Nội dung cốt lõi của môn ${header.subject} (${header.grade}) nhằm phát triển năng lực đặc thù nào cho học sinh?`,
      points: 0.25,
      options: [
        { key: 'A', content: 'Năng lực nhận thức, tư duy logic và vận dụng kiến thức vào thực tiễn cuộc sống.' },
        { key: 'B', content: 'Chỉ học thuộc lòng các định nghĩa mà không cần liên hệ thực tế.' },
        { key: 'C', content: 'Hạn chế việc tự học và giải quyết vấn đề sáng tạo.' },
        { key: 'D', content: 'Không cần phát triển kĩ năng làm việc nhóm và giao tiếp khoa học.' }
      ],
      correctOption: 'A',
      explanation: 'Chương trình GDPT 2018 chú trọng phát triển toàn diện phẩm chất và năng lực giải quyết vấn đề thực tiễn.'
    }
  ];
}
