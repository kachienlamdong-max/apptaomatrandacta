import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Edit3,
  BookOpen,
  PieChart
} from 'lucide-react';
import { MatrixRow, SpecificationItem, ExamHeaderConfig } from '../../types';
import { SUBJECTS_LIST } from '../../data/curriculumData';

interface MatrixStepProps {
  header: ExamHeaderConfig;
  matrix: MatrixRow[];
  onChangeMatrix: (matrix: MatrixRow[]) => void;
  specification: SpecificationItem[];
  onChangeSpecification: (spec: SpecificationItem[]) => void;
  onGenerateAiSpec: () => Promise<void>;
  onGenerateAiExam: () => Promise<void>;
  onNextStep: () => void;
  isAiGeneratingSpec: boolean;
  isAiGeneratingExam: boolean;
}

export const MatrixStep: React.FC<MatrixStepProps> = ({
  header,
  matrix,
  onChangeMatrix,
  specification,
  onChangeSpecification,
  onGenerateAiSpec,
  onGenerateAiExam,
  onNextStep,
  isAiGeneratingSpec,
  isAiGeneratingExam
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'spec'>('matrix');

  // Matrix Row update handlers
  const handleUpdateRow = (id: string, field: keyof MatrixRow, value: any) => {
    const updated = matrix.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        // Recalculate row points
        const p1Score = (newRow.part1_nb + newRow.part1_th + newRow.part1_vd + newRow.part1_vdc) * 0.25;
        const p2Score = (newRow.part2_nb + newRow.part2_th + newRow.part2_vd + newRow.part2_vdc) * 1.0;
        const p3Score = (newRow.part3_nb + newRow.part3_th + newRow.part3_vd + newRow.part3_vdc) * 0.5;
        const p4Score = (newRow.part4_nb + newRow.part4_th + newRow.part4_vd + newRow.part4_vdc) * 1.0;
        newRow.totalPoints = Number((p1Score + p2Score + p3Score + p4Score).toFixed(2));
        return newRow;
      }
      return row;
    });
    onChangeMatrix(updated);
  };

  const handleAddRow = () => {
    const newRow: MatrixRow = {
      id: 'row-' + Date.now(),
      topic: 'Chủ đề mới',
      unit: 'Đơn vị kiến thức mới',
      part1_nb: 1,
      part1_th: 1,
      part1_vd: 0,
      part1_vdc: 0,
      part2_nb: 0,
      part2_th: 0,
      part2_vd: 0,
      part2_vdc: 0,
      part3_nb: 0,
      part3_th: 0,
      part3_vd: 0,
      part3_vdc: 0,
      part4_nb: 0,
      part4_th: 0,
      part4_vd: 0,
      part4_vdc: 0,
      totalPoints: 0.5,
    };
    onChangeMatrix([...matrix, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    if (matrix.length <= 1) return;
    onChangeMatrix(matrix.filter(r => r.id !== id));
  };

  // Import default syllabus topics for current subject & grade
  const handleImportSyllabusTopics = () => {
    const subj = SUBJECTS_LIST.find(s => s.name === header.subject);
    if (!subj) return;
    const gradeData = subj.standardTopics.find(t => t.grade === header.grade);
    if (!gradeData || gradeData.topics.length === 0) return;

    const newRows: MatrixRow[] = gradeData.topics.map((t, idx) => ({
      id: 'topic-' + idx + '-' + Date.now(),
      topic: t.name,
      unit: t.units.join(', '),
      part1_nb: 1,
      part1_th: 1,
      part1_vd: 0,
      part1_vdc: 0,
      part2_nb: idx === 0 ? 1 : 0,
      part2_th: idx === 1 ? 1 : 0,
      part2_vd: 0,
      part2_vdc: 0,
      part3_nb: 0,
      part3_th: 0,
      part3_vd: 1,
      part3_vdc: 0,
      part4_nb: 0,
      part4_th: 0,
      part4_vd: 0,
      part4_vdc: idx === 0 ? 1 : 0,
      totalPoints: 2.5,
    }));

    onChangeMatrix(newRows);
  };

  // Calculations
  const totalP1_nb = matrix.reduce((sum, r) => sum + r.part1_nb, 0);
  const totalP1_th = matrix.reduce((sum, r) => sum + r.part1_th, 0);
  const totalP1_vd = matrix.reduce((sum, r) => sum + r.part1_vd, 0);
  const totalP1_vdc = matrix.reduce((sum, r) => sum + r.part1_vdc, 0);

  const totalP2_nb = matrix.reduce((sum, r) => sum + r.part2_nb, 0);
  const totalP2_th = matrix.reduce((sum, r) => sum + r.part2_th, 0);
  const totalP2_vd = matrix.reduce((sum, r) => sum + r.part2_vd, 0);
  const totalP2_vdc = matrix.reduce((sum, r) => sum + r.part2_vdc, 0);

  const totalP3_nb = matrix.reduce((sum, r) => sum + r.part3_nb, 0);
  const totalP3_th = matrix.reduce((sum, r) => sum + r.part3_th, 0);
  const totalP3_vd = matrix.reduce((sum, r) => sum + r.part3_vd, 0);
  const totalP3_vdc = matrix.reduce((sum, r) => sum + r.part3_vdc, 0);

  const totalP4_nb = matrix.reduce((sum, r) => sum + r.part4_nb, 0);
  const totalP4_th = matrix.reduce((sum, r) => sum + r.part4_th, 0);
  const totalP4_vd = matrix.reduce((sum, r) => sum + r.part4_vd, 0);
  const totalP4_vdc = matrix.reduce((sum, r) => sum + r.part4_vdc, 0);

  // Total questions per cognitive level
  const grandNb = totalP1_nb + totalP2_nb + totalP3_nb + totalP4_nb;
  const grandTh = totalP1_th + totalP2_th + totalP3_th + totalP4_th;
  const grandVd = totalP1_vd + totalP2_vd + totalP3_vd + totalP4_vd;
  const grandVdc = totalP1_vdc + totalP2_vdc + totalP3_vdc + totalP4_vdc;
  const grandTotalQuestions = grandNb + grandTh + grandVd + grandVdc;

  // Total points calculation
  const totalPointsP1 = (totalP1_nb + totalP1_th + totalP1_vd + totalP1_vdc) * 0.25;
  const totalPointsP2 = (totalP2_nb + totalP2_th + totalP2_vd + totalP2_vdc) * 1.0;
  const totalPointsP3 = (totalP3_nb + totalP3_th + totalP3_vd + totalP3_vdc) * 0.5;
  const totalPointsP4 = (totalP4_nb + totalP4_th + totalP4_vd + totalP4_vdc) * 1.0;
  const grandTotalPoints = Number((totalPointsP1 + totalPointsP2 + totalPointsP3 + totalPointsP4).toFixed(2));

  // Point ratios
  const ratioNb = grandTotalPoints > 0 ? Math.round(((totalP1_nb * 0.25 + totalP2_nb * 1 + totalP3_nb * 0.5 + totalP4_nb * 1) / grandTotalPoints) * 100) : 40;
  const ratioTh = grandTotalPoints > 0 ? Math.round(((totalP1_th * 0.25 + totalP2_th * 1 + totalP3_th * 0.5 + totalP4_th * 1) / grandTotalPoints) * 100) : 30;
  const ratioVd = grandTotalPoints > 0 ? Math.round(((totalP1_vd * 0.25 + totalP2_vd * 1 + totalP3_vd * 0.5 + totalP4_vd * 1) / grandTotalPoints) * 100) : 20;
  const ratioVdc = grandTotalPoints > 0 ? (100 - ratioNb - ratioTh - ratioVd) : 10;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sub-navigation & Quick Actions Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Toggle between Matrix & Spec */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            id="tab-btn-matrix"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Khung Ma Trận Đề Thi
          </button>
          <button
            id="tab-btn-spec"
            onClick={() => setActiveSubTab('spec')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'spec'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📝 Bản Đặc Tả Chuẩn Bộ
          </button>
        </div>

        {/* AI Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            id="btn-import-syllabus"
            onClick={handleImportSyllabusTopics}
            title="Tự động nạp danh mục chủ đề theo khung chương trình GDPT 2018"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Nạp Chủ Đề Chuẩn</span>
          </button>

          <button
            id="btn-ai-generate-spec"
            onClick={onGenerateAiSpec}
            disabled={isAiGeneratingSpec}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiGeneratingSpec ? 'animate-spin' : ''}`} />
            <span>{isAiGeneratingSpec ? 'Đang tạo đặc tả...' : 'AI Soạn Bản Đặc Tả'}</span>
          </button>

          <button
            id="btn-ai-generate-exam"
            onClick={onGenerateAiExam}
            disabled={isAiGeneratingExam}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiGeneratingExam ? 'animate-spin' : ''}`} />
            <span>{isAiGeneratingExam ? 'Đang soạn câu hỏi...' : 'AI Tạo Đề Thi Hoàn Chỉnh'}</span>
          </button>

        </div>

      </div>

      {/* Cognitive Balance Summary Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Tỷ Lệ Mức Độ Nhận Thức (Chuẩn 40 - 30 - 20 - 10)
            </h4>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span>Nhận biết: <strong className="text-blue-400">{ratioNb}%</strong> ({grandNb} câu)</span>
              <span>•</span>
              <span>Thông hiểu: <strong className="text-emerald-400">{ratioTh}%</strong> ({grandTh} câu)</span>
              <span>•</span>
              <span>Vận dụng: <strong className="text-amber-400">{ratioVd}%</strong> ({grandVd} câu)</span>
              <span>•</span>
              <span>Vận dụng cao: <strong className="text-rose-400">{ratioVdc}%</strong> ({grandVdc} câu)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Tổng điểm ma trận</p>
            <p className={`text-xl font-extrabold ${grandTotalPoints === 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {grandTotalPoints.toFixed(2)} / 10.0 đ
            </p>
          </div>
          {grandTotalPoints === 10 ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-400" />
          )}
        </div>

      </div>

      {/* SUB TAB 1: MATRIX TABLE */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Bảng Ma Trận Phân Bổ Câu Hỏi Theo Chuẩn Bộ GD&ĐT
              </span>
              <span className="text-[11px] text-slate-500">
                ({header.subject} - {header.grade} - {header.examTitle})
              </span>
            </div>
            <button
              id="btn-add-matrix-row"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm dòng</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th rowSpan={2} className="p-2.5 text-center border-r border-slate-200 w-12">TT</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-200 min-w-[180px]">Chủ đề / Chương</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-200 min-w-[200px]">Nội dung / Đơn vị kiến thức</th>
                  <th colSpan={4} className="p-2 text-center bg-indigo-50/70 border-r border-slate-200">Phần I (TN 4 lựa chọn - 0.25đ)</th>
                  <th colSpan={4} className="p-2 text-center bg-blue-50/70 border-r border-slate-200">Phần II (Đúng/Sai - 1.0đ)</th>
                  <th colSpan={4} className="p-2 text-center bg-emerald-50/70 border-r border-slate-200">Phần III (Trả lời ngắn - 0.5đ)</th>
                  <th colSpan={4} className="p-2 text-center bg-amber-50/70 border-r border-slate-200">Phần IV (Tự luận)</th>
                  <th rowSpan={2} className="p-2.5 text-center border-r border-slate-200 w-20">Điểm</th>
                  <th rowSpan={2} className="p-2.5 text-center w-12">Xóa</th>
                </tr>
                <tr className="bg-slate-50 text-[11px] text-slate-600 font-semibold border-b border-slate-200">
                  {/* Part 1 */}
                  <th className="p-1 text-center border-r border-slate-200">NB</th>
                  <th className="p-1 text-center border-r border-slate-200">TH</th>
                  <th className="p-1 text-center border-r border-slate-200">VD</th>
                  <th className="p-1 text-center border-r border-slate-200">VDC</th>
                  {/* Part 2 */}
                  <th className="p-1 text-center border-r border-slate-200">NB</th>
                  <th className="p-1 text-center border-r border-slate-200">TH</th>
                  <th className="p-1 text-center border-r border-slate-200">VD</th>
                  <th className="p-1 text-center border-r border-slate-200">VDC</th>
                  {/* Part 3 */}
                  <th className="p-1 text-center border-r border-slate-200">NB</th>
                  <th className="p-1 text-center border-r border-slate-200">TH</th>
                  <th className="p-1 text-center border-r border-slate-200">VD</th>
                  <th className="p-1 text-center border-r border-slate-200">VDC</th>
                  {/* Part 4 */}
                  <th className="p-1 text-center border-r border-slate-200">NB</th>
                  <th className="p-1 text-center border-r border-slate-200">TH</th>
                  <th className="p-1 text-center border-r border-slate-200">VD</th>
                  <th className="p-1 text-center border-r border-slate-200">VDC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {matrix.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2 text-center font-bold text-slate-500 border-r border-slate-200">
                      {idx + 1}
                    </td>
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.topic}
                        onChange={(e) => handleUpdateRow(row.id, 'topic', e.target.value)}
                        className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white border-transparent focus:border-indigo-500 rounded border focus:outline-hidden font-medium"
                      />
                    </td>
                    <td className="p-1 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.unit}
                        onChange={(e) => handleUpdateRow(row.id, 'unit', e.target.value)}
                        className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white border-transparent focus:border-indigo-500 rounded border focus:outline-hidden text-slate-600"
                      />
                    </td>

                    {/* Part 1 inputs */}
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part1_nb} onChange={(e) => handleUpdateRow(row.id, 'part1_nb', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-indigo-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part1_th} onChange={(e) => handleUpdateRow(row.id, 'part1_th', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-indigo-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part1_vd} onChange={(e) => handleUpdateRow(row.id, 'part1_vd', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-indigo-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part1_vdc} onChange={(e) => handleUpdateRow(row.id, 'part1_vdc', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-indigo-900" />
                    </td>

                    {/* Part 2 inputs */}
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part2_nb} onChange={(e) => handleUpdateRow(row.id, 'part2_nb', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-blue-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part2_th} onChange={(e) => handleUpdateRow(row.id, 'part2_th', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-blue-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part2_vd} onChange={(e) => handleUpdateRow(row.id, 'part2_vd', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-blue-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part2_vdc} onChange={(e) => handleUpdateRow(row.id, 'part2_vdc', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-blue-900" />
                    </td>

                    {/* Part 3 inputs */}
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part3_nb} onChange={(e) => handleUpdateRow(row.id, 'part3_nb', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-emerald-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part3_th} onChange={(e) => handleUpdateRow(row.id, 'part3_th', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-emerald-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part3_vd} onChange={(e) => handleUpdateRow(row.id, 'part3_vd', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-emerald-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part3_vdc} onChange={(e) => handleUpdateRow(row.id, 'part3_vdc', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-emerald-900" />
                    </td>

                    {/* Part 4 inputs */}
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part4_nb} onChange={(e) => handleUpdateRow(row.id, 'part4_nb', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-amber-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part4_th} onChange={(e) => handleUpdateRow(row.id, 'part4_th', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-amber-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part4_vd} onChange={(e) => handleUpdateRow(row.id, 'part4_vd', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-amber-900" />
                    </td>
                    <td className="p-0.5 border-r border-slate-200">
                      <input type="number" min={0} value={row.part4_vdc} onChange={(e) => handleUpdateRow(row.id, 'part4_vdc', Number(e.target.value) || 0)} className="w-10 text-center py-1 bg-transparent focus:bg-white border-0 rounded font-semibold text-amber-900" />
                    </td>

                    <td className="p-2 text-center font-bold text-indigo-700 bg-indigo-50/30 border-r border-slate-200">
                      {row.totalPoints || 0} đ
                    </td>

                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        disabled={matrix.length <= 1}
                        className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={3} className="p-3 text-right uppercase tracking-wider border-r border-slate-200">
                    Tổng số câu / Tổng điểm:
                  </td>
                  {/* Part 1 totals */}
                  <td className="p-2 text-center text-indigo-900 border-r border-slate-200">{totalP1_nb}</td>
                  <td className="p-2 text-center text-indigo-900 border-r border-slate-200">{totalP1_th}</td>
                  <td className="p-2 text-center text-indigo-900 border-r border-slate-200">{totalP1_vd}</td>
                  <td className="p-2 text-center text-indigo-900 border-r border-slate-200">{totalP1_vdc}</td>
                  {/* Part 2 totals */}
                  <td className="p-2 text-center text-blue-900 border-r border-slate-200">{totalP2_nb}</td>
                  <td className="p-2 text-center text-blue-900 border-r border-slate-200">{totalP2_th}</td>
                  <td className="p-2 text-center text-blue-900 border-r border-slate-200">{totalP2_vd}</td>
                  <td className="p-2 text-center text-blue-900 border-r border-slate-200">{totalP2_vdc}</td>
                  {/* Part 3 totals */}
                  <td className="p-2 text-center text-emerald-900 border-r border-slate-200">{totalP3_nb}</td>
                  <td className="p-2 text-center text-emerald-900 border-r border-slate-200">{totalP3_th}</td>
                  <td className="p-2 text-center text-emerald-900 border-r border-slate-200">{totalP3_vd}</td>
                  <td className="p-2 text-center text-emerald-900 border-r border-slate-200">{totalP3_vdc}</td>
                  {/* Part 4 totals */}
                  <td className="p-2 text-center text-amber-900 border-r border-slate-200">{totalP4_nb}</td>
                  <td className="p-2 text-center text-amber-900 border-r border-slate-200">{totalP4_th}</td>
                  <td className="p-2 text-center text-amber-900 border-r border-slate-200">{totalP4_vd}</td>
                  <td className="p-2 text-center text-amber-900 border-r border-slate-200">{totalP4_vdc}</td>
                  <td className="p-3 text-center text-sm font-extrabold text-indigo-700 bg-indigo-100/50 border-r border-slate-200">
                    {grandTotalPoints.toFixed(2)} đ
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      )}

      {/* SUB TAB 2: SPECIFICATION TABLE */}
      {activeSubTab === 'spec' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Bản Đặc Tả Ma Trận Đề Kiểm Tra (Yêu Cầu Cần Đạt)
              </h4>
              <p className="text-xs text-slate-500">
                Quy định chi tiết chuẩn kiến thức, kĩ năng và mức độ đánh giá cho từng câu hỏi
              </p>
            </div>
            <button
              onClick={onGenerateAiSpec}
              disabled={isAiGeneratingSpec}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Cập nhật đặc tả</span>
            </button>
          </div>

          <div className="space-y-4">
            {specification.map((item, idx) => (
              <div key={item.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-900">
                    {idx + 1}. {item.topic} — {item.unit}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <p className="font-semibold text-indigo-700 mb-1">Mức 1: Nhận biết (NB)</p>
                    <p className="text-slate-600 leading-relaxed">{item.learningObjectives.nb || 'Nhận biết các khái niệm cơ bản...'}</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <p className="font-semibold text-blue-700 mb-1">Mức 2: Thông hiểu (TH)</p>
                    <p className="text-slate-600 leading-relaxed">{item.learningObjectives.th || 'Giải thích, minh họa và phân tích...'}</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <p className="font-semibold text-emerald-700 mb-1">Mức 3: Vận dụng (VD)</p>
                    <p className="text-slate-600 leading-relaxed">{item.learningObjectives.vd || 'Vận dụng giải quyết các bài toán tình huống...'}</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <p className="font-semibold text-rose-700 mb-1">Mức 4: Vận dụng cao (VDC)</p>
                    <p className="text-slate-600 leading-relaxed">{item.learningObjectives.vdc || 'Tổng hợp, đánh giá và giải bài toán phân hóa...'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Đã hoàn thành thiết lập ma trận. Chuyển sang bước tiếp theo để xem đề thi mẫu & trộn 4 mã đề.
        </p>
        <button
          id="btn-proceed-exam-step"
          onClick={onNextStep}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-indigo-200 transition-colors"
        >
          <span>Xem Đề Thi & Trộn 4 Mã Đề</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
