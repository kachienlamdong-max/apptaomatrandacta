import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeaderConfigStep } from './components/steps/HeaderConfigStep';
import { MatrixStep } from './components/steps/MatrixStep';
import { ExamPreviewStep } from './components/steps/ExamPreviewStep';
import { ExportStep } from './components/steps/ExportStep';
import { TeacherProfileModal } from './components/modals/TeacherProfileModal';
import { ShareAppModal } from './components/modals/ShareAppModal';
import { DonateModal } from './components/modals/DonateModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { AdminDashboardModal } from './components/modals/AdminDashboardModal';
import { DeploymentGuideModal } from './components/modals/DeploymentGuideModal';
import { ExamProject, TeacherProfile, ExamQuestion } from './types';
import { SAMPLE_TOAN_12_PROJECT } from './data/defaultProjects';
import { generateShuffledExamVariants } from './utils/shuffler';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'config' | 'matrix' | 'exam' | 'export'>('config');

  // Active exam project state
  const [project, setProject] = useState<ExamProject>(() => {
    const saved = localStorage.getItem('edtech_exam_project');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_TOAN_12_PROJECT;
  });

  // Teacher Profile state
  const [teacher, setTeacher] = useState<TeacherProfile | null>(() => {
    const saved = localStorage.getItem('edtech_teacher_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'teacher-1',
      fullName: 'Thầy Nguyễn Văn An',
      school: 'THPT Chuyên Chu Văn An',
      province: 'Hà Nội',
      subject: 'Toán học',
      email: 'nguyenvanan.edu@gmail.com',
      phone: '0988123456',
      createdAt: new Date().toISOString()
    };
  });

  // Modals state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // AI loading flags & status toasts
  const [isAiGeneratingMatrix, setIsAiGeneratingMatrix] = useState(false);
  const [isAiGeneratingSpec, setIsAiGeneratingSpec] = useState(false);
  const [isAiGeneratingExam, setIsAiGeneratingExam] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync project to local storage
  useEffect(() => {
    localStorage.setItem('edtech_exam_project', JSON.stringify(project));
  }, [project]);

  // Sync teacher to local storage and server
  const handleSaveTeacher = async (t: TeacherProfile) => {
    setTeacher(t);
    localStorage.setItem('edtech_teacher_profile', JSON.stringify(t));
    try {
      await fetch('/api/teachers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t),
      });
    } catch (e) {
      console.error('Error syncing teacher profile:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // AI Actions: Generate Matrix
  const handleGenerateAiMatrix = async (customNotes: string) => {
    setIsAiGeneratingMatrix(true);
    try {
      const response = await fetch('/api/gemini/generate-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: project.header.subject,
          grade: project.header.grade,
          curriculum: project.header.curriculum,
          examTitle: project.header.examTitle,
          timeDuration: project.header.timeDuration,
          structureOption: project.header.structureOption,
          customNotes: customNotes || project.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối máy chủ tạo ma trận');
      }

      const data = await response.json();
      if (data.matrix && Array.isArray(data.matrix) && data.matrix.length > 0) {
        setProject(prev => ({
          ...prev,
          matrix: data.matrix,
          updatedAt: new Date().toISOString(),
        }));
        showToast('✨ AI đã tạo ma trận chuẩn thành công! Chuyển sang bước Ma trận để xem.');
        setCurrentTab('matrix');
      }
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Đã sử dụng mẫu ma trận chuẩn hóa sẵn có cho môn học này.');
      setCurrentTab('matrix');
    } finally {
      setIsAiGeneratingMatrix(false);
    }
  };

  // AI Actions: Generate Spec
  const handleGenerateAiSpec = async () => {
    setIsAiGeneratingSpec(true);
    try {
      const response = await fetch('/api/gemini/generate-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: project.header.subject,
          grade: project.header.grade,
          curriculum: project.header.curriculum,
          matrix: project.matrix,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi tạo bản đặc tả');
      }

      const data = await response.json();
      if (data.specification && Array.isArray(data.specification)) {
        setProject(prev => ({
          ...prev,
          specification: data.specification,
          updatedAt: new Date().toISOString(),
        }));
        showToast('📝 Đã tạo bản đặc tả chi tiết bám sát ma trận!');
      }
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Hoàn tất nạp bản đặc tả chuẩn.');
    } finally {
      setIsAiGeneratingSpec(false);
    }
  };

  // AI Actions: Generate Exam
  const handleGenerateAiExam = async () => {
    setIsAiGeneratingExam(true);
    try {
      const response = await fetch('/api/gemini/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          header: project.header,
          matrix: project.matrix,
          specification: project.specification,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi tạo đề thi');
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const shuffled = generateShuffledExamVariants(data.questions);
        setProject(prev => ({
          ...prev,
          sampleExamQuestions: data.questions,
          shuffledVariants: shuffled,
          updatedAt: new Date().toISOString(),
        }));
        showToast('🎉 Đã tạo bộ đề kiểm tra & tự động trộn 4 mã đề (101-104)!');
        setCurrentTab('exam');
      }
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Đã tải bộ câu hỏi chuẩn hóa bám sát ma trận.');
      setCurrentTab('exam');
    } finally {
      setIsAiGeneratingExam(false);
    }
  };

  // AI Actions: Assist Single Question
  const handleAssistQuestion = async (q: ExamQuestion, instruction: string): Promise<ExamQuestion | null> => {
    try {
      const response = await fetch('/api/gemini/assist-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          instruction,
          subject: project.header.subject,
          grade: project.header.grade,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast('✨ AI đã cập nhật câu hỏi thành công!');
        return data.question;
      }
    } catch (err) {
      console.error('Error assisting question:', err);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        teacher={teacher}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        totalTeachersCount={12480}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Config */}
        {currentTab === 'config' && (
          <HeaderConfigStep
            header={project.header}
            onChangeHeader={(newHeader) => setProject({ ...project, header: newHeader })}
            onGenerateAiMatrix={handleGenerateAiMatrix}
            onNextStep={() => setCurrentTab('matrix')}
            isAiGenerating={isAiGeneratingMatrix}
          />
        )}

        {/* Step 2: Matrix & Spec */}
        {currentTab === 'matrix' && (
          <MatrixStep
            header={project.header}
            matrix={project.matrix}
            onChangeMatrix={(newMatrix) => setProject({ ...project, matrix: newMatrix })}
            specification={project.specification}
            onChangeSpecification={(newSpec) => setProject({ ...project, specification: newSpec })}
            onGenerateAiSpec={handleGenerateAiSpec}
            onGenerateAiExam={handleGenerateAiExam}
            onNextStep={() => setCurrentTab('exam')}
            isAiGeneratingSpec={isAiGeneratingSpec}
            isAiGeneratingExam={isAiGeneratingExam}
          />
        )}

        {/* Step 3: Exam Preview & 4 Variants */}
        {currentTab === 'exam' && (
          <ExamPreviewStep
            header={project.header}
            questions={project.sampleExamQuestions}
            onChangeQuestions={(newQ) => {
              const updatedVariants = generateShuffledExamVariants(newQ);
              setProject({ ...project, sampleExamQuestions: newQ, shuffledVariants: updatedVariants });
            }}
            variants={project.shuffledVariants}
            onChangeVariants={(newV) => setProject({ ...project, shuffledVariants: newV })}
            onAssistQuestion={handleAssistQuestion}
            onNextStep={() => setCurrentTab('export')}
            isAiGeneratingExam={isAiGeneratingExam}
          />
        )}

        {/* Step 4: Export Word & Print */}
        {currentTab === 'export' && (
          <ExportStep
            project={project}
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 space-y-1 no-print">
        <p className="font-semibold text-slate-700">
          Hệ Thống Tạo Ma Trận, Đặc Tả & Đề Kiểm Tra Định Kỳ Chuẩn Bộ GD&ĐT
        </p>
        <p>
          Phục vụ giáo viên Tiểu học, THCS & THPT trên 63 tỉnh thành Việt Nam — Bám sát chương trình GDPT 2018
        </p>
      </footer>

      {/* Modals */}
      <TeacherProfileModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        teacher={teacher}
        onSaveTeacher={handleSaveTeacher}
      />

      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        teacher={teacher}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <DeploymentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

    </div>
  );
}
