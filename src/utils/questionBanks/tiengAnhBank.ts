import { SubjectQuestionBank } from './bankTypes';

export const TIENG_ANH_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['ngữ pháp', 'tenses', 'grammar'],
      level: 'Nhận biết',
      content: 'By the time the teacher entered the classroom, all the students ________ their assignments.',
      options: [
        { key: 'A', content: 'had finished' },
        { key: 'B', content: 'have finished' },
        { key: 'C', content: 'finish' },
        { key: 'D', content: 'are finishing' }
      ],
      correctOption: 'A',
      explanation: 'Hành động hoàn thành trước một thời điểm trong quá khứ ("By the time... entered") chia quá khứ hoàn thành (had finished).'
    },
    {
      topicKeywords: ['từ vựng', 'vocabulary', 'collocation'],
      level: 'Thông hiểu',
      content: 'Green energy technologies play a crucial role in reducing carbon ________ and protecting the environment.',
      options: [
        { key: 'A', content: 'emissions' },
        { key: 'B', content: 'absorptions' },
        { key: 'C', content: 'creations' },
        { key: 'D', content: 'expansions' }
      ],
      correctOption: 'A',
      explanation: 'Cụm từ cố định: "carbon emissions" (khí thải carbon).'
    },
    {
      topicKeywords: ['mệnh đề quan hệ', 'relative clause'],
      level: 'Nhận biết',
      content: 'The scientist ________ discovery revolutionized modern medicine received the Nobel Prize.',
      options: [
        { key: 'A', content: 'whose' },
        { key: 'B', content: 'which' },
        { key: 'C', content: 'whom' },
        { key: 'D', content: 'who' }
      ],
      correctOption: 'A',
      explanation: '"whose discovery" chỉ sở hữu của nhà khoa học.'
    },
    {
      topicKeywords: ['giao tiếp', 'communication'],
      level: 'Thông hiểu',
      content: 'Mark: "Would you mind helping me with this suitcase?" - Sarah: "________"',
      options: [
        { key: 'A', content: 'Not at all. I would be happy to help.' },
        { key: 'B', content: 'Yes, I would.' },
        { key: 'C', content: 'No, thanks.' },
        { key: 'D', content: 'Never mind.' }
      ],
      correctOption: 'A',
      explanation: 'Trả lời đồng ý lịch sự cho câu hỏi "Would you mind...?": "Not at all / No, not at all".'
    }
  ],
  tf: [
    {
      topicKeywords: ['reading', 'comprehension'],
      level: 'Vận dụng',
      content: 'Read the following passage and decide whether the statements are TRUE or FALSE:\n"Artificial Intelligence (AI) is transforming healthcare by improving diagnostics and treatment personalization. AI algorithms can analyze thousands of medical images in seconds, detecting early signs of diseases more accurately than human doctors in certain cases. However, ethical considerations, such as data privacy and algorithm bias, remain significant challenges."\n(Source: Medical Science Review, 2024)',
      items: [
        { key: 'a', statement: 'AI is currently utilized in healthcare to enhance personalized treatments and diagnostic accuracy.', isCorrect: true, explanation: 'True (Mức Biết): The passage states AI improves diagnostics and treatment personalization.' },
        { key: 'b', statement: 'According to the text, AI analysis of medical images takes several hours for each patient.', isCorrect: false, explanation: 'False (Mức Hiểu): The passage states AI can analyze thousands of images in seconds.' },
        { key: 'c', statement: 'Data privacy and algorithmic bias are identified as major ethical concerns regarding AI in healthcare.', isCorrect: true, explanation: 'True (Mức Vận dụng): Explicitly mentioned as significant challenges.' },
        { key: 'd', statement: 'The author suggests that human doctors should be completely replaced by AI machines in the future.', isCorrect: false, explanation: 'False (Mức Vận dụng cao): The passage does not recommend complete replacement, but highlights both benefits and challenges.' }
      ],
      explanation: 'Statements a, c are TRUE; b, d are FALSE.'
    }
  ],
  short: [
    {
      topicKeywords: ['word form', 'grammar'],
      level: 'Thông hiểu',
      content: 'How many letters are in the correct antonym of the word "INCREASE" that starts with the letter "D"? (The word is "DECREASE"). When answering, write only the number of letters (8).',
      key: '8',
      explanation: 'DECREASE has 8 letters: D-E-C-R-E-A-S-E.'
    }
  ],
  essay: [
    {
      topicKeywords: ['writing', 'essay'],
      level: 'Vận dụng cao',
      content: 'Write an opinion paragraph (about 150 - 180 words) discussing whether high school students should be allowed to use smartphones in class for learning purposes.',
      essayRubric: 'Ý a (1.0đ): Clear topic sentence stating the student\'s viewpoint with 2 main supporting arguments.\nÝ b (1.0đ): Detailed explanations and concrete examples demonstrating educational benefits or management solutions, with good vocabulary and accurate grammar.',
      explanation: 'Writing task focusing on coherence, relevant supporting details, and grammatical accuracy.'
    }
  ]
};
