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
  BookOpen
} from 'lucide-react';
import { ExamProject } from '../../types';
import { exportFullExamToDocx } from '../../utils/docxExport';

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
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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
            Hồ sơ đề kiểm tra đã sẵn sàng để tải về
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xuất File Word (.docx) & In Ấn Định Dạng Chuẩn
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            File Word được định dạng đúng phông chữ Times New Roman 13pt, lề trang tiêu chuẩn hành chính giáo dục, kèm đầy đủ Ma trận, Bản đặc tả, Đề gốc, Hướng dẫn chấm chi tiết và 4 mã đề trộn tự động.
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
          <span>{downloading ? 'Đang đóng gói file Word...' : 'Tải Toàn Bộ Hồ Sơ (.docx)'}</span>
        </button>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Option 1: Full Word Document */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              File Word Trọn Gói (Chuẩn Bộ GD&ĐT)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bao gồm toàn bộ Ma trận phân bổ, Bản đặc tả chi tiết, Đề thi gốc, Lời giải từng bước, 4 mã đề trộn (101-104) và Bảng soi đáp án.
            </p>
          </div>

          <button
            onClick={handleExportFullDocx}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Tải file Word .docx</span>
          </button>
        </div>

        {/* Option 2: Direct Print / PDF */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              In Trực Tiếp Hoặc Lưu PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mở hộp thoại in trình duyệt được tối ưu sẵn ngắt trang sạch đẹp, ẩn toàn bộ thanh công cụ để lưu ra file PDF chuẩn in ấn.
            </p>
          </div>

          <button
            id="btn-print-exam"
            onClick={handlePrint}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Mở Trang In / Lưu PDF</span>
          </button>
        </div>

        {/* Option 3: Copy Text for LMS / Forms */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Copy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Sao Chép Văn Bản Thuần
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sao chép toàn bộ nội dung đề thi dạng văn bản thô để dán nhanh vào Google Forms, Microsoft Teams, Azota hoặc OLM.
            </p>
          </div>

          <button
            id="btn-copy-raw-text"
            onClick={handleCopyRawText}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Đã sao chép văn bản!' : 'Sao chép văn bản'}</span>
          </button>
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
