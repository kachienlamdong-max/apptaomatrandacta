import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// In-memory stats and feedback store (simulating edtech analytics)
let appStats = {
  totalTeachers: 12480, // initial benchmark of teachers across Vietnam
  totalExamsGenerated: 48920,
  totalWordExports: 36150,
  totalFeedback: 1420,
  popularSubjects: [
    { name: 'Toán học', count: 18450 },
    { name: 'Ngữ văn', count: 12100 },
    { name: 'Khoa học tự nhiên / Vật lí', count: 9800 },
    { name: 'Tiếng Anh', count: 8570 },
  ],
  recentFeedbacks: [
    {
      id: 'fb-1',
      teacherName: 'Thầy Nguyễn Văn Hùng',
      school: 'THPT Chuyên Hà Nội - Amsterdam',
      province: 'Hà Nội',
      rating: 5,
      comment: 'Cấu trúc ma trận 4 phần theo chuẩn 2025 rất chính xác, công thức Toán xuất ra Word rất chuẩn đẹp!',
      createdAt: '2025-02-18T08:30:00.000Z'
    },
    {
      id: 'fb-2',
      teacherName: 'Cô Trần Thị Mai',
      school: 'THCS Lê Quý Đôn',
      province: 'Đà Nẵng',
      rating: 5,
      comment: 'Tính năng trộn 4 mã đề kèm bảng đáp án giúp tổ bộ môn tiết kiệm rất nhiều thời gian làm đề kiểm tra.',
      createdAt: '2025-02-19T14:15:00.000Z'
    },
    {
      id: 'fb-3',
      teacherName: 'Thầy Lê Hoàng Long',
      school: 'THPT Bùi Thị Xuân',
      province: 'TP. Hồ Chí Minh',
      rating: 5,
      comment: 'Bản đặc tả chi tiết đúng các mức độ nhận thức theo Công văn của Bộ. Tuyệt vời!',
      createdAt: '2025-02-20T09:45:00.000Z'
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for lazy Gemini SDK
  const getGeminiClient = () => {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API: Get Stats
  app.get('/api/stats', (req, res) => {
    res.json(appStats);
  });

  // API: Register Teacher / Increment Teacher count
  app.post('/api/teachers/register', (req, res) => {
    const { fullName, school, province, subject } = req.body;
    appStats.totalTeachers += 1;
    res.json({
      success: true,
      message: 'Đăng ký thông tin giáo viên thành công',
      currentTotal: appStats.totalTeachers,
      teacher: { fullName, school, province, subject }
    });
  });

  // API: Record Exam Generation
  app.post('/api/stats/record-generation', (req, res) => {
    appStats.totalExamsGenerated += 1;
    res.json({ success: true, count: appStats.totalExamsGenerated });
  });

  // API: Record Word Export
  app.post('/api/stats/record-export', (req, res) => {
    appStats.totalWordExports += 1;
    res.json({ success: true, count: appStats.totalWordExports });
  });

  // API: Submit Feedback
  app.post('/api/feedback', (req, res) => {
    const { teacherName, school, province, rating, comment, featureRequests } = req.body;
    const newFeedback = {
      id: 'fb-' + Date.now(),
      teacherName: teacherName || 'Giáo viên',
      school: school || 'Trường học',
      province: province || 'Việt Nam',
      rating: Number(rating) || 5,
      comment: comment || 'Đánh giá ứng dụng',
      featureRequests: featureRequests || '',
      createdAt: new Date().toISOString()
    };
    appStats.recentFeedbacks.unshift(newFeedback);
    appStats.totalFeedback += 1;
    res.json({ success: true, feedback: newFeedback });
  });

  // API: AI Generate Matrix
  app.post('/api/gemini/generate-matrix', async (req, res) => {
    try {
      const { subject, grade, curriculum, examTitle, timeDuration, structureOption, customNotes } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là chuyên gia thẩm định chương trình giáo dục phổ thông GDPT 2018 của Bộ Giáo dục và Đào tạo Việt Nam.
Hãy xây dựng Ma trận đề kiểm tra định kỳ cấp THPT/THCS chuẩn Bộ GD&ĐT cho:
- Môn học: ${subject}
- Khối lớp: ${grade}
- Bộ sách giáo khoa: ${curriculum}
- Kỳ thi / Kiểm tra: ${examTitle}
- Thời gian làm bài: ${timeDuration} phút
- Định dạng cấu trúc: ${structureOption}

QUY TẮC BẮT BUỘC THEO HƯỚNG DẪN KỸ THUẬT MA TRẬN BỘ GD&ĐT:
1. CẤU TRÚC ĐỀ THEO ĐẶC THÙ TỪNG MÔN:
   - Môn Toán: Phần I (12 câu MCQ - 3.0đ, 0.25đ/câu), Phần II (4 câu Đúng/Sai - 4.0đ, 1.0đ/câu với 4 ý), Phần III (6 câu Trả lời ngắn - 3.0đ, 0.5đ/câu).
   - Môn Vật lí, Hóa học, Sinh học, Địa lí: Phần I (18 câu MCQ - 4.5đ, 0.25đ/câu), Phần II (4 câu Đúng/Sai - 4.0đ, 1.0đ/câu với 4 ý), Phần III (6 câu Trả lời ngắn - 1.5đ, 0.25đ/câu).
   - Môn Lịch sử, GDKT&PL, Công nghệ: Phần I (24 câu MCQ - 6.0đ) + Phần II (4 câu Đúng/Sai - 4.0đ) hoặc cấu trúc kết hợp Tự luận định kỳ theo quy định.
   - Môn Ngữ văn: Tự luận gồm 2 phần (Đọc hiểu 4.0đ + Viết 6.0đ).
   - Môn Ngoại ngữ: Trắc nghiệm nhiều lựa chọn toàn bộ bài thi.
2. TỈ LỆ MỨC ĐỘ NHẬN THỨC TOÀN BÀI:
   - Mức Biết: khoảng 40% (4.0 điểm).
   - Mức Hiểu: khoảng 30% (3.0 điểm).
   - Mức Vận dụng (gồm Vận dụng và Vận dụng cao): khoảng 30% (3.0 điểm).
   - Lưu ý: Tỉ lệ tính theo ĐIỂM SỐ THỰC TẾ toàn bài, không chỉ tính theo số lượng câu hỏi.
3. PHÂN BỔ ĐIỂM SỐ CHÍNH XÁC:
   - Tổng điểm toàn bài phải đúng 10.0 điểm.
   - Các nội dung trọng tâm có thời lượng dạy học lớn hơn cần được phân bổ số câu, số lệnh hỏi và điểm số tương xứng.

${customNotes ? `- Yêu cầu bổ sung của giáo viên: ${customNotes}` : ''}

Hãy trả về định dạng JSON với mảng danh sách các dòng ma trận (MatrixRow). Mỗi dòng gồm:
- id: chuỗi
- topic: Tên chủ đề / chương chính trong chương trình
- unit: Đơn vị kiến thức cụ thể
- part1_nb, part1_th, part1_vd, part1_vdc (số lượng câu trắc nghiệm 4 lựa chọn ở 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
- part2_nb, part2_th, part2_vd, part2_vdc (số lượng câu Đúng/Sai ở 4 mức độ)
- part3_nb, part3_th, part3_vd, part3_vdc (số lượng câu Trả lời ngắn ở 4 mức độ)
- part4_nb, part4_th, part4_vd, part4_vdc (số lượng câu Tự luận ở 4 mức độ)
- totalPoints: tổng điểm tương ứng cho dòng đó (tổng toàn bộ ma trận phải đạt đúng 10.0 điểm).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                unit: { type: Type.STRING },
                part1_nb: { type: Type.INTEGER },
                part1_th: { type: Type.INTEGER },
                part1_vd: { type: Type.INTEGER },
                part1_vdc: { type: Type.INTEGER },
                part2_nb: { type: Type.INTEGER },
                part2_th: { type: Type.INTEGER },
                part2_vd: { type: Type.INTEGER },
                part2_vdc: { type: Type.INTEGER },
                part3_nb: { type: Type.INTEGER },
                part3_th: { type: Type.INTEGER },
                part3_vd: { type: Type.INTEGER },
                part3_vdc: { type: Type.INTEGER },
                part4_nb: { type: Type.INTEGER },
                part4_th: { type: Type.INTEGER },
                part4_vd: { type: Type.INTEGER },
                part4_vdc: { type: Type.INTEGER },
                totalPoints: { type: Type.NUMBER },
              },
              required: ['id', 'topic', 'unit', 'part1_nb', 'part1_th', 'part1_vd', 'part1_vdc', 'part2_nb', 'part2_th', 'part2_vd', 'part2_vdc', 'part3_nb', 'part3_th', 'part3_vd', 'part3_vdc', 'part4_nb', 'part4_th', 'part4_vd', 'part4_vdc', 'totalPoints'],
            }
          }
        }
      });

      const matrixData = JSON.parse(response.text || '[]');
      res.json({ success: true, matrix: matrixData });
    } catch (err: any) {
      console.error('Error generating matrix:', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi tạo ma trận AI' });
    }
  });

  // API: AI Generate Specification Table
  app.post('/api/gemini/generate-spec', async (req, res) => {
    try {
      const { subject, grade, curriculum, matrix } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là chuyên gia giáo dục Bộ GD&ĐT. Dựa trên ma trận kiểm tra môn ${subject} khối ${grade} (Bộ sách ${curriculum}) với các chủ đề sau:
${JSON.stringify(matrix, null, 2)}

Hãy viết BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA chuẩn Bộ GD&ĐT.
Đối với mỗi chủ đề và đơn vị kiến thức, viết rõ ràng, sư phạm các "Yêu cầu cần đạt" (Mức độ nhận thức) cho từng mức:
- nb: Nhận biết (Học sinh nêu, nhận biết, phân biệt, gọi tên được...)
- th: Thông hiểu (Học sinh giải thích, minh họa, so sánh, phân tích được...)
- vd: Vận dụng (Học sinh tính toán, giải quyết tình huống thực tiễn...)
- vdc: Vận dụng cao (Học sinh tổng hợp, đánh giá, giải quyết bài toán phân hóa...)
Và số câu hỏi tương ứng theo ma trận.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                unit: { type: Type.STRING },
                learningObjectives: {
                  type: Type.OBJECT,
                  properties: {
                    nb: { type: Type.STRING },
                    th: { type: Type.STRING },
                    vd: { type: Type.STRING },
                    vdc: { type: Type.STRING },
                  },
                  required: ['nb', 'th', 'vd', 'vdc']
                },
                questionCount: {
                  type: Type.OBJECT,
                  properties: {
                    part1: {
                      type: Type.OBJECT,
                      properties: { nb: { type: Type.INTEGER }, th: { type: Type.INTEGER }, vd: { type: Type.INTEGER }, vdc: { type: Type.INTEGER } },
                      required: ['nb', 'th', 'vd', 'vdc']
                    },
                    part2: {
                      type: Type.OBJECT,
                      properties: { nb: { type: Type.INTEGER }, th: { type: Type.INTEGER }, vd: { type: Type.INTEGER }, vdc: { type: Type.INTEGER } },
                      required: ['nb', 'th', 'vd', 'vdc']
                    },
                    part3: {
                      type: Type.OBJECT,
                      properties: { nb: { type: Type.INTEGER }, th: { type: Type.INTEGER }, vd: { type: Type.INTEGER }, vdc: { type: Type.INTEGER } },
                      required: ['nb', 'th', 'vd', 'vdc']
                    },
                    part4: {
                      type: Type.OBJECT,
                      properties: { nb: { type: Type.INTEGER }, th: { type: Type.INTEGER }, vd: { type: Type.INTEGER }, vdc: { type: Type.INTEGER } },
                      required: ['nb', 'th', 'vd', 'vdc']
                    },
                  },
                  required: ['part1', 'part2', 'part3', 'part4']
                }
              },
              required: ['id', 'topic', 'unit', 'learningObjectives', 'questionCount']
            }
          }
        }
      });

      const specData = JSON.parse(response.text || '[]');
      res.json({ success: true, specification: specData });
    } catch (err: any) {
      console.error('Error generating specification:', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi tạo bản đặc tả' });
    }
  });

  // API: AI Generate Full Exam with Math LaTeX & Detailed Solution
  app.post('/api/gemini/generate-exam', async (req, res) => {
    try {
      const { header, matrix, specification, customInstructions } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là giáo viên chuyên gia ra đề thi chuẩn Bộ GD&ĐT Việt Nam theo chương trình GDPT 2018.
Hãy tạo 01 ĐỀ THI MẪU HOÀN CHỈNH MINH HỌA bám sát 100% Ma trận, Bản đặc tả và BẢNG KIỂM TIÊU CHÍ KỸ THUẬT CỦA BỘ GD&ĐT sau:
- Môn: ${header.subject} (${header.grade})
- Kỳ thi: ${header.examTitle} - Thời gian: ${header.timeDuration} phút
- Bộ sách: ${header.curriculum}

QUY TẮC KỸ THUẬT VÀ TIÊU CHÍ BẢNG KIỂM BẮT BUỘC CỦA BỘ GD&ĐT:

1. QUY TẮC CHUNG VÀ TÍNH ĐỘC LẬP (KHÔNG TRÙNG LẶP):
- TẤT CẢ CÁC CÂU HỎI TRONG TOÀN BỘ ĐỀ THI BẮT BUỘC PHẢI HOÀN TOÀN KHÁC NHAU VỀ NỘI DUNG, DỮ LIỆU, NGỮ CẢNH VÀ LỆNH HỎI.
- Tất cả công thức Toán, Lý, Hóa BẮT BUỘC đặt trong cặp dấu $...$ (ví dụ: $f(x) = x^3 - 3x + 1$, $\\int_0^1 x e^x dx$, $\\vec{u} = (1; 2; -3)$, $Fe + 2HCl \\rightarrow FeCl_2 + H_2\\uparrow$).

2. PHẦN I - CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (type: 'multiple_choice'):
- Mỗi câu hỏi đo lường một kết quả học tập/mục tiêu xác định; tập trung vào MỘT vấn đề duy nhất.
- Câu dẫn ngắn gọn, rõ ý, ở thể khẳng định. Tránh các từ ngữ mơ hồ, chủ quan như "Theo em...", "hầu hết", "phần lớn".
- Bốn phương án lựa chọn A, B, C, D độc lập, đồng nhất về nội dung và độ dài tương đương nhau.
- TUYỆT ĐỐI KHÔNG dùng các phương án: "Tất cả các phương án trên đều đúng", "Không có phương án nào đúng", "Cả A và B đều đúng/sai".
- Phương án nhiễu phải có tính hợp lí, không "sai" một cách quá lộ liễu. Vị trí phương án đúng A, B, C, D phân bố đều.

3. PHẦN II - CÂU TRẮC NGHIỆM ĐÚNG/SAI (type: 'true_false'):
- Mỗi câu gồm 1 đoạn thông tin/ngữ liệu, PHẦN NGUỒN NGỮ LIỆU đặt ngay dưới đoạn thông tin (ví dụ: Nguồn: Tổng hợp từ Tổng cục Thống kê / Nguồn: Xử lí từ SGK Địa lí 12 / Nguồn: Biên tập từ Bộ TN&MT...).
- Đoạn thông tin cung cấp đủ dữ kiện để đánh giá, không sao chép nguyên văn dài từ SGK mà được tổng hợp/xử lí.
- BỐN NHẬN ĐỊNH a, b, c, d PHÂN BỐ CHUẨN CẤP ĐỘ NHẬN THỨC:
  + Nhận định a): Mức NHẬN BIẾT (tái hiện kiến thức cơ bản, sự kiện, định nghĩa, thông tin trực tiếp).
  + Nhận định b): Mức THÔNG HIỂU (xử lí thông tin, giải thích, so sánh, phân tích mối quan hệ, xác định nguyên nhân).
  + Nhận định c) & d): Mức VẬN DỤNG (kết nối thông tin phức hợp, suy luận, đánh giá, xử lí dữ liệu thực tế, giải quyết tình huống).
- Mỗi nhận định là một mệnh đề hoàn chỉnh, chỉ chứa MỘT ý chính trọn vẹn, không mơ hồ, không dùng phủ định kép/phức tạp, hạn chế từ cảm tính ước lệ ("hầu hết", "nhiều", "ít", "cao", "thấp"... trừ khi có số liệu rõ ràng).
- Tỉ lệ số nhận định Đúng và Sai trong đề phải cân đối tương đối, các nhận định độc lập, không gợi đáp án cho nhau.

4. PHẦN III - CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (type: 'short_answer'):
- CHỈ DÙNG CHO CÁC CÂU HỎI TÍNH TOÁN HOẶC XỬ LÍ SỐ LIỆU ĐỊNH LƯỢNG (Toán, Vật lí, Hóa học, Sinh học, Địa lí có xử lí số liệu). Không dùng câu hỏi lí thuyết, thuật ngữ, tên địa danh.
- ĐÁP ÁN LÀ MỘT SỐ HOẶC GIÁ TRỊ ĐỊNH LƯỢNG XÁC ĐỊNH, TỐI ĐA 4 KÝ TỰ (bao gồm cả dấu trừ '-' và dấu phẩy thập phân ',').
  (Ví dụ hợp lệ: 12, 3,5, 0,75, -2,1, 1089, 290, 75).
- KHÔNG ghi đơn vị đo, KHÔNG ghi kí hiệu %, phân số hay lời giải trong đáp án (shortAnswerKey).
- Trong đề bài BẮT BUỘC nêu rõ đơn vị, quy ước làm tròn và câu dẫn: "Khi trả lời, chỉ ghi số." (Ví dụ: "...Tính mật độ dân số của tỉnh X (đơn vị: người/km²), làm tròn đến hàng đơn vị. Khi trả lời, chỉ ghi số.").

5. PHẦN IV - CÂU TỰ LUẬN (type: 'essay'):
- Phân loại theo 3 mức: Biết, Hiểu, Vận dụng.
- Cấu trúc đầy đủ 4 thành phần: Ngữ liệu/bối cảnh, Lệnh hỏi rõ ràng, Phạm vi trả lời cụ thể (giới hạn rõ số lượng ý: ví dụ "nêu 2 biểu hiện", "đề xuất 2 giải pháp", thời gian, đối tượng), Sản phẩm trả lời.
- essayRubric (Hướng dẫn chấm): BẮT BUỘC chia điểm chi tiết theo từng ý (ví dụ: Ý 1 (0.5đ): ..., Ý 2 (0.5đ): ..., Lưu ý chấm: ...).

${customInstructions ? `Lưu ý thêm từ giáo viên: ${customInstructions}` : ''}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                orderNumber: { type: Type.INTEGER },
                type: { type: Type.STRING, description: 'multiple_choice | true_false | short_answer | essay' },
                topic: { type: Type.STRING },
                unit: { type: Type.STRING },
                cognitiveLevel: { type: Type.STRING },
                content: { type: Type.STRING, description: 'Đề bài chứa LaTeX' },
                points: { type: Type.NUMBER },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      key: { type: Type.STRING },
                      content: { type: Type.STRING }
                    },
                    required: ['key', 'content']
                  }
                },
                correctOption: { type: Type.STRING },
                trueFalseItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      key: { type: Type.STRING },
                      statement: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                      explanation: { type: Type.STRING }
                    },
                    required: ['key', 'statement', 'isCorrect']
                  }
                },
                shortAnswerKey: { type: Type.STRING },
                essayRubric: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ['id', 'orderNumber', 'type', 'topic', 'cognitiveLevel', 'content', 'points', 'explanation']
            }
          }
        }
      });

      const questions = JSON.parse(response.text || '[]');
      res.json({ success: true, questions });
    } catch (err: any) {
      console.error('Error generating exam:', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi tạo đề thi' });
    }
  });

  // API: AI Assistant - Refine or Replace Question
  app.post('/api/gemini/assist-question', async (req, res) => {
    try {
      const { question, action, instruction } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là trợ lý AI sư phạm cho giáo viên.
Câu hỏi hiện tại:
${JSON.stringify(question, null, 2)}

Hành động yêu cầu: ${action} (${instruction || 'Nâng cấp câu hỏi, chuẩn hóa LaTeX, kiểm tra tính đúng đắn của đáp án'}).
Hãy tạo câu hỏi thay thế hoặc câu hỏi đã được tinh chỉnh, giữ nguyên định dạng JSON của câu hỏi, hỗ trợ công thức Toán LaTeX chuẩn ($...$).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              orderNumber: { type: Type.INTEGER },
              type: { type: Type.STRING },
              topic: { type: Type.STRING },
              unit: { type: Type.STRING },
              cognitiveLevel: { type: Type.STRING },
              content: { type: Type.STRING },
              points: { type: Type.NUMBER },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { key: { type: Type.STRING }, content: { type: Type.STRING } },
                  required: ['key', 'content']
                }
              },
              correctOption: { type: Type.STRING },
              trueFalseItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { key: { type: Type.STRING }, statement: { type: Type.STRING }, isCorrect: { type: Type.BOOLEAN }, explanation: { type: Type.STRING } },
                  required: ['key', 'statement', 'isCorrect']
                }
              },
              shortAnswerKey: { type: Type.STRING },
              essayRubric: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ['id', 'orderNumber', 'type', 'topic', 'cognitiveLevel', 'content', 'points', 'explanation']
          }
        }
      });

      const updatedQuestion = JSON.parse(response.text || '{}');
      res.json({ success: true, question: updatedQuestion });
    } catch (err: any) {
      console.error('Error assisting question:', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi trợ lý AI' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware for dev or static for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EdTech Exam Matrix Server running on http://localhost:${PORT}`);
  });
}

startServer();
