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
Hãy xây dựng Ma trận đề kiểm tra định kỳ chuẩn Bộ GD&ĐT cho:
- Môn học: ${subject}
- Khối lớp: ${grade}
- Bộ sách giáo khoa: ${curriculum}
- Kỳ thi / Kiểm tra: ${examTitle}
- Thời gian làm bài: ${timeDuration} phút
- Định dạng cấu trúc: ${structureOption} (Option 1: Phần I TN 4 lựa chọn, Phần II Đúng/Sai, Phần III Trả lời ngắn, Phần IV Tự luận).
${customNotes ? `- Yêu cầu bổ sung của giáo viên: ${customNotes}` : ''}

Hãy trả về định dạng JSON với mảng danh sách các dòng ma trận (MatrixRow). Mỗi dòng gồm:
- id: chuỗi
- topic: Tên chủ đề / chương chính trong chương trình
- unit: Đơn vị kiến thức cụ thể
- part1_nb, part1_th, part1_vd, part1_vdc (số lượng câu trắc nghiệm 4 lựa chọn ở 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
- part2_nb, part2_th, part2_vd, part2_vdc (số lượng câu Đúng/Sai ở 4 mức độ)
- part3_nb, part3_th, part3_vd, part3_vdc (số lượng câu Trả lời ngắn ở 4 mức độ)
- part4_nb, part4_th, part4_vd, part4_vdc (số lượng câu Tự luận ở 4 mức độ)
- totalPoints: tổng điểm tương ứng ước tính cho dòng đó (thang 10 điểm toàn đề).
Lưu ý: Tỷ lệ phân bổ điểm chuẩn Bộ thường là: 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao. Tổng điểm toàn bộ ma trận phải đúng 10.0 điểm.`;

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

      const prompt = `Bạn là giáo viên chuyên gia ra đề thi chuẩn Bộ GD&ĐT Việt Nam.
Hãy tạo 01 ĐỀ THI MẪU HOÀN CHỈNH MINH HỌA bám sát 100% Ma trận và Bản đặc tả sau:
- Môn: ${header.subject} (${header.grade})
- Kỳ thi: ${header.examTitle} - Thời gian: ${header.timeDuration} phút
- Bộ sách: ${header.curriculum}

QUY TẮC CÔNG THỨC TOÁN / LÝ / HÓA (BẮT BUỘC):
- Tất cả công thức Toán, Lý, Hóa BẮT BUỘC đặt trong cặp dấu $...$ (ví dụ: $f(x) = x^3 - 3x + 1$, $\\int_0^1 x e^x dx$, $\\vec{u} = (1; 2; -3)$, $\\Delta = b^2 - 4ac$, $Fe + 2HCl \\rightarrow FeCl_2 + H_2\\uparrow$).

CẤU TRÚC 4 PHẦN CHUẨN BỘ GD&ĐT:
1. PHẦN I: Trắc nghiệm 4 lựa chọn (type: 'multiple_choice'). Mỗi câu có options: [{key: 'A', content: '...'}, {key: 'B', content: '...'}, {key: 'C', content: '...'}, {key: 'D', content: '...'}], correctOption: 'A'|'B'|'C'|'D'.
2. PHẦN II: Trắc nghiệm Đúng/Sai (type: 'true_false'). Mỗi câu có ngữ cảnh và 4 mệnh đề con a, b, c, d (trueFalseItems: [{key: 'a', statement: '...', isCorrect: true/false, explanation: '...'}, ...]).
3. PHẦN III: Trắc nghiệm trả lời ngắn (type: 'short_answer'). Điền số hoặc kết quả ngắn gọn (shortAnswerKey).
4. PHẦN IV: Tự luận (type: 'essay'). Có hướng dẫn chấm, biểu điểm và thang điểm chi tiết (essayRubric).

Mỗi câu hỏi BẮT BUỘC có:
- cognitiveLevel: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao'
- points: điểm số
- explanation: Lời giải chi tiết, rõ ràng, sư phạm, bước giải cụ thể để giáo viên làm hướng dẫn chấm.
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
