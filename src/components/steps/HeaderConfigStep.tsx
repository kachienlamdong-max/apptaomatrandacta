import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Layers, 
  Clock, 
  BookOpen, 
  School, 
  GraduationCap, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowRight,
  Info
} from 'lucide-react';
import { ExamHeaderConfig, StructureOption, GradeLevel, SchoolLevel } from '../../types';
import { SUBJECTS_LIST, CURRICULUM_SERIES, EXAM_TYPES, PROVINCES_VIETNAM } from '../../data/curriculumData';
import { STRUCTURE_OPTIONS_METADATA, getStructurePartConfigs } from '../../utils/structurePresets';
import { Lock, Check } from 'lucide-react';

interface HeaderConfigStepProps {
  header: ExamHeaderConfig;
  onChangeHeader: (header: ExamHeaderConfig) => void;
  onGenerateAiMatrix: (customNotes: string) => Promise<void>;
  onNextStep: () => void;
  isAiGenerating: boolean;
}

export const HeaderConfigStep: React.FC<HeaderConfigStepProps> = ({
  header,
  onChangeHeader,
  onGenerateAiMatrix,
  onNextStep,
  isAiGenerating
}) => {
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<SchoolLevel>('THPT');
  const [aiCustomNotes, setAiCustomNotes] = useState('');

  // Filter subjects by school level
  const filteredSubjects = SUBJECTS_LIST.filter(s => s.level === selectedSchoolLevel);

  const handleSubjectChange = (subjectName: string) => {
    const found = SUBJECTS_LIST.find(s => s.name === subjectName);
    const isLiterature = subjectName.toLowerCase().includes('văn') || subjectName.toLowerCase().includes('tiếng việt');
    const newStructure: StructureOption = isLiterature ? 'option_tuluan' : (header.structureOption === 'option_tuluan' ? 'option_1' : header.structureOption);
    const newPartConfigs = getStructurePartConfigs(newStructure, undefined, subjectName);

    if (found) {
      const defaultGrade = found.grades[found.grades.length - 1]; // e.g. Lớp 12
      onChangeHeader({
        ...header,
        subject: found.name,
        grade: defaultGrade,
        timeDuration: isLiterature ? '90 phút' : found.defaultDuration,
        structureOption: newStructure,
        partConfigs: newPartConfigs
      });
    } else {
      onChangeHeader({
        ...header,
        subject: subjectName,
        structureOption: newStructure,
        partConfigs: newPartConfigs
      });
    }
  };

  const handleSelectStructure = (structureId: StructureOption) => {
    const newPartConfigs = getStructurePartConfigs(structureId, header.partConfigs, header.subject);
    onChangeHeader({
      ...header,
      structureOption: structureId,
      partConfigs: newPartConfigs
    });
  };

  const handleLevelChange = (level: SchoolLevel) => {
    setSelectedSchoolLevel(level);
    const subjectsForLevel = SUBJECTS_LIST.filter(s => s.level === level);
    if (subjectsForLevel.length > 0) {
      const first = subjectsForLevel[0];
      const isLiterature = first.name.toLowerCase().includes('văn') || first.name.toLowerCase().includes('tiếng việt');
      const newStructure: StructureOption = isLiterature ? 'option_tuluan' : 'option_1';
      const newPartConfigs = getStructurePartConfigs(newStructure, undefined, first.name);

      onChangeHeader({
        ...header,
        subject: first.name,
        grade: first.grades[first.grades.length - 1],
        timeDuration: first.defaultDuration,
        structureOption: newStructure,
        partConfigs: newPartConfigs
      });
    }
  };

  const currentSubjectInfo = SUBJECTS_LIST.find(s => s.name === header.subject);
  const gradeOptions: GradeLevel[] = currentSubjectInfo 
    ? currentSubjectInfo.grades 
    : ['Lớp 10', 'Lớp 11', 'Lớp 12'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome & Subject Level Selector */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Hỗ trợ toàn diện Chương trình GDPT 2018 & Định dạng thi mới của Bộ GD&ĐT
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Thiết Lập Khung Ma Trận & Đề Kiểm Tra Định Kỳ
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Chọn cấp học, môn học, bộ sách và định dạng đề thi để hệ thống tự động thiết kế ma trận, bản đặc tả chuẩn hóa và tạo đề kiểm tra kèm lời giải chi tiết.
          </p>

          {/* Level Switcher */}
          <div className="pt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Cấp học:</span>
            {(['THPT', 'THCS', 'Tiểu học'] as SchoolLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSchoolLevel === lvl
                    ? 'bg-white text-indigo-900 shadow-md shadow-black/20 scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Thông Tin Hành Chính Đề Kiểm Tra
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sở / Phòng GD&ĐT
              </label>
              <input
                id="input-header-dept-gov"
                type="text"
                value={header.provinceOrDept}
                onChange={(e) => onChangeHeader({ ...header, provinceOrDept: e.target.value })}
                placeholder="Ví dụ: SỞ GD&ĐT HÀ NỘI"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trường học / Đơn vị
              </label>
              <input
                id="input-header-school"
                type="text"
                value={header.schoolName}
                onChange={(e) => onChangeHeader({ ...header, schoolName: e.target.value })}
                placeholder="Ví dụ: TRƯỜNG THPT CHU VĂN AN"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổ bộ môn / Chuyên môn
              </label>
              <input
                id="input-header-dept"
                type="text"
                value={header.dept || ''}
                onChange={(e) => onChangeHeader({ ...header, dept: e.target.value })}
                placeholder="Ví dụ: TỔ SỬ - ĐỊA - GDKT&PL"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn học <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-header-subject"
                value={header.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-900"
              >
                {filteredSubjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Khối lớp <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-header-grade"
                value={header.grade}
                onChange={(e) => onChangeHeader({ ...header, grade: e.target.value as GradeLevel })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                {gradeOptions.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bộ sách giáo khoa
              </label>
              <select
                id="select-header-curriculum"
                value={header.curriculum}
                onChange={(e) => onChangeHeader({ ...header, curriculum: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                {CURRICULUM_SERIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kỳ thi / Đợt kiểm tra <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-header-exam-type"
                value={header.examTitle}
                onChange={(e) => onChangeHeader({ ...header, examTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {EXAM_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời gian làm bài
              </label>
              <div className="relative">
                <input
                  id="input-header-time"
                  type="number"
                  min={15}
                  max={180}
                  step={5}
                  value={header.timeDuration}
                  onChange={(e) => onChangeHeader({ ...header, timeDuration: Number(e.target.value) || 45 })}
                  className="w-full pl-3 pr-12 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">phút</span>
              </div>
            </div>
          </div>

          {/* Section 2: Structure Options Selection (Prompt Requirement 2) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Lựa Chọn Cấu Trúc Đề Thi & Định Dạng Ma Trận
              </label>
              <span className="text-[11px] text-slate-500 font-medium italic">
                * Các phần không dùng sẽ tự động khóa trên Ma trận
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STRUCTURE_OPTIONS_METADATA.map(opt => {
                const isSelected = header.structureOption === opt.id;
                const hasLockedParts = opt.lockedPartsDesc.includes('🔒');

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectStructure(opt.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                          <span className="font-bold text-xs text-slate-900 leading-snug">{opt.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {opt.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1.5">
                      <div className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                        <span className="text-indigo-600 font-bold">Phân bổ:</span> {opt.activePartsSummary}
                      </div>
                      {hasLockedParts ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/70">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>{opt.lockedPartsDesc}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Mở đầy đủ 4 phần</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: AI Auto Generator Card */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-b from-indigo-50 to-blue-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Trợ Lý AI Soạn Ma Trận Tự Động</span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Trí tuệ nhân tạo Gemini sẽ tự động phân bổ câu hỏi theo 4 mức độ nhận thức (Nhận biết 40%, Thông hiểu 30%, Vận dụng 20%, Vận dụng cao 10%) bám sát nội dung chương trình GDPT 2018 của Bộ GD&ĐT.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Yêu cầu bổ sung (tùy chọn):
              </label>
              <textarea
                rows={3}
                value={aiCustomNotes}
                onChange={(e) => setAiCustomNotes(e.target.value)}
                placeholder="Ví dụ: Tập trung 60% vào Chương 1 Khảo sát hàm số, 40% vào Chương 2 Toạ độ Oxyz; tăng cường câu hỏi thực tiễn..."
                className="w-full p-2.5 text-xs bg-white border border-indigo-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              id="btn-ai-generate-matrix"
              onClick={() => onGenerateAiMatrix(aiCustomNotes)}
              disabled={isAiGenerating}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition-all hover:scale-[1.01]"
            >
              <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>{isAiGenerating ? 'Đang tạo ma trận chuẩn...' : 'AI Tự Động Tạo Ma Trận'}</span>
            </button>
          </div>

          {/* Quick Step Navigation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Bước tiếp theo:</span>
            </div>
            <p className="text-xs text-slate-500">
              Sau khi chọn cấu hình xong, Thầy/Cô chuyển sang bước <strong>2. Ma trận & Đặc tả</strong> để tinh chỉnh chi tiết từng câu hỏi.
            </p>
            <button
              id="btn-proceed-matrix-step"
              onClick={onNextStep}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors"
            >
              <span>Tiếp tục sang Ma Trận & Đặc Tả</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
