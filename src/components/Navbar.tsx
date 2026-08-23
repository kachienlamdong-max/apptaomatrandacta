import React from 'react';
import { 
  GraduationCap, 
  Share2, 
  Heart, 
  MessageSquareHeart, 
  ShieldCheck, 
  BookOpen, 
  UserCircle, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface NavbarProps {
  currentTab: 'config' | 'matrix' | 'exam' | 'export';
  setCurrentTab: (tab: 'config' | 'matrix' | 'exam' | 'export') => void;
  teacher: TeacherProfile | null;
  onOpenTeacherModal: () => void;
  onOpenShareModal: () => void;
  onOpenDonateModal: () => void;
  onOpenFeedbackModal: () => void;
  onOpenAdminModal: () => void;
  onOpenGuideModal: () => void;
  totalTeachersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  teacher,
  onOpenTeacherModal,
  onOpenShareModal,
  onOpenDonateModal,
  onOpenFeedbackModal,
  onOpenAdminModal,
  onOpenGuideModal,
  totalTeachersCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('config')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  EdTech Ma Trận & Đề Thi
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Chuẩn Bộ GD&ĐT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống tạo ma trận, đặc tả & trộn 4 mã đề thi định kỳ
              </p>
            </div>
          </div>

          {/* Navigation Steps */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              id="nav-step-config"
              onClick={() => setCurrentTab('config')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'config'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              1. Cấu hình chung
            </button>
            <button
              id="nav-step-matrix"
              onClick={() => setCurrentTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'matrix'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              2. Ma trận & Đặc tả
            </button>
            <button
              id="nav-step-exam"
              onClick={() => setCurrentTab('exam')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'exam'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              3. Đề thi & Trộn đề
            </button>
            <button
              id="nav-step-export"
              onClick={() => setCurrentTab('export')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'export'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              4. Xuất Word & In
            </button>
          </nav>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Share App button */}
            <button
              id="btn-share-app"
              onClick={onOpenShareModal}
              title="Chia sẻ ứng dụng cho đồng nghiệp qua mã QR / Link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Chia sẻ QR</span>
            </button>

            {/* Donate button - subtle */}
            <button
              id="btn-donate-author"
              onClick={onOpenDonateModal}
              title="Ủng hộ 5.000đ cà phê cho tác giả phát triển"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/60"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="hidden sm:inline">Cảm ơn tác giả</span>
            </button>

            {/* Feedback button */}
            <button
              id="btn-feedback"
              onClick={onOpenFeedbackModal}
              title="Đánh giá 5 sao & Góp ý"
              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <MessageSquareHeart className="w-4 h-4" />
            </button>

            {/* Guide deployment */}
            <button
              id="btn-deploy-guide"
              onClick={onOpenGuideModal}
              title="Hướng dẫn sử dụng & Triển khai miễn phí"
              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Teacher Profile Button */}
            <button
              id="btn-teacher-profile"
              onClick={onOpenTeacherModal}
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-900 rounded-lg border border-indigo-200/50 transition-colors"
            >
              <UserCircle className="w-5 h-5 text-indigo-600" />
              <div className="text-left text-xs">
                <p className="font-semibold leading-tight line-clamp-1 max-w-[120px]">
                  {teacher ? teacher.fullName : 'Thầy/Cô giáo'}
                </p>
                <p className="text-[10px] text-indigo-600/80 leading-tight line-clamp-1">
                  {teacher ? teacher.school : 'Cập nhật thông tin'}
                </p>
              </div>
            </button>

            {/* Secret Admin Button */}
            <button
              id="btn-admin-secret"
              onClick={onOpenAdminModal}
              title="Dashboard Quản trị Thống kê"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100">
          <button
            onClick={() => setCurrentTab('config')}
            className={`px-3 py-1 whitespace-nowrap rounded-md text-xs font-medium ${
              currentTab === 'config' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            1. Cấu hình
          </button>
          <button
            onClick={() => setCurrentTab('matrix')}
            className={`px-3 py-1 whitespace-nowrap rounded-md text-xs font-medium ${
              currentTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            2. Ma trận & Đặc tả
          </button>
          <button
            onClick={() => setCurrentTab('exam')}
            className={`px-3 py-1 whitespace-nowrap rounded-md text-xs font-medium ${
              currentTab === 'exam' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            3. Đề thi & Trộn đề
          </button>
          <button
            onClick={() => setCurrentTab('export')}
            className={`px-3 py-1 whitespace-nowrap rounded-md text-xs font-medium ${
              currentTab === 'export' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            4. Xuất Word
          </button>
        </div>

      </div>
    </header>
  );
};
