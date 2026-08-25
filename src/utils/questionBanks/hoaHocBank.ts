import { SubjectQuestionBank } from './bankTypes';

export const HOA_HOC_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['este', 'lipit'],
      level: 'Nhận biết',
      content: 'Este ethyl acetate có công thức phân tử là:',
      options: [
        { key: 'A', content: '$\\text{CH}_3\\text{COOC}_2\\text{H}_5$' },
        { key: 'B', content: '$\\text{HCOOC}_2\\text{H}_5$' },
        { key: 'C', content: '$\\text{CH}_3\\text{COOCH}_3$' },
        { key: 'D', content: '$\\text{C}_2\\text{H}_5\\text{COOCH}_3$' }
      ],
      correctOption: 'A',
      explanation: 'Ethyl acetate là este tạo bởi axit axetic và ancol etylic: $\\text{CH}_3\\text{COOC}_2\\text{H}_5$.'
    },
    {
      topicKeywords: ['cacbohidrat', 'glucozo'],
      level: 'Nhận biết',
      content: 'Chất nào sau đây thuộc loại monosaccharide?',
      options: [
        { key: 'A', content: 'Glucose' },
        { key: 'B', content: 'Saccharose' },
        { key: 'C', content: 'Tinh bột' },
        { key: 'D', content: 'Cellulose' }
      ],
      correctOption: 'A',
      explanation: 'Glucose và Fructose là các monosaccharide (đường đơn).'
    },
    {
      topicKeywords: ['amin', 'amino axit'],
      level: 'Thông hiểu',
      content: 'Dung dịch chất nào sau đây làm quỳ tím chuyển sang màu hồng nhạt?',
      options: [
        { key: 'A', content: 'Axit glutamic' },
        { key: 'B', content: 'Lysine' },
        { key: 'C', content: 'Glycine' },
        { key: 'D', content: 'Alanine' }
      ],
      correctOption: 'A',
      explanation: 'Axit glutamic có 2 nhóm -COOH và 1 nhóm -NH2 nên dung dịch có tính axit, làm đổi màu chỉ thị sang hồng/đỏ.'
    },
    {
      topicKeywords: ['polime', 'vật liệu'],
      level: 'Thông hiểu',
      content: 'Poly(vinyl chloride) (PVC) được điều chế trực tiếp từ monomer nào sau đây?',
      options: [
        { key: 'A', content: '$\\text{CH}_2=\\text{CH}-\\text{Cl}$' },
        { key: 'B', content: '$\\text{CH}_2=\\text{CH}_2$' },
        { key: 'C', content: '$\\text{CH}_2=\\text{CH}-\\text{CH}_3$' },
        { key: 'D', content: '$\\text{CF}_2=\\text{CF}_2$' }
      ],
      correctOption: 'A',
      explanation: 'Trùng hợp vinyl clorua $\\text{CH}_2=\\text{CH}-\\text{Cl}$ thu được poly(vinyl chloride).'
    }
  ],
  tf: [
    {
      topicKeywords: ['este', 'xà phòng hoá'],
      level: 'Vận dụng',
      content: 'Cho $8,8\\text{ g}$ ethyl acetate tác dụng hoàn toàn với $100\\text{ mL}$ dung dịch $\\text{NaOH } 1,5\\text{M}$, đun nóng. Sau phản ứng cô cạn dung dịch thu được chất rắn khan. Xét tính đúng/sai của các mệnh đề:',
      items: [
        { key: 'a', statement: 'Số mol ethyl acetate ban đầu bằng $0,1\\text{ mol}$.', isCorrect: true, explanation: 'Đúng (Mức Biết): $n = \\frac{8,8}{88} = 0,1\\text{ mol}$.' },
        { key: 'b', statement: 'Phản ứng thủy phân este trong môi trường kiềm là phản ứng thuận nghịch hai chiều.', isCorrect: false, explanation: 'Sai (Mức Hiểu): Phản ứng xà phòng hóa este là phản ứng một chiều không thuận nghịch.' },
        { key: 'c', statement: 'Dung dịch $\\text{NaOH}$ dùng trong phản ứng trên bị dư $0,05\\text{ mol}$.', isCorrect: true, explanation: 'Đúng (Mức Vận dụng): $n_{\\text{NaOH ban đầu}} = 0,15\\text{ mol} \\implies n_{\\text{dư}} = 0,15 - 0,1 = 0,05\\text{ mol}$.' },
        { key: 'd', statement: 'Khối lượng chất rắn khan thu được sau khi cô cạn bằng $8,2\\text{ g}$.', isCorrect: false, explanation: 'Sai (Mức Vận dụng): Chất rắn gồm $\\text{CH}_3\\text{COONa } (0,1 \\times 82 = 8,2\\text{g})$ và $\\text{NaOH dư } (0,05 \\times 40 = 2,0\\text{g}) \\implies m = 10,2\\text{ g}$.' }
      ],
      explanation: 'Mệnh đề a, c là ĐÚNG; b, d là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['mol', 'tính toán hóa học'],
      level: 'Thông hiểu',
      content: 'Đốt cháy hoàn toàn $0,1\\text{ mol}$ một hydrocarbon mạch hở $X$ thu được $0,2\\text{ mol } \\text{CO}_2$. Số nguyên tử carbon trong phân tử $X$ là bao nhiêu? Khi trả lời, chỉ ghi số.',
      key: '2',
      explanation: 'Số C = $\\frac{n_{\\text{CO}_2}}{n_X} = \\frac{0,2}{0,1} = 2$.'
    },
    {
      topicKeywords: ['hiệu suất', 'hóa học'],
      level: 'Vận dụng',
      content: 'Lên men $180\\text{ g}$ glucose thu được $46\\text{ g}$ ethyl alcohol $\\text{C}_2\\text{H}_5\\text{OH}$. Tính hiệu suất của phản ứng lên men (đơn vị: %). Khi trả lời, chỉ ghi số.',
      key: '50',
      explanation: '$n_{\\text{glucose}} = 1\\text{ mol} \\implies n_{\\text{etanol LT}} = 2\\text{ mol } (92\\text{g})$. Hiệu suất $H = \\frac{46}{92} \\times 100\\% = 50\\%$.'
    }
  ],
  essay: [
    {
      topicKeywords: ['chuỗi phản ứng', 'hữu cơ'],
      level: 'Vận dụng cao',
      content: 'Viết phương trình hóa học thực hiện sơ đồ chuyển hóa sau (ghi rõ điều kiện nếu có):\n$\\text{Tinh bột} \\xrightarrow{(1)} \\text{Glucose} \\xrightarrow{(2)} \\text{Ethanol} \\xrightarrow{(3)} \\text{Acetic acid} \\xrightarrow{(4)} \\text{Ethyl acetate}$.',
      essayRubric: 'Ý a (1.0đ): Viết đúng 2 phương trình (1) và (2) kèm chất xúc tác enzim hoặc axit.\nÝ b (1.0đ): Viết đúng 2 phương trình (3) lên men giấm và (4) phản ứng este hóa với axit sunfuric đặc nóng.',
      explanation: 'Sơ đồ chuyển hóa hữu cơ từ tinh bột đến este ethyl acetate.'
    }
  ]
};
