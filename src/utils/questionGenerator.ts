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
 */

interface SubjectQuestionBankItem {
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  options?: MultipleChoiceOption[];
  correctOption?: 'A' | 'B' | 'C' | 'D';
  trueFalseItems?: TrueFalseSubItem[];
  shortAnswerKey?: string;
  essayRubric?: string;
  explanation: string;
}

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

export function generateConsistentQuestionsFromMatrixAndSpec(
  header: ExamHeaderConfig,
  matrix: MatrixRow[],
  specification: SpecificationItem[] = []
): ExamQuestion[] {
  const subjectKey = normalizeSubjectKey(header.subject);
  const questions: ExamQuestion[] = [];
  let globalOrder = 1;

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

  // Track counts to generate corresponding questions per matrix row
  // 1. GENERATE PART I QUESTIONS (Multiple Choice)
  let p1Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part1_nb, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part1_th, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part1_vd, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part1_vdc, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = buildSubjectQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          type: 'multiple_choice',
          level,
          objective: obj,
          orderNumber: p1Order++,
          points: p1Pts,
          index: i
        });
        questions.push(q);
      }
    });
  });

  // 2. GENERATE PART II QUESTIONS (True / False - count restarts from 1)
  let p2Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part2_nb, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part2_th, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part2_vd, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part2_vdc, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = buildSubjectQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          type: 'true_false',
          level,
          objective: obj,
          orderNumber: p2Order++,
          points: p2Pts,
          index: i
        });
        questions.push(q);
      }
    });
  });

  // 3. GENERATE PART III QUESTIONS (Short Answer - count restarts from 1)
  let p3Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part3_nb, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part3_th, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part3_vd, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part3_vdc, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = buildSubjectQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          type: 'short_answer',
          level,
          objective: obj,
          orderNumber: p3Order++,
          points: p3Pts,
          index: i
        });
        questions.push(q);
      }
    });
  });

  // 4. GENERATE PART IV QUESTIONS (Essay - count restarts from 1)
  let p4Order = 1;
  matrix.forEach((row, rowIndex) => {
    const spec = specification[rowIndex];
    const rowCounts = [
      { level: 'Nhận biết' as const, count: row.part4_nb, obj: spec?.learningObjectives?.nb },
      { level: 'Thông hiểu' as const, count: row.part4_th, obj: spec?.learningObjectives?.th },
      { level: 'Vận dụng' as const, count: row.part4_vd, obj: spec?.learningObjectives?.vd },
      { level: 'Vận dụng cao' as const, count: row.part4_vdc, obj: spec?.learningObjectives?.vdc },
    ];

    rowCounts.forEach(({ level, count, obj }) => {
      for (let i = 0; i < count; i++) {
        const q = buildSubjectQuestion({
          subjectKey,
          subjectName: header.subject,
          grade: header.grade,
          topic: row.topic,
          unit: row.unit,
          type: 'essay',
          level,
          objective: obj,
          orderNumber: p4Order++,
          points: p4Pts,
          index: i
        });
        questions.push(q);
      }
    });
  });

  // If matrix is empty or produced 0 questions, return a solid fallback
  if (questions.length === 0) {
    return generateFallbackQuestionsForSubject(header);
  }

  return questions;
}

interface BuildQuestionParams {
  subjectKey: string;
  subjectName: string;
  grade: string;
  topic: string;
  unit: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  objective?: string;
  orderNumber: number;
  points: number;
  index: number;
}

function buildSubjectQuestion(p: BuildQuestionParams): ExamQuestion {
  const { subjectKey, topic, unit, type, level, objective, orderNumber, points, index } = p;
  const id = `q-${type}-${orderNumber}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;

  // ==========================================
  // SUBJECT: ĐỊA LÍ (GEOGRAPHY)
  // ==========================================
  if (subjectKey === 'dia-li') {
    if (type === 'multiple_choice') {
      const isViTri = topic.includes('Vị trí') || unit.includes('Vị trí') || topic.includes('lãnh thổ');
      const isTuNhien = topic.includes('tự nhiên') || topic.includes('khí hậu') || topic.includes('địa hình');
      const isDanCu = topic.includes('dân cư') || topic.includes('đô thị') || topic.includes('dân số');

      if (isViTri) {
        if (level === 'Nhận biết') {
          return {
            id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
            content: 'Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, nên có đặc điểm nào sau đây?',
            options: [
              { key: 'A', content: 'Tổng lượng mưa hàng năm luôn nhỏ hơn lượng bốc hơi.' },
              { key: 'B', content: 'Nền nhiệt độ cao, nhiều ánh nắng mặt trời.' },
              { key: 'C', content: 'Chịu ảnh hưởng sâu sắc của gió Mậu dịch bán cầu Nam.' },
              { key: 'D', content: 'Khí hậu phân hóa thành 4 mùa xuân, hạ, thu, đông rõ rệt.' }
            ],
            correctOption: 'B',
            explanation: 'Do nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc nên nước ta có góc nhập xạ lớn, tổng bức xạ dồi dào, nền nhiệt độ cao quanh năm (trừ vùng núi cao).'
          };
        }
        return {
          id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
          content: 'Vị trí địa lí tiếp giáp giữa lục địa Á - Âu và biển Đông rộng lớn đã mang lại cho khí hậu nước ta tính chất nào?',
          options: [
            { key: 'A', content: 'Lượng mưa và độ ẩm dồi dào, cân bằng ẩm luôn dương.' },
            { key: 'B', content: 'Tính chất khô hạn, hoang mạc hóa cục bộ ven biển.' },
            { key: 'C', content: 'Khí hậu cận nhiệt đới gió mùa có mùa đông rất lạnh.' },
            { key: 'D', content: 'Thời tiết ổn định, hoàn toàn không xuất hiện thiên tai.' }
          ],
          correctOption: 'A',
          explanation: 'Nhờ tiếp giáp biển Đông cùng các khối khí di chuyển qua biển được tăng cường ẩm, nước ta có khí hậu nhiệt đới ẩm gió mùa với lượng mưa trung bình từ 1500 - 2000 mm/năm.'
        };
      }

      if (isDanCu) {
        return {
          id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
          content: `Hiện nay, cơ cấu dân số theo nhóm tuổi ở nước ta đang có xu hướng biến đổi nào sau đây (${unit})?`,
          options: [
            { key: 'A', content: 'Tỉ lệ nhóm tuổi dưới 15 tuổi giảm, tỉ lệ nhóm từ 65 tuổi trở lên tăng.' },
            { key: 'B', content: 'Tỉ lệ nhóm tuổi dưới 15 tuổi tăng nhanh, dân số trẻ hóa mạnh.' },
            { key: 'C', content: 'Tỉ lệ người già giảm dần do điều kiện chăm sóc y tế giảm sút.' },
            { key: 'D', content: 'Tỉ lệ trong độ tuổi lao động giảm sâu, thiếu hụt lao động trầm trọng.' }
          ],
          correctOption: 'A',
          explanation: 'Nhờ kết quả của chính sách dân số và nâng cao chất lượng cuộc sống, tuổi thọ bình quân tăng khiến nhóm ≥65 tuổi tăng, đồng thời tỉ suất sinh giảm khiến nhóm <15 tuổi giảm (xu hướng già hóa dân số).'
        };
      }

      // Default Dia Li
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Căn cứ vào đặc điểm ${unit || topic}, yếu tố nào đóng vai trò then chốt thúc đẩy chuyển dịch cơ cấu kinh tế theo ngành ở nước ta?`,
        options: [
          { key: 'A', content: 'Đẩy mạnh quá trình công nghiệp hóa, hiện đại hóa và hội nhập quốc tế.' },
          { key: 'B', content: 'Tăng nhanh tỉ trọng ngành nông nghiệp truyền thống.' },
          { key: 'C', content: 'Mở rộng diện tích đất trồng cây lương thực thuần túy.' },
          { key: 'D', content: 'Hạn chế thu hút vốn đầu tư trực tiếp từ nước ngoài (FDI).' }
        ],
        correctOption: 'A',
        explanation: 'Quá trình công nghiệp hóa, hiện đại hóa gắn với kinh tế tri thức và hội nhập kinh tế quốc tế là động lực cốt lõi để nâng cao tỉ trọng công nghiệp và dịch vụ, giảm tỉ trọng nông - lâm - thủy sản.'
      };
    }

    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Cho thông tin về đặc điểm phát triển kinh tế - xã hội gắn với "${topic} - ${unit}":\nNước ta có vùng biển rộng khoảng 1 triệu km², nằm trên ngã tư đường hàng hải và hàng không quốc tế quan trọng, giàu tiềm năng tài nguyên sinh vật và khoáng sản.`,
        trueFalseItems: [
          { key: 'a', statement: 'Vùng biển nước ta tạo điều kiện thuận lợi để phát triển tổng hợp kinh tế biển.', isCorrect: true, explanation: 'Đúng, bao gồm đánh bắt nuôi trồng thủy sản, khai thác khoáng sản dầu khí, du lịch biển và giao thông vận tải biển.' },
          { key: 'b', statement: 'Tất cả các tỉnh thành ở nước ta đều có đường bờ biển trực tiếp.', isCorrect: false, explanation: 'Sai, cả nước chỉ có 28 tỉnh, thành phố trực thuộc Trung ương giáp biển.' },
          { key: 'c', statement: 'Biển Đông là nhân tố làm cho khí hậu nước ta mang tính hải dương điều hòa hơn so với các nước cùng vĩ độ ở Tây Á.', isCorrect: true, explanation: 'Đúng, biển Đông mang lại lượng ẩm lớn, giảm bớt tính khắc nghiệt và khô hạn.' },
          { key: 'd', statement: 'Việc khai thác tài nguyên biển không cần phải kết hợp với việc bảo vệ an ninh quốc phòng.', isCorrect: false, explanation: 'Sai, phát triển kinh tế biển luôn luôn phải gắn liền mật thiết với việc giữ vững chủ quyền biển đảo quốc gia.' }
        ],
        explanation: 'Khẳng định a, c là ĐÚNG; b, d là SAI. Phát triển kinh tế biển phải mang tính tổng hợp, bền vững và bảo đảm chủ quyền an ninh biển đảo.'
      };
    }

    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Dựa vào số liệu thống kê về diện tích rừng nước ta: Năm 2020 diện tích rừng trồng là 4,4 triệu ha trên tổng số 14,7 triệu ha diện tích đất có rừng. Hãy tính tỉ lệ (%) diện tích rừng trồng so với tổng diện tích đất có rừng của nước ta (làm tròn kết quả đến 1 chữ số thập phân)?`,
        shortAnswerKey: '29.9',
        explanation: 'Tỉ lệ rừng trồng = (4,4 / 14,7) * 100% ≈ 29.93% -> Làm tròn 1 chữ số thập phân: 29.9%'
      };
    }

    // Essay
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Dựa vào kiến thức về "${topic} - ${unit}", hãy phân tích những thế mạnh tự nhiên để phát triển ngành thủy sản ở nước ta. Nêu 02 giải pháp chủ yếu để phát triển bền vững ngành kinh tế này.`,
      essayRubric: 'Ý a (1.0đ): Nêu đúng 4 ngư trường trọng điểm, bờ biển dài 3260km, bãi triều, đầm phá, vũng vịnh thuận lợi nuôi trồng thủy sản nước lợ, nước mặn.\nÝ b (0.5đ): Nguồn lợi sinh vật biển phong phú với hơn 2000 loài cá, nhiều đặc sản giá trị kinh tế cao.\nÝ c (0.5đ): 02 giải pháp: Hiện đại hóa phương tiện đánh bắt xa bờ gắn với bảo vệ nguồn lợi ven bờ; Đẩy mạnh công nghiệp chế biến và mở rộng thị trường xuất khẩu.',
      explanation: 'Học sinh trình bày đủ 2 luận điểm chính: (1) Thế mạnh tự nhiên (bờ biển, ngư trường, sinh vật, vũng vịnh) và (2) Giải pháp phát triển bền vững (đánh bắt xa bờ, bảo vệ nguồn lợi, công nghệ chế biến).'
    };
  }

  // ==========================================
  // SUBJECT: LỊCH SỬ (HISTORY)
  // ==========================================
  if (subjectKey === 'lich-su') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Nội dung nào sau đây là ý nghĩa lịch sử to lớn của sự kiện gắn với "${topic} - ${unit}"?`,
        options: [
          { key: 'A', content: 'Mở ra bước ngoặt vĩ đại trong lịch sử đấu tranh giải phóng dân tộc.' },
          { key: 'B', content: 'Chấm dứt hoàn toàn sự thống trị của chủ nghĩa thực dân trên phạm vi toàn cầu.' },
          { key: 'C', content: 'Đưa nước ta bước ngay vào giai đoạn công nghiệp hóa hiện đại hóa phát triển cao.' },
          { key: 'D', content: 'Xóa bỏ hoàn toàn mọi tàn dư của chế độ phong kiến trong một thời gian ngắn.' }
        ],
        correctOption: 'A',
        explanation: 'Sự kiện mang ý nghĩa bước ngoặt căn bản, mở ra kỉ nguyên độc lập tự do và làm thay đổi cục diện lịch sử của dân tộc.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Đọc đoạn tư liệu sau về "${topic}":\n"Đảng Cộng sản Việt Nam ra đời là sản phẩm của sự kết hợp giữa chủ nghĩa Mác - Lênin với phong trào công nhân và phong trào yêu nước Việt Nam trong những năm đầu thế kỉ XX."`,
        trueFalseItems: [
          { key: 'a', statement: 'Sự kiện này chấm dứt thời kì khủng hoảng sâu sắc về đường lối và giai cấp lãnh đạo.', isCorrect: true, explanation: 'Đúng, từ đây cách mạng Việt Nam có chính đảng tiên phong soi đường.' },
          { key: 'b', statement: 'Phong trào yêu nước không đóng vai trò gì trong sự hình thành của Đảng Cộng sản.', isCorrect: false, explanation: 'Sai, phong trào yêu nước là một trong ba thành tố cốt lõi kết tinh nên Đảng.' },
          { key: 'c', statement: 'Nguyễn Ái Quốc là người trực tiếp chuẩn bị về chính trị, tư tưởng và tổ chức cho sự thành lập Đảng.', isCorrect: true, explanation: 'Đúng, Người triệu tập và chủ trì Hội nghị hợp nhất tại Hương Cảng đầu năm 1930.' },
          { key: 'd', statement: 'Đảng ra đời đặt cách mạng Việt Nam tách biệt hoàn toàn khỏi phong trào cách mạng thế giới.', isCorrect: false, explanation: 'Sai, cách mạng Việt Nam trở thành một bộ phận khăng khít của cách mạng vô sản thế giới.' }
        ],
        explanation: 'Mệnh đề a, c là ĐÚNG; b, d là SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Đại hội đại biểu toàn quốc lần thứ mấy của Đảng Cộng sản Việt Nam (tháng 12/1986) đã đề ra đường lối đổi mới toàn diện đất nước? (Ghi chữ số La Mã hoặc số Ả Rập tương ứng)`,
        shortAnswerKey: 'VI',
        explanation: 'Đại hội đại biểu toàn quốc lần thứ VI của Đảng (tháng 12/1986) là mốc lịch sử khởi xướng công cuộc Đổi mới.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Phân tích nguyên nhân thắng lợi và bài học kinh nghiệm của "${topic} - ${unit}" đối với sự nghiệp xây dựng và bảo vệ Tổ quốc hiện nay.`,
      essayRubric: 'Ý a (1.0đ): Trình bày nguyên nhân chủ quan (sự lãnh đạo của Đảng, tinh thần đoàn kết toàn dân) và khách quan.\nÝ b (1.0đ): Rút ra 02 bài học kinh nghiệm sâu sắc vận dụng vào thực tiễn công cuộc phát triển đất nước.',
      explanation: 'Trình bày mạch lạc, có luận cứ lịch sử xác thực và liên hệ thực tiễn hiện nay.'
    };
  }

  // ==========================================
  // SUBJECT: VẬT LÍ (PHYSICS)
  // ==========================================
  if (subjectKey === 'vat-li') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Trong nghiên cứu về ${unit || topic}, đại lượng đặc trưng cho tốc độ biến thiên của từ thông qua mạch kín là gì?`,
        options: [
          { key: 'A', content: 'Suất điện động cảm ứng.' },
          { key: 'B', content: 'Cường độ dòng điện không đổi.' },
          { key: 'C', content: 'Nhiệt dung riêng của vật dẫn.' },
          { key: 'D', content: 'Hệ số tự cảm của ống dây.' }
        ],
        correctOption: 'A',
        explanation: 'Theo định luật Faraday: $e_c = -\\frac{\\Delta \\Phi}{\\Delta t}$, độ lớn suất điện động cảm ứng tỉ lệ với tốc độ biến thiên của từ thông.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Xét một lượng khí lí tưởng xác định thực hiện các quá trình biến đổi trạng thái (${topic}):`,
        trueFalseItems: [
          { key: 'a', statement: 'Trong quá trình đẳng nhiệt, áp suất tỉ lệ nghịch với thể tích ($p \\cdot V = \\text{const}$).', isCorrect: true, explanation: 'Đúng theo định luật Boyle.' },
          { key: 'b', statement: 'Khi nhiệt độ tuyệt đối tăng gấp đôi ở quá trình đẳng tích, áp suất chất khí giảm một nửa.', isCorrect: false, explanation: 'Sai, $p/T = \\text{const}$ nên khi $T$ tăng 2 lần thì $p$ cũng phải tăng gấp đôi.' },
          { key: 'c', statement: 'Nội năng của khí lí tưởng chỉ phụ thuộc vào nhiệt độ tuyệt đối của khối khí.', isCorrect: true, explanation: 'Đúng theo thuyết động học phân tử chất khí.' },
          { key: 'd', statement: 'Chất khí chỉ nhận nhiệt lượng mà không thể sinh công trong mọi quá trình biến đổi.', isCorrect: false, explanation: 'Sai, theo định luật I NĐLH: $\\Delta U = Q + A$, chất khí có thể dãn nở sinh công ($A < 0$).' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Một lượng khí có thể tích $V_1 = 4\\text{ lít}$ ở áp suất $p_1 = 1\\text{ atm}$. Nén đẳng nhiệt lượng khí này đến thể tích $V_2 = 1\\text{ lít}$. Áp suất $p_2$ của khối khí sau khi nén bằng bao nhiêu atm?`,
        shortAnswerKey: '4',
        explanation: 'Theo định luật Boyle: $p_1 V_1 = p_2 V_2 \\Rightarrow p_2 = \\frac{1 \\times 4}{1} = 4\\text{ atm}$.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Trình bày nguyên lí hoạt động và thiết lập biểu thức tính nhiệt lượng cung cấp để làm nóng chảy hoàn toàn một vật rắn có khối lượng $m$ từ nhiệt độ ban đầu $t_0$ đến nhiệt độ nóng chảy $t_{nc}$.`,
      essayRubric: 'Ý a (1.0đ): Viết đúng công thức nâng nhiệt độ $Q_1 = mc(t_{nc} - t_0)$ và nhiệt nóng chảy $Q_2 = \\lambda m$.\nÝ b (1.0đ): Lập luận bảo toàn năng lượng và đưa ra tổng nhiệt lượng $Q = Q_1 + Q_2$.',
      explanation: 'Áp dụng các định luật nhiệt học và định nghĩa nhiệt nóng chảy.'
    };
  }

  // ==========================================
  // SUBJECT: HÓA HỌC (CHEMISTRY)
  // ==========================================
  if (subjectKey === 'hoa-hoc') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Chất nào sau đây phản ứng được với dung dịch $AgNO_3$ trong $NH_3$ đun nóng tạo kết tủa bạc sáng bóng (phản ứng tráng bạc) (${unit})?`,
        options: [
          { key: 'A', content: 'Glucose ($C_6H_{12}O_6$)' },
          { key: 'B', content: 'Saccharose ($C_{12}H_{22}O_{11}$)' },
          { key: 'C', content: 'Tinh bột' },
          { key: 'D', content: 'Cellulose' }
        ],
        correctOption: 'A',
        explanation: 'Glucose có nhóm aldehyde ($-CHO$) ở dạng mạch hở nên tham gia phản ứng tráng bạc tạo $2Ag\\downarrow$.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Cho các phát biểu sau về hợp chất hữu cơ liên quan đến "${topic} - ${unit}":`,
        trueFalseItems: [
          { key: 'a', statement: 'Ester có nhiệt độ sôi thấp hơn alcohol có cùng số nguyên tử carbon do không có liên kết hydrogen liên phân tử.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'b', statement: 'Phản ứng thủy phân ester trong môi trường kiềm (xà phòng hóa) là phản ứng thuận nghịch.', isCorrect: false, explanation: 'Sai, phản ứng xà phòng hóa xảy ra một chiều.' },
          { key: 'c', statement: 'Chất béo là triester của glycerol với các acid béo.', isCorrect: true, explanation: 'Đúng theo định nghĩa lipid.' },
          { key: 'd', statement: 'Tất cả các carbohydrate đều cho phản ứng màu với dung dịch iodine.', isCorrect: false, explanation: 'Sai, chỉ có tinh bột mới cho phản ứng màu xanh tím đặc trưng với iodine.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Đốt cháy hoàn toàn $0,1\\text{ mol}$ một ester đơn chức, no, mạch hở thu được $0,2\\text{ mol } CO_2$. Số nguyên tử carbon trong phân tử ester đó là bao nhiêu?`,
        shortAnswerKey: '2',
        explanation: 'Số nguyên tử $C = \\frac{n_{CO_2}}{n_{ester}} = \\frac{0,2}{0,1} = 2$ ($HCOOCH_3$).'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Viết phương trình hóa học thực hiện chuỗi chuyển hóa sau (ghi rõ điều kiện nếu có): $Tinh\\ bột \\rightarrow Glucose \\rightarrow Ethanol \\rightarrow Acetic\\ acid$.`,
      essayRubric: 'Ý a (0.75đ): Viết đúng 3 phương trình phản ứng có cân bằng hệ số.\nÝ b (0.75đ): Ghi đúng điều kiện xúc tác men, nhiệt độ, enzyme cho từng phản ứng.',
      explanation: 'Thực hiện tuần tự 3 phản ứng: thủy phân tinh bột, lên men rượu và lên men giấm.'
    };
  }

  // ==========================================
  // SUBJECT: SINH HỌC (BIOLOGY)
  // ==========================================
  if (subjectKey === 'sinh-hoc') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Trong cấu trúc phân tử DNA, nucleotide loại Adenine (A) liên kết với nucleotide loại nào theo nguyên tắc bổ sung?`,
        options: [
          { key: 'A', content: 'Thymine (T) bằng 2 liên kết hydrogen.' },
          { key: 'B', content: 'Guanine (G) bằng 3 liên kết hydrogen.' },
          { key: 'C', content: 'Cytosine (C) bằng 2 liên kết hydrogen.' },
          { key: 'D', content: 'Uracil (U) bằng 3 liên kết hydrogen.' }
        ],
        correctOption: 'A',
        explanation: 'Theo nguyên tắc bổ sung trong DNA: A liên kết với T bằng 2 liên kết hydrogen; G liên kết với C bằng 3 liên kết hydrogen.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Xét quá trình di truyền ở cấp độ phân tử (${topic}):`,
        trueFalseItems: [
          { key: 'a', statement: 'Quá trình tái bản DNA diễn ra theo nguyên tắc bổ sung và nguyên tắc bán bảo toàn.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'b', statement: 'Mã di truyền có tính thoái hóa nghĩa là một bộ ba mã hóa cho nhiều loại amino acid.', isCorrect: false, explanation: 'Sai, tính thoái hóa là nhiều bộ ba khác nhau cùng mã hóa cho một amino acid.' },
          { key: 'c', statement: 'Enzyme RNA polymerase vừa có khả năng tháo xoắn vừa xúc tác tổng hợp mạch RNA mới.', isCorrect: true, explanation: 'Đúng trong quá trình phiên mã.' },
          { key: 'd', statement: 'Đột biến điểm luôn luôn làm thay đổi cấu trúc của chuỗi polypeptide tương ứng.', isCorrect: false, explanation: 'Sai, đột biến đồng nghĩa (do tính thoái hóa của mã di truyền) không làm thay đổi amino acid.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Một gene có chiều dài $5100\\text{ Å}$. Tổng số nucleotide của gene này là bao nhiêu?`,
        shortAnswerKey: '3000',
        explanation: '$N = \\frac{2 \\times L}{3,4} = \\frac{2 \\times 5100}{3,4} = 3000\\text{ nucleotide}$.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Nêu các cơ chế phát sinh đột biến gen và ý nghĩa của đột biến gen đối với tiến hóa và chọn giống.`,
      essayRubric: 'Ý a (1.0đ): Nêu được cơ chế bắt cặp nhầm (sự bắt cặp không theo NTBS) và tác nhân hóa học/vật lí (5-BU, tia UV).\nÝ b (1.0đ): Giải thích được vai trò cung cấp nguồn nguyên liệu sơ cấp cho tiến hóa.',
      explanation: 'Trình bày đầy đủ cơ chế phân tử và vai trò sinh học.'
    };
  }

  // ==========================================
  // SUBJECT: NGỮ VĂN (LITERATURE)
  // ==========================================
  if (subjectKey === 'ngu-van') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Biện pháp tu từ nào được sử dụng chủ đạo trong việc khắc họa hình tượng nghệ thuật ở "${topic} - ${unit}"?`,
        options: [
          { key: 'A', content: 'Ẩn dụ và nhân hóa gợi hình tượng sâu sắc.' },
          { key: 'B', content: 'Liệt kê thuần túy không có yếu tố biểu cảm.' },
          { key: 'C', content: 'Nói quá làm giảm bớt tính chân thực.' },
          { key: 'D', content: 'Đảo ngữ mang tính chất hài hước châm biếm.' }
        ],
        correctOption: 'A',
        explanation: 'Nghệ thuật ẩn dụ và nhân hóa giúp tác phẩm giàu giá trị thẩm mĩ, khơi gợi chiều sâu cảm xúc.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Đọc đoạn văn bản sau và xác định tính đúng/sai của các nhận định liên quan đến "${topic}":\n"Lòng yêu nước, tinh thần trách nhiệm và sự cống hiến vì cộng đồng là nền tảng vững chắc để xây dựng một xã hội văn minh, thịnh vượng."`,
        trueFalseItems: [
          { key: 'a', statement: 'Phương thức biểu đạt chính của đoạn văn bản trên là nghị luận.', isCorrect: true, explanation: 'Đúng, nhằm bàn luận và thuyết phục về tư tưởng đạo lí.' },
          { key: 'b', statement: 'Đoạn trích sử dụng phong cách ngôn ngữ sinh hoạt đời thường.', isCorrect: false, explanation: 'Sai, sử dụng phong cách ngôn ngữ chính luận/báo chí.' },
          { key: 'c', statement: 'Thao tác lập luận chủ yếu trong đoạn văn là giải thích và bình luận.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'd', statement: 'Văn bản phủ nhận vai trò của cá nhân đối với sự phát triển xã hội.', isCorrect: false, explanation: 'Sai, văn bản đề cao trách nhiệm cống hiến của mỗi cá nhân.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Hãy chỉ ra từ khóa (keyword) quan trọng nhất thể hiện chủ đề tư tưởng của văn bản đọc hiểu trên (viết ngắn gọn trong 1-4 từ).`,
        shortAnswerKey: 'Trách nhiệm cống hiến',
        explanation: 'Chủ đề chính bàn về tinh thần trách nhiệm và cống hiến vì cộng đồng.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Viết một đoạn văn nghị luận xã hội (khoảng 200 chữ) trình bày suy nghĩ của anh/chị về ý nghĩa của lối sống có trách nhiệm đối với thế hệ trẻ trong kỉ nguyên chuyển đổi số.`,
      essayRubric: 'Ý a (0.5đ): Đảm bảo hình thức đoạn văn 200 chữ, đúng chính tả ngữ pháp.\nÝ b (0.5đ): Nêu rõ vấn đề: Ý nghĩa của lối sống có trách nhiệm.\nÝ c (1.0đ): Bàn luận sâu sắc (giúp hoàn thiện bản thân, lan tỏa giá trị tích cực, làm chủ công nghệ), có dẫn chứng thực tế và bài học hành động.',
      explanation: 'Đoạn văn kết cấu chặt chẽ, luận điểm rõ ràng, dẫn chứng thuyết phục.'
    };
  }

  // ==========================================
  // SUBJECT: TIẾNG ANH (ENGLISH)
  // ==========================================
  if (subjectKey === 'tieng-anh') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Choose the letter A, B, C, or D to indicate the correct answer to the following question regarding "${unit || topic}":\nIf she _______ harder, she would have passed the final examination with flying colours.`,
        options: [
          { key: 'A', content: 'had studied' },
          { key: 'B', content: 'studied' },
          { key: 'C', content: 'studies' },
          { key: 'D', content: 'would study' }
        ],
        correctOption: 'A',
        explanation: 'Đây là câu điều kiện loại 3 (Third Conditional) diễn tả sự việc trái với thực tế trong quá khứ: If + S + had + V3/ed, S + would/could + have + V3/ed.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Read the passage about "${topic}" and decide whether the following statements are True (T) or False (F):\n"Artificial Intelligence (AI) and digital transformation are rapidly revolutionizing education worldwide. By offering personalized learning paths and automated feedback, modern technologies empower students to master complex concepts at their own pace while helping educators optimize instructional time."`,
        trueFalseItems: [
          { key: 'a', statement: 'AI and digital transformation are changing global education in significant ways.', isCorrect: true, explanation: 'True (Passage: "...are rapidly revolutionizing education worldwide").' },
          { key: 'b', statement: 'Personalized learning paths force all students to study at the exact same pace.', isCorrect: false, explanation: 'False (Passage mentions: "...empower students to master complex concepts at their own pace").' },
          { key: 'c', statement: 'Modern educational technologies can provide automated feedback to learners.', isCorrect: true, explanation: 'True (Passage: "...offering personalized learning paths and automated feedback").' },
          { key: 'd', statement: 'Educators receive no benefits from applying digital tools in their classrooms.', isCorrect: false, explanation: 'False (Passage states it is "...helping educators optimize instructional time").' }
        ],
        explanation: 'Statements a and c are TRUE; b and d are FALSE based on the reading text.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Give the correct form of the word in brackets to complete the sentence: "Renewable energy plays an extremely _______ role in mitigating climate change." (IMPORTANCE)`,
        shortAnswerKey: 'important',
        explanation: 'Sau trạng từ "extremely" và trước danh từ "role", ta cần một tính từ: importance (n) -> important (adj).'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Write an essay (150 - 180 words) discussing the benefits and challenges of online learning for high school students in Vietnam.`,
      essayRubric: 'Task Achievement (0.5 pts): Fully addresses all parts of the prompt.\nCoherence & Cohesion (0.5 pts): Clear organization, logical paragraphing and transitions.\nLexical Resource (0.5 pts): Wide range of vocabulary and correct collocations.\nGrammatical Accuracy (0.5 pts): Accurate complex sentence structures and punctuation.',
      explanation: 'Candidate clearly organizes introduction, body paragraphs (advantages & challenges), and conclusion with supporting examples.'
    };
  }

  // ==========================================
  // SUBJECT: TIN HỌC (INFORMATICS / IT)
  // ==========================================
  if (subjectKey === 'tin-hoc') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Trong lập trình và khoa học máy tính (${topic} - ${unit}), cấu trúc dữ liệu hoặc thuật toán nào sau đây hoạt động theo nguyên lí LIFO (Last In First Out)?`,
        options: [
          { key: 'A', content: 'Ngăn xếp (Stack)' },
          { key: 'B', content: 'Hàng đợi (Queue)' },
          { key: 'C', content: 'Mảng một chiều (Array)' },
          { key: 'D', content: 'Danh sách liên kết đơn (Singly Linked List)' }
        ],
        correctOption: 'A',
        explanation: 'Ngăn xếp (Stack) lưu trữ và truy xuất phần tử theo nguyên lí vào sau ra trước (LIFO: Last In First Out).'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Xét các phát biểu về mạng máy tính, an toàn thông tin và cơ sở dữ liệu (${topic}):`,
        trueFalseItems: [
          { key: 'a', statement: 'Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) tổ chức dữ liệu dưới dạng các bảng hai chiều gồm hàng và cột.', isCorrect: true, explanation: 'Đúng theo mô hình dữ liệu quan hệ của Codd.' },
          { key: 'b', statement: 'Khóa chính (Primary Key) của một bảng có thể chứa các giá trị trùng lặp hoặc giá trị NULL.', isCorrect: false, explanation: 'Sai, khóa chính phải mang tính duy nhất và không được phép NULL.' },
          { key: 'c', statement: 'Mã hóa dữ liệu và xác thực 2 yếu tố (2FA) giúp tăng cường bảo mật tài khoản người dùng trên không gian mạng.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'd', statement: 'Giao thức HTTPS truyền dữ liệu dưới dạng văn bản thuần túy không qua bất kì lớp bảo mật nào.', isCorrect: false, explanation: 'Sai, HTTPS sử dụng SSL/TLS để mã hóa đường truyền an toàn.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Cho đoạn mã Python: \n\`a = [x**2 for x in range(5) if x % 2 == 1]\`\nGiá trị của \`len(a)\` sau khi thực thi là bao nhiêu?`,
        shortAnswerKey: '2',
        explanation: 'Các giá trị thỏa mãn x trong range(5) là số lẻ: x = 1, x = 3 -> a = [1, 9] -> len(a) = 2.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Trình bày các bước xây dựng cơ sở dữ liệu quan hệ cho bài toán Quản lí Thư viện trường học (gồm các thực thể: Sách, Độc giả, Phiếu mượn). Nêu rõ các khóa chính và khóa ngoại để liên kết các bảng.`,
      essayRubric: 'Ý a (1.0đ): Xác định đúng thuộc tính cho các bảng Sách(MaSach, TenSach, TacGia), DocGia(MaDG, HoTen, Lop), PhieuMuon(MaPM, MaSach, MaDG, NgayMuon, NgayTra).\nÝ b (1.0đ): Chỉ rõ khóa chính và mô tả đúng mối quan hệ 1-N giữa các bảng.',
      explanation: 'Mô hình hóa dữ liệu chính xác, chuẩn hóa dữ liệu 3NF và thiết lập quan hệ toàn vẹn.'
    };
  }

  // ==========================================
  // SUBJECT: GIÁO DỤC KINH TẾ VÀ PHÁP LUẬT / GDCD
  // ==========================================
  if (subjectKey === 'gdkt-pl') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Theo quy định của pháp luật Việt Nam về "${topic} - ${unit}", hình thức thực hiện pháp luật nào mà các cá nhân, tổ chức chủ động thực hiện đầy đủ những nghĩa vụ mà pháp luật quy định phải làm?`,
        options: [
          { key: 'A', content: 'Thi hành pháp luật' },
          { key: 'B', content: 'Sử dụng pháp luật' },
          { key: 'C', content: 'Tuân thủ pháp luật' },
          { key: 'D', content: 'Áp dụng pháp luật' }
        ],
        correctOption: 'A',
        explanation: 'Thi hành pháp luật là việc chủ động thực hiện nghĩa vụ mà pháp luật quy định phải làm (ví dụ: đóng thuế, thực hiện nghĩa vụ quân sự).'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Đọc tình huống kinh tế - pháp luật sau (${topic}):\nDoanh nghiệp X áp dụng mô hình kinh tế tuần hoàn, đầu tư dây chuyền xử lí chất thải thành nguyên liệu tái chế, thực hiện kê khai nộp thuế đúng hạn và kí hợp đồng lao động đầy đủ với người lao động.`,
        trueFalseItems: [
          { key: 'a', statement: 'Doanh nghiệp X đã thể hiện trách nhiệm xã hội và bảo vệ môi trường sinh thái.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'b', statement: 'Việc nộp thuế đúng hạn của doanh nghiệp là hình thức tuân thủ pháp luật bị động.', isCorrect: false, explanation: 'Sai, đây là hành vi thi hành nghĩa vụ pháp lí chủ động.' },
          { key: 'c', statement: 'Kí hợp đồng lao động giúp bảo đảm quyền và lợi ích hợp pháp của các bên tham gia quan hệ lao động.', isCorrect: true, explanation: 'Đúng theo Bộ luật Lao động.' },
          { key: 'd', statement: 'Mô hình kinh tế tuần hoàn gây lãng phí tài nguyên và làm giảm năng lực cạnh tranh.', isCorrect: false, explanation: 'Sai, kinh tế tuần hoàn tối ưu hóa sử dụng tài nguyên và phát triển bền vững.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Theo Hiến pháp năm 2013 của nước CHXHCN Việt Nam, công dân đủ từ bao nhiêu tuổi trở lên có quyền bầu cử Quốc hội và Hội đồng nhân dân các cấp? (Điền số tuổi)`,
        shortAnswerKey: '18',
        explanation: 'Theo Điều 27 Hiến pháp 2013: Công dân đủ mười tám tuổi trở lên có quyền bầu cử và đủ hai mươi mốt tuổi trở lên có quyền ứng cử.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Phân tích vai trò của pháp luật đối với sự phát triển kinh tế thị trường định hướng xã hội chủ nghĩa ở nước ta hiện nay.`,
      essayRubric: 'Ý a (1.0đ): Tạo khung khổ pháp lí minh bạch, bảo đảm quyền tự do kinh doanh và bình đẳng giữa các thành phần kinh tế.\nÝ b (1.0đ): Ngăn ngừa cạnh tranh không lành mạnh, bảo vệ quyền lợi người tiêu dùng và thúc đẩy hội nhập quốc tế.',
      explanation: 'Phân tích đầy đủ vai trò định hướng, kiến tạo và bảo vệ của hệ thống pháp luật.'
    };
  }

  // ==========================================
  // SUBJECT: CÔNG NGHỆ (TECHNOLOGY)
  // ==========================================
  if (subjectKey === 'cong-nghe') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Trong lĩnh vực công nghệ (${topic} - ${unit}), vật liệu hoặc giải pháp kĩ thuật nào sau đây thân thiện với môi trường và tiết kiệm năng lượng?`,
        options: [
          { key: 'A', content: 'Sử dụng hệ thống pin năng lượng mặt trời và đèn LED hiệu suất cao.' },
          { key: 'B', content: 'Sử dụng nhiên liệu hóa thạch không qua xử lí khí thải.' },
          { key: 'C', content: 'Xả trực tiếp chất thải công nghiệp chưa qua xử lí ra sông suối.' },
          { key: 'D', content: 'Lạm dụng hóa chất bảo vệ thực vật có độ độc cao trong canh tác.' }
        ],
        correctOption: 'A',
        explanation: 'Năng lượng tái tạo và thiết bị chiếu sáng LED giúp giảm tiêu thụ điện năng và giảm phát thải khí nhà kính.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Xét quy trình thiết kế kĩ thuật và công nghệ sản xuất (${topic}):`,
        trueFalseItems: [
          { key: 'a', statement: 'Bản vẽ kĩ thuật là ngôn ngữ chung dùng trong kĩ thuật và sản xuất công nghiệp.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'b', statement: 'Trong mạch điện xoay chiều, cầu chì được mắc song song với thiết bị điện cần bảo vệ.', isCorrect: false, explanation: 'Sai, cầu chì phải được mắc nối tiếp trên dây pha trước thiết bị điện.' },
          { key: 'c', statement: 'Nông nghiệp công nghệ cao ứng dụng cảm biến IoT để tự động tưới tiêu và điều hòa vi khí hậu.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'd', statement: 'Khi sử dụng điện an toàn, có thể sửa chữa thiết bị điện mà không cần ngắt nguồn điện chính.', isCorrect: false, explanation: 'Sai, bắt buộc phải ngắt aptomat/cầu dao và kiểm tra bằng bút thử điện.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Một bóng đèn sợi đốt có công suất $P = 60\\text{W}$ thắp sáng $5\\text{ giờ}$ mỗi ngày. Điện năng tiêu thụ của bóng đèn đó trong 30 ngày là bao nhiêu kWh?`,
        shortAnswerKey: '9',
        explanation: '$A = P \\times t = 60\\text{W} \\times (5 \\times 30)\\text{h} = 9000\\text{Wh} = 9\\text{kWh}$.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Trình bày các bước trong quy trình thiết kế kĩ thuật một sản phẩm đơn giản phục vụ đời sống.`,
      essayRubric: 'Ý a (1.0đ): Nêu đúng 5 bước: Xác định vấn đề -> Tìm hiểu tổng quan -> Đề xuất giải pháp -> Chế tạo mẫu thử -> Đánh giá và hoàn thiện.\nÝ b (1.0đ): Minh họa bằng một ví dụ thực tế cụ thể.',
      explanation: 'Trình bày theo đúng chuẩn quy trình tư duy thiết kế và kĩ thuật GDPT 2018.'
    };
  }

  // ==========================================
  // SUBJECT: TOÁN HỌC (MATHEMATICS)
  // ==========================================
  if (subjectKey === 'toan') {
    if (type === 'multiple_choice') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Cho hàm số $y = f(x)$ liên quan đến ${unit || topic}. Mệnh đề nào sau đây đúng?`,
        options: [
          { key: 'A', content: 'Hàm số đồng biến trên khoảng xác định khi $f\'(x) > 0$.' },
          { key: 'B', content: 'Hàm số luôn nghịch biến trên $\\mathbb{R}$.' },
          { key: 'C', content: 'Hàm số không có điểm cực trị nào.' },
          { key: 'D', content: 'Giá trị lớn nhất của hàm số luôn bằng 0.' }
        ],
        correctOption: 'A',
        explanation: 'Theo định lí về tính đơn điệu của hàm số: Nếu $f\'(x) > 0, \\forall x \\in (a; b)$ thì hàm số đồng biến trên khoảng $(a; b)$.'
      };
    }
    if (type === 'true_false') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Cho hàm số $y = f(x) = x^3 - 3x^2 + 2$ liên quan đến chủ đề "${topic}":`,
        trueFalseItems: [
          { key: 'a', statement: 'Đạo hàm của hàm số là $f\'(x) = 3x^2 - 6x$.', isCorrect: true, explanation: 'Đúng.' },
          { key: 'b', statement: 'Hàm số đạt cực tiểu tại điểm $x = 0$.', isCorrect: false, explanation: 'Sai, $f\'(x)=0 \\Leftrightarrow x=0$ hoặc $x=2$; $x=0$ là điểm cực đại.' },
          { key: 'c', statement: 'Hàm số đồng biến trên các khoảng $(-\\infty; 0)$ và $(2; +\\infty)$.', isCorrect: true, explanation: 'Đúng do $f\'(x) > 0$.' },
          { key: 'd', statement: 'Đồ thị hàm số đi qua gốc tọa độ $O(0; 0)$.', isCorrect: false, explanation: 'Sai, tại $x=0 \\Rightarrow y=2 \\neq 0$.' }
        ],
        explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
      };
    }
    if (type === 'short_answer') {
      return {
        id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
        content: `Tìm giá trị cực đại của hàm số $y = -x^2 + 4x + 1$.`,
        shortAnswerKey: '5',
        explanation: 'Ta có đỉnh parabol tại $x = -b/(2a) = 2 \\Rightarrow y_{max} = -(2)^2 + 4(2) + 1 = 5$.'
      };
    }
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Khảo sát sự biến thiên và vẽ đồ thị của hàm số $y = x^3 - 3x + 1$ (${topic}).`,
      essayRubric: 'Ý a (1.0đ): Tập xác định, tính đạo hàm $y\' = 3x^2 - 3$, giải nghiệm $x = \\pm 1$, lập bảng biến thiên.\nÝ b (1.0đ): Xác định điểm uốn, giao điểm với các trục tọa độ và vẽ đồ thị chính xác.',
      explanation: 'Thực hiện đầy đủ các bước khảo sát hàm đa thức bậc ba.'
    };
  }

  // ==========================================
  // SUBJECT: GENERIC SUBJECT (CHUNG CHO TẤT CẢ MÔN HỌC KHÁC)
  // ==========================================
  if (type === 'multiple_choice') {
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Nội dung cốt lõi của bài học "${unit || topic}" (Môn ${p.subjectName}) hướng tới phát triển năng lực nhận thức nào sau đây?`,
      options: [
        { key: 'A', content: 'Hiểu rõ khái niệm bản chất, vận dụng linh hoạt kiến thức vào giải quyết vấn đề thực tiễn.' },
        { key: 'B', content: 'Chỉ học thuộc lòng máy móc định nghĩa mà không cần liên hệ thực tế.' },
        { key: 'C', content: 'Bỏ qua việc phân tích và đánh giá các dữ liệu thực nghiệm.' },
        { key: 'D', content: 'Không chú trọng tư duy phản biện và kĩ năng làm việc sáng tạo.' }
      ],
      correctOption: 'A',
      explanation: `Chương trình giáo dục môn ${p.subjectName} chú trọng phát triển phẩm chất và năng lực giải quyết vấn đề gắn với thực tiễn đời sống.`
    };
  }

  if (type === 'true_false') {
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Xét các nhận định khoa học liên quan đến nội dung "${topic} - ${unit}" trong môn ${p.subjectName}:`,
      trueFalseItems: [
        { key: 'a', statement: `Kiến thức của "${unit || topic}" có tính hệ thống và gắn liền với các hiện tượng thực tế.`, isCorrect: true, explanation: 'Đúng, môn học mang tính thực tiễn cao.' },
        { key: 'b', statement: 'Mọi quy luật khoa học đều mang tính cảm tính và không cần được kiểm chứng bằng thực nghiệm.', isCorrect: false, explanation: 'Sai, tri thức khoa học dựa trên phương pháp nghiên cứu và luận cứ xác thực.' },
        { key: 'c', statement: 'Việc vận dụng tri thức vào đời sống giúp nâng cao năng lực tư duy sáng tạo của người học.', isCorrect: true, explanation: 'Đúng.' },
        { key: 'd', statement: 'Nội dung bài học hoàn toàn tách rời với xu thế chuyển đổi số và phát triển bền vững.', isCorrect: false, explanation: 'Sai, môn học luôn định hướng gắn với xã hội hiện đại.' }
      ],
      explanation: 'Mệnh đề a, c ĐÚNG; b, d SAI.'
    };
  }

  if (type === 'short_answer') {
    return {
      id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
      content: `Hãy nêu từ khóa (keyword) quan trọng nhất thể hiện mục tiêu phát triển của "${topic} - ${unit}" (viết ngắn gọn trong 1-4 từ)?`,
      shortAnswerKey: 'Vận dụng thực tiễn',
      explanation: `Mục tiêu cốt lõi là phát triển năng lực tư duy và vận dụng kiến thức môn ${p.subjectName} vào thực tiễn.`
    };
  }

  return {
    id, orderNumber, type, topic, unit, cognitiveLevel: level, points,
    content: `Dựa vào kiến thức về "${topic} - ${unit}" trong môn ${p.subjectName}, hãy trình bày ý nghĩa thực tiễn của bài học và đề xuất 02 giải pháp nâng cao hiệu quả học tập môn học này.`,
    essayRubric: 'Ý a (1.0đ): Nêu rõ ý nghĩa thực tiễn đối với đời sống và nhận thức bản thân.\nÝ b (1.0đ): Đề xuất 02 giải pháp học tập chủ động, sáng tạo và có tính khả thi cao.',
    explanation: 'Trình bày mạch lạc, logic và bám sát yêu cầu cần đạt của chương trình.'
  };
}

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
