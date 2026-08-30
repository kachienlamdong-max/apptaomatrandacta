import { GradeLevel, SchoolLevel } from '../types';

export interface SubjectInfo {
  id: string;
  name: string;
  level: SchoolLevel;
  grades: GradeLevel[];
  defaultDuration: number;
  hasMathLatex: boolean;
  standardTopics: {
    grade: GradeLevel;
    topics: {
      name: string;
      units: string[];
    }[];
  }[];
}

export const PROVINCES_VIETNAM = [
  "Hà Nội", "TP. Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export const CURRICULUM_SERIES = [
  "Kết nối tri thức với cuộc sống",
  "Cánh Diều",
  "Chân trời sáng tạo",
  "Chương trình GDPT hiện hành"
];

export const EXAM_TYPES = [
  "Kiểm tra thường xuyên (15 phút)",
  "Kiểm tra định kỳ Giữa học kỳ I",
  "Kiểm tra định kỳ Cuối học kỳ I",
  "Kiểm tra định kỳ Giữa học kỳ II",
  "Kiểm tra định kỳ Cuối học kỳ II (Cuối năm)",
  "Khảo sát chất lượng đầu năm / giữa năm",
  "Thi thử Tốt nghiệp THPT Quốc gia (Format 2025)",
  "Thi Tuyển sinh vào Lớp 10 THPT",
  "Đề kiểm tra nâng cao / Ôn luyện Học sinh giỏi"
];

export const SUBJECTS_LIST: SubjectInfo[] = [
  // THPT
  {
    id: 'toan-thpt',
    name: 'Toán học',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 90,
    hasMathLatex: true,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
            units: ['Tính đơn điệu của hàm số', 'Cực trị của hàm số', 'Giá trị lớn nhất và nhỏ nhất của hàm số', 'Đường tiệm cận của đồ thị hàm số', 'Khảo sát và vẽ đồ thị hàm số']
          },
          {
            name: 'Toạ độ trong không gian (Oxyz)',
            units: ['Hệ toạ độ trong không gian', 'Toạ độ của vectơ', 'Biểu thức toạ độ các phép toán vectơ', 'Phương trình mặt phẳng', 'Phương trình đường thẳng', 'Phương trình mặt cầu']
          },
          {
            name: 'Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm',
            units: ['Khoảng biến thiên và khoảng tứ phân vị', 'Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm']
          },
          {
            name: 'Nguyên hàm, tích phân và ứng dụng',
            units: ['Nguyên hàm và tính chất', 'Tích phân', 'Ứng dụng hình học của tích phân']
          },
          {
            name: 'Phương pháp toạ độ và Xác suất có điều kiện',
            units: ['Xác suất có điều kiện', 'Công thức xác suất toàn phần và công thức Bayes']
          }
        ]
      },
      {
        grade: 'Lớp 11',
        topics: [
          {
            name: 'Hàm số lượng giác và phương trình lượng giác',
            units: ['Góc lượng giác', 'Giá trị lượng giác của một góc', 'Các công thức lượng giác', 'Hàm số lượng giác và đồ thị', 'Phương trình lượng giác cơ bản']
          },
          {
            name: 'Dãy số. Cấp số cộng và Cấp số nhân',
            units: ['Dãy số', 'Cấp số cộng', 'Cấp số nhân']
          },
          {
            name: 'Giới hạn. Hàm số liên tục',
            units: ['Giới hạn của dãy số', 'Giới hạn của hàm số', 'Hàm số liên tục']
          },
          {
            name: 'Đường thẳng và mặt phẳng trong không gian',
            units: ['Hai đường thẳng song song', 'Đường thẳng song song với mặt phẳng', 'Hai mặt phẳng song song', 'Quan hệ vuông góc trong không gian']
          }
        ]
      },
      {
        grade: 'Lớp 10',
        topics: [
          {
            name: 'Mệnh đề và Tập hợp',
            units: ['Mệnh đề toán học', 'Tập hợp và các phép toán trên tập hợp']
          },
          {
            name: 'Bất phương trình và Hệ bất phương trình bậc nhất hai ẩn',
            units: ['Bất phương trình bậc nhất hai ẩn', 'Hệ bất phương trình bậc nhất hai ẩn và ứng dụng quy hoạch tuyến tính']
          },
          {
            name: 'Hàm số bậc hai và đồ thị',
            units: ['Hàm số và đồ thị', 'Hàm số bậc hai', 'Dấu của tam thức bậc hai']
          },
          {
            name: 'Vectơ và các phép toán',
            units: ['Khái niệm vectơ', 'Tổng và hiệu hai vectơ', 'Tích của một số với một vectơ', 'Tích vô hướng của hai vectơ']
          }
        ]
      }
    ]
  },
  {
    id: 'vat-li-thpt',
    name: 'Vật lí',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 50,
    hasMathLatex: true,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Vật lí nhiệt',
            units: ['Cấu trúc của chất và sự chuyển thể', 'Nhiệt dung riêng, nhiệt nóng chảy, nhiệt hóa hơi', 'Định luật I của nhiệt động lực học']
          },
          {
            name: 'Khí lí tưởng',
            units: ['Mô hình động học phân tử chất khí', 'Định luật Boyle và định luật Charles', 'Phương trình trạng thái khí lí tưởng']
          },
          {
            name: 'Từ trường',
            units: ['Từ trường và cảm ứng từ', 'Lực từ tác dụng lên đoạn dây dẫn mang dòng điện', 'Hiện tượng cảm ứng điện từ']
          },
          {
            name: 'Vật lí hạt nhân',
            units: ['Cấu tạo hạt nhân và năng lượng liên kết', 'Phóng xạ và an toàn phóng xạ', 'Phản ứng hạt nhân']
          }
        ]
      },
      {
        grade: 'Lớp 11',
        topics: [
          {
            name: 'Dao động',
            units: ['Mô tả dao động điều hòa', 'Phương trình dao động điều hòa', 'Năng lượng trong dao động điều hòa', 'Dao động tắt dần và dao động cưỡng bức']
          },
          {
            name: 'Sóng',
            units: ['Mô tả sóng và các đặc trưng sóng', 'Giao thoa sóng', 'Sóng dừng']
          },
          {
            name: 'Điện trường',
            units: ['Lực tương tác tĩnh điện - Định luật Coulomb', 'Cường độ điện trường', 'Điện thế và thế năng điện trường', 'Tụ điện']
          }
        ]
      },
      {
        grade: 'Lớp 10',
        topics: [
          {
            name: 'Mô tả chuyển động',
            units: ['Độ dịch chuyển và quãng đường', 'Vận tốc và tốc độ', 'Gia tốc và chuyển động biến đổi đều']
          },
          {
            name: 'Lực và chuyển động',
            units: ['Các định luật Newton', 'Trọng lực và lực căng', 'Lực ma sát', 'Lực cản và lực nâng']
          },
          {
            name: 'Năng lượng, công, công suất',
            units: ['Công và công suất', 'Động năng và thế năng', 'Định luật bảo toàn cơ năng']
          }
        ]
      }
    ]
  },
  {
    id: 'hoa-hoc-thpt',
    name: 'Hóa học',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 50,
    hasMathLatex: true,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Ester - Lipid',
            units: ['Ester', 'Lipid và chất béo', 'Xà phòng và chất giặt rửa tổng hợp']
          },
          {
            name: 'Carbohydrate',
            units: ['Glucose và Fructose', 'Saccharose và Maltose', 'Tinh bột và Cellulose']
          },
          {
            name: 'Hợp chất chứa Nitrogen',
            units: ['Amine', 'Amino acid', 'Peptide và Protein']
          },
          {
            name: 'Polymer',
            units: ['Đại cương về polymer', 'Vật liệu polymer (Chất dẻo, tơ, cao su)']
          },
          {
            name: 'Hóa học vô cơ và Kim loại',
            units: ['Đại cương kim loại và pin điện hóa', 'Kim loại chuyển tiếp dãy thứ nhất và phức chất']
          }
        ]
      },
      {
        grade: 'Lớp 11',
        topics: [
          {
            name: 'Cân bằng hóa học',
            units: ['Khái niệm thuận nghịch và trạng thái cân bằng', 'Hằng số cân bằng Kc', 'Sự điện li và pH']
          },
          {
            name: 'Nitrogen và Sulfur',
            units: ['Đơn chất và hợp chất của Nitrogen', 'Ammonia và muối ammonium', 'Sulfur và Sulfur dioxide', 'Sulfuric acid và muối sulfate']
          },
          {
            name: 'Hóa học hữu cơ',
            units: ['Đại cương hóa học hữu cơ', 'Hydrocarbon no (Alkane)', 'Hydrocarbon không no (Alkene, Alkyne)', 'Arene', 'Dẫn xuất Halogen - Alcohol - Phenol']
          }
        ]
      },
      {
        grade: 'Lớp 10',
        topics: [
          {
            name: 'Cấu tạo nguyên tử',
            units: ['Thành phần nguyên tử', 'Hạt nhân nguyên tử và nguyên tố hóa học', 'Cấu hình electron nguyên tử']
          },
          {
            name: 'Bảng tuần hoàn các nguyên tố hóa học',
            units: ['Cấu tạo bảng tuần hoàn', 'Sự biến đổi tuần hoàn tính chất', 'Định luật tuần hoàn']
          },
          {
            name: 'Liên kết hóa học',
            units: ['Quy tắc Octet', 'Liên kết ion', 'Liên kết cộng hóa trị', 'Liên kết hydrogen và tương tác van der Waals']
          },
          {
            name: 'Phản ứng oxi hóa - khử',
            units: ['Số oxi hóa', 'Phản ứng oxi hóa - khử và cân bằng phương trình']
          }
        ]
      }
    ]
  },
  {
    id: 'sinh-hoc-thpt',
    name: 'Sinh học',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 50,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Di truyền phân tử và Di truyền nhiễm sắc thể',
            units: ['Gen, mã di truyền và quá trình tái bản DNA', 'Phiên mã và dịch mã', 'Điều hòa biểu hiện gen', 'Đột biến gen và Đột biến NST']
          },
          {
            name: 'Di truyền quần thể và Tiến hóa',
            units: ['Cấu trúc di truyền của quần thể', 'Học thuyết tiến hóa tổng hợp hiện đại', 'Các nhân tố tiến hóa']
          },
          {
            name: 'Sinh thái học và Môi trường',
            units: ['Quần thể sinh vật', 'Quần xã sinh vật và hệ sinh thái', 'Chu trình sinh địa hóa và bảo vệ sinh quyển']
          }
        ]
      }
    ]
  },
  {
    id: 'ngu-van-thpt',
    name: 'Ngữ văn',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 90,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Đọc hiểu văn bản Văn học',
            units: ['Truyện ngắn và tiểu thuyết hiện đại', 'Thơ hiện đại', 'Văn bản kịch và phóng sự']
          },
          {
            name: 'Đọc hiểu văn bản Nghị luận & Thông tin',
            units: ['Nghị luận xã hội và nghị luận văn học', 'Văn bản thông tin đa phương thức']
          },
          {
            name: 'Thực hành Tiếng Việt',
            units: ['Biện pháp tu từ, ngữ pháp và liên kết câu', 'Lỗi dùng từ và phong cách ngôn ngữ']
          },
          {
            name: 'Viết văn bản',
            units: ['Đoạn văn nghị luận xã hội (khoảng 200 chữ)', 'Bài văn nghị luận văn học / so sánh tác phẩm']
          }
        ]
      }
    ]
  },
  {
    id: 'tieng-anh-thpt',
    name: 'Tiếng Anh',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 50,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Phonetics & Pronunciation',
            units: ['Pronunciation of -ed and -s/es', 'Word stress on 2-syllable and 3-syllable words']
          },
          {
            name: 'Grammar & Vocabulary',
            units: ['Tenses and Verb forms', 'Conditional sentences and Wish', 'Relative clauses and Participles', 'Collocations, Phrasal verbs, Idioms']
          },
          {
            name: 'Reading Comprehension',
            units: ['Cloze text / Guided gap fill', 'Reading comprehension (Main idea, Reference, Detail, Inference)']
          },
          {
            name: 'Communication & Sentence Transformation',
            units: ['Everyday conversational exchanges', 'Sentence transformation / Error identification']
          }
        ]
      }
    ]
  },
  {
    id: 'lich-su-thpt',
    name: 'Lịch sử',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 50,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Thế giới trong và sau Chiến tranh Lạnh',
            units: ['Trật tự thế giới hai cực I-an-ta', 'Xu thế toàn cầu hóa và quan hệ quốc tế']
          },
          {
            name: 'Lịch sử Việt Nam giai đoạn 1919 - 1975',
            units: ['Phong trào dân tộc dân chủ 1919 - 1930', 'Cách mạng tháng Tám 1945', 'Kháng chiến chống thực dân Pháp (1945 - 1954)', 'Kháng chiến chống Mỹ cứu nước (1954 - 1975)']
          },
          {
            name: 'Công cuộc Đổi mới ở Việt Nam từ 1986 đến nay',
            units: ['Đường lối đổi mới kinh tế - xã hội', 'Hội nhập quốc tế và thành tựu đối ngoại']
          }
        ]
      }
    ]
  },
  {
    id: 'dia-li-thpt',
    name: 'Địa lí',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 50,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Địa lí tự nhiên Việt Nam',
            units: [
              'Vị trí địa lí và phạm vi lãnh thổ (Điểm cực, vùng biển, 34 đơn vị hành chính cấp tỉnh)',
              'Thiên nhiên nhiệt đới ẩm gió mùa (Khí hậu, địa hình xâm thực - bồi tụ, sông ngòi, thổ nhưỡng)',
              'Sự phân hoá đa dạng của thiên nhiên (Bắc - Nam, Đông - Tây, theo độ cao, các miền địa lí)',
              'Sử dụng hợp lí tài nguyên thiên nhiên và bảo vệ môi trường'
            ]
          },
          {
            name: 'Địa lí dân cư Việt Nam',
            units: [
              'Dân số Việt Nam (Quy mô, gia tăng, cơ cấu dân số vàng và già hoá, phân bố dân cư)',
              'Lao động và việc làm (Đặc điểm nguồn lao động, chất lượng, chuyển dịch cơ cấu việc làm)',
              'Đô thị hoá ở Việt Nam (Đặc điểm, ảnh hưởng tích cực và tiêu cực, mạng lưới đô thị)'
            ]
          },
          {
            name: 'Địa lí các ngành kinh tế',
            units: [
              'Chuyển dịch cơ cấu kinh tế (Theo ngành, thành phần kinh tế và lãnh thổ)',
              'Vấn đề phát triển ngành nông nghiệp (Trồng trọt lúa, cây công nghiệp, cây ăn quả, chăn nuôi)',
              'Vấn đề phát triển ngành lâm nghiệp và thủy sản',
              'Địa lí ngành công nghiệp và tổ chức lãnh thổ công nghiệp',
              'Địa lí các ngành dịch vụ (Giao thông vận tải, bưu chính viễn thông, thương mại, du lịch)'
            ]
          },
          {
            name: 'Địa lí các vùng kinh tế - xã hội',
            units: [
              'Vùng Trung du và miền núi phía Bắc',
              'Vùng Đồng bằng sông Hồng',
              'Vùng Bắc Trung Bộ',
              'Vùng Duyên hải Nam Trung Bộ và Tây Nguyên (Nam Trung Bộ)',
              'Vùng Đông Nam Bộ',
              'Vùng Đồng bằng sông Cửu Long',
              'Phát triển kinh tế biển và đảm bảo quốc phòng an ninh vùng Biển Đông'
            ]
          },
          {
            name: 'Chuyên đề học tập Địa lí 12',
            units: [
              'Chuyên đề 12.1: Thiên tai và biện pháp phòng chống (Bão, lũ lụt, hạn hán, sạt lở đất, xâm nhập mặn)',
              'Chuyên đề 12.2: Phát triển vùng kinh tế và các vùng kinh tế trọng điểm',
              'Chuyên đề 12.3: Phát triển làng nghề truyền thống ở Việt Nam'
            ]
          }
        ]
      },
      {
        grade: 'Lớp 11',
        topics: [
          {
            name: 'Một số vấn đề kinh tế - xã hội thế giới',
            units: [
              'Sự khác biệt về trình độ phát triển KTXH của các nhóm nước (GNI/người, cơ cấu GDP, HDI)',
              'Toàn cầu hoá và khu vực hoá kinh tế',
              'Một số tổ chức quốc tế và khu vực (UN, WTO, IMF, APEC) và An ninh toàn cầu',
              'Nền kinh tế tri thức'
            ]
          },
          {
            name: 'Địa lí khu vực Mỹ La-tinh',
            units: [
              'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Mỹ La-tinh',
              'Kinh tế khu vực Mỹ La-tinh và vấn đề phát triển KTXH Cộng hoà Liên bang Bra-xin'
            ]
          },
          {
            name: 'Liên minh Châu Âu (EU)',
            units: [
              'Quy mô, mục tiêu, thể chế hoạt động và vị thế kinh tế của EU trên thế giới',
              'Hợp tác và liên kết kinh tế trong EU (Thị trường chung, đồng Euro, chuyển đổi số và xanh)'
            ]
          },
          {
            name: 'Khu vực Đông Nam Á (ASEAN)',
            units: [
              'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á',
              'Kinh tế khu vực Đông Nam Á và Hiệp hội các quốc gia Đông Nam Á (ASEAN)'
            ]
          },
          {
            name: 'Địa lí một số quốc gia lớn trên thế giới',
            units: [
              'Hợp chúng quốc Hoa Kỳ',
              'Liên bang Nga',
              'Nhật Bản',
              'Cộng hoà Nhân dân Trung Hoa',
              'Ô-xtrây-li-a và Cộng hoà Nam Phi'
            ]
          },
          {
            name: 'Chuyên đề học tập Địa lí 11',
            units: [
              'Chuyên đề 11.1: Một số vấn đề về khu vực Đông Nam Á (Ủy hội sông Mê Công MRC, Hợp tác Biển Đông)',
              'Chuyên đề 11.2: Một số vấn đề về du lịch thế giới và định hướng nghề nghiệp',
              'Chuyên đề 11.3: Cuộc cách mạng công nghiệp lần thứ tư (4.0)'
            ]
          }
        ]
      },
      {
        grade: 'Lớp 10',
        topics: [
          {
            name: 'Sử dụng bản đồ và phương pháp biểu hiện',
            units: [
              'Môn Địa lí với định hướng nghề nghiệp',
              'Một số phương pháp biểu hiện các đối tượng địa lí trên bản đồ (Kí hiệu, chuyển động, bản đồ - biểu đồ, chấm điểm, khoanh vùng)',
              'Sử dụng bản đồ trong học tập và đời sống, ứng dụng GPS và bản đồ số'
            ]
          },
          {
            name: 'Địa lí tự nhiên - Trái Đất và Thạch quyển',
            units: [
              'Sự hình thành Trái Đất, vỏ Trái Đất và vật liệu cấu tạo vỏ Trái Đất (đá macma, trầm tích, biến chất)',
              'Hệ quả địa lí các chuyển động của Trái Đất (Hiện tượng ngày đêm luân phiên, giờ trên Trái Đất, mùa, ngày đêm dài ngắn theo mùa)',
              'Thạch quyển và thuyết kiến tạo mảng (các mảng xô vào nhau hoặc tách xa nhau)',
              'Tác động của nội lực và ngoại lực đến địa hình bề mặt Trái Đất'
            ]
          },
          {
            name: 'Địa lí tự nhiên - Khí quyển, Thủy quyển và Sinh quyển',
            units: [
              'Khí quyển, các yếu tố khí hậu (Nhiệt độ không khí, khí áp, các đới gió chính, nguyên nhân và phân bố mưa)',
              'Đọc bản đồ các đới và các kiểu khí hậu trên Trái Đất',
              'Thủy quyển, nước trên lục địa, chế độ nước sông và đại dương',
              'Thổ nhưỡng quyển và Sinh quyển, các quy luật địa lí (Quy luật thống nhất và hoàn chỉnh, quy luật địa đới và phi địa đới)'
            ]
          },
          {
            name: 'Địa lí kinh tế - xã hội đại cương',
            units: [
              'Địa lí dân cư (Quy mô dân số, gia tăng dân số, cơ cấu dân số, phân bố dân cư và đô thị hoá)',
              'Các nguồn lực phát triển kinh tế, cơ cấu kinh tế và một số chỉ tiêu GDP, GNI',
              'Địa lí ngành nông nghiệp, lâm nghiệp, thuỷ sản',
              'Địa lí ngành công nghiệp và dịch vụ',
              'Môi trường và phát triển bền vững, tăng trưởng xanh'
            ]
          },
          {
            name: 'Chuyên đề học tập Địa lí 10',
            units: [
              'Chuyên đề 10.1: Biến đổi khí hậu (Khái niệm, biểu hiện tăng nhiệt độ, biến động mưa, mực nước biển dâng; nguyên nhân tự nhiên và con người; tác động và giải pháp ứng phó)',
              'Chuyên đề 10.2: Đô thị hoá ở các nước phát triển và đang phát triển',
              'Chuyên đề 10.3: Phương pháp viết báo cáo địa lí'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tin-hoc-thpt',
    name: 'Tin học',
    level: 'THPT',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    defaultDuration: 45,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 12',
        topics: [
          {
            name: 'Mạng máy tính và Internet',
            units: ['Kiến trúc mạng và giao thức truyền thông', 'Dịch vụ mạng và an toàn thông tin']
          },
          {
            name: 'Cơ sở dữ liệu và Hệ quản trị CSDL',
            units: ['Mô hình dữ liệu quan hệ', 'Truy vấn dữ liệu SQL', 'Thiết kế CSDL trường học/kinh doanh']
          },
          {
            name: 'Trí tuệ nhân tạo và Ứng dụng',
            units: ['Tổng quan về AI', 'Tác động của AI đối với xã hội và đạo đức số']
          }
        ]
      }
    ]
  },
  // THCS
  {
    id: 'toan-thcs',
    name: 'Toán (THCS)',
    level: 'THCS',
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
    defaultDuration: 90,
    hasMathLatex: true,
    standardTopics: [
      {
        grade: 'Lớp 9',
        topics: [
          {
            name: 'Phương trình và Hệ hai phương trình bậc nhất hai ẩn',
            units: ['Khái niệm phương trình bậc nhất hai ẩn', 'Giải hệ phương trình bằng phương pháp thế và cộng đại số', 'Giải bài toán bằng cách lập hệ phương trình']
          },
          {
            name: 'Căn bậc hai và Căn bậc ba',
            units: ['Căn bậc hai số học và hằng đẳng thức', 'Liên hệ giữa phép nhân, phép chia và phép khai phương', 'Rút gọn biểu thức chứa căn']
          },
          {
            name: 'Hệ thức lượng trong tam giác vuông',
            units: ['Một số hệ thức về cạnh và đường cao', 'Tỉ số lượng giác của góc nhọn', 'Ứng dụng thực tế']
          },
          {
            name: 'Đường tròn và Góc với đường tròn',
            units: ['Sự xác định đường tròn', 'Đường kính và dây cung', 'Tiếp tuyến của đường tròn', 'Góc nội tiếp và Tứ giác nội tiếp']
          }
        ]
      },
      {
        grade: 'Lớp 8',
        topics: [
          {
            name: 'Đa thức và Hằng đẳng thức đáng nhớ',
            units: ['Đơn thức và đa thức nhiều biến', '7 hằng đẳng thức đáng nhớ', 'Phân tích đa thức thành nhân tử']
          },
          {
            name: 'Phân thức đại số',
            units: ['Khái niệm phân thức', 'Cộng trừ nhân chia phân thức']
          },
          {
            name: 'Tứ giác',
            units: ['Hình thang cân', 'Hình bình hành', 'Hình chữ nhật', 'Hình thoi', 'Hình vuông']
          }
        ]
      },
      {
        grade: 'Lớp 7',
        topics: [
          {
            name: 'Số hữu tỉ và Số thực',
            units: ['Tập hợp số hữu tỉ và các phép toán', 'Số vô tỉ và Căn bậc hai số học', 'Số thực']
          },
          {
            name: 'Góc và Đường thẳng song song',
            units: ['Hai góc đối đỉnh', 'Góc tạo bởi một đường thẳng cắt hai đường thẳng', 'Hai đường thẳng song song']
          },
          {
            name: 'Tam giác bằng nhau',
            units: ['Trường hợp bằng nhau c-c-c, c-g-c, g-c-g', 'Tam giác cân và Định lí Pythagore']
          }
        ]
      },
      {
        grade: 'Lớp 6',
        topics: [
          {
            name: 'Số tự nhiên',
            units: ['Tập hợp các số tự nhiên', 'Các phép toán trên tập hợp số tự nhiên', 'Dấu hiệu chia hết', 'Ước và bội, ƯCLN, BCNN']
          },
          {
            name: 'Số nguyên',
            units: ['Tập hợp số nguyên', 'Phép cộng và phép trừ số nguyên', 'Quy tắc dấu ngoặc', 'Phép nhân số nguyên']
          },
          {
            name: 'Hình học phẳng cơ bản',
            units: ['Điểm, đường thẳng, tia', 'Đoạn thẳng và độ dài đoạn thẳng', 'Góc']
          }
        ]
      }
    ]
  },
  {
    id: 'khtn-thcs',
    name: 'Khoa học tự nhiên (KHTN)',
    level: 'THCS',
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
    defaultDuration: 60,
    hasMathLatex: true,
    standardTopics: [
      {
        grade: 'Lớp 8',
        topics: [
          {
            name: 'Phản ứng hóa học và Định luật bảo toàn khối lượng',
            units: ['Biến đổi vật lí và biến đổi hóa học', 'Phản ứng hóa học', 'Mol và tỉ khối chất khí', 'Nồng độ dung dịch']
          },
          {
            name: 'Acid - Base - Oxide - Muối',
            units: ['Acid và pH', 'Base', 'Oxide', 'Muối và phân bón hóa học']
          },
          {
            name: 'Lực và Áp suất',
            units: ['Áp suất chất rắn', 'Áp suất chất lỏng và lực đẩy Archimedes', 'Áp suất khí quyển']
          },
          {
            name: 'Sinh học cơ thể người',
            units: ['Hệ vận động', 'Hệ tuần hoàn', 'Hệ hô hấp', 'Hệ tiêu hóa']
          }
        ]
      }
    ]
  },
  {
    id: 'ngu-van-thcs',
    name: 'Ngữ văn (THCS)',
    level: 'THCS',
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
    defaultDuration: 90,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 9',
        topics: [
          {
            name: 'Đọc hiểu văn bản Văn học',
            units: ['Thơ hiện đại Việt Nam', 'Truyện ngắn hiện đại', 'Văn bản kịch và nghị luận']
          },
          {
            name: 'Tiếng Việt',
            units: ['Khởi ngữ và thành phần biệt lập', 'Liên kết câu và đoạn văn', 'Nghĩa tường minh và hàm ý']
          },
          {
            name: 'Tập làm văn',
            units: ['Nghị luận về một sự việc, hiện tượng đời sống', 'Nghị luận về một tác phẩm truyện / đoạn thơ']
          }
        ]
      }
    ]
  },
  // TIỂU HỌC
  {
    id: 'toan-tieu-hoc',
    name: 'Toán (Tiểu học)',
    level: 'Tiểu học',
    grades: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
    defaultDuration: 40,
    hasMathLatex: true,
    standardTopics: [
      {
        grade: 'Lớp 5',
        topics: [
          {
            name: 'Phân số và Số thập phân',
            units: ['Ôn tập phân số và hỗn số', 'Khái niệm số thập phân', 'Cộng, trừ, nhân, chia số thập phân']
          },
          {
            name: 'Hình học và Đo lường',
            units: ['Hình tam giác và diện tích', 'Hình thang và diện tích', 'Hình tròn và chu vi, diện tích', 'Hình hộp chữ nhật và hình lập phương']
          },
          {
            name: 'Số đo thời gian và Toán chuyển động đều',
            units: ['Bảng đơn vị đo thời gian', 'Vận tốc, quãng đường, thời gian', 'Bài toán hai chuyển động ngược chiều / cùng chiều']
          }
        ]
      },
      {
        grade: 'Lớp 4',
        topics: [
          {
            name: 'Số tự nhiên đến lớp triệu',
            units: ['Đọc, viết, so sánh số tự nhiên', 'Các phép tính cộng, trừ, nhân, chia số tự nhiên']
          },
          {
            name: 'Phân số và các phép tính',
            units: ['Khái niệm phân số, phân số bằng nhau', 'Rút gọn và quy đồng', 'Cộng, trừ, nhân, chia phân số']
          },
          {
            name: 'Hình học và Thống kê',
            units: ['Góc nhọn, góc tù, góc bẹt', 'Hai đường thẳng vuông góc, song song', 'Hình bình hành, hình thoi', 'Biểu đồ cột và số trung bình cộng']
          }
        ]
      }
    ]
  },
  {
    id: 'tieng-viet-tieu-hoc',
    name: 'Tiếng Việt (Tiểu học)',
    level: 'Tiểu học',
    grades: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
    defaultDuration: 40,
    hasMathLatex: false,
    standardTopics: [
      {
        grade: 'Lớp 5',
        topics: [
          {
            name: 'Đọc hiểu & Luyện từ và câu',
            units: ['Đọc thầm và trả lời câu hỏi', 'Từ đồng nghĩa, từ trái nghĩa, từ đồng âm, từ nhiều nghĩa', 'Đại từ và quan hệ từ', 'Câu ghép và cách nối các vế câu ghép']
          },
          {
            name: 'Tập làm văn',
            units: ['Tả cảnh thiên nhiên / cảnh sinh hoạt', 'Tả người', 'Viết đoạn văn bày tỏ tình cảm, cảm xúc']
          }
        ]
      }
    ]
  }
];
