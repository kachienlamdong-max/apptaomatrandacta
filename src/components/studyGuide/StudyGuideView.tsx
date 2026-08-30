import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Download, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Filter, 
  Search, 
  FileSpreadsheet, 
  HelpCircle,
  FileCheck,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  GraduationCap
} from 'lucide-react';
import { ExamProject, StudyGuideData, StudyGuideQuestionSlot, ExamQuestion, CognitiveLevel } from '../../types';
import { MathRenderer } from '../../utils/mathRenderer';
import { generateStudyGuideFromMatrixAndSpec } from '../../utils/questionGenerator';
import { exportStudyGuideToDocx } from '../../utils/docxExport';

interface StudyGuideViewProps {
  project: ExamProject;
  onUpdateStudyGuide?: (studyGuide: StudyGuideData) => void;
}

export const StudyGuideView: React.FC<StudyGuideViewProps> = ({
  project,
  onUpdateStudyGuide
}) => {
  const [multiplier, setMultiplier] = useState<number>(4);
  const [showAllSolutions, setShowAllSolutions] = useState<boolean>(true);
  const [selectedPartFilter, setSelectedPartFilter] = useState<'all' | 'part1' | 'part2' | 'part3' | 'part4'>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | CognitiveLevel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExporting, setIsExporting] = useState<'full' | 'student' | 'answers' | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>({});

  // Generate or retrieve current study guide
  const studyGuide: StudyGuideData = useMemo(() => {
    if (project.studyGuide && project.studyGuide.multiplier === multiplier && project.studyGuide.slots.length > 0) {
      return project.studyGuide;
    }
    return generateStudyGuideFromMatrixAndSpec(
      project.header,
      project.matrix,
      project.specification,
      multiplier
    );
  }, [project.header, project.matrix, project.specification, project.studyGuide, multiplier]);

  // Sync to parent if freshly generated
  React.useEffect(() => {
    if (!project.studyGuide || project.studyGuide.multiplier !== multiplier) {
      if (onUpdateStudyGuide) {
        onUpdateStudyGuide(studyGuide);
      }
    }
  }, [studyGuide, multiplier, project.studyGuide, onUpdateStudyGuide]);

  // Handle regenerating study guide
  const handleRegenerate = (newMultiplier: number = multiplier) => {
    setMultiplier(newMultiplier);
    const freshGuide = generateStudyGuideFromMatrixAndSpec(
      project.header,
      project.matrix,
      project.specification,
      newMultiplier
    );
    if (onUpdateStudyGuide) {
      onUpdateStudyGuide(freshGuide);
    }
  };

  // Handle export docx
  const handleExport = async (mode: 'full' | 'student' | 'answers_only') => {
    setIsExporting(mode === 'answers_only' ? 'answers' : mode);
    try {
      await exportStudyGuideToDocx(project, studyGuide, { mode });
      setExportSuccess(mode);
      setTimeout(() => setExportSuccess(null), 3500);
    } catch (err) {
      console.error('Error exporting study guide:', err);
    } finally {
      setIsExporting(null);
    }
  };

  // Filter slots
  const filteredSlots = useMemo(() => {
    return studyGuide.slots.filter(slot => {
      if (selectedPartFilter !== 'all' && slot.part !== selectedPartFilter) {
        return false;
      }
      if (selectedLevelFilter !== 'all' && slot.cognitiveLevel !== selectedLevelFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTopic = slot.topic.toLowerCase().includes(q);
        const matchUnit = slot.unit.toLowerCase().includes(q);
        const matchObj = (slot.learningObjective || '').toLowerCase().includes(q);
        const matchContent = slot.questions.some(item => item.content.toLowerCase().includes(q));
        if (!matchTopic && !matchUnit && !matchObj && !matchContent) {
          return false;
        }
      }
      return true;
    });
  }, [studyGuide.slots, selectedPartFilter, selectedLevelFilter, searchQuery]);

  // Toggle single slot
  const toggleSlotExpand = (slotId: string) => {
    setExpandedSlots(prev => ({
      ...prev,
      [slotId]: prev[slotId] === undefined ? false : !prev[slotId]
    }));
  };

  const getLevelBadgeClass = (level: CognitiveLevel) => {
    switch (level) {
      case 'Nhận biết': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Thông hiểu': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Vận dụng': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Vận dụng cao': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              TÍNH NĂNG ĐỘT PHÁ: ĐỀ CƯƠNG THEO MA TRẬN & ĐẶC TẢ
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bộ Đề Cương Ôn Tập & Ngân Hàng Câu Hỏi Rèn Luyện
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Tự động nhân <span className="font-semibold text-amber-300">{multiplier} câu hỏi tương đương hoàn toàn khác nhau</span> cho từng vị trí trong ma trận đề thi. Cùng dạng thức, cùng mức độ nhận thức và chuẩn yêu cầu cần đạt, giúp học sinh ôn tập trọng tâm và vững vàng kiến thức.
            </p>
          </div>

          {/* Quick Multiplier Selector */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex flex-col sm:flex-row items-center gap-4">
            <div>
              <span className="block text-xs font-medium text-slate-300">Hệ số nhân câu tương đương:</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                {[2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => handleRegenerate(num)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      multiplier === num
                        ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    ×{num} câu
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRegenerate(multiplier)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tạo lại ngẫu nhiên
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-xs text-slate-400">Vị trí Ma trận gốc</span>
            <p className="text-xl font-bold text-white mt-0.5">{studyGuide.totalSlots} vị trí</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-xs text-slate-400">Tổng số câu rèn luyện</span>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{studyGuide.totalQuestions} câu hỏi</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-xs text-slate-400">Hệ số nhân</span>
            <p className="text-xl font-bold text-white mt-0.5">×{multiplier} câu/vị trí</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-xs text-slate-400">Môn học & Lớp</span>
            <p className="text-sm font-bold text-indigo-200 mt-1 truncate">{project.header.subject} - {project.header.grade}</p>
          </div>
        </div>
      </div>

      {/* Export Toolbar Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tải bộ đề cương về máy (Word .docx)</h3>
            <p className="text-xs text-slate-500">Được định dạng chuẩn Times New Roman, phân chia phần rõ ràng và sẵn sàng in ấn</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => handleExport('full')}
            disabled={isExporting !== null}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow"
          >
            {isExporting === 'full' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : exportSuccess === 'full' ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <FileCheck className="w-4 h-4" />
            )}
            <span>Tải Đề Cương Đầy Đủ (Kèm Lời Giải)</span>
          </button>

          <button
            onClick={() => handleExport('student')}
            disabled={isExporting !== null}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow"
          >
            {isExporting === 'student' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : exportSuccess === 'student' ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <GraduationCap className="w-4 h-4" />
            )}
            <span>Tải Phiếu Học Sinh (Không Đáp Án)</span>
          </button>

          <button
            onClick={() => handleExport('answers_only')}
            disabled={isExporting !== null}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-300/80 transition-all"
          >
            {isExporting === 'answers' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            )}
            <span>Bảng Đáp Án Riêng</span>
          </button>
        </div>
      </div>

      {/* Filter and View Options */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Part Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedPartFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPartFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Tất cả các phần ({studyGuide.slots.length} vị trí)
            </button>
            <button
              onClick={() => setSelectedPartFilter('part1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPartFilter === 'part1'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Phần I (TN 4 lựa chọn)
            </button>
            <button
              onClick={() => setSelectedPartFilter('part2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPartFilter === 'part2'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Phần II (Đúng/Sai)
            </button>
            <button
              onClick={() => setSelectedPartFilter('part3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPartFilter === 'part3'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Phần III (Trả lời ngắn)
            </button>
            <button
              onClick={() => setSelectedPartFilter('part4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPartFilter === 'part4'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Phần IV (Tự luận)
            </button>
          </div>

          {/* Toggle show answers button */}
          <button
            onClick={() => setShowAllSolutions(!showAllSolutions)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            {showAllSolutions ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
            <span>{showAllSolutions ? 'Ẩn Lời giải chi tiết' : 'Hiện Lời giải chi tiết'}</span>
          </button>
        </div>

        {/* Cognitive level & search filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1">Mức độ:</span>
            {(['all', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedLevelFilter === lvl
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Tất cả mức' : lvl}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm chủ đề, bài học..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-6">
        {filteredSlots.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Không tìm thấy vị trí ma trận phù hợp</h4>
            <p className="text-xs text-slate-500 mt-1">Vui lòng thử bỏ bớt điều kiện lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          filteredSlots.map((slot) => {
            const isCollapsed = expandedSlots[slot.slotId] === false;

            return (
              <div 
                key={slot.slotId}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Slot Header Bar */}
                <div 
                  onClick={() => toggleSlotExpand(slot.slotId)}
                  className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-xs">
                      Vị trí Ma trận #{slot.slotNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {slot.partName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getLevelBadgeClass(slot.cognitiveLevel)}`}>
                      {slot.cognitiveLevel}
                    </span>
                    <span className="text-xs text-slate-600">
                      • Chủ đề: <strong className="text-slate-800">{slot.topic}</strong> - {slot.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                      {slot.questions.length} câu tương đương
                    </span>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Learning Objective Callout */}
                {slot.learningObjective && !isCollapsed && (
                  <div className="px-5 py-2.5 bg-indigo-50/40 border-b border-indigo-100/60 text-xs text-indigo-900 flex items-start gap-2">
                    <span className="font-bold shrink-0 text-indigo-700">Yêu cầu cần đạt:</span>
                    <span className="italic text-slate-700">{slot.learningObjective}</span>
                  </div>
                )}

                {/* Questions Grid / List */}
                {!isCollapsed && (
                  <div className="p-5 divide-y divide-slate-100 space-y-6">
                    {slot.questions.map((q, qIdx) => {
                      const qLabel = `Câu ${slot.slotNumber}.${qIdx + 1}`;

                      return (
                        <div key={q.id || qIdx} className={qIdx > 0 ? 'pt-6' : ''}>
                          {/* Question Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold tracking-wide">
                                {qLabel}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                (Phiên bản rèn luyện #{qIdx + 1})
                              </span>
                            </div>
                            {q.correctOption && showAllSolutions && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Đáp án: {q.correctOption}
                              </span>
                            )}
                          </div>

                          {/* Question Stem Content */}
                          <div className="text-sm font-medium text-slate-900 leading-relaxed pl-1">
                            <MathRenderer text={q.content} />
                          </div>

                          {/* Options for MCQ */}
                          {q.type === 'multiple_choice' && q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pl-1">
                              {q.options.map((opt) => {
                                const isCorrect = q.correctOption === opt.key;
                                return (
                                  <div
                                    key={opt.key}
                                    className={`p-2.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2 ${
                                      showAllSolutions && isCorrect
                                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium shadow-xs ring-1 ring-emerald-400/50'
                                        : 'bg-slate-50/70 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                                      showAllSolutions && isCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {opt.key}
                                    </span>
                                    <div className="flex-1 pt-0.5">
                                      <MathRenderer text={opt.content} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* True/False Statements */}
                          {q.type === 'true_false' && q.trueFalseItems && (
                            <div className="space-y-2 mt-3 pl-1">
                              {q.trueFalseItems.map((item) => (
                                <div 
                                  key={item.key}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                                    showAllSolutions
                                      ? item.isCorrect 
                                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-900' 
                                        : 'bg-rose-50/60 border-rose-200 text-slate-900'
                                      : 'bg-slate-50/70 border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-start gap-2 flex-1">
                                    <span className="font-bold text-slate-900 shrink-0">{item.key})</span>
                                    <div><MathRenderer text={item.statement} /></div>
                                  </div>
                                  {showAllSolutions && (
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                                      item.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                    }`}>
                                      {item.isCorrect ? 'ĐÚNG' : 'SAI'}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Short Answer Key */}
                          {q.type === 'short_answer' && showAllSolutions && (
                            <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs flex items-center gap-2">
                              <span className="font-bold text-amber-900">Đáp số chuẩn:</span>
                              <span className="px-2 py-0.5 bg-white font-mono font-bold text-amber-950 rounded border border-amber-300">
                                {q.shortAnswerKey || 'N/A'}
                              </span>
                            </div>
                          )}

                          {/* Solution & Explanation */}
                          {showAllSolutions && q.explanation && (
                            <div className="mt-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs space-y-1">
                              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>Lời giải chi tiết & Phương pháp:</span>
                              </div>
                              <div className="text-slate-700 leading-relaxed pl-5">
                                <MathRenderer text={q.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
