import { MultipleChoiceOption, TrueFalseSubItem } from '../../types';

export interface RawMCQ {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  options: MultipleChoiceOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface RawTF {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  items: TrueFalseSubItem[];
  explanation: string;
}

export interface RawShort {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  key: string;
  explanation: string;
}

export interface RawEssay {
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  essayRubric: string;
  explanation: string;
}

export interface SubjectQuestionBank {
  mcq: RawMCQ[];
  tf: RawTF[];
  short: RawShort[];
  essay: RawEssay[];
}
