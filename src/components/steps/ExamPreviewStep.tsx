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
  Copy,
  Sliders,
  Download,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { ExamQuestion, ExamHeaderConfig, ShuffledExamVariant, MatrixRow, SpecificationItem } from '../../types';
import { MathRenderer } from '../../utils/mathRenderer';
import { generateShuffledExamVariants } from '../../utils/shuffler';
import { balanceMultipleChoiceQuestions, calculateAnswerDistribution } from '../../utils/answerBalancer';
import { exportSingleVariantToDocx, exportComplianceReportToDocx } from '../../utils/docxExport';
import { performMoetComplianceAudit } from '../../utils/complianceAudit';
import { parseEssayQuestionRubric, formatPoint } from '../../utils/rubricParser';
import { StudyGuideView } from '../studyGuide/StudyGuideView';
import { StudyGuideData } from '../../types';

interface ExamPreviewStepProps {
  header: ExamHeaderConfig;
  questions: ExamQuestion[];
  onChangeQuestions: (questions: ExamQuestion[]) => void;
  variants: ShuffledExamVariant[];
  onChangeVariants: (variants: ShuffledExamVariant[]) => void;
  onAssistQuestion: (q: ExamQuestion, prompt: string) => Promise<ExamQuestion | null>;
  onNextStep: () => void;
  isAiGeneratingExam: boolean;
  onSyncQuestionsFromMatrix?: () => void;
  onGenerateAiExam?: () => void;
  matrix?: MatrixRow[];
  specification?: SpecificationItem[];
  studyGuide?: StudyGuideData;
  onUpdateStudyGuide?: (studyGuide: StudyGuideData) => void;
}

export const ExamPreviewStep: React.FC<ExamPreviewStepProps> = ({
  header,
  questions,
  onChangeQuestions,
  variants,
  onChangeVariants,
  onAssistQuestion,
  onNextStep,
  isAiGeneratingExam,
  onSyncQuestionsFromMatrix,
  onGenerateAiExam,
  matrix = [],
  specification = [],
  studyGuide,
  onUpdateStudyGuide
}) => {
  const [viewMode, setViewMode] = useState<'master' | 'variants' | 'matrix_key' | 'study_guide' | 'checklist'>('master');
  const [variantCount, setVariantCount] = useState<number>(variants.length > 0 ? variants.length : 4);
  const [startCode, setStartCode] = useState<number>(101);
  const [selectedVariantCode, setSelectedVariantCode] = useState<string>(variants[0]?.examCode || (variants[0] as any)?.code || '101');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [aiPromptModalQuestion, setAiPromptModalQuestion] = useState<ExamQuestion | null>(null);
  const [customAiPrompt, setCustomAiPrompt] = useState<string>('');
  const [isAssisting, setIsAssisting] = useState(false);
  const [isCustomShuffleModalOpen, setIsCustomShuffleModalOpen] = useState(false);
  const [customCodesInput, setCustomCodesInput] = useState<string>('101, 102, 103, 104');
  const [isExportingReport, setIsExportingReport] = useState(false);

  const auditReport = performMoetComplianceAudit(header, questions, matrix, specification);

  // Re-shuffle variants on demand with specified count or startCode
  const handleReshuffleWithCount = (count: number, customStart: number = startCode) => {
    setVariantCount(count);
    setStartCode(customStart);
    const newVariants = generateShuffledExamVariants(questions, count, customStart);
    onChangeVariants(newVariants);
    if (newVariants.length > 0) {
      setSelectedVariantCode(newVariants[0].examCode || (newVariants[0] as any).code || '101');
    }
  };

  const handleApplyCustomCodes = () => {
    const rawCodes = customCodesInput
      .split(/[,;\s]+/)
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const validCodes = rawCodes.length > 0 ? rawCodes : ['101', '102'];
    setVariantCount(validCodes.length);
    const newVariants = generateShuffledExamVariants(questions, validCodes);
    onChangeVariants(newVariants);
    if (newVariants.length > 0) {
      setSelectedVariantCode(newVariants[0].examCode || (newVariants[0] as any).code || validCodes[0]);
    }
    setIsCustomShuffleModalOpen(false);
  };

  // Re-shuffle variants with current settings
  const handleReshuffle = () => {
    const currentCodes = variants.map(v => v.examCode || (v as any).code || '101');
    const newVariants = currentCodes.length > 0 
      ? generateShuffledExamVariants(questions, currentCodes)
      : generateShuffledExamVariants(questions, variantCount, startCode);
    onChangeVariants(newVariants);
  };

  // Re-balance and equalize A, B, C, D choices across all questions and regenerate variants
  const handleEqualizeAnswers = () => {
    const randomSeed = Math.floor(Math.random() * 10000) + 101;
    const balancedQuestions = balanceMultipleChoiceQuestions(questions, randomSeed);
    onChangeQuestions(balancedQuestions);
    const currentCodes = variants.map(v => v.examCode || (v as any).code || '101');
    const newVariants = currentCodes.length > 0
      ? generateShuffledExamVariants(balancedQuestions, currentCodes)
      : generateShuffledExamVariants(balancedQuestions, variantCount, startCode);
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
        onChangeVariants(generateShuffledExamVariants(updatedList, variantCount, startCode));
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

  // Find selected variant or fallback
  const activeVariants = variants && variants.length > 0 
    ? variants 
    : generateShuffledExamVariants(questions, variantCount, startCode);

  const selectedVariant = activeVariants.find(v => (v.examCode || (v as any).code) === selectedVariantCode) || activeVariants[0];
  const variantCodes = activeVariants.map(v => v.examCode || (v as any).code || '101');
  const codeRangeText = variantCodes.length <= 4 
    ? variantCodes.join(' - ') 
    : `${variantCodes[0]} ... ${variantCodes[variantCodes.length - 1]}`;

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
            📄 Đề Gốc & Lời Giải ({questions.length} câu)
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
            🔀 {activeVariants.length} Mã Đề Trộn ({codeRangeText})
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
            📊 Bảng Soi Đáp Án ({activeVariants.length} Mã Đề)
          </button>
          <button
            id="view-btn-study-guide"
            onClick={() => setViewMode('study_guide')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'study_guide'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-xs scale-105'
                : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100 hover:text-amber-900 border border-amber-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Bộ Đề Cương Ôn Tập (Nhân 4 câu)</span>
          </button>
          <button
            id="view-btn-checklist"
            onClick={() => setViewMode('checklist')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'checklist'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bảng Kiểm Chuẩn Bộ GD&ĐT ({auditReport.scorePercentage}%)</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onSyncQuestionsFromMatrix && (
            <button
              id="btn-sync-matrix-questions"
              onClick={onSyncQuestionsFromMatrix}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
              title="Đồng bộ chính xác câu hỏi theo môn học, ma trận và bản đặc tả"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đồng bộ từ Ma trận & Đặc tả</span>
            </button>
          )}

          {onGenerateAiExam && (
            <button
              id="btn-ai-generate-exam"
              onClick={onGenerateAiExam}
              disabled={isAiGeneratingExam}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isAiGeneratingExam ? 'animate-spin' : 'text-indigo-600'}`} />
              <span>{isAiGeneratingExam ? 'AI đang tạo...' : 'AI Tạo Đề'}</span>
            </button>
          )}

          <button
            id="btn-reshuffle"
            onClick={handleReshuffle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Xáo trộn lại thứ tự câu hỏi và đáp án"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Trộn lại {activeVariants.length} mã đề</span>
          </button>

          <button
            id="btn-goto-export"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
          >
            <span>Xuất File Word</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Flexible Shuffle Control Bar: Allow teacher to freely select 2, 3, 4, 6, 8 variants */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-slate-50 border border-indigo-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Tùy chọn số lượng mã đề trộn:</span>
              <span className="text-[11px] text-slate-500">Giáo viên tự do chọn 2, 3, 4 hoặc nhiều mã đề</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-indigo-200 shadow-xs">
            {[2, 3, 4, 6, 8].map(count => {
              const isSelected = activeVariants.length === count;
              return (
                <button
                  key={count}
                  id={`btn-shuffle-count-${count}`}
                  onClick={() => handleReshuffleWithCount(count)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs scale-105'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {count} mã đề
                </button>
              );
            })}

            <button
              id="btn-custom-shuffle"
              onClick={() => {
                setCustomCodesInput(variantCodes.join(', '));
                setIsCustomShuffleModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors border-l border-slate-200 ml-1"
              title="Nhập mã đề tùy biến hoặc đổi mã đề bắt đầu"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Tùy biến...</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-900 bg-white/80 px-3.5 py-1.5 rounded-xl border border-indigo-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Đang trộn: <strong className="font-bold text-indigo-700">{activeVariants.length} mã đề</strong> ({codeRangeText})
          </span>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Đề kiểm tra đang đồng bộ <strong className="font-bold">100%</strong> với môn <strong className="font-bold">{header.subject}</strong> ({header.grade}) — Tổng số: <strong className="font-bold">{questions.length} câu</strong> theo Ma trận và Bản đặc tả.
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
          Thời gian: {header.timeDuration} phút
        </span>
      </div>

      {questions.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900">Chưa có câu hỏi trong đề thi</h3>
            <p className="text-xs text-slate-500">
              Nhấn nút bên dưới để tạo ngay bộ câu hỏi chuẩn hóa bám sát 100% Ma trận và Bản đặc tả môn {header.subject}.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {onSyncQuestionsFromMatrix && (
              <button
                onClick={onSyncQuestionsFromMatrix}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo câu hỏi từ Ma trận & Đặc tả</span>
              </button>
            )}
            {onGenerateAiExam && (
              <button
                onClick={onGenerateAiExam}
                disabled={isAiGeneratingExam}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-colors disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>Tạo bằng AI</span>
              </button>
            )}
          </div>
        </div>
      )}

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

                        {/* Options - National Exam Format (A, B on row 1; C, D on row 2) */}
                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs pt-1 font-serif">
                            {q.options.map(opt => (
                              <div
                                key={opt.key}
                                className={`flex items-start gap-2 py-0.5 ${
                                  opt.key === q.correctOption
                                    ? 'text-emerald-900 font-bold'
                                    : 'text-slate-800'
                                }`}
                              >
                                <span className={`font-bold shrink-0 ${
                                  opt.key === q.correctOption ? 'text-emerald-700 underline' : 'text-slate-900'
                                }`}>
                                  {opt.key}.
                                </span>
                                <div className="flex-1">
                                  <MathRenderer content={opt.content} />
                                </div>
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

                        {(() => {
                          const structured = parseEssayQuestionRubric(q, idx);
                          return (
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-amber-800 font-bold text-[11px] uppercase flex items-center gap-1.5">
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  Biểu điểm chấm chi tiết (Rubric - {structured.totalPointsFormatted} điểm):
                                </span>
                                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                                  Thang 0.25đ - 0.5đ / ý
                                </span>
                              </div>
                              <div className="space-y-1.5 pt-1">
                                {structured.items.map((it, itIdx) => (
                                  <div key={itIdx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-xs font-serif">
                                    <div className="flex items-start gap-2 flex-1">
                                      {it.subLabel && <span className="font-bold text-slate-800 font-sans text-[11px] shrink-0">{it.subLabel}</span>}
                                      <div className="text-slate-800 leading-relaxed">
                                        <MathRenderer content={it.content} />
                                      </div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-amber-100/80 text-amber-900 border border-amber-200 font-mono font-bold text-[11px] rounded shrink-0">
                                      {it.pointsFormatted}đ
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {q.explanation && (
                                <div className="p-2 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-blue-900 font-sans">
                                  <span className="font-semibold">Lời giải chi tiết: </span>
                                  <MathRenderer content={q.explanation} />
                                </div>
                              )}
                            </div>
                          );
                        })()}

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: SHUFFLED VARIANTS */}
      {viewMode === 'variants' && (
        <div className="space-y-6">
          
          {/* Variant Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              {activeVariants.map(variant => {
                const code = variant.examCode || (variant as any).code || '101';
                const isSelected = selectedVariantCode === code;
                return (
                  <button
                    key={code}
                    id={`btn-variant-${code}`}
                    onClick={() => setSelectedVariantCode(code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Mã Đề {code}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Đang xem: <strong className="text-indigo-700">Mã Đề {selectedVariant.examCode || (selectedVariant as any).code}</strong> ({selectedVariant.questions.length} câu)
              </span>
              <button
                id={`btn-download-preview-${selectedVariant.examCode || (selectedVariant as any).code}`}
                onClick={() => {
                  const code = selectedVariant.examCode || (selectedVariant as any).code || '101';
                  exportSingleVariantToDocx({
                    header,
                    matrix: [],
                    specification: [],
                    sampleExamQuestions: questions,
                    shuffledVariants: activeVariants,
                  }, code);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
                title={`Tải ngay file Word Mã Đề ${selectedVariant.examCode || (selectedVariant as any).code}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Mã {selectedVariant.examCode || (selectedVariant as any).code} (.docx)</span>
              </button>
            </div>
          </div>

          {/* Exam Paper for Selected Variant */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header with Code */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-900 text-center">
              <div>
                <p className="font-bold text-xs uppercase text-slate-800">{header.provinceOrDept || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}</p>
                <p className="font-bold text-xs uppercase text-slate-900">{header.schoolName || 'TRƯỜNG THPT CHU VĂN AN'}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded-md">
                  MÃ ĐỀ THI: {selectedVariant.examCode || (selectedVariant as any).code}
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
            <div className="space-y-8">
              
              {/* PHẦN I TRONG MÃ ĐỀ */}
              {(() => {
                const vPart1 = selectedVariant.questions.filter(q => q.type === 'multiple_choice');
                if (vPart1.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100">
                      <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide">
                        PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn ({vPart1.length} câu - {(vPart1.length * 0.25).toFixed(2)} điểm)
                      </h4>
                      <p className="text-[11px] text-indigo-700 mt-0.5">
                        Thí sinh trả lời từ câu 1 đến câu {vPart1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {vPart1.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-2">
                          <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
                            <span className="font-bold text-slate-900 shrink-0 font-sans">
                              Câu {idx + 1}:
                            </span>
                            <MathRenderer content={q.content} />
                          </div>

                          {q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-serif pl-4">
                              {q.options.map(opt => (
                                <div key={opt.key} className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-800">{opt.key}.</span>
                                  <MathRenderer content={opt.content} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* PHẦN II TRONG MÃ ĐỀ (Đếm lại từ câu 1) */}
              {(() => {
                const vPart2 = selectedVariant.questions.filter(q => q.type === 'true_false');
                if (vPart2.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                        PHẦN II. Câu trắc nghiệm đúng sai ({vPart2.length} câu - {(vPart2.length * 1.0).toFixed(2)} điểm)
                      </h4>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        Thí sinh trả lời từ câu 1 đến câu {vPart2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {vPart2.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-2">
                          <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
                            <span className="font-bold text-slate-900 shrink-0 font-sans">
                              Câu {idx + 1}:
                            </span>
                            <MathRenderer content={q.content} />
                          </div>

                          {q.trueFalseItems && (
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
                );
              })()}

              {/* PHẦN III TRONG MÃ ĐỀ (Đếm lại từ câu 1) */}
              {(() => {
                const vPart3 = selectedVariant.questions.filter(q => q.type === 'short_answer');
                if (vPart3.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100">
                      <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                        PHẦN III. Câu trắc nghiệm trả lời ngắn ({vPart3.length} câu - {(vPart3.length * 0.5).toFixed(2)} điểm)
                      </h4>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Thí sinh trả lời từ câu 1 đến câu {vPart3.length}. Điền kết quả vào ô tương ứng trên phiếu trả lời.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {vPart3.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-2">
                          <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
                            <span className="font-bold text-slate-900 shrink-0 font-sans">
                              Câu {idx + 1}:
                            </span>
                            <MathRenderer content={q.content} />
                          </div>
                          <div className="pl-4 text-xs font-serif text-slate-500 italic">
                            [Học sinh điền kết quả vào ô trả lời]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* PHẦN IV TRONG MÃ ĐỀ (Đếm lại từ câu 1) */}
              {(() => {
                const vPart4 = selectedVariant.questions.filter(q => q.type === 'essay');
                if (vPart4.length === 0) return null;
                return (
                  <div className="space-y-4">
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100">
                      <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                        PHẦN IV. Tự luận ({vPart4.length} câu)
                      </h4>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Thí sinh trình bày bài làm tự luận vào giấy thi.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {vPart4.map((q, idx) => (
                        <div key={q.id || idx} className="space-y-2">
                          <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
                            <span className="font-bold text-slate-900 shrink-0 font-sans">
                              Câu {idx + 1} ({q.points || 1.0} điểm):
                            </span>
                            <MathRenderer content={q.content} />
                          </div>
                          <div className="pl-4 text-xs font-serif text-slate-500 italic">
                            [Học sinh trình bày bài làm tự luận vào giấy thi]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

        </div>
      )}

      {/* VIEW 3: MASTER ANSWER KEY COMPARISON TABLE */}
      {viewMode === 'matrix_key' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Bảng Soi & Đối Chiếu Đáp Án ({activeVariants.length} Mã Đề: {codeRangeText})
              </h4>
              <p className="text-xs text-slate-500">
                Bảng chuẩn phục vụ giáo viên chấm nhanh bài làm trắc nghiệm của học sinh (đếm từ Câu 1 theo từng phần)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEqualizeAnswers}
                title="Tự động phân bổ lại đáp án A, B, C, D đều nhau (25% mỗi đáp án)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cân bằng đều A, B, C, D (25%)</span>
              </button>
              <button
                onClick={handleReshuffle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Trộn lại</span>
              </button>
            </div>
          </div>

          {/* BẢNG PHẦN I */}
          {questions.filter(q => q.type === 'multiple_choice').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-indigo-900 uppercase flex items-center gap-1.5">
                  <span>1. Đáp án Phần I: Câu trắc nghiệm nhiều phương án lựa chọn</span>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ✓ Đã phân bổ đều A, B, C, D (~25%/đáp án)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-2.5 border-r border-slate-200 text-left pl-4 min-w-[100px]">Câu số</th>
                      {activeVariants.map((variant, vIdx) => {
                        const code = variant.examCode || (variant as any).code || `Mã ${vIdx + 1}`;
                        return (
                          <th key={code} className="p-2.5 border-r border-slate-200 last:border-r-0 bg-indigo-50/80 text-indigo-900 min-w-[70px]">
                            Mã {code}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {questions.filter(q => q.type === 'multiple_choice').map((_, idx) => {
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-sans font-bold text-slate-600 border-r border-slate-200 text-left pl-4">
                            Câu {idx + 1}
                          </td>
                          {activeVariants.map((variant, vIdx) => {
                            const code = variant.examCode || (variant as any).code;
                            const key = (variant.part1AnswerKeys?.[idx + 1] || variant.answerKey?.[idx + 1] || 'A').toUpperCase();
                            const colorClass = 
                              key === 'A' ? 'text-blue-700 bg-blue-50/70 border-blue-200' :
                              key === 'B' ? 'text-emerald-700 bg-emerald-50/70 border-emerald-200' :
                              key === 'C' ? 'text-amber-700 bg-amber-50/70 border-amber-200' :
                              'text-purple-700 bg-purple-50/70 border-purple-200';

                            return (
                              <td key={code || vIdx} className="p-2 border-r border-slate-200 last:border-r-0">
                                <span className={`inline-block w-6 h-6 leading-6 text-center font-bold rounded border ${colorClass}`}>
                                  {key}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Thống kê phân bổ đáp án Part 1 cho từng mã đề */}
                    <tr className="bg-slate-50 font-sans text-xs border-t-2 border-slate-300 font-medium text-slate-700">
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200 text-left pl-4">
                        <div>Thống kê tỉ lệ</div>
                        <div className="text-[10px] text-slate-400 font-normal">A / B / C / D</div>
                      </td>
                      {activeVariants.map((variant, vIdx) => {
                        const code = variant.examCode || (variant as any).code;
                        const p1Questions = variant.questions.filter(q => q.type === 'multiple_choice');
                        const totalMC = p1Questions.length;
                        const countA = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'A').length;
                        const countB = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'B').length;
                        const countC = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'C').length;
                        const countD = p1Questions.filter(q => (q.correctOption || '').toUpperCase() === 'D').length;

                        return (
                          <td key={code || vIdx} className="p-2.5 border-r border-slate-200 last:border-r-0 bg-slate-50">
                            <div className="flex flex-col items-center justify-center gap-1 text-[11px]">
                              <div className="flex items-center justify-center gap-1 font-semibold">
                                <span className="text-blue-700">A:{countA}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-emerald-700">B:{countB}</span>
                              </div>
                              <div className="flex items-center justify-center gap-1 font-semibold">
                                <span className="text-amber-700">C:{countC}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-purple-700">D:{countD}</span>
                              </div>
                              <div className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.5 rounded">
                                {totalMC > 0 ? `${Math.round((Math.max(countA, countB, countC, countD) / totalMC) * 100)}% max` : 'Đều'}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BẢNG PHẦN II (Đếm lại từ câu 1) */}
          {questions.filter(q => q.type === 'true_false').length > 0 && (
            <div className="space-y-2">
              <div className="font-bold text-xs text-blue-900 uppercase">
                2. Đáp án Phần II: Câu trắc nghiệm đúng sai (Đếm từ Câu 1)
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-2.5 border-r border-slate-200 text-left pl-4 min-w-[90px]">Câu số</th>
                      {activeVariants.map((variant, vIdx) => {
                        const code = variant.examCode || (variant as any).code || `Mã ${vIdx + 1}`;
                        return (
                          <th key={code} className="p-2.5 border-r border-slate-200 last:border-r-0 bg-blue-50 text-blue-900">
                            Mã {code}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {questions.filter(q => q.type === 'true_false').map((_, idx) => {
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-sans font-bold text-slate-600 border-r border-slate-200 text-left pl-4">
                            Câu {idx + 1}
                          </td>
                          {activeVariants.map((variant, vIdx) => {
                            const code = variant.examCode || (variant as any).code;
                            const key = variant.part2AnswerKeys?.[idx + 1] || 'a: Đ | b: S | c: Đ | d: S';
                            return (
                              <td key={code || vIdx} className="p-2 font-medium text-[11px] border-r border-slate-200 last:border-r-0 text-blue-800 bg-blue-50/20">
                                {key}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BẢNG PHẦN III (Đếm lại từ câu 1) */}
          {questions.filter(q => q.type === 'short_answer').length > 0 && (
            <div className="space-y-2">
              <div className="font-bold text-xs text-emerald-900 uppercase">
                3. Đáp án Phần III: Câu trắc nghiệm trả lời ngắn (Đếm từ Câu 1)
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-2.5 border-r border-slate-200 text-left pl-4 min-w-[90px]">Câu số</th>
                      {activeVariants.map((variant, vIdx) => {
                        const code = variant.examCode || (variant as any).code || `Mã ${vIdx + 1}`;
                        return (
                          <th key={code} className="p-2.5 border-r border-slate-200 last:border-r-0 bg-emerald-50 text-emerald-900">
                            Mã {code}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {questions.filter(q => q.type === 'short_answer').map((_, idx) => {
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-sans font-bold text-slate-600 border-r border-slate-200 text-left pl-4">
                            Câu {idx + 1}
                          </td>
                          {activeVariants.map((variant, vIdx) => {
                            const code = variant.examCode || (variant as any).code;
                            const key = variant.part3AnswerKeys?.[idx + 1] || '—';
                            return (
                              <td key={code || vIdx} className="p-2 font-bold border-r border-slate-200 last:border-r-0 text-emerald-800 bg-emerald-50/20">
                                {key}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BẢNG PHẦN IV: HƯỚNG DẪN CHẤM & BIỂU ĐIỂM TỰ LUẬN */}
          {questions.filter(q => q.type === 'essay').length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-xs text-amber-900 uppercase flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>4. Bảng Hướng dẫn chấm & Biểu điểm Phần IV: Tự luận (Chuẩn 3 cột)</span>
                </div>
                <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                  Biểu điểm chi tiết theo từng ý (0,25đ / 0,5đ)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-3 border-r border-slate-200 text-center w-28 bg-slate-200/70">Câu</th>
                      <th className="p-3 border-r border-slate-200 text-left pl-4">Nội dung / Yêu cầu cần đạt (Hướng dẫn chấm chi tiết)</th>
                      <th className="p-3 text-center w-24 bg-amber-50/80 text-amber-900">Điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {questions.filter(q => q.type === 'essay').map((q, qIdx) => {
                      const structured = parseEssayQuestionRubric(q, qIdx);
                      return (
                        <React.Fragment key={q.id || qIdx}>
                          {structured.items.map((item, itemIdx) => (
                            <tr key={itemIdx} className="hover:bg-slate-50/70 transition-colors">
                              {itemIdx === 0 && (
                                <td 
                                  rowSpan={structured.items.length} 
                                  className="p-3 font-sans text-center border-r border-slate-200 bg-slate-50/60 align-middle"
                                >
                                  <div className="font-bold text-slate-900 text-sm">Câu {qIdx + 1}</div>
                                  <div className="text-[11px] text-amber-800 font-semibold mt-0.5">({structured.totalPointsFormatted} điểm)</div>
                                  <div className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                                    {q.cognitiveLevel || 'Vận dụng cao'}
                                  </div>
                                </td>
                              )}
                              <td className="p-3 border-r border-slate-200 text-slate-800 font-serif leading-relaxed">
                                <div className="flex items-start gap-2">
                                  {item.subLabel && (
                                    <span className="font-bold text-slate-900 font-sans shrink-0 text-xs">
                                      {item.subLabel}
                                    </span>
                                  )}
                                  <div className="flex-1">
                                    <MathRenderer content={item.content} />
                                    {itemIdx === structured.items.length - 1 && q.explanation && (
                                      <div className="mt-2 pt-2 border-t border-dashed border-slate-200 text-[11px] text-blue-800 bg-blue-50/50 p-2 rounded-lg font-sans">
                                        <span className="font-semibold text-blue-900">Lời giải chi tiết / Ghi chú: </span>
                                        <MathRenderer content={q.explanation} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center align-middle font-bold text-slate-900 bg-amber-50/30 text-xs font-mono">
                                <span className="inline-block px-2 py-1 bg-white border border-amber-200 text-amber-900 rounded-md shadow-2xs">
                                  {item.pointsFormatted}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50/80 font-sans text-xs border-b-2 border-slate-200 font-medium">
                            <td colSpan={2} className="p-2.5 text-right font-bold text-slate-700 border-r border-slate-200 pr-4">
                              Tổng điểm Câu {qIdx + 1}:
                            </td>
                            <td className="p-2.5 text-center font-bold text-indigo-900 bg-indigo-50/50">
                              {structured.totalPointsFormatted}đ
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW: BẢNG KIỂM TRA ĐÁNH GIÁ CHUẨN KỸ THUẬT BỘ GD&ĐT (CHECKLIST)        */}
      {/* ========================================================================= */}
      {viewMode === 'checklist' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Summary Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Thẩm Định Kỹ Thuật Chương Trình GDPT 2018</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Bảng Kiểm Tra & Đánh Giá Chất Lượng Đề Thi
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ thống tự động đối soát toàn bộ ma trận, bản đặc tả và {questions.length} câu hỏi theo 4 bảng kiểm kỹ thuật của Bộ GD&ĐT (Trắc nghiệm 4 lựa chọn, Đúng/Sai, Trả lời ngắn, Tự luận và tính độc lập toàn đề).
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 min-w-[160px] text-center">
              <span className="text-3xl font-black text-emerald-400">{auditReport.scorePercentage}%</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mt-1">
                {auditReport.overallStatus === 'excellent' ? 'ĐẠT CHUẨN XUẤT SẮC' : 'ĐẠT YÊU CẦU'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {auditReport.passedChecks}/{auditReport.totalChecks} tiêu chí hoàn hảo
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> {auditReport.passedChecks} Đạt chuẩn
              </span>
              {auditReport.warningChecks > 0 && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> {auditReport.warningChecks} Lưu ý khuyến nghị
                </span>
              )}
              {auditReport.failedChecks > 0 && (
                <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <XCircle className="w-3.5 h-3.5" /> {auditReport.failedChecks} Cần sửa
                </span>
              )}
            </div>

            <button
              onClick={async () => {
                setIsExportingReport(true);
                try {
                  await exportComplianceReportToDocx({
                    header,
                    sampleExamQuestions: questions,
                    matrix,
                    specification,
                    shuffledVariants: activeVariants
                  });
                } finally {
                  setIsExportingReport(false);
                }
              }}
              disabled={isExportingReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>{isExportingReport ? 'Đang xuất file...' : 'Tải Bảng Kiểm (DOCX)'}</span>
            </button>
          </div>

          {/* Checklist Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {auditReport.items.map((item, idx) => {
                const isPass = item.status === 'pass';
                const isWarn = item.status === 'warning';
                return (
                  <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      {isPass && (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      {isWarn && (
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      {!isPass && !isWarn && (
                        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {idx + 1}. {item.title}
                        </h4>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isPass 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : isWarn 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPass ? 'Đạt Chuẩn' : isWarn ? 'Khuyến nghị' : 'Chưa Đạt'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 font-sans">
                        <span className="font-semibold text-slate-900">Chi tiết kiểm tra: </span>
                        {item.details}
                      </div>
                      {item.suggestion && (
                        <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900">
                          <span className="font-semibold">💡 Giải pháp khắc phục: </span>
                          {item.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VIEW: BỘ ĐỀ CƯƠNG ÔN TẬP NHÂN 4 CÂU TƯƠNG ĐƯƠNG THEO MA TRẬN & ĐẶC TẢ    */}
      {/* ========================================================================= */}
      {viewMode === 'study_guide' && (
        <div className="animate-in fade-in duration-150">
          <StudyGuideView
            project={{
              id: 'current-project',
              header,
              matrix,
              specification,
              sampleExamQuestions: questions,
              shuffledVariants: activeVariants,
              studyGuide,
              createdAt: '',
              updatedAt: ''
            }}
            onUpdateStudyGuide={onUpdateStudyGuide}
          />
        </div>
      )}

      {/* Custom Shuffle Codes Modal */}
      {isCustomShuffleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Tùy biến Mã Đề Thi</h3>
              </div>
              <button onClick={() => setIsCustomShuffleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhập danh sách mã đề (ngăn cách bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={customCodesInput}
                  onChange={(e) => setCustomCodesInput(e.target.value)}
                  placeholder="Ví dụ: 101, 102, 103, 104, 105"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Nhập bất kỳ số lượng mã đề nào (2, 3, 4, 5, 6, 8,...) hoặc các ký hiệu như 201, 202, A1, A2.
                </p>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <span className="font-bold block">Gợi ý thiết lập nhanh:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setCustomCodesInput('101, 102')}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-md text-[11px] font-mono text-indigo-700"
                  >
                    2 đề: 101, 102
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomCodesInput('101, 102, 103')}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-md text-[11px] font-mono text-indigo-700"
                  >
                    3 đề: 101, 102, 103
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomCodesInput('101, 102, 103, 104')}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-md text-[11px] font-mono text-indigo-700"
                  >
                    4 đề: 101, 102, 103, 104
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomCodesInput('101, 102, 103, 104, 105, 106')}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-md text-[11px] font-mono text-indigo-700"
                  >
                    6 đề: 101..106
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCustomShuffleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyCustomCodes}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Áp dụng & Trộn đề</span>
              </button>
            </div>
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
