import { MultipleChoiceOption, TrueFalseSubItem } from '../../types';

export interface RawMCQ {
  grade?: '10' | '11' | '12' | string;
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  options: MultipleChoiceOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface RawTF {
  grade?: '10' | '11' | '12' | string;
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  items: TrueFalseSubItem[];
  explanation: string;
}

export interface RawShort {
  grade?: '10' | '11' | '12' | string;
  topicKeywords?: string[];
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  key: string;
  explanation: string;
}

export interface RawEssay {
  grade?: '10' | '11' | '12' | string;
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
