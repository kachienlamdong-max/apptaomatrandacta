import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  Layers, 
  CheckCircle2,
  Table,
  BookOpen,
  FileSpreadsheet,
  Files,
  ShieldCheck,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { ExamProject, StudyGuideData } from '../../types';
import { 
  exportFullExamToDocx, 
  exportAllVariantsOnlyToDocx, 
  exportSingleVariantToDocx,
  exportMatrixAndSpecToDocx,
  exportComplianceReportToDocx,
  exportStudyGuideToDocx
} from '../../utils/docxExport';
import { generateShuffledExamVariants } from '../../utils/shuffler';
import { generateStudyGuideFromMatrixAndSpec } from '../../utils/questionGenerator';

interface ExportStepProps {
  project: ExamProject;
  onOpenDonateModal: () => void;
  onOpenShareModal: () => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  project,
  onOpenDonateModal,
  onOpenShareModal
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadingVariant, setDownloadingVariant] = useState<string | null>(null);
  const [downloadingStudyGuide, setDownloadingStudyGuide] = useState<'full' | 'student' | 'answers' | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const activeVariants = (project.shuffledVariants && project.shuffledVariants.length > 0)
    ? project.shuffledVariants
    : generateShuffledExamVariants(project.sampleExamQuestions, 4, 101);

  const getOrGenerateStudyGuide = (): StudyGuideData => {
    if (project.studyGuide && project.studyGuide.slots.length > 0) {
      return project.studyGuide;
    }
    return generateStudyGuideFromMatrixAndSpec(
      project.header,
      project.matrix,
      project.specification,
      4
    );
  };

  const handleExportStudyGuide = async (mode: 'full' | 'student' | 'answers_only') => {
    setDownloadingStudyGuide(mode === 'answers_only' ? 'answers' : mode);
    try {
      const guide = getOrGenerateStudyGuide();
      await exportStudyGuideToDocx(project, guide, { mode });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting study guide:', err);
    } finally {
      setDownloadingStudyGuide(null);
    }
  };

  const handleExportFullDocx = async () => {
    setDownloading(true);
    try {
      await exportFullExamToDocx(project);
      
      // Notify stats
      await fetch('/api/stats/increment-export', { method: 'POST' }).catch(() => {});

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting DOCX:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportAllVariantsOnly = async () => {
    setDownloading(true);
    try {
      await exportAllVariantsOnlyToDocx(project);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting variants DOCX:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportSingleVariant = async (code: string) => {
    setDownloadingVariant(code);
    try {
      await exportSingleVariantToDocx(project, code);
    } catch (err) {
      console.error('Error exporting single variant:', err);
    } finally {
      setDownloadingVariant(null);
    }
  };

  const handleExportMatrixAndSpec = async () => {
    setDownloading(true);
    try {
      await exportMatrixAndSpecToDocx(project);
    } catch (err) {
      console.error('Error exporting matrix & spec:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportChecklistDocx = async () => {
    setDownloading(true);
    try {
      await exportComplianceReportToDocx(project);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting checklist DOCX:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRawText = () => {
    let fullText = `${project.header.examTitle}\nMÔN: ${project.header.subject} - ${project.header.grade}\nThời gian: ${project.header.timeDuration} phút\n\n`;
    
    project.sampleExamQuestions.forEach((q, idx) => {
      fullText += `Câu ${idx + 1}: ${q.content}\n`;
      if (q.options) {
        q.options.forEach(opt => {
          fullText += `${opt.key}. ${opt.content}\n`;
        });
      }
      if (q.trueFalseItems) {
        q.trueFalseItems.forEach(item => {
          fullText += `${item.key}) ${item.statement}\n`;
        });
      }
      if (q.explanation) {
        fullText += `HDG: ${q.explanation}\n`;
      }
      fullText += `\n`;
    });

    navigator.clipboard.writeText(fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hồ sơ {activeVariants.length} mã đề đã hoàn tất chuẩn Bộ GD&ĐT
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xuất File Word (.docx) Đầy Đủ {activeVariants.length} Mã Đề
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            File Word xuất ra bao gồm đầy đủ <strong>tất cả {activeVariants.length} mã đề thi</strong> ({activeVariants.map(v => v.examCode || (v as any).code).join(', ')}), mỗi mã đề có tiêu đề Sở/Trường/SBD riêng biệt được ngắt trang độc lập để in phát học sinh, kèm Hướng dẫn chấm chi tiết, Bảng soi đối chiếu đáp án, Khung ma trận và Bản đặc tả.
          </p>
        </div>

        {/* Big Export Button */}
        <button
          id="btn-download-full-docx"
          onClick={handleExportFullDocx}
          disabled={downloading}
          className="inline-flex items-center gap-2.5 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Đang đóng gói file Word...' : `Tải Toàn Bộ Hồ Sơ ${activeVariants.length} Mã Đề (.docx)`}</span>
        </button>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Option 1: Full Word Document with All Variants */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
              <Files className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Trọn Bộ Hồ Sơ {activeVariants.length} Mã Đề
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bao gồm đầy đủ {activeVariants.length} mã đề thi đã trộn (mỗi mã đề 1 trang riêng có Quốc hiệu, Sở GD, Trường, SBD), Đáp án chi tiết, Bảng soi đáp án, Ma trận và Đặc tả.
            </p>
          </div>

          <button
            onClick={handleExportFullDocx}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Tải Trọn Bộ (.docx)</span>
          </button>
        </div>

        {/* Option 2: Only Variant Exam Papers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Chỉ {activeVariants.length} Mã Đề Thi (Để In)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tệp Word chỉ chứa các đề thi (không kèm đáp án hay ma trận), mỗi mã đề ngắt trang riêng biệt, định dạng chuẩn để in ấn hoặc photocopy ngay cho học sinh.
            </p>
          </div>

          <button
            onClick={handleExportAllVariantsOnly}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Tải {activeVariants.length} Đề Thi Để In</span>
          </button>
        </div>

        {/* Option 3: Matrix & Spec Only */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Khung Ma Trận & Bản Đặc Tả
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tải riêng tệp Word chứa Khung ma trận kiểm tra và Bản đặc tả chi tiết mức độ đánh giá để nộp Ban Giám Hiệu hoặc Tổ Chuyên Môn lưu trữ hồ sơ.
            </p>
          </div>

          <button
            onClick={handleExportMatrixAndSpec}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Tải Ma Trận & Đặc Tả</span>
          </button>
        </div>

        {/* Option 4: Direct Print / PDF */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              In Trực Tiếp / Lưu PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mở hộp thoại in trình duyệt được tối ưu sẵn ngắt trang sạch đẹp, ẩn toàn bộ thanh công cụ để lưu ra file PDF chuẩn in ấn ngay trên máy tính.
            </p>
          </div>

          <button
            id="btn-print-exam"
            onClick={handlePrint}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Mở Trang In / Lưu PDF</span>
          </button>
        </div>

        {/* Option 5: Study Guide (x4 Question Bank) Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-6 rounded-2xl border border-indigo-700 shadow-md space-y-4 flex flex-col justify-between hover:border-indigo-400 transition-all md:col-span-2 lg:col-span-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Bộ Đề Cương Ôn Tập & Ngân Hàng Câu Hỏi Rèn Luyện (Nhân 4 Câu Theo Ma Trận)</span>
                  <span className="text-[10px] font-bold text-slate-900 bg-amber-300 px-2 py-0.5 rounded-full uppercase">Mới & Đột Phá</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Tải riêng bộ tài liệu đề cương gồm <strong>{getOrGenerateStudyGuide().totalQuestions} câu hỏi tương đương</strong> được nhân bản từ từng vị trí ma trận/đặc tả gốc (bảo toàn 100% dạng thức và mức độ nhận thức). Tùy chọn tải bản đầy đủ kèm lời giải, bản phiếu làm bài học sinh hoặc bảng đáp án.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                id="btn-download-study-guide-full"
                onClick={() => handleExportStudyGuide('full')}
                disabled={downloadingStudyGuide !== null}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-xs transition-all shadow-sm"
              >
                {downloadingStudyGuide === 'full' ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Tải Đề Cương Kèm Lời Giải (.docx)</span>
              </button>

              <button
                id="btn-download-study-guide-student"
                onClick={() => handleExportStudyGuide('student')}
                disabled={downloadingStudyGuide !== null}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl font-semibold text-xs transition-all"
              >
                {downloadingStudyGuide === 'student' ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-indigo-300" />
                )}
                <span>Phiếu Học Sinh (Không Đáp Án)</span>
              </button>

              <button
                id="btn-download-study-guide-answers"
                onClick={() => handleExportStudyGuide('answers_only')}
                disabled={downloadingStudyGuide !== null}
                className="inline-flex items-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded-xl font-medium text-xs transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Bảng Đáp Án</span>
              </button>
            </div>
          </div>
        </div>

        {/* Option 6: Compliance Audit Checklist DOCX */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all md:col-span-2 lg:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Bảng Kiểm Tra & Đánh Giá Chất Lượng Kỹ Thuật Đề Thi (.docx)</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Chuẩn GDPT 2018</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Xuất văn bản Bảng kiểm đánh giá toàn bộ 4 phần của đề thi theo bảng kiểm chuẩn của Bộ Giáo dục và Đào tạo, phân tích chi tiết mức độ Biết, Hiểu, Vận dụng, tính độc lập của các nhận định và các khuyến nghị chuyên môn.
                </p>
              </div>
            </div>

            <button
              id="btn-download-checklist-docx"
              onClick={handleExportChecklistDocx}
              disabled={downloading}
              className="inline-flex items-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm shrink-0"
            >
              <FileCheck className="w-4 h-4" />
              <span>Tải Bảng Kiểm Thẩm Định (.docx)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Individual Variant Download Strip */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Tải Riêng Lẻ Từng Mã Đề Thi (.docx)
            </h3>
            <p className="text-xs text-slate-500">
              Giáo viên có thể tải riêng từng file Word cho từng mã đề để gửi riêng cho từng phòng thi hoặc lớp học
            </p>
          </div>

          <button
            id="btn-copy-raw-text"
            onClick={handleCopyRawText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Đã sao chép văn bản!' : 'Sao chép văn bản thô (LMS/Forms)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-2">
          {activeVariants.map((variant) => {
            const code = variant.examCode || (variant as any).code || '101';
            const isDownloadingThis = downloadingVariant === code;
            return (
              <button
                key={code}
                id={`btn-download-single-${code}`}
                onClick={() => handleExportSingleVariant(code)}
                disabled={isDownloadingThis}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-400 text-slate-800 transition-all hover:scale-105 group"
              >
                <FileText className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-indigo-900">Mã Đề {code}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {isDownloadingThis ? 'Đang tải...' : 'Tải file Word'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Share & Feedback Bottom Banner */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-xs text-slate-900">
            Chia sẻ hệ thống cho đồng nghiệp trong trường
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Cùng lan tỏa công cụ giáo dục miễn phí đến giáo viên trên khắp cả nước
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mã QR Chia Sẻ</span>
          </button>

          <button
            onClick={onOpenDonateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Cảm ơn tác giả (5.000đ)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
