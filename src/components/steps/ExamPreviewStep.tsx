import React, { useState } from 'react';
import { 
  FileText, 
  Shuffle, 
  Sparkles, 
  Check, 
  Edit3, 
  Trash2, 
  Plus, 
  Eye, 
  Table, 
  BookOpen, 
  ArrowRight,
  HelpCircle,
  Wand2,
  CheckCircle2,
  XCircle,
  Copy
} from 'lucide-react';
import { ExamQuestion, ExamHeaderConfig, ShuffledExamVariant } from '../../types';
import { MathRenderer } from '../../utils/mathRenderer';
import { generateShuffledExamVariants } from '../../utils/shuffler';

interface ExamPreviewStepProps {
  header: ExamHeaderConfig;
  questions: ExamQuestion[];
  onChangeQuestions: (questions: ExamQuestion[]) => void;
  variants: ShuffledExamVariant[];
  onChangeVariants: (variants: ShuffledExamVariant[]) => void;
  onAssistQuestion: (q: ExamQuestion, prompt: string) => Promise<ExamQuestion | null>;
  onNextStep: () => void;
  isAiGeneratingExam: boolean;
}

export const ExamPreviewStep: React.FC<ExamPreviewStepProps> = ({
  header,
  questions,
  onChangeQuestions,
  variants,
  onChangeVariants,
  onAssistQuestion,
  onNextStep,
  isAiGeneratingExam
}) => {
  const [viewMode, setViewMode] = useState<'master' | 'variants' | 'matrix_key'>('master');
  const [selectedVariantCode, setSelectedVariantCode] = useState<'101' | '102' | '103' | '104'>('101');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [aiPromptModalQuestion, setAiPromptModalQuestion] = useState<ExamQuestion | null>(null);
  const [customAiPrompt, setCustomAiPrompt] = useState<string>('');
  const [isAssisting, setIsAssisting] = useState(false);

  // Re-shuffle variants on demand
  const handleReshuffle = () => {
    const newVariants = generateShuffledExamVariants(questions);
    onChangeVariants(newVariants);
  };

  // Trigger AI Question Assistant
  const handleExecuteAiAssist = async (instruction: string) => {
    if (!aiPromptModalQuestion) return;
    setIsAssisting(true);
    try {
      const updatedQ = await onAssistQuestion(aiPromptModalQuestion, instruction);
      if (updatedQ) {
        const updatedList = questions.map(q => q.id === updatedQ.id ? updatedQ : q);
        onChangeQuestions(updatedList);
        onChangeVariants(generateShuffledExamVariants(updatedList));
      }
      setAiPromptModalQuestion(null);
      setCustomAiPrompt('');
    } catch (err) {
      console.error('Error assisting question:', err);
    } finally {
      setIsAssisting(false);
    }
  };

  // Group questions by Part
  const part1Questions = questions.filter(q => q.type === 'multiple_choice');
  const part2Questions = questions.filter(q => q.type === 'true_false');
  const part3Questions = questions.filter(q => q.type === 'short_answer');
  const part4Questions = questions.filter(q => q.type === 'essay');

  const selectedVariant = variants.find(v => v.code === selectedVariantCode) || variants[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Controls & View Switcher */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            id="view-btn-master"
            onClick={() => setViewMode('master')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'master'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📄 Đề Gốc & Lời Giải Chi Tiết ({questions.length} câu)
          </button>
          <button
            id="view-btn-variants"
            onClick={() => setViewMode('variants')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'variants'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔀 4 Mã Đề Trộn (101 - 104)
          </button>
          <button
            id="view-btn-matrix-key"
            onClick={() => setViewMode('matrix_key')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'matrix_key'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Bảng Soi Đáp Án 4 Mã Đề
          </button>
        </div>

        {/* Reshuffle & Export actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-reshuffle"
            onClick={handleReshuffle}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Trộn lại 4 mã đề</span>
          </button>

          <button
            id="btn-goto-export"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
          >
            <span>Xuất File Word .docx</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* VIEW 1: MASTER EXAM & DETAILED SOLUTIONS */}
      {viewMode === 'master' && (
        <div className="space-y-6">
          
          {/* Official MOET Exam Paper Header Frame */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header Layout */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-900 text-center">
              <div>
                <p className="font-bold text-xs uppercase text-slate-800">{header.provinceOrDept || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}</p>
                <p className="font-bold text-xs uppercase text-slate-900">{header.schoolName || 'TRƯỜNG THPT CHU VĂN AN'}</p>
                <p className="text-[11px] text-slate-500 mt-1">ĐỀ CHÍNH THỨC (ĐỀ GỐC)</p>
              </div>
              <div>
                <p className="font-extrabold text-sm uppercase text-slate-900">{header.examTitle}</p>
                <p className="font-bold text-xs text-indigo-900">MÔN: {header.subject.toUpperCase()} - KHỐI {header.grade.toUpperCase()}</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Thời gian làm bài: <span className="font-bold">{header.timeDuration} phút</span> (không kể thời gian phát đề)
                </p>
              </div>
            </div>

            {/* Questions Stream */}
            <div className="space-y-8">
              
              {/* PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN */}
              {part1Questions.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide">
                      PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn ({part1Questions.length} câu - {(part1Questions.length * 0.25).toFixed(2)} điểm)
                    </h4>
                    <p className="text-[11px] text-indigo-700 mt-0.5">
                      Thí sinh trả lời từ câu 1 đến câu {part1Questions.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {part1Questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                        
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-xs text-slate-900 shrink-0">
                              Câu {idx + 1} ({q.cognitiveLevel}):
                            </span>
                            <div className="text-xs text-slate-800 font-serif leading-relaxed">
                              <MathRenderer content={q.content} />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setAiPromptModalQuestion(q)}
                              title="Dùng AI chỉnh sửa / nâng cấp câu hỏi"
                              className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Options */}
                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs pt-1">
                            {q.options.map(opt => (
                              <div
                                key={opt.key}
                                className={`p-2 rounded-lg border font-serif flex items-center gap-2 ${
                                  opt.key === q.correctOption
                                    ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`font-bold w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                  opt.key === q.correctOption ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {opt.key}
                                </span>
                                <MathRenderer content={opt.content} />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Solution */}
                        {q.explanation && (
                          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đáp án đúng: {q.correctOption} — Hướng dẫn giải chi tiết:</span>
                            </div>
                            <div className="text-slate-600 font-serif text-[11px] leading-relaxed">
                              <MathRenderer content={q.explanation} />
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI */}
              {part2Questions.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                      PHẦN II. Câu trắc nghiệm đúng sai ({part2Questions.length} câu - {(part2Questions.length * 1.0).toFixed(2)} điểm)
                    </h4>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Thí sinh trả lời từ câu 1 đến câu {part2Questions.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {part2Questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                        
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-xs text-slate-900 shrink-0">
                              Câu {idx + 1} ({q.cognitiveLevel}):
                            </span>
                            <div className="text-xs text-slate-800 font-serif leading-relaxed">
                              <MathRenderer content={q.content} />
                            </div>
                          </div>

                          <button
                            onClick={() => setAiPromptModalQuestion(q)}
                            title="AI chỉnh sửa câu hỏi"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Sub items a, b, c, d */}
                        {q.trueFalseItems && (
                          <div className="space-y-1.5 pt-1">
                            {q.trueFalseItems.map(item => (
                              <div key={item.key} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs font-serif">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-700">{item.key})</span>
                                  <MathRenderer content={item.statement} />
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {item.isCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                            <span className="text-blue-700 font-semibold text-[11px]">Hướng dẫn giải:</span>
                            <div className="text-slate-600 font-serif text-[11px] leading-relaxed">
                              <MathRenderer content={q.explanation} />
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PHẦN III: TRẢ LỜI NGẮN */}
              {part3Questions.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                      PHẦN III. Câu trắc nghiệm trả lời ngắn ({part3Questions.length} câu - {(part3Questions.length * 0.5).toFixed(2)} điểm)
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Thí sinh trả lời từ câu 1 đến câu {part3Questions.length}. Điền kết quả số/giá trị vào ô trả lời.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {part3Questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                        
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-xs text-slate-900 shrink-0">
                              Câu {idx + 1} ({q.cognitiveLevel}):
                            </span>
                            <div className="text-xs text-slate-800 font-serif leading-relaxed">
                              <MathRenderer content={q.content} />
                            </div>
                          </div>

                          <button
                            onClick={() => setAiPromptModalQuestion(q)}
                            title="AI chỉnh sửa câu hỏi"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-700">Đáp số chuẩn:</span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-mono font-bold rounded-lg border border-emerald-300">
                            {q.shortAnswerKey || '5'}
                          </span>
                        </div>

                        {q.explanation && (
                          <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                            <span className="text-emerald-700 font-semibold text-[11px]">Hướng dẫn giải:</span>
                            <div className="text-slate-600 font-serif text-[11px] leading-relaxed">
                              <MathRenderer content={q.explanation} />
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PHẦN IV: TỰ LUẬN */}
              {part4Questions.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100">
                    <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                      PHẦN IV. Tự luận ({part4Questions.length} câu)
                    </h4>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Thí sinh trình bày chi tiết các bước giải và lập luận trên giấy làm bài.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {part4Questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                        
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-xs text-slate-900 shrink-0">
                              Câu {idx + 1} ({q.points || 1.0} điểm):
                            </span>
                            <div className="text-xs text-slate-800 font-serif leading-relaxed whitespace-pre-line">
                              <MathRenderer content={q.content} />
                            </div>
                          </div>

                          <button
                            onClick={() => setAiPromptModalQuestion(q)}
                            title="AI chỉnh sửa câu hỏi"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {q.essayRubric && (
                          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                            <span className="text-amber-800 font-bold text-[11px]">Biểu điểm chấm (Rubric):</span>
                            <p className="text-slate-600 font-serif text-[11px] leading-relaxed whitespace-pre-line">
                              {q.essayRubric}
                            </p>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: 4 SHUFFLED VARIANTS (101 - 104) */}
      {viewMode === 'variants' && (
        <div className="space-y-6">
          
          {/* Variant Selector Tabs */}
          <div className="flex items-center gap-2">
            {(['101', '102', '103', '104'] as const).map(code => (
              <button
                key={code}
                onClick={() => setSelectedVariantCode(code)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVariantCode === code
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Mã Đề {code}
              </button>
            ))}
          </div>

          {/* Exam Paper for Selected Variant */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header with Code */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-900 text-center">
              <div>
                <p className="font-bold text-xs uppercase text-slate-800">{header.provinceOrDept || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}</p>
                <p className="font-bold text-xs uppercase text-slate-900">{header.schoolName || 'TRƯỜNG THPT CHU VĂN AN'}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded-md">
                  MÃ ĐỀ THI: {selectedVariant.code}
                </div>
              </div>
              <div>
                <p className="font-extrabold text-sm uppercase text-slate-900">{header.examTitle}</p>
                <p className="font-bold text-xs text-indigo-900">MÔN: {header.subject.toUpperCase()} - KHỐI {header.grade.toUpperCase()}</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Thời gian làm bài: <span className="font-bold">{header.timeDuration} phút</span>
                </p>
              </div>
            </div>

            {/* Questions for this variant */}
            <div className="space-y-6">
              {selectedVariant.questions.map((q, idx) => (
                <div key={q.id} className="space-y-2">
                  <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
                    <span className="font-bold text-slate-900 shrink-0 font-sans">
                      Câu {idx + 1}:
                    </span>
                    <MathRenderer content={q.content} />
                  </div>

                  {q.type === 'multiple_choice' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-serif pl-4">
                      {q.options.map(opt => (
                        <div key={opt.key} className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{opt.key}.</span>
                          <MathRenderer content={opt.content} />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'true_false' && q.trueFalseItems && (
                    <div className="space-y-1 pl-4 text-xs font-serif">
                      {q.trueFalseItems.map(item => (
                        <div key={item.key} className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{item.key})</span>
                          <MathRenderer content={item.statement} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* VIEW 3: MASTER ANSWER KEY COMPARISON TABLE */}
      {viewMode === 'matrix_key' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Bảng Soi & Đối Chiếu Đáp Án 4 Mã Đề (101 - 102 - 103 - 104)
              </h4>
              <p className="text-xs text-slate-500">
                Bảng chuẩn phục vụ giáo viên chấm nhanh bài làm trắc nghiệm của học sinh
              </p>
            </div>
            <button
              onClick={handleReshuffle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Trộn lại</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-2.5 border-r border-slate-200">Câu số</th>
                  <th className="p-2.5 border-r border-slate-200 bg-indigo-50 text-indigo-900">Mã Đề 101</th>
                  <th className="p-2.5 border-r border-slate-200 bg-blue-50 text-blue-900">Mã Đề 102</th>
                  <th className="p-2.5 border-r border-slate-200 bg-emerald-50 text-emerald-900">Mã Đề 103</th>
                  <th className="p-2.5 bg-amber-50 text-amber-900">Mã Đề 104</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {questions.filter(q => q.type === 'multiple_choice').map((_, idx) => {
                  const k101 = variants.find(v => v.code === '101')?.answerKey[idx + 1] || 'A';
                  const k102 = variants.find(v => v.code === '102')?.answerKey[idx + 1] || 'B';
                  const k103 = variants.find(v => v.code === '103')?.answerKey[idx + 1] || 'C';
                  const k104 = variants.find(v => v.code === '104')?.answerKey[idx + 1] || 'D';

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 font-sans font-bold text-slate-600 border-r border-slate-200">
                        Câu {idx + 1}
                      </td>
                      <td className="p-2 font-bold text-indigo-700 bg-indigo-50/30 border-r border-slate-200">{k101}</td>
                      <td className="p-2 font-bold text-blue-700 bg-blue-50/30 border-r border-slate-200">{k102}</td>
                      <td className="p-2 font-bold text-emerald-700 bg-emerald-50/30 border-r border-slate-200">{k103}</td>
                      <td className="p-2 font-bold text-amber-700 bg-amber-50/30">{k104}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Assistant Modal per Question */}
      {aiPromptModalQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 space-y-4 p-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Trợ Lý AI Tinh Chỉnh Câu Hỏi</h3>
              </div>
              <button onClick={() => setAiPromptModalQuestion(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-serif">
              <MathRenderer content={aiPromptModalQuestion.content} />
            </div>

            {/* Quick preset AI prompt actions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Chọn lệnh nhanh:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExecuteAiAssist('Làm mới câu hỏi tương đương nhưng đổi số liệu')}
                  disabled={isAssisting}
                  className="p-2 text-left text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg border border-indigo-200 transition-colors"
                >
                  🔄 Đổi số liệu tương đương
                </button>
                <button
                  onClick={() => handleExecuteAiAssist('Nâng cao mức độ tư duy sang Vận dụng')}
                  disabled={isAssisting}
                  className="p-2 text-left text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-200 transition-colors"
                >
                  📈 Nâng cao độ khó (Vận dụng)
                </button>
                <button
                  onClick={() => handleExecuteAiAssist('Chuyển thành bài toán thực tế đời sống')}
                  disabled={isAssisting}
                  className="p-2 text-left text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-200 transition-colors"
                >
                  🌿 Gắn với thực tiễn
                </button>
                <button
                  onClick={() => handleExecuteAiAssist('Sửa lại công thức toán LaTeX chuẩn đẹp và viết lại lời giải chi tiết')}
                  disabled={isAssisting}
                  className="p-2 text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg border border-blue-200 transition-colors"
                >
                  📐 Chuẩn hóa công thức LaTeX
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hoặc nhập yêu cầu riêng cho AI:
              </label>
              <input
                type="text"
                value={customAiPrompt}
                onChange={(e) => setCustomAiPrompt(e.target.value)}
                placeholder="Ví dụ: Thêm đồ thị minh họa dạng chữ, tăng tính phân hóa..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setAiPromptModalQuestion(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => handleExecuteAiAssist(customAiPrompt || 'Hoàn thiện câu hỏi')}
                disabled={isAssisting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAssisting ? 'animate-spin' : ''}`} />
                <span>{isAssisting ? 'AI đang xử lý...' : 'Thực hiện'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
