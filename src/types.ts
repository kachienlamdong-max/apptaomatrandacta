export type GradeLevel = 
  | 'Lớp 1' | 'Lớp 2' | 'Lớp 3' | 'Lớp 4' | 'Lớp 5'
  | 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9'
  | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';

export type SchoolLevel = 'Tiểu học' | 'THCS' | 'THPT';

export type StructureOption = 
  | 'option_1' // TN 4 lựa chọn + Đúng/Sai + Trả lời ngắn + Tự luận (Chuẩn Bộ 2025)
  | 'option_2' // TN 4 lựa chọn + Đúng/Sai + Tự luận
  | 'option_3' // TN 4 lựa chọn + Đúng/Sai + Trả lời ngắn
  | 'option_4'; // Tùy chỉnh tự do

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface TeacherProfile {
  id: string;
  fullName: string;
  school: string;
  province: string;
  subject: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface MatrixRow {
  id: string;
  topic: string; // Chủ đề / Chương
  unit: string; // Nội dung / Đơn vị kiến thức
  // Phần I: Trắc nghiệm nhiều lựa chọn
  part1_nb: number;
  part1_th: number;
  part1_vd: number;
  part1_vdc: number;
  // Phần II: Trắc nghiệm Đúng/Sai
  part2_nb: number;
  part2_th: number;
  part2_vd: number;
  part2_vdc: number;
  // Phần III: Trả lời ngắn
  part3_nb: number;
  part3_th: number;
  part3_vd: number;
  part3_vdc: number;
  // Phần IV: Tự luận
  part4_nb: number;
  part4_th: number;
  part4_vd: number;
  part4_vdc: number;
  // Tổng điểm dòng
  totalPoints?: number;
}

export interface SpecificationItem {
  id: string;
  topic: string;
  unit: string;
  learningObjectives: {
    nb: string; // Yêu cầu cần đạt - Nhận biết
    th: string; // Yêu cầu cần đạt - Thông hiểu
    vd: string; // Yêu cầu cần đạt - Vận dụng
    vdc: string; // Yêu cầu cần đạt - Vận dụng cao
  };
  questionCount: {
    part1: { nb: number; th: number; vd: number; vdc: number };
    part2: { nb: number; th: number; vd: number; vdc: number };
    part3: { nb: number; th: number; vd: number; vdc: number };
    part4: { nb: number; th: number; vd: number; vdc: number };
  };
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface MultipleChoiceOption {
  key: 'A' | 'B' | 'C' | 'D';
  content: string;
}

export interface TrueFalseSubItem {
  key: 'a' | 'b' | 'c' | 'd';
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ExamQuestion {
  id: string;
  orderNumber: number;
  type: QuestionType;
  topic: string;
  unit: string;
  cognitiveLevel: CognitiveLevel;
  content: string; // Stem text or question context
  points: number;
  
  // For multiple_choice
  options?: MultipleChoiceOption[];
  correctOption?: 'A' | 'B' | 'C' | 'D';

  // For true_false
  trueFalseItems?: TrueFalseSubItem[];

  // For short_answer
  shortAnswerKey?: string;

  // For essay
  essayRubric?: string;

  explanation: string; // Lời giải chi tiết
}

export interface PartConfig {
  name: string; // Tên phần
  pointsPerQuestion: number; // Điểm mỗi câu (e.g. 0.25, 0.5, 1.0)
  targetQuestions: number; // Số câu mục tiêu (e.g. 12, 4, 6, 2)
  enabled: boolean; // Bật / tắt phần này
  description?: string;
}

export interface ExamPartConfigs {
  part1: PartConfig;
  part2: PartConfig;
  part3: PartConfig;
  part4: PartConfig;
}

export interface ExamHeaderConfig {
  provinceOrDept: string; // SỞ GD&ĐT TỈNH/TP...
  schoolName: string; // TRƯỜNG THPT/THCS/TIỂU HỌC...
  examTitle: string; // ĐỀ KIỂM TRA ĐỊNH KỲ HỌC KỲ I / KHẢO SÁT CHẤT LƯỢNG
  subject: string;
  grade: GradeLevel;
  curriculum: string; // Kết nối tri thức / Cánh Diều / Chân trời sáng tạo
  academicYear: string; // 2024 - 2025
  timeDuration: number; // 45, 60, 90 phút
  structureOption: StructureOption;
  teacherName: string;
  partConfigs?: ExamPartConfigs;
}

export interface ShuffledExamVariant {
  examCode: string; // 101, 102, 103, 104...
  code?: string; // alias for convenient access
  questions: ExamQuestion[];
  answerKeySummary: {
    part?: 'part1' | 'part2' | 'part3' | 'part4';
    questionNumber: number;
    type: QuestionType;
    correctAnswer: string;
  }[];
  answerKey?: Record<number, string>;
  part1AnswerKeys?: Record<number, string>;
  part2AnswerKeys?: Record<number, string>;
  part3AnswerKeys?: Record<number, string>;
}

export interface ExamProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  header: ExamHeaderConfig;
  matrix: MatrixRow[];
  specification: SpecificationItem[];
  sampleExamQuestions: ExamQuestion[];
  shuffledVariants: ShuffledExamVariant[];
  notes?: string;
}

export interface FeedbackSubmission {
  id: string;
  teacherName: string;
  school: string;
  province: string;
  rating: number; // 1-5
  comment: string;
  featureRequests?: string;
  createdAt: string;
}

export interface AppStats {
  totalTeachers: number;
  totalExamsGenerated: number;
  totalWordExports: number;
  totalFeedback: number;
  popularSubjects: { name: string; count: number }[];
  recentFeedbacks: FeedbackSubmission[];
}
