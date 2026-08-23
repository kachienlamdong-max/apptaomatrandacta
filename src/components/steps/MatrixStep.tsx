import React, { useState } from 'react';
import { 
  Plus, 
  Minus,
  Trash2, 
  Sparkles, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowDown,
  ArrowUp,
  Edit3,
  BookOpen,
  PieChart,
  Lock,
  Unlock,
  RefreshCw,
  Table as TableIcon,
  LayoutGrid,
  Sliders,
  ChevronDown,
  ChevronUp,
  Settings2,
  Check
} from 'lucide-react';
import { MatrixRow, SpecificationItem, ExamHeaderConfig, ExamPartConfigs, PartConfig } from '../../types';
import { SUBJECTS_LIST } from '../../data/curriculumData';
import { DEFAULT_PART_CONFIGS } from '../../data/defaultProjects';

interface MatrixStepProps {
  header: ExamHeaderConfig;
  onChangeHeader?: (header: ExamHeaderConfig) => void;
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
  onChangeHeader,
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
  const [activeSubTab, setActiveSubTab] = useState<'both' | 'matrix' | 'spec'>('both');
  const [specViewMode, setSpecViewMode] = useState<'table' | 'cards'>('table');
  const [specSyncNotification, setSpecSyncNotification] = useState<string | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);

  // Active Part configurations with fallback to defaults
  const partConfigs: ExamPartConfigs = header.partConfigs || DEFAULT_PART_CONFIGS;

  const p1_pts = partConfigs.part1?.pointsPerQuestion ?? 0.25;
  const p2_pts = partConfigs.part2?.pointsPerQuestion ?? 1.0;
  const p3_pts = partConfigs.part3?.pointsPerQuestion ?? 0.5;
  const p4_pts = partConfigs.part4?.pointsPerQuestion ?? 1.0;

  const p1_target = partConfigs.part1?.targetQuestions ?? 12;
  const p2_target = partConfigs.part2?.targetQuestions ?? 4;
  const p3_target = partConfigs.part3?.targetQuestions ?? 6;
  const p4_target = partConfigs.part4?.targetQuestions ?? 2;

  // Handler to update part configs (points per question, target questions, name, enable)
  const handleUpdatePartConfig = (partKey: keyof ExamPartConfigs, field: keyof PartConfig, value: any) => {
    let parsedValue = value;
    if (field === 'pointsPerQuestion' || field === 'targetQuestions') {
      if (typeof value === 'string') {
        const normalized = value.replace(',', '.').trim();
        parsedValue = normalized === '' ? 0 : Math.max(0, parseFloat(normalized) || 0);
      } else {
        parsedValue = Math.max(0, Number(value) || 0);
      }
    }

    const newConfigs: ExamPartConfigs = {
      ...partConfigs,
      [partKey]: {
        ...partConfigs[partKey],
        [field]: parsedValue
      }
    };

    if (onChangeHeader) {
      onChangeHeader({
        ...header,
        partConfigs: newConfigs
      });
    }

    // If point per question changes, recalculate row points for all rows
    if (field === 'pointsPerQuestion') {
      const curP1Pts = partKey === 'part1' ? Number(parsedValue) : (newConfigs.part1?.pointsPerQuestion ?? 0.25);
      const curP2Pts = partKey === 'part2' ? Number(parsedValue) : (newConfigs.part2?.pointsPerQuestion ?? 1.0);
      const curP3Pts = partKey === 'part3' ? Number(parsedValue) : (newConfigs.part3?.pointsPerQuestion ?? 0.5);
      const curP4Pts = partKey === 'part4' ? Number(parsedValue) : (newConfigs.part4?.pointsPerQuestion ?? 1.0);

      const updated = matrix.map(row => {
        const p1Score = (row.part1_nb + row.part1_th + row.part1_vd + row.part1_vdc) * curP1Pts;
        const p2Score = (row.part2_nb + row.part2_th + row.part2_vd + row.part2_vdc) * curP2Pts;
        const p3Score = (row.part3_nb + row.part3_th + row.part3_vd + row.part3_vdc) * curP3Pts;
        const p4Score = (row.part4_nb + row.part4_th + row.part4_vd + row.part4_vdc) * curP4Pts;
        return {
          ...row,
          totalPoints: Number((p1Score + p2Score + p3Score + p4Score).toFixed(2))
        };
      });
      onChangeMatrix(updated);
    }
  };

  // Quick adjust point per question with +/- step
  const handleAdjustPoints = (partKey: keyof ExamPartConfigs, delta: number) => {
    const current = partConfigs[partKey]?.pointsPerQuestion ?? (partKey === 'part1' ? 0.25 : partKey === 'part2' ? 1.0 : partKey === 'part3' ? 0.5 : 1.0);
    const newVal = Math.max(0, Number((current + delta).toFixed(2)));
    handleUpdatePartConfig(partKey, 'pointsPerQuestion', newVal);
  };

  // Quick adjust target question count with +/- step
  const handleAdjustQuestions = (partKey: keyof ExamPartConfigs, delta: number) => {
    const current = partConfigs[partKey]?.targetQuestions ?? (partKey === 'part1' ? 12 : partKey === 'part2' ? 4 : partKey === 'part3' ? 6 : 2);
    const newVal = Math.max(0, current + delta);
    handleUpdatePartConfig(partKey, 'targetQuestions', newVal);
  };

  // Preset structure loader
  const handleApplyPreset = (presetKey: 'bo_2025' | 'tn_tuluan_70_30' | 'ket_hop_4_phan' | 'tn_100') => {
    let newConfigs: ExamPartConfigs;
    if (presetKey === 'bo_2025') {
      newConfigs = {
        part1: { name: 'Phần I: TN 4 lựa chọn', pointsPerQuestion: 0.25, targetQuestions: 12, enabled: true, description: '12 câu TN 4 lựa chọn (3.0đ)' },
        part2: { name: 'Phần II: TN Đúng/Sai', pointsPerQuestion: 1.0, targetQuestions: 4, enabled: true, description: '4 câu Đúng/Sai (4.0đ)' },
        part3: { name: 'Phần III: Trả lời ngắn', pointsPerQuestion: 0.5, targetQuestions: 6, enabled: true, description: '6 câu Trả lời ngắn (3.0đ)' },
        part4: { name: 'Phần IV: Tự luận', pointsPerQuestion: 1.0, targetQuestions: 0, enabled: false, description: 'Không có tự luận' },
      };
    } else if (presetKey === 'tn_tuluan_70_30') {
      newConfigs = {
        part1: { name: 'Phần I: TN 4 lựa chọn', pointsPerQuestion: 0.25, targetQuestions: 28, enabled: true, description: '28 câu TN (7.0đ)' },
        part2: { name: 'Phần II: TN Đúng/Sai', pointsPerQuestion: 1.0, targetQuestions: 0, enabled: false, description: 'Tắt' },
        part3: { name: 'Phần III: Trả lời ngắn', pointsPerQuestion: 0.5, targetQuestions: 0, enabled: false, description: 'Tắt' },
        part4: { name: 'Phần IV: Tự luận', pointsPerQuestion: 1.0, targetQuestions: 3, enabled: true, description: '3 câu tự luận (3.0đ)' },
      };
    } else if (presetKey === 'ket_hop_4_phan') {
      newConfigs = {
        part1: { name: 'Phần I: TN 4 lựa chọn', pointsPerQuestion: 0.25, targetQuestions: 16, enabled: true, description: '16 câu TN (4.0đ)' },
        part2: { name: 'Phần II: TN Đúng/Sai', pointsPerQuestion: 1.0, targetQuestions: 2, enabled: true, description: '2 câu Đúng/Sai (2.0đ)' },
        part3: { name: 'Phần III: Trả lời ngắn', pointsPerQuestion: 0.5, targetQuestions: 4, enabled: true, description: '4 câu Trả lời ngắn (2.0đ)' },
        part4: { name: 'Phần IV: Tự luận', pointsPerQuestion: 1.0, targetQuestions: 2, enabled: true, description: '2 câu tự luận (2.0đ)' },
      };
    } else {
      newConfigs = {
        part1: { name: 'Phần I: TN 4 lựa chọn', pointsPerQuestion: 0.25, targetQuestions: 40, enabled: true, description: '40 câu TN 4 lựa chọn (10.0đ)' },
        part2: { name: 'Phần II: TN Đúng/Sai', pointsPerQuestion: 1.0, targetQuestions: 0, enabled: false, description: 'Tắt' },
        part3: { name: 'Phần III: Trả lời ngắn', pointsPerQuestion: 0.5, targetQuestions: 0, enabled: false, description: 'Tắt' },
        part4: { name: 'Phần IV: Tự luận', pointsPerQuestion: 1.0, targetQuestions: 0, enabled: false, description: 'Tắt' },
      };
    }

    if (onChangeHeader) {
      onChangeHeader({
        ...header,
        partConfigs: newConfigs
      });
    }

    // Recalculate row points
    const updated = matrix.map(row => {
      const p1Score = (row.part1_nb + row.part1_th + row.part1_vd + row.part1_vdc) * newConfigs.part1.pointsPerQuestion;
      const p2Score = (row.part2_nb + row.part2_th + row.part2_vd + row.part2_vdc) * newConfigs.part2.pointsPerQuestion;
      const p3Score = (row.part3_nb + row.part3_th + row.part3_vd + row.part3_vdc) * newConfigs.part3.pointsPerQuestion;
      const p4Score = (row.part4_nb + row.part4_th + row.part4_vd + row.part4_vdc) * newConfigs.part4.pointsPerQuestion;
      return {
        ...row,
        totalPoints: Number((p1Score + p2Score + p3Score + p4Score).toFixed(2))
      };
    });
    onChangeMatrix(updated);
    setSpecSyncNotification('✨ Đã áp dụng mẫu thang điểm & số câu mục tiêu thành công!');
    setTimeout(() => setSpecSyncNotification(null), 3500);
  };

  // Matrix Row update handlers
  const handleUpdateRow = (id: string, field: keyof MatrixRow, value: any) => {
    const updated = matrix.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        // Recalculate row points using configurable points per question
        const p1Score = (newRow.part1_nb + newRow.part1_th + newRow.part1_vd + newRow.part1_vdc) * p1_pts;
        const p2Score = (newRow.part2_nb + newRow.part2_th + newRow.part2_vd + newRow.part2_vdc) * p2_pts;
        const p3Score = (newRow.part3_nb + newRow.part3_th + newRow.part3_vd + newRow.part3_vdc) * p3_pts;
        const p4Score = (newRow.part4_nb + newRow.part4_th + newRow.part4_vd + newRow.part4_vdc) * p4_pts;
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

  // Feature: Generate Specification Table Directly From Matrix
  const handleGenerateSpecFromMatrix = () => {
    const newSpecs: SpecificationItem[] = matrix.map((row, idx) => {
      // Find if we already have spec for this topic/unit to preserve custom edits
      const existing = specification.find(s => s.topic === row.topic && s.unit === row.unit) || specification[idx];
      
      const totalNb = row.part1_nb + row.part2_nb + row.part3_nb + row.part4_nb;
      const totalTh = row.part1_th + row.part2_th + row.part3_th + row.part4_th;
      const totalVd = row.part1_vd + row.part2_vd + row.part3_vd + row.part4_vd;
      const totalVdc = row.part1_vdc + row.part2_vdc + row.part3_vdc + row.part4_vdc;

      return {
        id: existing?.id || `spec-${row.id || idx}`,
        topic: row.topic,
        unit: row.unit,
        learningObjectives: {
          nb: totalNb > 0 
            ? (existing?.learningObjectives?.nb || `Nhận biết và nêu được các khái niệm, định nghĩa, tính chất cơ bản của ${row.unit || row.topic}.`)
            : '',
          th: totalTh > 0 
            ? (existing?.learningObjectives?.th || `Hiểu, giải thích, phân tích và thực hiện được các quy tắc, mối liên hệ về ${row.unit || row.topic}.`)
            : '',
          vd: totalVd > 0 
            ? (existing?.learningObjectives?.vd || `Vận dụng các kiến thức, kĩ năng về ${row.unit || row.topic} để giải quyết bài tập và tình huống thực tiễn đơn giản.`)
            : '',
          vdc: totalVdc > 0 
            ? (existing?.learningObjectives?.vdc || `Vận dụng kiến thức nâng cao về ${row.unit || row.topic}, liên môn hoặc mô hình hóa để giải quyết bài toán phức hợp.`)
            : '',
        },
        questionCount: {
          part1: { nb: row.part1_nb, th: row.part1_th, vd: row.part1_vd, vdc: row.part1_vdc },
          part2: { nb: row.part2_nb, th: row.part2_th, vd: row.part2_vd, vdc: row.part2_vdc },
          part3: { nb: row.part3_nb, th: row.part3_th, vd: row.part3_vd, vdc: row.part3_vdc },
          part4: { nb: row.part4_nb, th: row.part4_th, vd: row.part4_vd, vdc: row.part4_vdc },
        }
      };
    });

    onChangeSpecification(newSpecs);
    setSpecSyncNotification('✨ Đã tạo & đồng bộ Bảng đặc tả khớp 100% từng ô Ma trận!');
    if (activeSubTab === 'matrix') {
      setActiveSubTab('both');
    }
    setTimeout(() => {
      document.getElementById('section-spec')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setTimeout(() => setSpecSyncNotification(null), 4000);
  };

  // Update a single learning objective in the specification
  const handleUpdateSpecObjective = (index: number, level: 'nb' | 'th' | 'vd' | 'vdc', text: string) => {
    const row = matrix[index];
    if (!row) return;

    let updated = [...specification];
    // If specification length does not match matrix, populate missing items
    while (updated.length < matrix.length) {
      const mRow = matrix[updated.length];
      updated.push({
        id: `spec-${mRow.id || updated.length}`,
        topic: mRow.topic,
        unit: mRow.unit,
        learningObjectives: { nb: '', th: '', vd: '', vdc: '' },
        questionCount: {
          part1: { nb: mRow.part1_nb, th: mRow.part1_th, vd: mRow.part1_vd, vdc: mRow.part1_vdc },
          part2: { nb: mRow.part2_nb, th: mRow.part2_th, vd: mRow.part2_vd, vdc: mRow.part2_vdc },
          part3: { nb: mRow.part3_nb, th: mRow.part3_th, vd: mRow.part3_vd, vdc: mRow.part3_vdc },
          part4: { nb: mRow.part4_nb, th: mRow.part4_th, vd: mRow.part4_vd, vdc: mRow.part4_vdc },
        }
      });
    }

    const cur = updated[index] || {
      id: `spec-${row.id || index}`,
      topic: row.topic,
      unit: row.unit,
      learningObjectives: { nb: '', th: '', vd: '', vdc: '' },
      questionCount: {
        part1: { nb: row.part1_nb, th: row.part1_th, vd: row.part1_vd, vdc: row.part1_vdc },
        part2: { nb: row.part2_nb, th: row.part2_th, vd: row.part2_vd, vdc: row.part2_vdc },
        part3: { nb: row.part3_nb, th: row.part3_th, vd: row.part3_vd, vdc: row.part3_vdc },
        part4: { nb: row.part4_nb, th: row.part4_th, vd: row.part4_vd, vdc: row.part4_vdc },
      }
    };

    updated[index] = {
      ...cur,
      topic: row.topic,
      unit: row.unit,
      learningObjectives: {
        ...cur.learningObjectives,
        [level]: text
      },
      questionCount: {
        part1: { nb: row.part1_nb, th: row.part1_th, vd: row.part1_vd, vdc: row.part1_vdc },
        part2: { nb: row.part2_nb, th: row.part2_th, vd: row.part2_vd, vdc: row.part2_vdc },
        part3: { nb: row.part3_nb, th: row.part3_th, vd: row.part3_vd, vdc: row.part3_vdc },
        part4: { nb: row.part4_nb, th: row.part4_th, vd: row.part4_vd, vdc: row.part4_vdc },
      }
    };
    onChangeSpecification(updated);
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

  // Calculations for Part 1, 2, 3, 4
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

  // Total questions per part in matrix
  const totalP1 = totalP1_nb + totalP1_th + totalP1_vd + totalP1_vdc;
  const totalP2 = totalP2_nb + totalP2_th + totalP2_vd + totalP2_vdc;
  const totalP3 = totalP3_nb + totalP3_th + totalP3_vd + totalP3_vdc;
  const totalP4 = totalP4_nb + totalP4_th + totalP4_vd + totalP4_vdc;

  // Total questions per cognitive level
  const grandNb = totalP1_nb + totalP2_nb + totalP3_nb + totalP4_nb;
  const grandTh = totalP1_th + totalP2_th + totalP3_th + totalP4_th;
  const grandVd = totalP1_vd + totalP2_vd + totalP3_vd + totalP4_vd;
  const grandVdc = totalP1_vdc + totalP2_vdc + totalP3_vdc + totalP4_vdc;
  const grandTotalQuestions = grandNb + grandTh + grandVd + grandVdc;

  // Target totals
  const grandTargetQuestions = (partConfigs.part1?.enabled ? p1_target : 0) +
    (partConfigs.part2?.enabled ? p2_target : 0) +
    (partConfigs.part3?.enabled ? p3_target : 0) +
    (partConfigs.part4?.enabled ? p4_target : 0);

  // Points per column calculation using configurable p1_pts, p2_pts, p3_pts, p4_pts
  const ptsP1_nb = totalP1_nb * p1_pts;
  const ptsP1_th = totalP1_th * p1_pts;
  const ptsP1_vd = totalP1_vd * p1_pts;
  const ptsP1_vdc = totalP1_vdc * p1_pts;

  const ptsP2_nb = totalP2_nb * p2_pts;
  const ptsP2_th = totalP2_th * p2_pts;
  const ptsP2_vd = totalP2_vd * p2_pts;
  const ptsP2_vdc = totalP2_vdc * p2_pts;

  const ptsP3_nb = totalP3_nb * p3_pts;
  const ptsP3_th = totalP3_th * p3_pts;
  const ptsP3_vd = totalP3_vd * p3_pts;
  const ptsP3_vdc = totalP3_vdc * p3_pts;

  const ptsP4_nb = totalP4_nb * p4_pts;
  const ptsP4_th = totalP4_th * p4_pts;
  const ptsP4_vd = totalP4_vd * p4_pts;
  const ptsP4_vdc = totalP4_vdc * p4_pts;

  const totalPointsP1 = ptsP1_nb + ptsP1_th + ptsP1_vd + ptsP1_vdc;
  const totalPointsP2 = ptsP2_nb + ptsP2_th + ptsP2_vd + ptsP2_vdc;
  const totalPointsP3 = ptsP3_nb + ptsP3_th + ptsP3_vd + ptsP3_vdc;
  const totalPointsP4 = ptsP4_nb + ptsP4_th + ptsP4_vd + ptsP4_vdc;
  const grandTotalPoints = Number((totalPointsP1 + totalPointsP2 + totalPointsP3 + totalPointsP4).toFixed(2));

  const targetPointsP1 = p1_target * p1_pts;
  const targetPointsP2 = p2_target * p2_pts;
  const targetPointsP3 = p3_target * p3_pts;
  const targetPointsP4 = p4_target * p4_pts;
  const grandTargetPoints = Number((
    (partConfigs.part1?.enabled ? targetPointsP1 : 0) +
    (partConfigs.part2?.enabled ? targetPointsP2 : 0) +
    (partConfigs.part3?.enabled ? targetPointsP3 : 0) +
    (partConfigs.part4?.enabled ? targetPointsP4 : 0)
  ).toFixed(2));

  // Point ratios for 4 cognitive levels
  const ptsTotalNb = ptsP1_nb + ptsP2_nb + ptsP3_nb + ptsP4_nb;
  const ptsTotalTh = ptsP1_th + ptsP2_th + ptsP3_th + ptsP4_th;
  const ptsTotalVd = ptsP1_vd + ptsP2_vd + ptsP3_vd + ptsP4_vd;
  const ptsTotalVdc = ptsP1_vdc + ptsP2_vdc + ptsP3_vdc + ptsP4_vdc;

  const ratioNb = grandTotalPoints > 0 ? Math.round((ptsTotalNb / grandTotalPoints) * 100) : 40;
  const ratioTh = grandTotalPoints > 0 ? Math.round((ptsTotalTh / grandTotalPoints) * 100) : 30;
  const ratioVd = grandTotalPoints > 0 ? Math.round((ptsTotalVd / grandTotalPoints) * 100) : 20;
  const ratioVdc = grandTotalPoints > 0 ? (100 - ratioNb - ratioTh - ratioVd) : 10;

  // Helper to format percentage per column cell
  const formatCellPercentage = (pts: number) => {
    if (!grandTotalPoints || pts === 0) return '0%';
    const pct = (pts / grandTotalPoints) * 100;
    return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sub-navigation & Quick Actions Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Toggle between Both, Matrix & Spec */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            id="tab-btn-both"
            onClick={() => setActiveSubTab('both')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'both'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Xem Cả Hai (Ma Trận & Đặc Tả)
          </button>
          <button
            id="tab-btn-matrix"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Chỉ xem Ma Trận
          </button>
          <button
            id="tab-btn-spec"
            onClick={() => setActiveSubTab('spec')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'spec'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📝 Chỉ xem Bản Đặc Tả
          </button>
        </div>

        {/* AI & Matrix Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Toggle Point & Question Count Customizer Panel */}
          <button
            id="btn-toggle-part-config"
            onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
              isConfigPanelOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
            }`}
            title="Tùy chỉnh số câu, số điểm mỗi câu và tổng điểm từng phần"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Cài đặt Thang điểm & Số câu</span>
            {isConfigPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          
          <button
            id="btn-import-syllabus"
            onClick={handleImportSyllabusTopics}
            title="Tự động nạp danh mục chủ đề theo khung chương trình GDPT 2018"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Nạp Chủ Đề Chuẩn</span>
          </button>

          {/* Direct Feature: Tạo Bảng Đặc Tả Từ Ma Trận */}
          <button
            id="btn-sync-spec-from-matrix"
            onClick={handleGenerateSpecFromMatrix}
            title="Tạo nhanh bảng đặc tả tương ứng chuẩn xác theo các ô ma trận hiện tại"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tạo Bảng Đặc Tả Từ Ma Trận</span>
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

      {/* COLLAPSIBLE ADVANCED PART POINT & QUESTION COUNT CONFIGURATION PANEL */}
      {isConfigPanelOpen && (
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Thiết Lập Số Câu, Điểm Mỗi Câu & Tổng Điểm Từng Phần</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Thầy/cô có thể tự do nhập số điểm cho mỗi câu, số lượng câu hỏi mục tiêu cho từng phần hoặc chọn nhanh các cấu trúc mẫu bên dưới.
              </p>
            </div>

            {/* Quick Structure Preset Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Mẫu nhanh:</span>
              <button
                onClick={() => handleApplyPreset('bo_2025')}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 transition-colors"
                title="12 câu TN (3đ) + 4 câu Đ/S (4đ) + 6 câu TLN (3đ)"
              >
                ⚡ Chuẩn Bộ 2025
              </button>
              <button
                onClick={() => handleApplyPreset('tn_tuluan_70_30')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                title="28 câu TN (7đ) + 3 câu Tự luận (3đ)"
              >
                ⚡ 70% TN + 30% TL
              </button>
              <button
                onClick={() => handleApplyPreset('ket_hop_4_phan')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                title="16 câu TN + 2 câu Đ/S + 4 câu TLN + 2 câu TL"
              >
                ⚡ Kết hợp 4 phần
              </button>
              <button
                onClick={() => handleApplyPreset('tn_100')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition-colors"
                title="40 câu trắc nghiệm 4 lựa chọn (10 điểm)"
              >
                ⚡ 100% Trắc nghiệm (40 câu)
              </button>
            </div>
          </div>

          {/* 4 Cards for 4 Parts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* PART 1 CARD */}
            <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-indigo-900">PHẦN I</span>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={partConfigs.part1?.enabled ?? true}
                      onChange={(e) => handleUpdatePartConfig('part1', 'enabled', e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Bật phần này</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={partConfigs.part1?.name || 'Phần I (TN 4 lựa chọn)'}
                  onChange={(e) => handleUpdatePartConfig('part1', 'name', e.target.value)}
                  className="w-full mt-1.5 px-2 py-1 bg-white border border-indigo-200 rounded text-xs font-bold text-slate-800"
                  placeholder="Tên Phần I..."
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Điểm mỗi câu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-indigo-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part1', -0.05)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                        title="Giảm 0.05 điểm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={p1_pts}
                        onChange={(e) => handleUpdatePartConfig('part1', 'pointsPerQuestion', e.target.value)}
                        className="w-12 py-1 text-center font-extrabold text-indigo-700 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part1', 0.05)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                        title="Tăng 0.05 điểm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500 font-bold">đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Số câu mục tiêu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-indigo-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part1', -1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                        title="Giảm 1 câu"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={p1_target}
                        onChange={(e) => handleUpdatePartConfig('part1', 'targetQuestions', e.target.value)}
                        className="w-10 py-1 text-center font-extrabold text-slate-800 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part1', 1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                        title="Tăng 1 câu"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500">câu</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between font-bold">
                  <span className="text-slate-700">Tổng điểm phần:</span>
                  <span className="text-indigo-700 font-black text-sm">{(p1_target * p1_pts).toFixed(2)} đ</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Thực tế trong Ma trận:</span>
                  <span className={`font-bold ${totalP1 === p1_target ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {totalP1} / {p1_target} câu ({totalPointsP1.toFixed(2)}đ)
                  </span>
                </div>
              </div>
            </div>

            {/* PART 2 CARD */}
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-blue-900">PHẦN II</span>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={partConfigs.part2?.enabled ?? true}
                      onChange={(e) => handleUpdatePartConfig('part2', 'enabled', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Bật phần này</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={partConfigs.part2?.name || 'Phần II (TN Đúng/Sai)'}
                  onChange={(e) => handleUpdatePartConfig('part2', 'name', e.target.value)}
                  className="w-full mt-1.5 px-2 py-1 bg-white border border-blue-200 rounded text-xs font-bold text-slate-800"
                  placeholder="Tên Phần II..."
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Điểm mỗi câu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-blue-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part2', -0.25)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                        title="Giảm 0.25 điểm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={p2_pts}
                        onChange={(e) => handleUpdatePartConfig('part2', 'pointsPerQuestion', e.target.value)}
                        className="w-12 py-1 text-center font-extrabold text-blue-700 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part2', 0.25)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                        title="Tăng 0.25 điểm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500 font-bold">đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Số câu mục tiêu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-blue-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part2', -1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                        title="Giảm 1 câu"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={p2_target}
                        onChange={(e) => handleUpdatePartConfig('part2', 'targetQuestions', e.target.value)}
                        className="w-10 py-1 text-center font-extrabold text-slate-800 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part2', 1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                        title="Tăng 1 câu"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500">câu</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between font-bold">
                  <span className="text-slate-700">Tổng điểm phần:</span>
                  <span className="text-blue-700 font-black text-sm">{(p2_target * p2_pts).toFixed(2)} đ</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Thực tế trong Ma trận:</span>
                  <span className={`font-bold ${totalP2 === p2_target ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {totalP2} / {p2_target} câu ({totalPointsP2.toFixed(2)}đ)
                  </span>
                </div>
              </div>
            </div>

            {/* PART 3 CARD */}
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-emerald-900">PHẦN III</span>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={partConfigs.part3?.enabled ?? true}
                      onChange={(e) => handleUpdatePartConfig('part3', 'enabled', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Bật phần này</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={partConfigs.part3?.name || 'Phần III (Trả lời ngắn)'}
                  onChange={(e) => handleUpdatePartConfig('part3', 'name', e.target.value)}
                  className="w-full mt-1.5 px-2 py-1 bg-white border border-emerald-200 rounded text-xs font-bold text-slate-800"
                  placeholder="Tên Phần III..."
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Điểm mỗi câu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-emerald-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part3', -0.1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                        title="Giảm 0.1 điểm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={p3_pts}
                        onChange={(e) => handleUpdatePartConfig('part3', 'pointsPerQuestion', e.target.value)}
                        className="w-12 py-1 text-center font-extrabold text-emerald-700 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part3', 0.1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                        title="Tăng 0.1 điểm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500 font-bold">đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Số câu mục tiêu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-emerald-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part3', -1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                        title="Giảm 1 câu"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={p3_target}
                        onChange={(e) => handleUpdatePartConfig('part3', 'targetQuestions', e.target.value)}
                        className="w-10 py-1 text-center font-extrabold text-slate-800 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part3', 1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                        title="Tăng 1 câu"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500">câu</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between font-bold">
                  <span className="text-slate-700">Tổng điểm phần:</span>
                  <span className="text-emerald-700 font-black text-sm">{(p3_target * p3_pts).toFixed(2)} đ</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Thực tế trong Ma trận:</span>
                  <span className={`font-bold ${totalP3 === p3_target ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {totalP3} / {p3_target} câu ({totalPointsP3.toFixed(2)}đ)
                  </span>
                </div>
              </div>
            </div>

            {/* PART 4 CARD */}
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-900">PHẦN IV</span>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={partConfigs.part4?.enabled ?? true}
                      onChange={(e) => handleUpdatePartConfig('part4', 'enabled', e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Bật phần này</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={partConfigs.part4?.name || 'Phần IV (Tự luận)'}
                  onChange={(e) => handleUpdatePartConfig('part4', 'name', e.target.value)}
                  className="w-full mt-1.5 px-2 py-1 bg-white border border-amber-200 rounded text-xs font-bold text-slate-800"
                  placeholder="Tên Phần IV..."
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Điểm mỗi câu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-amber-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part4', -0.25)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                        title="Giảm 0.25 điểm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={p4_pts}
                        onChange={(e) => handleUpdatePartConfig('part4', 'pointsPerQuestion', e.target.value)}
                        className="w-12 py-1 text-center font-extrabold text-amber-700 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustPoints('part4', 0.25)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                        title="Tăng 0.25 điểm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500 font-bold">đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 font-medium">Số câu mục tiêu:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-amber-200 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part4', -1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                        title="Giảm 1 câu"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={p4_target}
                        onChange={(e) => handleUpdatePartConfig('part4', 'targetQuestions', e.target.value)}
                        className="w-10 py-1 text-center font-extrabold text-slate-800 focus:outline-hidden text-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdjustQuestions('part4', 1)}
                        className="px-1.5 py-1 bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                        title="Tăng 1 câu"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-slate-500">câu</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between font-bold">
                  <span className="text-slate-700">Tổng điểm phần:</span>
                  <span className="text-amber-700 font-black text-sm">{(p4_target * p4_pts).toFixed(2)} đ</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Thực tế trong Ma trận:</span>
                  <span className={`font-bold ${totalP4 === p4_target ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {totalP4} / {p4_target} câu ({totalPointsP4.toFixed(2)}đ)
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Target Sum Summary Banner */}
          <div className="p-3 bg-slate-100 rounded-xl flex flex-wrap items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600" />
              <span>Tổng mục tiêu toàn đề thi: <strong>{grandTargetQuestions} câu</strong></span>
              <span>•</span>
              <span>Tổng thang điểm: <strong className={grandTargetPoints === 10 ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>{grandTargetPoints.toFixed(2)} / 10.0 đ</strong></span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Tự động cập nhật bảng Ma trận và Bản đặc tả tương ứng.
            </div>
          </div>

        </div>
      )}

      {/* Sync / Notification Toast */}
      {specSyncNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{specSyncNotification}</span>
          </div>
          <button 
            onClick={() => setSpecSyncNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 py-0.5"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Cognitive Balance Summary Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Tỷ Lệ Mức Độ Nhận Thức (Chuẩn Bộ 40% - 30% - 20% - 10%)
            </h4>
            <div className="flex items-center gap-3 text-xs mt-1 flex-wrap">
              <span>Nhận biết: <strong className="text-blue-400 font-bold">{ratioNb}%</strong> ({grandNb} câu / {ptsTotalNb.toFixed(1)}đ)</span>
              <span>•</span>
              <span>Thông hiểu: <strong className="text-emerald-400 font-bold">{ratioTh}%</strong> ({grandTh} câu / {ptsTotalTh.toFixed(1)}đ)</span>
              <span>•</span>
              <span>Vận dụng: <strong className="text-amber-400 font-bold">{ratioVd}%</strong> ({grandVd} câu / {ptsTotalVd.toFixed(1)}đ)</span>
              <span>•</span>
              <span>Vận dụng cao: <strong className="text-rose-400 font-bold">{ratioVdc}%</strong> ({grandVdc} câu / {ptsTotalVdc.toFixed(1)}đ)</span>
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
      {(activeSubTab === 'both' || activeSubTab === 'matrix') && (
        <div id="section-matrix" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-black text-xs">BẢNG 1</span>
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Bảng Ma Trận Phân Bổ Câu Hỏi Theo Chuẩn Bộ GD&ĐT
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                ({header.subject} - {header.grade} - {header.examTitle})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {activeSubTab === 'both' && (
                <button
                  type="button"
                  onClick={() => document.getElementById('section-spec')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-2xs transition-colors"
                  title="Cuộn nhanh xuống xem Bảng Đặc Tả"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Xem Bảng Đặc Tả</span>
                </button>
              )}
              <button
                id="btn-add-matrix-row"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm dòng</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th rowSpan={2} className="p-2.5 text-center border-r border-slate-200 w-12">TT</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-200 min-w-[180px]">Chủ đề / Chương</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-200 min-w-[200px]">Nội dung / Đơn vị kiến thức</th>
                  
                  {/* Part 1 Header with Inline Config */}
                  <th colSpan={4} className="p-2 bg-indigo-50/90 border-r border-slate-200">
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-indigo-950 text-xs truncate" title={partConfigs.part1?.name}>
                          {partConfigs.part1?.name || 'Phần I'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                          totalP1 === p1_target 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : totalP1 < p1_target 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {totalP1}/{p1_target} câu
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] bg-white/95 p-1 rounded-lg border border-indigo-100 shadow-2xs">
                        {/* Điểm/câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Điểm:</span>
                          <div className="flex items-center border border-indigo-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part1', -0.05)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                              title="Giảm 0.05 điểm"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={p1_pts}
                              onChange={(e) => handleUpdatePartConfig('part1', 'pointsPerQuestion', e.target.value)}
                              className="w-8 text-center font-extrabold text-indigo-700 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số điểm mỗi câu Phần I"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part1', 0.05)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                              title="Tăng 0.05 điểm"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="text-indigo-900 font-bold text-[10px]">đ</span>
                        </div>

                        {/* Số câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Số câu:</span>
                          <div className="flex items-center border border-indigo-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part1', -1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                              title="Giảm 1 câu"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={p1_target}
                              onChange={(e) => handleUpdatePartConfig('part1', 'targetQuestions', e.target.value)}
                              className="w-7 text-center font-bold text-slate-800 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số câu mục tiêu Phần I"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part1', 1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                              title="Tăng 1 câu"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-indigo-900 font-semibold px-0.5">
                        <span>Tổng điểm: <strong className="text-indigo-700 font-bold">{totalPointsP1.toFixed(2)}đ</strong></span>
                        <span className="text-slate-500">(MT: {(p1_target * p1_pts).toFixed(2)}đ)</span>
                      </div>
                    </div>
                  </th>

                  {/* Part 2 Header with Inline Config */}
                  <th colSpan={4} className="p-2 bg-blue-50/90 border-r border-slate-200">
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-blue-950 text-xs truncate" title={partConfigs.part2?.name}>
                          {partConfigs.part2?.name || 'Phần II'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                          totalP2 === p2_target 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : totalP2 < p2_target 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {totalP2}/{p2_target} câu
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] bg-white/95 p-1 rounded-lg border border-blue-100 shadow-2xs">
                        {/* Điểm/câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Điểm:</span>
                          <div className="flex items-center border border-blue-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part2', -0.25)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                              title="Giảm 0.25 điểm"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={p2_pts}
                              onChange={(e) => handleUpdatePartConfig('part2', 'pointsPerQuestion', e.target.value)}
                              className="w-8 text-center font-extrabold text-blue-700 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số điểm mỗi câu Phần II"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part2', 0.25)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                              title="Tăng 0.25 điểm"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="text-blue-900 font-bold text-[10px]">đ</span>
                        </div>

                        {/* Số câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Số câu:</span>
                          <div className="flex items-center border border-blue-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part2', -1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                              title="Giảm 1 câu"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={p2_target}
                              onChange={(e) => handleUpdatePartConfig('part2', 'targetQuestions', e.target.value)}
                              className="w-7 text-center font-bold text-slate-800 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số câu mục tiêu Phần II"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part2', 1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                              title="Tăng 1 câu"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-blue-900 font-semibold px-0.5">
                        <span>Tổng điểm: <strong className="text-blue-700 font-bold">{totalPointsP2.toFixed(2)}đ</strong></span>
                        <span className="text-slate-500">(MT: {(p2_target * p2_pts).toFixed(2)}đ)</span>
                      </div>
                    </div>
                  </th>

                  {/* Part 3 Header with Inline Config */}
                  <th colSpan={4} className="p-2 bg-emerald-50/90 border-r border-slate-200">
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-emerald-950 text-xs truncate" title={partConfigs.part3?.name}>
                          {partConfigs.part3?.name || 'Phần III'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                          totalP3 === p3_target 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : totalP3 < p3_target 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {totalP3}/{p3_target} câu
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] bg-white/95 p-1 rounded-lg border border-emerald-100 shadow-2xs">
                        {/* Điểm/câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Điểm:</span>
                          <div className="flex items-center border border-emerald-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part3', -0.1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                              title="Giảm 0.1 điểm"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={p3_pts}
                              onChange={(e) => handleUpdatePartConfig('part3', 'pointsPerQuestion', e.target.value)}
                              className="w-8 text-center font-extrabold text-emerald-700 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số điểm mỗi câu Phần III"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part3', 0.1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                              title="Tăng 0.1 điểm"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="text-emerald-900 font-bold text-[10px]">đ</span>
                        </div>

                        {/* Số câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Số câu:</span>
                          <div className="flex items-center border border-emerald-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part3', -1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                              title="Giảm 1 câu"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={p3_target}
                              onChange={(e) => handleUpdatePartConfig('part3', 'targetQuestions', e.target.value)}
                              className="w-7 text-center font-bold text-slate-800 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số câu mục tiêu Phần III"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part3', 1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                              title="Tăng 1 câu"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-emerald-900 font-semibold px-0.5">
                        <span>Tổng điểm: <strong className="text-emerald-700 font-bold">{totalPointsP3.toFixed(2)}đ</strong></span>
                        <span className="text-slate-500">(MT: {(p3_target * p3_pts).toFixed(2)}đ)</span>
                      </div>
                    </div>
                  </th>

                  {/* Part 4 Header with Inline Config */}
                  <th colSpan={4} className="p-2 bg-amber-50/90 border-r border-slate-200">
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-amber-950 text-xs truncate" title={partConfigs.part4?.name}>
                          {partConfigs.part4?.name || 'Phần IV (Tự luận)'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                          totalP4 === p4_target 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : totalP4 < p4_target 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                        }`}>
                          {totalP4}/{p4_target} câu
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] bg-white/95 p-1 rounded-lg border border-amber-100 shadow-2xs">
                        {/* Điểm/câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Điểm:</span>
                          <div className="flex items-center border border-amber-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part4', -0.25)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                              title="Giảm 0.25 điểm"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={p4_pts}
                              onChange={(e) => handleUpdatePartConfig('part4', 'pointsPerQuestion', e.target.value)}
                              className="w-8 text-center font-extrabold text-amber-700 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số điểm mỗi câu Phần IV"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustPoints('part4', 0.25)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                              title="Tăng 0.25 điểm"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="text-amber-900 font-bold text-[10px]">đ</span>
                        </div>

                        {/* Số câu */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium text-[10px]">Số câu:</span>
                          <div className="flex items-center border border-amber-200 rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part4', -1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                              title="Giảm 1 câu"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={p4_target}
                              onChange={(e) => handleUpdatePartConfig('part4', 'targetQuestions', e.target.value)}
                              className="w-7 text-center font-bold text-slate-800 bg-transparent focus:outline-hidden text-[11px]"
                              title="Số câu mục tiêu Phần IV"
                            />
                            <button
                              type="button"
                              onClick={() => handleAdjustQuestions('part4', 1)}
                              className="w-4 h-5 flex items-center justify-center bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors"
                              title="Tăng 1 câu"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-amber-900 font-semibold px-0.5">
                        <span>Tổng điểm: <strong className="text-amber-700 font-bold">{totalPointsP4.toFixed(2)}đ</strong></span>
                        <span className="text-slate-500">(MT: {(p4_target * p4_pts).toFixed(2)}đ)</span>
                      </div>
                    </div>
                  </th>

                  <th rowSpan={2} className="p-2.5 text-center border-r border-slate-200 w-20">Điểm</th>
                  <th rowSpan={2} className="p-2.5 text-center w-12">Xóa</th>
                </tr>
                <tr className="bg-slate-50 text-[11px] text-slate-600 font-semibold border-b border-slate-200">
                  {/* Part 1 */}
                  <th className="p-1 text-center border-r border-slate-200 bg-indigo-50/40">NB</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-indigo-50/40">TH</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-indigo-50/40">VD</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-indigo-50/40">VDC</th>
                  {/* Part 2 */}
                  <th className="p-1 text-center border-r border-slate-200 bg-blue-50/40">NB</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-blue-50/40">TH</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-blue-50/40">VD</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-blue-50/40">VDC</th>
                  {/* Part 3 */}
                  <th className="p-1 text-center border-r border-slate-200 bg-emerald-50/40">NB</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-emerald-50/40">TH</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-emerald-50/40">VD</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-emerald-50/40">VDC</th>
                  {/* Part 4 */}
                  <th className="p-1 text-center border-r border-slate-200 bg-amber-50/40">NB</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-amber-50/40">TH</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-amber-50/40">VD</th>
                  <th className="p-1 text-center border-r border-slate-200 bg-amber-50/40">VDC</th>
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
                {/* FOOTER ROW 1: TỔNG SỐ CÂU */}
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={3} className="p-2.5 text-right uppercase tracking-wider border-r border-slate-200 text-xs">
                    <div className="flex flex-col items-end">
                      <span>Tổng số câu hỏi:</span>
                      <span className="text-[10px] text-slate-500 font-normal">Mục tiêu: {grandTargetQuestions} câu</span>
                    </div>
                  </td>
                  {/* Part 1 */}
                  <td className="p-1.5 text-center text-indigo-900 border-r border-slate-200 font-bold bg-indigo-50/50">{totalP1_nb}</td>
                  <td className="p-1.5 text-center text-indigo-900 border-r border-slate-200 font-bold bg-indigo-50/50">{totalP1_th}</td>
                  <td className="p-1.5 text-center text-indigo-900 border-r border-slate-200 font-bold bg-indigo-50/50">{totalP1_vd}</td>
                  <td className="p-1.5 text-center text-indigo-900 border-r border-slate-200 font-bold bg-indigo-50/50">{totalP1_vdc}</td>
                  {/* Part 2 */}
                  <td className="p-1.5 text-center text-blue-900 border-r border-slate-200 font-bold bg-blue-50/50">{totalP2_nb}</td>
                  <td className="p-1.5 text-center text-blue-900 border-r border-slate-200 font-bold bg-blue-50/50">{totalP2_th}</td>
                  <td className="p-1.5 text-center text-blue-900 border-r border-slate-200 font-bold bg-blue-50/50">{totalP2_vd}</td>
                  <td className="p-1.5 text-center text-blue-900 border-r border-slate-200 font-bold bg-blue-50/50">{totalP2_vdc}</td>
                  {/* Part 3 */}
                  <td className="p-1.5 text-center text-emerald-900 border-r border-slate-200 font-bold bg-emerald-50/50">{totalP3_nb}</td>
                  <td className="p-1.5 text-center text-emerald-900 border-r border-slate-200 font-bold bg-emerald-50/50">{totalP3_th}</td>
                  <td className="p-1.5 text-center text-emerald-900 border-r border-slate-200 font-bold bg-emerald-50/50">{totalP3_vd}</td>
                  <td className="p-1.5 text-center text-emerald-900 border-r border-slate-200 font-bold bg-emerald-50/50">{totalP3_vdc}</td>
                  {/* Part 4 */}
                  <td className="p-1.5 text-center text-amber-900 border-r border-slate-200 font-bold bg-amber-50/50">{totalP4_nb}</td>
                  <td className="p-1.5 text-center text-amber-900 border-r border-slate-200 font-bold bg-amber-50/50">{totalP4_th}</td>
                  <td className="p-1.5 text-center text-amber-900 border-r border-slate-200 font-bold bg-amber-50/50">{totalP4_vd}</td>
                  <td className="p-1.5 text-center text-amber-900 border-r border-slate-200 font-bold bg-amber-50/50">{totalP4_vdc}</td>
                  <td className="p-2 text-center text-xs font-extrabold border-r border-slate-200">
                    <span className={grandTotalQuestions === grandTargetQuestions ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>
                      {grandTotalQuestions} câu
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/ {grandTargetQuestions} MT</span>
                  </td>
                  <td></td>
                </tr>

                {/* FOOTER ROW 2: TỔNG ĐIỂM THEO CỘT */}
                <tr className="bg-slate-50 font-semibold text-slate-700 border-t border-slate-200">
                  <td colSpan={3} className="p-2 text-right uppercase tracking-wider border-r border-slate-200 text-[11px] text-slate-600">
                    <div className="flex flex-col items-end">
                      <span>Tổng điểm từng cột:</span>
                      <span className="text-[10px] text-slate-400 font-normal">Thang điểm chuẩn: 10.0 đ</span>
                    </div>
                  </td>
                  {/* Part 1 */}
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-indigo-900">{ptsP1_nb.toFixed(2)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-indigo-900">{ptsP1_th.toFixed(2)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-indigo-900">{ptsP1_vd.toFixed(2)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-indigo-900">{ptsP1_vdc.toFixed(2)}đ</td>
                  {/* Part 2 */}
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-blue-900">{ptsP2_nb.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-blue-900">{ptsP2_th.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-blue-900">{ptsP2_vd.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-blue-900">{ptsP2_vdc.toFixed(1)}đ</td>
                  {/* Part 3 */}
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-emerald-900">{ptsP3_nb.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-emerald-900">{ptsP3_th.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-emerald-900">{ptsP3_vd.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-emerald-900">{ptsP3_vdc.toFixed(1)}đ</td>
                  {/* Part 4 */}
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-amber-900">{ptsP4_nb.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-amber-900">{ptsP4_th.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-amber-900">{ptsP4_vd.toFixed(1)}đ</td>
                  <td className="p-1 text-center border-r border-slate-200 text-[11px] text-amber-900">{ptsP4_vdc.toFixed(1)}đ</td>
                  <td className="p-2 text-center text-xs font-bold text-indigo-700 bg-indigo-50/50 border-r border-slate-200">
                    <span className={grandTotalPoints === 10 ? 'text-emerald-700 font-black' : 'text-amber-700 font-black'}>
                      {grandTotalPoints.toFixed(2)} đ
                    </span>
                  </td>
                  <td></td>
                </tr>

                {/* FOOTER ROW 3: DÒNG THỂ HIỆN TỈ LỆ % (Theo yêu cầu người dùng) */}
                <tr className="bg-indigo-50/80 font-bold text-indigo-950 border-t-2 border-indigo-200">
                  <td colSpan={3} className="p-2.5 text-right uppercase tracking-wider border-r border-slate-300 text-xs font-extrabold text-indigo-900">
                    Tỉ lệ % theo từng cột (%):
                  </td>
                  {/* Part 1 percentages */}
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-indigo-800 font-bold">{formatCellPercentage(ptsP1_nb)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-indigo-800 font-bold">{formatCellPercentage(ptsP1_th)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-indigo-800 font-bold">{formatCellPercentage(ptsP1_vd)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-indigo-800 font-bold">{formatCellPercentage(ptsP1_vdc)}</td>
                  {/* Part 2 percentages */}
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-blue-800 font-bold">{formatCellPercentage(ptsP2_nb)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-blue-800 font-bold">{formatCellPercentage(ptsP2_th)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-blue-800 font-bold">{formatCellPercentage(ptsP2_vd)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-blue-800 font-bold">{formatCellPercentage(ptsP2_vdc)}</td>
                  {/* Part 3 percentages */}
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-emerald-800 font-bold">{formatCellPercentage(ptsP3_nb)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-emerald-800 font-bold">{formatCellPercentage(ptsP3_th)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-emerald-800 font-bold">{formatCellPercentage(ptsP3_vd)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-emerald-800 font-bold">{formatCellPercentage(ptsP3_vdc)}</td>
                  {/* Part 4 percentages */}
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-amber-800 font-bold">{formatCellPercentage(ptsP4_nb)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-amber-800 font-bold">{formatCellPercentage(ptsP4_th)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-amber-800 font-bold">{formatCellPercentage(ptsP4_vd)}</td>
                  <td className="p-1.5 text-center border-r border-slate-300 text-[11px] text-amber-800 font-bold">{formatCellPercentage(ptsP4_vdc)}</td>
                  <td className="p-2.5 text-center text-xs font-black text-indigo-700 bg-indigo-200/70 border-r border-slate-300">
                    100%
                  </td>
                  <td></td>
                </tr>

                {/* FOOTER ROW 4: TỔNG HỢP TỈ LỆ 4 MỨC ĐỘ NHẬN THỨC CHUẨN */}
                <tr className="bg-slate-900 text-white font-bold border-t border-slate-700">
                  <td colSpan={3} className="p-3 text-right uppercase tracking-wider text-xs text-indigo-300">
                    TỔNG HỢP 4 MỨC ĐỘ NHẬN THỨC:
                  </td>
                  <td colSpan={4} className="p-2.5 text-center border-r border-slate-700 bg-blue-950/60">
                    <span className="text-blue-300 text-[11px]">Nhận biết: </span>
                    <strong className="text-blue-400 text-xs font-extrabold">{ratioNb}%</strong>
                    <span className="text-[10px] text-slate-400 block font-normal">({grandNb} câu • {ptsTotalNb.toFixed(1)}đ)</span>
                  </td>
                  <td colSpan={4} className="p-2.5 text-center border-r border-slate-700 bg-emerald-950/60">
                    <span className="text-emerald-300 text-[11px]">Thông hiểu: </span>
                    <strong className="text-emerald-400 text-xs font-extrabold">{ratioTh}%</strong>
                    <span className="text-[10px] text-slate-400 block font-normal">({grandTh} câu • {ptsTotalTh.toFixed(1)}đ)</span>
                  </td>
                  <td colSpan={4} className="p-2.5 text-center border-r border-slate-700 bg-amber-950/60">
                    <span className="text-amber-300 text-[11px]">Vận dụng: </span>
                    <strong className="text-amber-400 text-xs font-extrabold">{ratioVd}%</strong>
                    <span className="text-[10px] text-slate-400 block font-normal">({grandVd} câu • {ptsTotalVd.toFixed(1)}đ)</span>
                  </td>
                  <td colSpan={4} className="p-2.5 text-center border-r border-slate-700 bg-rose-950/60">
                    <span className="text-rose-300 text-[11px]">Vận dụng cao: </span>
                    <strong className="text-rose-400 text-xs font-extrabold">{ratioVdc}%</strong>
                    <span className="text-[10px] text-slate-400 block font-normal">({grandVdc} câu • {ptsTotalVdc.toFixed(1)}đ)</span>
                  </td>
                  <td className="p-2.5 text-center text-xs font-black text-emerald-400 bg-slate-950 border-r border-slate-700">
                    {grandTotalPoints.toFixed(2)}đ
                    <span className="text-[10px] text-slate-400 block">100%</span>
                  </td>
                  <td></td>
                </tr>

              </tfoot>
            </table>
          </div>

        </div>
      )}

      {/* SUB TAB 2: SPECIFICATION TABLE & STRICT MATRIX CELL LOCKING */}
      {(activeSubTab === 'both' || activeSubTab === 'spec') && (
        <div id="section-spec" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
          
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-xs">BẢNG 2</span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Bản Đặc Tả Ma Trận Đề Kiểm Tra Chuẩn Bộ GD&ĐT
                </h4>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-[11px] font-semibold">
                  Khóa ô tự động theo Ma trận
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                🔒 <strong>Quy tắc bảo vệ:</strong> Chỉ cho phép nhập Yêu cầu cần đạt vào các ô có phân bổ câu hỏi ở Ma trận. Các ô có 0 câu hỏi sẽ tự động khóa để bảo đảm tính thống nhất.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeSubTab === 'both' && (
                <button
                  type="button"
                  onClick={() => document.getElementById('section-matrix')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Cuộn nhanh lên xem Bảng Ma Trận"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Lên Bảng Ma Trận</span>
                </button>
              )}
              
              {/* View Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setSpecViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    specViewMode === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Dạng Bảng Chuẩn Bộ</span>
                </button>
                <button
                  onClick={() => setSpecViewMode('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    specViewMode === 'cards' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Dạng Khối Chi Tiết</span>
                </button>
              </div>

              {/* Sync Button */}
              <button
                id="btn-sync-spec-from-matrix-inner"
                onClick={handleGenerateSpecFromMatrix}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors shadow-2xs"
                title="Tự động đồng bộ các ô và câu hỏi khớp theo Ma trận"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đồng bộ từ Ma trận</span>
              </button>

              <button
                id="btn-ai-rewrite-spec"
                onClick={onGenerateAiSpec}
                disabled={isAiGeneratingSpec}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Viết lại chi tiết</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: FULL TABLE FORMAT (CHUẨN BỘ GD&ĐT) */}
          {specViewMode === 'table' && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th rowSpan={2} className="p-2.5 text-center border-r border-slate-300 w-12">TT</th>
                    <th rowSpan={2} className="p-2.5 border-r border-slate-300 min-w-[160px]">Chủ đề / Chương</th>
                    <th rowSpan={2} className="p-2.5 border-r border-slate-300 min-w-[180px]">Nội dung kiến thức</th>
                    <th rowSpan={2} className="p-2.5 border-r border-slate-300 min-w-[100px] text-center">Mức độ</th>
                    <th rowSpan={2} className="p-2.5 border-r border-slate-300 min-w-[320px]">
                      Yêu cầu cần đạt (Chỉ nhập ô có câu hỏi ở Ma trận)
                    </th>
                    <th colSpan={4} className="p-2 text-center border-r border-slate-300 bg-indigo-50/70">
                      Số câu hỏi phân bổ theo Ma trận
                    </th>
                    <th rowSpan={2} className="p-2.5 text-center w-16">Trạng thái</th>
                  </tr>
                  <tr className="bg-slate-50 text-[11px] text-slate-600 font-semibold border-b border-slate-300">
                    <th className="p-1.5 text-center border-r border-slate-300">Phần I (TN)</th>
                    <th className="p-1.5 text-center border-r border-slate-300">Phần II (Đ/S)</th>
                    <th className="p-1.5 text-center border-r border-slate-300">Phần III (TLN)</th>
                    <th className="p-1.5 text-center border-r border-slate-300">Phần IV (TL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {matrix.map((row, rowIdx) => {
                    const specItem = specification.find(s => s.topic === row.topic && s.unit === row.unit) || specification[rowIdx];
                    
                    const totalNb = row.part1_nb + row.part2_nb + row.part3_nb + row.part4_nb;
                    const totalTh = row.part1_th + row.part2_th + row.part3_th + row.part4_th;
                    const totalVd = row.part1_vd + row.part2_vd + row.part3_vd + row.part4_vd;
                    const totalVdc = row.part1_vdc + row.part2_vdc + row.part3_vdc + row.part4_vdc;

                    const levels = [
                      {
                        key: 'nb' as const,
                        label: 'Nhận biết (NB)',
                        color: 'text-blue-700 bg-blue-50 border-blue-200',
                        active: totalNb > 0,
                        count: totalNb,
                        p1: row.part1_nb,
                        p2: row.part2_nb,
                        p3: row.part3_nb,
                        p4: row.part4_nb,
                        text: specItem?.learningObjectives?.nb || '',
                        defaultPlaceholder: 'Nêu các khái niệm, định nghĩa, nhận diện công thức cơ bản...',
                      },
                      {
                        key: 'th' as const,
                        label: 'Thông hiểu (TH)',
                        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                        active: totalTh > 0,
                        count: totalTh,
                        p1: row.part1_th,
                        p2: row.part2_th,
                        p3: row.part3_th,
                        p4: row.part4_th,
                        text: specItem?.learningObjectives?.th || '',
                        defaultPlaceholder: 'Giải thích, phân tích mối quan hệ, áp dụng trực tiếp tính chất...',
                      },
                      {
                        key: 'vd' as const,
                        label: 'Vận dụng (VD)',
                        color: 'text-amber-700 bg-amber-50 border-amber-200',
                        active: totalVd > 0,
                        count: totalVd,
                        p1: row.part1_vd,
                        p2: row.part2_vd,
                        p3: row.part3_vd,
                        p4: row.part4_vd,
                        text: specItem?.learningObjectives?.vd || '',
                        defaultPlaceholder: 'Vận dụng giải quyết các bài toán tình huống đơn giản...',
                      },
                      {
                        key: 'vdc' as const,
                        label: 'Vận dụng cao (VDC)',
                        color: 'text-rose-700 bg-rose-50 border-rose-200',
                        active: totalVdc > 0,
                        count: totalVdc,
                        p1: row.part1_vdc,
                        p2: row.part2_vdc,
                        p3: row.part3_vdc,
                        p4: row.part4_vdc,
                        text: specItem?.learningObjectives?.vdc || '',
                        defaultPlaceholder: 'Tổng hợp kiến thức giải bài toán phân hóa, thực tiễn phức hợp...',
                      }
                    ];

                    return (
                      <React.Fragment key={row.id || rowIdx}>
                        {levels.map((lvl, lvlIdx) => (
                          <tr 
                            key={`${row.id}-${lvl.key}`} 
                            className={`${lvl.active ? 'hover:bg-slate-50' : 'bg-slate-100/50 text-slate-400'}`}
                          >
                            {/* Topic & Unit cell - only in first subrow */}
                            {lvlIdx === 0 && (
                              <>
                                <td rowSpan={4} className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200 bg-white align-top">
                                  {rowIdx + 1}
                                </td>
                                <td rowSpan={4} className="p-2.5 font-semibold text-slate-900 border-r border-slate-200 bg-white align-top">
                                  {row.topic}
                                </td>
                                <td rowSpan={4} className="p-2.5 text-slate-700 border-r border-slate-200 bg-white align-top">
                                  {row.unit}
                                </td>
                              </>
                            )}

                            {/* Cognitive Level Tag */}
                            <td className="p-2 border-r border-slate-200 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${lvl.color}`}>
                                {lvl.label}
                              </span>
                            </td>

                            {/* Learning Objective Text Input - STRICT LOCK IF NOT ACTIVE */}
                            <td className="p-2 border-r border-slate-200">
                              {lvl.active ? (
                                <textarea
                                  value={lvl.text}
                                  onChange={(e) => handleUpdateSpecObjective(rowIdx, lvl.key, e.target.value)}
                                  placeholder={lvl.defaultPlaceholder}
                                  rows={2}
                                  className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg focus:outline-hidden resize-y leading-relaxed font-normal shadow-2xs"
                                />
                              ) : (
                                <div className="px-3 py-2 bg-slate-200/50 border border-dashed border-slate-300 rounded-lg text-[11px] text-slate-400 italic flex items-center gap-1.5 select-none">
                                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Không có câu hỏi ở Ma trận (0 câu) — Đã khóa ô đặc tả</span>
                                </div>
                              )}
                            </td>

                            {/* Question counts according to matrix */}
                            <td className="p-2 text-center border-r border-slate-200 font-semibold">
                              {lvl.p1 > 0 ? <span className="text-indigo-700 font-bold">{lvl.p1}</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200 font-semibold">
                              {lvl.p2 > 0 ? <span className="text-blue-700 font-bold">{lvl.p2}</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200 font-semibold">
                              {lvl.p3 > 0 ? <span className="text-emerald-700 font-bold">{lvl.p3}</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="p-2 text-center border-r border-slate-200 font-semibold">
                              {lvl.p4 > 0 ? <span className="text-amber-700 font-bold">{lvl.p4}</span> : <span className="text-slate-300">—</span>}
                            </td>

                            {/* Lock Status */}
                            <td className="p-2 text-center">
                              {lvl.active ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800" title={`Có ${lvl.count} câu hỏi trong ma trận`}>
                                  <Unlock className="w-3 h-3 text-emerald-600" />
                                  {lvl.count} câu
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-500" title="Không có câu hỏi">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  Khóa
                                </span>
                              )}
                            </td>

                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 2: INTERACTIVE CARD FORMAT */}
          {specViewMode === 'cards' && (
            <div className="space-y-6">
              {matrix.map((row, rowIdx) => {
                const specItem = specification.find(s => s.topic === row.topic && s.unit === row.unit) || specification[rowIdx];
                
                const totalNb = row.part1_nb + row.part2_nb + row.part3_nb + row.part4_nb;
                const totalTh = row.part1_th + row.part2_th + row.part3_th + row.part4_th;
                const totalVd = row.part1_vd + row.part2_vd + row.part3_vd + row.part4_vd;
                const totalVdc = row.part1_vdc + row.part2_vdc + row.part3_vdc + row.part4_vdc;

                return (
                  <div key={row.id || rowIdx} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wide">
                          {rowIdx + 1}. {row.topic}
                        </span>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Đơn vị kiến thức: {row.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold shadow-2xs">
                          Tổng điểm chủ đề: <strong className="text-indigo-700">{row.totalPoints || 0} đ</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Level 1: Nhận biết */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        totalNb > 0 
                          ? 'bg-white border-blue-200 shadow-2xs' 
                          : 'bg-slate-100/60 border-dashed border-slate-300'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-blue-800 flex items-center gap-1.5">
                            {totalNb > 0 ? <Unlock className="w-3.5 h-3.5 text-blue-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                            Mức 1: Nhận biết (NB)
                          </span>
                          {totalNb > 0 ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                              {totalNb} câu (P1: {row.part1_nb}, P2: {row.part2_nb}, P3: {row.part3_nb}, P4: {row.part4_nb})
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">0 câu (Khóa)</span>
                          )}
                        </div>

                        {totalNb > 0 ? (
                          <textarea
                            value={specItem?.learningObjectives?.nb || ''}
                            onChange={(e) => handleUpdateSpecObjective(rowIdx, 'nb', e.target.value)}
                            placeholder="Nhập yêu cầu cần đạt mức Nhận biết cho nội dung này..."
                            rows={3}
                            className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 focus:border-blue-500 rounded-lg focus:outline-hidden leading-relaxed resize-y"
                          />
                        ) : (
                          <p className="text-xs text-slate-400 italic py-2">
                            🔒 Ô ma trận mức Nhận biết đang là 0 câu. Không cần soạn đặc tả cho mức này.
                          </p>
                        )}
                      </div>

                      {/* Level 2: Thông hiểu */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        totalTh > 0 
                          ? 'bg-white border-emerald-200 shadow-2xs' 
                          : 'bg-slate-100/60 border-dashed border-slate-300'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                            {totalTh > 0 ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                            Mức 2: Thông hiểu (TH)
                          </span>
                          {totalTh > 0 ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                              {totalTh} câu (P1: {row.part1_th}, P2: {row.part2_th}, P3: {row.part3_th}, P4: {row.part4_th})
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">0 câu (Khóa)</span>
                          )}
                        </div>

                        {totalTh > 0 ? (
                          <textarea
                            value={specItem?.learningObjectives?.th || ''}
                            onChange={(e) => handleUpdateSpecObjective(rowIdx, 'th', e.target.value)}
                            placeholder="Nhập yêu cầu cần đạt mức Thông hiểu cho nội dung này..."
                            rows={3}
                            className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 focus:border-emerald-500 rounded-lg focus:outline-hidden leading-relaxed resize-y"
                          />
                        ) : (
                          <p className="text-xs text-slate-400 italic py-2">
                            🔒 Ô ma trận mức Thông hiểu đang là 0 câu. Không cần soạn đặc tả cho mức này.
                          </p>
                        )}
                      </div>

                      {/* Level 3: Vận dụng */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        totalVd > 0 
                          ? 'bg-white border-amber-200 shadow-2xs' 
                          : 'bg-slate-100/60 border-dashed border-slate-300'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-amber-800 flex items-center gap-1.5">
                            {totalVd > 0 ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                            Mức 3: Vận dụng (VD)
                          </span>
                          {totalVd > 0 ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                              {totalVd} câu (P1: {row.part1_vd}, P2: {row.part2_vd}, P3: {row.part3_vd}, P4: {row.part4_vd})
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">0 câu (Khóa)</span>
                          )}
                        </div>

                        {totalVd > 0 ? (
                          <textarea
                            value={specItem?.learningObjectives?.vd || ''}
                            onChange={(e) => handleUpdateSpecObjective(rowIdx, 'vd', e.target.value)}
                            placeholder="Nhập yêu cầu cần đạt mức Vận dụng cho nội dung này..."
                            rows={3}
                            className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 focus:border-amber-500 rounded-lg focus:outline-hidden leading-relaxed resize-y"
                          />
                        ) : (
                          <p className="text-xs text-slate-400 italic py-2">
                            🔒 Ô ma trận mức Vận dụng đang là 0 câu. Không cần soạn đặc tả cho mức này.
                          </p>
                        )}
                      </div>

                      {/* Level 4: Vận dụng cao */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        totalVdc > 0 
                          ? 'bg-white border-rose-200 shadow-2xs' 
                          : 'bg-slate-100/60 border-dashed border-slate-300'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-rose-800 flex items-center gap-1.5">
                            {totalVdc > 0 ? <Unlock className="w-3.5 h-3.5 text-rose-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                            Mức 4: Vận dụng cao (VDC)
                          </span>
                          {totalVdc > 0 ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
                              {totalVdc} câu (P1: {row.part1_vdc}, P2: {row.part2_vdc}, P3: {row.part3_vdc}, P4: {row.part4_vdc})
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">0 câu (Khóa)</span>
                          )}
                        </div>

                        {totalVdc > 0 ? (
                          <textarea
                            value={specItem?.learningObjectives?.vdc || ''}
                            onChange={(e) => handleUpdateSpecObjective(rowIdx, 'vdc', e.target.value)}
                            placeholder="Nhập yêu cầu cần đạt mức Vận dụng cao cho nội dung này..."
                            rows={3}
                            className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 focus:border-rose-500 rounded-lg focus:outline-hidden leading-relaxed resize-y"
                          />
                        ) : (
                          <p className="text-xs text-slate-400 italic py-2">
                            🔒 Ô ma trận mức Vận dụng cao đang là 0 câu. Không cần soạn đặc tả cho mức này.
                          </p>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Đã hoàn thành thiết lập ma trận & bản đặc tả. Chuyển sang bước tiếp theo để xem đề thi mẫu & trộn 4 mã đề.
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
