import { SubjectQuestionBank } from './bankTypes';

export const DIA_LI_BANK: SubjectQuestionBank = {
  mcq: [
    // =========================================================================
    // ĐỊA LÍ 10 & CHUYÊN ĐỀ HỌC TẬP ĐỊA LÍ 10
    // =========================================================================
    {
      topicKeywords: ['phương pháp', 'kí hiệu', 'bản đồ', 'đối tượng'],
      level: 'Nhận biết',
      content: 'Để thể hiện các đối tượng địa lí phân bố theo những điểm cụ thể như các mỏ khoáng sản, các nhà máy thuỷ điện, trung tâm công nghiệp trên bản đồ, người ta thường sử dụng phương pháp nào sau đây?',
      options: [
        { key: 'A', content: 'Phương pháp kí hiệu.' },
        { key: 'B', content: 'Phương pháp kí hiệu đường chuyển động.' },
        { key: 'C', content: 'Phương pháp bản đồ - biểu đồ.' },
        { key: 'D', content: 'Phương pháp khoanh vùng.' }
      ],
      correctOption: 'A',
      explanation: 'Phương pháp kí hiệu dùng để biểu hiện các đối tượng địa lí phân bố theo điểm cụ thể hoặc tập trung trên diện tích nhỏ mà không thể biểu hiện theo tỉ lệ bản đồ (mỏ khoáng sản, nhà máy, trường học, điểm dân cư...).'
    },
    {
      topicKeywords: ['đường chuyển động', 'gió', 'bão', 'bản đồ'],
      level: 'Nhận biết',
      content: 'Phương pháp kí hiệu đường chuyển động trên bản đồ thường được sử dụng để biểu hiện đối tượng hoặc hiện tượng nào sau đây?',
      options: [
        { key: 'A', content: 'Sự phân bố các vành đai động đất và núi lửa trên thế giới.' },
        { key: 'B', content: 'Sự di chuyển của các luồng gió, hướng bão và dòng biển.' },
        { key: 'C', content: 'Sản lượng lúa của các tỉnh thành trong cả nước.' },
        { key: 'D', content: 'Mật độ dân số tại các khu vực nông thôn.' }
      ],
      correctOption: 'B',
      explanation: 'Phương pháp kí hiệu đường chuyển động dùng để thể hiện sự di chuyển của các đối tượng, hiện tượng tự nhiên và kinh tế - xã hội (hướng gió, dòng hải lưu, luồng di dân, luồng vận tải hàng hóa).'
    },
    {
      topicKeywords: ['gps', 'bản đồ số', 'ứng dụng', 'định vị'],
      level: 'Thông hiểu',
      content: 'Ứng dụng nổi bật và cơ bản nhất của hệ thống định vị toàn cầu (GPS) trong đời sống hiện đại là:',
      options: [
        { key: 'A', content: 'Dự báo chính xác thời điểm xảy ra động đất và núi lửa phun trào.' },
        { key: 'B', content: 'Xác định vị trí toạ độ chính xác của các đối tượng trên bề mặt Trái Đất.' },
        { key: 'C', content: 'Tự động tính toán trữ lượng dầu mỏ dưới thềm lục địa.' },
        { key: 'D', content: 'Xoá bỏ hoàn toàn các tai nạn giao thông trên đường bộ.' }
      ],
      correctOption: 'B',
      explanation: 'GPS (Global Positioning System) là hệ thống xác định vị trí toạ độ chính xác của bất kì đối tượng nào trên bề mặt Trái Đất thông qua mạng lưới vệ tinh nhân tạo.'
    },
    {
      topicKeywords: ['vỏ trái đất', 'thạch quyển', 'cấu tạo', 'granit'],
      level: 'Thông hiểu',
      content: 'Điểm khác biệt cơ bản về cấu tạo giữa vỏ lục địa và vỏ đại dương là:',
      options: [
        { key: 'A', content: 'Vỏ lục địa có độ dày lớn hơn và có tầng đá granit phân bố liên tục.' },
        { key: 'B', content: 'Vỏ đại dương dày hơn và được cấu tạo chủ yếu bởi tầng đá trầm tích biến chất.' },
        { key: 'C', content: 'Vỏ lục địa không có tầng đá badan dưới đáy.' },
        { key: 'D', content: 'Vỏ đại dương có lớp đá granit rất dày bao phủ bên ngoài.' }
      ],
      correctOption: 'A',
      explanation: 'Vỏ lục địa dày (trung bình 35 - 70 km) gồm 3 tầng: trầm tích, granit và badan. Vỏ đại dương mỏng hơn (5 - 10 km), hầu như không có tầng granit hoặc tầng granit rất mỏng không liên tục.'
    },
    {
      topicKeywords: ['kiến tạo mảng', 'xô vào nhau', 'dãy núi', 'hi-ma-lay-a'],
      level: 'Thông hiểu',
      content: 'Khi hai mảng kiến tạo lục địa xô vào nhau (như mảng Ấn Độ - Ô-xtrây-li-a xô vào mảng Âu - Á), kết quả hình thành dạng địa hình nào sau đây?',
      options: [
        { key: 'A', content: 'Sống núi ngầm giữa lòng đại dương rộng lớn.' },
        { key: 'B', content: 'Các vũng vịnh sâu và thềm lục địa phẳng lì.' },
        { key: 'C', content: 'Các dãy núi uốn nếp lục địa cao và đồ sộ (như dãy Hi-ma-lay-a).' },
        { key: 'D', content: 'Địa hào ngập nước và bồn trũng sâu.' }
      ],
      correctOption: 'C',
      explanation: 'Khi hai mảng lục địa xô vào nhau, phần rìa mảng bị nén ép, uốn nếp mãnh liệt làm trồi lên các dãy núi lục địa cao đồ sộ như dãy Hi-ma-lay-a.'
    },
    {
      topicKeywords: ['nội lực', 'ngoại lực', 'uốn nếp', 'phong hóa'],
      level: 'Nhận biết',
      content: 'Dạng địa hình hang động các-xtơ (như động Phong Nha, vịnh Hạ Long) được hình thành chủ yếu do quá trình ngoại lực nào sau đây?',
      options: [
        { key: 'A', content: 'Quá trình phong hoá hoá học do nước hoà tan đá vôi.' },
        { key: 'B', content: 'Quá trình phong hoá sinh học do rễ cây tiết axit hữu cơ.' },
        { key: 'C', content: 'Quá trình vận động nâng lên của nội lực theo phương thẳng đứng.' },
        { key: 'D', content: 'Quá trình thổi mòn của gió bão vùng bán hoang mạc.' }
      ],
      correctOption: 'A',
      explanation: 'Địa hình các-xtơ được hình thành do phong hoá hoá học, trong đó nước mưa chứa khí CO2 hoà tan đá vôi (CaCO3) tạo thành các hang động ngầm và thung lũng đá vôi kì thú.'
    },
    {
      topicKeywords: ['khí áp', 'gió mùa', 'áp cao', 'xi-bia'],
      level: 'Thông hiểu',
      content: 'Khối khí lạnh di chuyển vào miền Bắc nước ta trong mùa đông có nguồn gốc từ trung tâm áp cao nào sau đây?',
      options: [
        { key: 'A', content: 'Áp cao Xi-bia.' },
        { key: 'B', content: 'Áp cao Ha-oai.' },
        { key: 'C', content: 'Áp cao cận chí tuyến Nam bán cầu.' },
        { key: 'D', content: 'Áp cao A-xo.' }
      ],
      correctOption: 'A',
      explanation: 'Gió mùa Đông Bắc thổi vào nước ta xuất phát từ trung tâm áp cao lạnh Xi-bia (thuộc lục địa Á - Âu ở vĩ độ khoảng 50°B), gây ra một mùa đông lạnh đặc trưng ở miền Bắc.'
    },
    {
      topicKeywords: ['biến đổi khí hậu', 'khí nhà kính', 'chuyên đề 10', 'năng lượng'],
      level: 'Thông hiểu',
      content: 'Theo thống kê trong Chuyên đề học tập Địa lí 10, ngành kinh tế - xã hội phát thải lượng khí nhà kính lớn nhất trên phạm vi toàn cầu hiện nay là:',
      options: [
        { key: 'A', content: 'Ngành năng lượng (đốt nhiên liệu hoá thạch để phát điện, phát nhiệt).' },
        { key: 'B', content: 'Ngành giao thông vận tải đường bộ.' },
        { key: 'C', content: 'Ngành sản xuất nông nghiệp và chăn nuôi gia súc.' },
        { key: 'D', content: 'Ngành xử lí chất thải và nước thải sinh hoạt.' }
      ],
      correctOption: 'A',
      explanation: 'Ngành năng lượng chiếm trên 50% tổng lượng phát thải khí nhà kính toàn cầu do việc đốt than đá, dầu mỏ và khí tự nhiên để phát điện và phục vụ công nghiệp.'
    },

    // =========================================================================
    // ĐỊA LÍ 11 & CHUYÊN ĐỀ HỌC TẬP ĐỊA LÍ 11
    // =========================================================================
    {
      topicKeywords: ['gni', 'hdi', 'nước phát triển', 'kinh tế thế giới'],
      level: 'Nhận biết',
      content: 'Một trong những tiêu chí quan trọng để phân loại một quốc gia thuộc nhóm nước phát triển là:',
      options: [
        { key: 'A', content: 'Chỉ số phát triển con người (HDI) đạt mức rất cao (từ 0,800 trở lên).' },
        { key: 'B', content: 'Tỉ trọng ngành nông nghiệp trong cơ cấu GDP chiếm trên 50%.' },
        { key: 'C', content: 'Quy mô dân số luôn trên 100 triệu người.' },
        { key: 'D', content: 'Tốc độ tăng trưởng dân số tự nhiên luôn vượt mức 2,5%/năm.' }
      ],
      correctOption: 'A',
      explanation: 'Các nước phát triển có GNI/người cao, ngành dịch vụ chiếm tỉ trọng áp đảo trong GDP và chỉ số phát triển con người HDI rất cao (từ 0,800 trở lên).'
    },
    {
      topicKeywords: ['toàn cầu hóa', 'chuỗi giá trị', 'kinh tế tri thức'],
      level: 'Thông hiểu',
      content: 'Biểu hiện rõ rệt nhất của xu thế toàn cầu hoá kinh tế trên thế giới hiện nay là:',
      options: [
        { key: 'A', content: 'Sự gia tăng nhanh chóng của các dòng thương mại, vốn đầu tư quốc tế và chuỗi giá trị toàn cầu.' },
        { key: 'B', content: 'Tất cả các quốc gia đều sử dụng chung một loại đồng tiền duy nhất.' },
        { key: 'C', content: 'Sự suy giảm hoàn toàn của các tập đoàn công nghệ xuyên quốc gia.' },
        { key: 'D', content: 'Việc xoá bỏ hoàn toàn biên giới hành chính giữa các quốc gia.' }
      ],
      correctOption: 'A',
      explanation: 'Toàn cầu hoá kinh tế biểu hiện qua tự do hoá thương mại, dòng chuyển dịch vốn FDI, công nghệ, nhân lực và sự hình thành mạng lưới sản xuất, chuỗi cung ứng toàn cầu.'
    },
    {
      topicKeywords: ['liên minh châu âu', 'eu', 'thị trường chung', 'euro'],
      level: 'Thông hiểu',
      content: 'Nội dung nào sau đây KHÔNG PHẢI là một trong bốn quyền tự do lưu thông cơ bản của Liên minh Châu Âu (EU)?',
      options: [
        { key: 'A', content: 'Tự do lưu thông hàng hoá.' },
        { key: 'B', content: 'Tự do lưu thông dịch vụ.' },
        { key: 'C', content: 'Tự do lưu thông tiền vốn và con người.' },
        { key: 'D', content: 'Tự do khai thác tài nguyên lãnh thổ không cần kiểm soát môi trường.' }
      ],
      correctOption: 'D',
      explanation: 'Bốn quyền tự do trụ cột của EU bao gồm: Tự do di chuyển (con người), Tự do lưu thông dịch vụ, Tự do lưu thông hàng hoá và Tự do lưu thông tiền vốn.'
    },
    {
      topicKeywords: ['mỹ la-tinh', 'đô thị hóa', 'tự phát', 'khí hậu'],
      level: 'Thông hiểu',
      content: 'Đặc điểm nổi bật của quá trình đô thị hoá ở khu vực Mỹ La-tinh là:',
      options: [
        { key: 'A', content: 'Tỉ lệ dân thành thị cao (xấp xỉ 80%) nhưng mang tính chất đô thị hoá tự phát.' },
        { key: 'B', content: 'Tỉ lệ dân thành thị rất thấp, tập trung chủ yếu ở vùng nông thôn hẻo lánh.' },
        { key: 'C', content: 'Đô thị hoá diễn ra gắn liền đồng bộ tuyệt đối với công nghiệp hoá hiện đại.' },
        { key: 'D', content: 'Không có các siêu đô thị trên 10 triệu dân.' }
      ],
      correctOption: 'A',
      explanation: 'Đô thị hoá ở Mỹ La-tinh diễn ra nhanh do nông dân di cư ồ ạt ra thành phố kiếm sống, dẫn tới tỉ lệ thị dân cao (~80%) nhưng sinh ra nhiều khu nhà ổ chuột và vấn đề xã hội nan giải.'
    },
    {
      topicKeywords: ['mê công', 'mrc', 'chuyên đề 11', 'ủy hội'],
      level: 'Nhận biết',
      content: 'Theo Chuyên đề 11.1 Địa lí 11, văn phòng Ủy hội sông Mê Công quốc tế (MRC) được thành lập dựa trên Hiệp định Mê Công năm nào?',
      options: [
        { key: 'A', content: 'Năm 1995.' },
        { key: 'B', content: 'Năm 1975.' },
        { key: 'C', content: 'Năm 2005.' },
        { key: 'D', content: 'Năm 2015.' }
      ],
      correctOption: 'A',
      explanation: 'Năm 1995, bốn quốc gia hạ lưu sông Mê Công (Lào, Thái Lan, Cam-pu-chia, Việt Nam) đã kí Hiệp định hợp tác phát triển bền vững lưu vực sông Mê Công và thành lập Ủy hội sông Mê Công (MRC).'
    },
    {
      topicKeywords: ['biển đông', 'chuyên đề 11', 'tài nguyên', 'thủy sản'],
      level: 'Thông hiểu',
      content: 'Biển Đông là vùng biển có ý nghĩa chiến lược kinh tế - an ninh to lớn đối với khu vực Đông Nam Á vì:',
      options: [
        { key: 'A', content: 'Nằm trên tuyến hàng hải huyết mạch quốc tế kết nối Ấn Độ Dương và Thái Bình Dương, giàu tài nguyên sinh vật và khoáng sản.' },
        { key: 'B', content: 'Là vùng biển kín hoàn toàn không chịu tác động của bão nhiệt đới.' },
        { key: 'C', content: 'Có nguồn băng tuyết ngọt dự trữ lớn nhất thế giới.' },
        { key: 'D', content: 'Không có tranh chấp chủ quyền giữa các quốc gia ven biển.' }
      ],
      correctOption: 'A',
      explanation: 'Biển Đông có diện tích khoảng 3,44 triệu km², là tuyến đường hàng hải quốc tế huyết mạch và sở hữu nguồn lợi thuỷ hải sản phong phú cùng tiềm năng dầu khí lớn.'
    },

    // =========================================================================
    // ĐỊA LÍ 12 & CHUYÊN ĐỀ HỌC TẬP ĐỊA LÍ 12 (CẬP NHẬT 2024-2025)
    // =========================================================================
    {
      topicKeywords: ['vị trí', 'lãnh thổ', 'hành chính', '34 tỉnh'],
      level: 'Nhận biết',
      content: 'Theo Nghị quyết của Quốc hội về việc sắp xếp đơn vị hành chính cấp tỉnh (cập nhật trong SGK Địa lí 12 mới), nước ta có bao nhiêu đơn vị hành chính cấp tỉnh?',
      options: [
        { key: 'A', content: '34 đơn vị hành chính cấp tỉnh (gồm 28 tỉnh và 6 thành phố trực thuộc Trung ương).' },
        { key: 'B', content: '63 đơn vị hành chính cấp tỉnh (gồm 58 tỉnh và 5 thành phố).' },
        { key: 'C', content: '45 đơn vị hành chính cấp tỉnh.' },
        { key: 'D', content: '50 đơn vị hành chính cấp tỉnh.' }
      ],
      correctOption: 'A',
      explanation: 'Theo phương án sắp xếp đơn vị hành chính cấp tỉnh được cập nhật trong SGK Địa lí 12 (trang 8), cả nước gồm 34 đơn vị hành chính cấp tỉnh (28 tỉnh và 6 thành phố trực thuộc Trung ương).'
    },
    {
      topicKeywords: ['lãnh hải', 'đặc quyền kinh tế', 'vùng biển', 'luật biển'],
      level: 'Nhận biết',
      content: 'Theo Luật Biển Việt Nam, vùng lãnh hải của nước ta có chiều rộng là bao nhiêu hải lí tính từ đường cơ sở ra phía biển?',
      options: [
        { key: 'A', content: '12 hải lí.' },
        { key: 'B', content: '24 hải lí.' },
        { key: 'C', content: '200 hải lí.' },
        { key: 'D', content: '350 hải lí.' }
      ],
      correctOption: 'A',
      explanation: 'Lãnh hải là vùng biển có chiều rộng 12 hải lí tính từ đường cơ sở ra phía biển. Ranh giới ngoài của lãnh hải chính là đường biên giới quốc gia trên biển của Việt Nam.'
    },
    {
      topicKeywords: ['dân số', 'dân số vàng', 'già hóa', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Theo số liệu thống kê năm 2024 trong SGK Địa lí 12, đặc điểm cơ cấu dân số theo độ tuổi của nước ta là:',
      options: [
        { key: 'A', content: 'Nước ta đang trong thời kì cơ cấu dân số vàng (nhóm 15-64 tuổi chiếm 67,4%) đồng thời có xu hướng già hoá dân số nhanh.' },
        { key: 'B', content: 'Cơ cấu dân số trẻ với tỉ lệ trẻ em dưới 15 tuổi chiếm trên 50%.' },
        { key: 'C', content: 'Tỉ lệ người cao tuổi từ 65 tuổi trở lên chiếm đa số trong tổng dân số.' },
        { key: 'D', content: 'Lực lượng lao động suy giảm nghiêm trọng do mức sinh tăng cao.' }
      ],
      correctOption: 'A',
      explanation: 'Năm 2024, cơ cấu tuổi của nước ta: nhóm dưới 15 tuổi chiếm 23,3%, nhóm 15-64 tuổi chiếm 67,4% (dân số vàng), nhóm 65 tuổi trở lên tăng lên 9,3% (bước vào giai đoạn già hoá).'
    },
    {
      topicKeywords: ['đô thị hóa', 'gdp', 'thành thị', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Vai trò kinh tế nổi bật của mạng lưới đô thị ở nước ta hiện nay (năm 2024) được thể hiện rõ qua đặc điểm nào sau đây?',
      options: [
        { key: 'A', content: 'Đô thị đóng góp khoảng 70% vào GDP cả nước, là động lực tăng trưởng kinh tế và đổi mới sáng tạo.' },
        { key: 'B', content: 'Đô thị là nơi cung cấp 100% lương thực và thuỷ sản xuất khẩu.' },
        { key: 'C', content: 'Thu hút toàn bộ 100% lực lượng lao động cả nước về làm việc.' },
        { key: 'D', content: 'Xoá bỏ hoàn toàn sự phân hoá giàu nghèo giữa các vùng miền.' }
      ],
      correctOption: 'A',
      explanation: 'Mặc dù thị dân chiếm 38,5% dân số (năm 2024), kinh tế đô thị đóng góp tới 70% GDP cả nước, đóng vai trò hạt nhân lan toả công nghệ và thúc đẩy chuyển dịch cơ cấu kinh tế.'
    },
    {
      topicKeywords: ['cơ cấu kinh tế', 'gdp 2024', 'dịch vụ', 'nông nghiệp'],
      level: 'Nhận biết',
      content: 'Trong cơ cấu GDP phân theo ngành kinh tế của nước ta năm 2024 (theo SGK Địa lí 12), khu vực chiếm tỉ trọng cao nhất là:',
      options: [
        { key: 'A', content: 'Khu vực Dịch vụ (chiếm 42,4%).' },
        { key: 'B', content: 'Khu vực Nông nghiệp, lâm nghiệp và thuỷ sản (chiếm 45,0%).' },
        { key: 'C', content: 'Khu vực Công nghiệp khai khoáng thô.' },
        { key: 'D', content: 'Thuế sản phẩm trừ trợ cấp sản phẩm.' }
      ],
      correctOption: 'A',
      explanation: 'Cơ cấu GDP năm 2024: Nông, lâm, thuỷ sản chiếm 11,9%; Công nghiệp và xây dựng chiếm 37,6%; Dịch vụ chiếm 42,4%; Thuế sản phẩm chiếm 8,1%.'
    },
    {
      topicKeywords: ['nông nghiệp', 'lúa gạo', 'cây công nghiệp', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Trong cơ cấu ngành trồng trọt nước ta hiện nay, xu hướng chuyển đổi cơ cấu cây trồng thể hiện rõ ở việc:',
      options: [
        { key: 'A', content: 'Giảm dần tỉ trọng diện tích cây lương thực, tăng nhanh diện tích cây ăn quả và cây công nghiệp có giá trị xuất khẩu cao.' },
        { key: 'B', content: 'Chuyển đổi toàn bộ đất trồng lúa sang nuôi chim yến lấy tổ.' },
        { key: 'C', content: 'Chỉ tập trung phát triển cây công nghiệp hàng năm ngắn ngày.' },
        { key: 'D', content: 'Ngừng canh tác lúa gạo để nhập khẩu hoàn toàn từ nước ngoài.' }
      ],
      correctOption: 'A',
      explanation: 'Ngành trồng trọt chuyển từ tư duy sản xuất nông nghiệp truyền thống sang kinh tế nông nghiệp hàng hoá, nâng cao diện tích cây ăn quả (đạt gần 1,3 triệu ha) và cây công nghiệp giá trị cao.'
    },
    {
      topicKeywords: ['thiên tai', 'bão', 'chuyên đề 12', 'mùa bão'],
      level: 'Thông hiểu',
      content: 'Theo Chuyên đề học tập 12.1 Địa lí 12, quy luật di chuyển của mùa bão ở nước ta là:',
      options: [
        { key: 'A', content: 'Mùa bão có xu hướng chậm dần từ Bắc vào Nam (tháng 6-8 ở Bắc Bộ, tháng 9-10 ở Trung Bộ, tháng 11-12 ở Nam Bộ).' },
        { key: 'B', content: 'Mùa bão di chuyển sớm nhất ở Nam Bộ và kết thúc muộn nhất ở Bắc Bộ.' },
        { key: 'C', content: 'Bão chỉ xuất hiện duy nhất ở vùng biển ven bờ Tây Nam Bộ.' },
        { key: 'D', content: 'Tất cả các cơn bão trong năm đều đổ bộ đồng thời vào tháng 7.' }
      ],
      correctOption: 'A',
      explanation: 'Mùa bão ở nước ta có quy luật chậm dần từ Bắc vào Nam: Bắc Bộ và Thanh Hoá tập trung bão vào tháng 6 - 8; Trung Bộ tháng 8 - 11 (nhiều nhất tháng 9, 10); Nam Bộ ít bão, nếu có thường vào tháng 10 - 12.'
    },
    {
      topicKeywords: ['xâm nhập mặn', 'đồng bằng sông cửu long', 'chuyên đề 12', '4 phần nghìn'],
      level: 'Vận dụng',
      content: 'Ranh giới đo độ mặn xâm nhập gây hại nghiêm trọng đến sinh hoạt và cây trồng ở Đồng bằng sông Cửu Long thường được xác định ở ngưỡng nồng độ mặn nào?',
      options: [
        { key: 'A', content: '4‰ (bốn phần nghìn).' },
        { key: 'B', content: '0,1‰ (không phẩy một phần nghìn).' },
        { key: 'C', content: '35‰ (ba mươi lăm phần nghìn).' },
        { key: 'D', content: '50‰ (năm mươi phần nghìn).' }
      ],
      correctOption: 'A',
      explanation: 'Trong quan trắc thuỷ văn và nông nghiệp (Chuyên đề 12.1), ranh giới độ mặn 4‰ được coi là giới hạn nguy hiểm làm cây trồng bị chết và nguồn nước không thể dùng cho sinh hoạt nếu chưa qua xử lí.'
    }
  ],

  tf: [
    // =========================================================================
    // CÂU HỎI ĐÚNG / SAI (4 PHÁT BIỂU a, b, c, d)
    // =========================================================================
    {
      topicKeywords: ['vị trí địa lí', 'lãnh thổ', 'khí hậu', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau về vị trí địa lí và lãnh thổ nước ta:\n"Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, ở khu vực gió mùa châu Á, tiếp giáp Biển Đông rộng lớn. Vị trí địa lí đã quy định đặc điểm cơ bản của thiên nhiên Việt Nam mang tính chất nhiệt đới ẩm gió mùa, có sự phân hoá sâu sắc theo không gian và thời gian. Lãnh thổ nước ta gồm vùng đất liền, vùng biển và vùng trời với 34 đơn vị hành chính cấp tỉnh."\n(Nguồn: SGK Địa lí 12 - Kết nối tri thức với cuộc sống)\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Nước ta có nền nhiệt độ cao, chan hoà ánh nắng là do nằm trọn vẹn trong vùng nội chí tuyến bán cầu Bắc.', isCorrect: true, explanation: 'Đúng: Vị trí nội chí tuyến quy định góc nhập xạ lớn và bức xạ mặt trời dồi dào quanh năm.' },
        { key: 'b', statement: 'Tính chất gió mùa của khí hậu Việt Nam là do vị trí tiếp giáp giữa lục địa Á - Âu và đại dương Thái Bình Dương/Ấn Độ Dương.', isCorrect: true, explanation: 'Đúng: Vị trí nằm trong khu vực hoạt động của hoàn lưu gió mùa châu Á.' },
        { key: 'c', statement: 'Toàn bộ vùng lãnh hải 12 hải lí của nước ta được coi là vùng biển quốc tế tự do tàu bè nước ngoài đánh bắt hải sản không cần xin phép.', isCorrect: false, explanation: 'Sai: Vùng lãnh hải là lãnh thổ thuộc chủ quyền hoàn toàn, tuyệt đối của Việt Nam, ranh giới ngoài là biên giới quốc gia trên biển.' },
        { key: 'd', statement: 'Sự phân hoá thiên nhiên theo chiều Bắc - Nam qua dãy Bạch Mã chủ yếu là do sự suy giảm tác động của gió mùa Đông Bắc về phía Nam.', isCorrect: true, explanation: 'Đúng: Dãy Bạch Mã ngăn cản gió mùa Đông Bắc, tạo nên ranh giới khí hậu giữa miền Bắc (có mùa đông lạnh) và miền Nam (cận xích đạo nóng quanh năm).' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    },
    {
      topicKeywords: ['dân số', 'lao động', 'việc làm', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu về Cơ cấu dân số theo nhóm tuổi của nước ta giai đoạn 1999 - 2024 (%):\n- Năm 1999: Dưới 15 tuổi = 33,1%; Từ 15 đến 64 tuổi = 61,1%; Từ 65 tuổi trở lên = 5,8%.\n- Năm 2009: Dưới 15 tuổi = 24,5%; Từ 15 đến 64 tuổi = 69,1%; Từ 65 tuổi trở lên = 6,4%.\n- Năm 2019: Dưới 15 tuổi = 24,3%; Từ 15 đến 64 tuổi = 68,0%; Từ 65 tuổi trở lên = 7,7%.\n- Năm 2024: Dưới 15 tuổi = 23,3%; Từ 15 đến 64 tuổi = 67,4%; Từ 65 tuổi trở lên = 9,3%.\n(Nguồn: Niên giám Thống kê Việt Nam 2024, Cục Thống kê)\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Giai đoạn 1999 - 2024, tỉ trọng nhóm tuổi dưới 15 tuổi giảm liên tục, phản ánh mức sinh ở nước ta có xu hướng giảm.', isCorrect: true, explanation: 'Đúng: Tỉ trọng giảm từ 33,1% xuống 23,3% do hiệu quả của chính sách dân số kế hoạch hoá gia đình.' },
        { key: 'b', statement: 'Năm 2024, nhóm tuổi từ 15 đến 64 tuổi chiếm 67,4% cho thấy nước ta vẫn đang duy trì lợi thế cơ cấu dân số vàng.', isCorrect: true, explanation: 'Đúng: Tỉ lệ lao động chiếm trên 66% tổng dân số là biểu hiện đặc trưng của thời kì dân số vàng.' },
        { key: 'c', statement: 'Tỉ trọng nhóm từ 65 tuổi trở lên tăng nhanh đạt 9,3% năm 2024 là minh chứng cho thấy nước ta chưa bước vào quá trình già hoá dân số.', isCorrect: false, explanation: 'Sai: Tỉ lệ trên 65 tuổi vượt 7% và tiệm cận 10% chứng tỏ nước ta đang già hoá dân số với tốc độ nhanh.' },
        { key: 'd', statement: 'Cơ cấu dân số hiện nay đòi hỏi nước ta phải tập trung nâng cao chất lượng đào tạo nghề cho lao động trẻ và hoàn thiện hệ thống an sinh xã hội cho người cao tuổi.', isCorrect: true, explanation: 'Đúng: Đây là hai chiến lược cốt lõi để tận dụng cơ hội dân số vàng và thích ứng với già hoá dân số.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    },
    {
      topicKeywords: ['mê công', 'mrc', 'chuyên đề 11', 'tài nguyên nước'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau về Ủy hội sông Mê Công (MRC):\n"Lưu vực sông Mê Công có diện tích 810.000 km², bắt nguồn từ cao nguyên Tây Tạng (Trung Quốc) chảy qua 6 quốc gia: Trung Quốc, Mi-an-ma, Lào, Thái Lan, Cam-pu-chia và Việt Nam. Ủy hội sông Mê Công quốc tế được thành lập nhằm thúc đẩy phối hợp quản lí và phát triển bền vững tài nguyên nước, thông qua 5 thủ tục then chốt gồm PDIES, PWUM, PNPCA, PMFM và PWQ."\n(Nguồn: Chuyên đề học tập Địa lí 11 - Kết nối tri thức với cuộc sống)\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Sông Mê Công khi chảy vào lãnh thổ Việt Nam chia thành hai nhánh lớn là sông Tiền và sông Hậu rồi đổ ra Biển Đông.', isCorrect: true, explanation: 'Đúng: Chảy vào ĐBSCL, sông tách thành sông Tiền và sông Hậu (Cửu Long).' },
        { key: 'b', statement: 'Việc xây dựng ồ ạt các đập thuỷ điện trên dòng chính ở thượng nguồn không gây ra bất kì tác động nào đến lưu lượng phù sa và chế độ nước ở hạ lưu.', isCorrect: false, explanation: 'Sai: Các đập thuỷ điện thượng lưu giữ lại lượng lớn phù sa và làm thay đổi chu kì lũ tự nhiên, gia tăng sạt lở bờ sông và xâm nhập mặn ở ĐBSCL.' },
        { key: 'c', statement: 'Thủ tục Trao đổi và chia sẻ thông tin số liệu (PDIES) giúp các quốc gia thành viên minh bạch hoá dữ liệu thuỷ văn và vận hành hồ chứa.', isCorrect: true, explanation: 'Đúng: PDIES được thông qua năm 2001 để chia sẻ số liệu giám sát nguồn nước liên quốc gia.' },
        { key: 'd', statement: 'Việt Nam đóng vai trò tích cực trong Ủy hội Mê Công nhằm bảo vệ an ninh nguồn nước và sinh kế bền vững cho hàng chục triệu người dân Đồng bằng sông Cửu Long.', isCorrect: true, explanation: 'Đúng: ĐBSCL nằm ở cuối nguồn, chịu ảnh hưởng trực tiếp nhất từ mọi can thiệp nguồn nước ở thượng lưu.' }
      ],
      explanation: 'Nhận định a, c, d là ĐÚNG; b là SAI.'
    },
    {
      topicKeywords: ['thiên tai', 'bão', 'lũ', 'chuyên đề 12'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu về Số cơn bão và áp thấp nhiệt đới trên Biển Đông ảnh hưởng trực tiếp đến đất liền Việt Nam giai đoạn 2010 - 2024:\n- Năm 2010: Hoạt động Biển Đông = 9 cơn; Ảnh hưởng đất liền = 5 cơn.\n- Năm 2015: Hoạt động Biển Đông = 6 cơn; Ảnh hưởng đất liền = 5 cơn.\n- Năm 2019: Hoạt động Biển Đông = 12 cơn; Ảnh hưởng đất liền = 6 cơn.\n- Năm 2021: Hoạt động Biển Đông = 11 cơn; Ảnh hưởng đất liền = 6 cơn.\n- Năm 2024: Hoạt động Biển Đông = 10 cơn; Ảnh hưởng đất liền = 4 cơn.\n(Nguồn: Cục Quản lí đê điều và Phòng, chống thiên tai)\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Trung bình hàng năm có từ 10 - 12 cơn bão và áp thấp nhiệt đới hoạt động trên Biển Đông, trong đó khoảng 4 - 6 cơn đổ bộ trực tiếp vào đất liền nước ta.', isCorrect: true, explanation: 'Đúng: Số liệu thống kê trong Chuyên đề 12.1 phản ánh chính xác tần suất bão trên Biển Đông.' },
        { key: 'b', statement: 'Tất cả các vùng ven biển nước ta từ Bắc vào Nam đều chịu tần suất bão đổ bộ như nhau vào tháng 6 hàng năm.', isCorrect: false, explanation: 'Sai: Tần suất bão có sự phân hoá rõ rệt và chậm dần từ Bắc vào Nam theo các tháng trong năm.' },
        { key: 'c', statement: 'Bão đổ bộ thường kèm theo gió mạnh, mưa lớn, nước dâng và sóng thần gây ngập lụt ven biển, phá huỷ công trình hạ tầng.', isCorrect: true, explanation: 'Đúng: Hậu quả tổng hợp của bão là gió giật, triều cường nước biển dâng và sạt lở ngập úng nghiêm trọng.' },
        { key: 'd', statement: 'Biện pháp công trình hiệu quả nhất trong phòng chống bão là củng cố hệ thống đê biển, trồng rừng ngập mặn chắn sóng và xây dựng khu neo đậu tàu thuyền an toàn.', isCorrect: true, explanation: 'Đúng: Kết hợp giữa công trình đê kè, rừng ngập mặn sinh thái và khu tránh trú bão là giải pháp phòng ngừa căn cơ.' }
      ],
      explanation: 'Nhận định a, c, d là ĐÚNG; b là SAI.'
    }
  ],

  short: [
    // =========================================================================
    // CÂU HỎI TRẢ LỜI NGẮN (TÍNH TOÁN THEO SỐ LIỆU CHUẨN SGK ĐỊA LÍ 10, 11, 12)
    // =========================================================================
    {
      topicKeywords: ['tỉ lệ', 'thành thị', 'đô thị hóa', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Năm 2024, tổng dân số nước ta là 101,3 triệu người, trong đó số dân sinh sống ở khu vực thành thị là 39,0 triệu người. Hãy tính tỉ lệ dân thành thị của nước ta năm 2024 (đơn vị: %, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '38,5',
      explanation: '$\\text{Tỉ lệ dân thành thị} = \\frac{39,0}{101,3} \\times 100\\% \\approx 38,499\\% \\approx 38,5\\%$.'
    },
    {
      topicKeywords: ['tỉ trọng', 'lao động', 'dịch vụ', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Năm 2024, tổng số lao động có việc làm trong nền kinh tế nước ta là 52,4 triệu người, trong đó số lao động làm việc trong khu vực Dịch vụ là 21,07 triệu người. Hãy tính tỉ trọng lao động của khu vực Dịch vụ trong tổng số lao động năm 2024 (đơn vị: %, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '40,2',
      explanation: '$\\text{Tỉ trọng lao động dịch vụ} = \\frac{21,07}{52,4} \\times 100\\% \\approx 40,21\\% \\approx 40,2\\%$.'
    },
    {
      topicKeywords: ['nhiệt độ', 'địa hình', 'đai cao', 'địa lí 10'],
      level: 'Vận dụng cao',
      content: 'Tại chân núi (độ cao 150 m), trạm khí tượng ghi nhận nhiệt độ không khí là $28,5^\\circ\\text{C}$. Theo quy luật đai cao, trong tầng đối lưu nhiệt độ trung bình giảm $0,6^\\circ\\text{C}$ khi lên cao $100\\text{ m}$. Hỏi tại đỉnh núi có độ cao $2150\\text{ m}$, nhiệt độ không khí dự kiến là bao nhiêu $^\\circ\\text{C}$ (làm tròn kết quả đến một chữ số thập phân)? Khi trả lời, chỉ ghi số.',
      key: '16,5',
      explanation: 'Độ chênh lệch độ cao: $\\Delta h = 2150 - 150 = 2000\\text{ m}$. Độ giảm nhiệt độ: $\\Delta T = \\frac{2000}{100} \\times 0,6 = 12,0^\\circ\\text{C}$. Nhiệt độ tại đỉnh núi: $T_{\\text{đỉnh}} = 28,5 - 12,0 = 16,5^\\circ\\text{C}$.'
    },
    {
      topicKeywords: ['mật độ', 'dân số', 'đồng bằng sông hồng', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Năm 2024, diện tích tự nhiên của vùng Đồng bằng sông Hồng là $21278,6\\text{ km}^2$, quy mô dân số của vùng là $22,0$ triệu người. Hãy tính mật độ dân số của vùng Đồng bằng sông Hồng năm 2024 (đơn vị: người/km², làm tròn đến phần nguyên). Khi trả lời, chỉ ghi số.',
      key: '1034',
      explanation: '$\\text{Mật độ dân số} = \\frac{22000000}{21278,6} \\approx 1033,9\\text{ người/km}^2 \\approx 1034\\text{ người/km}^2$.'
    },
    {
      topicKeywords: ['năng suất', 'lúa', 'nông nghiệp', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Năm 2024, diện tích gieo trồng lúa của nước ta là $7127,1\\text{ nghìn ha}$, tổng sản lượng lúa thu hoạch đạt $43,5\\text{ triệu tấn}$ ($43500\\text{ nghìn tấn}$). Hãy tính năng suất lúa bình quân của cả nước năm 2024 (đơn vị: tạ/ha, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '61,0',
      explanation: 'Đổi $43,5\\text{ triệu tấn} = 435000\\text{ nghìn tạ}$. $\\text{Năng suất lúa} = \\frac{435000}{7127,1} \\approx 61,03\\text{ tạ/ha} \\approx 61,0\\text{ tạ/ha}$.'
    },
    {
      topicKeywords: ['tốc độ tăng trưởng', 'gdp', 'mỹ la-tinh', 'địa lí 11'],
      level: 'Vận dụng',
      content: 'Quy mô GDP của Bra-xin năm 2000 là $655,5\\text{ tỉ USD}$, năm 2020 đạt $1448,6\\text{ tỉ USD}$. Hãy cho biết tốc độ tăng trưởng GDP của Bra-xin năm 2020 so với năm 2000 là bao nhiêu % (lấy năm 2000 = 100%, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '221,0',
      explanation: '$\\text{Tốc độ tăng trưởng} = \\frac{1448,6}{655,5} \\times 100\\% \\approx 220,99\\% \\approx 221,0\\%$.'
    },
    {
      topicKeywords: ['biên độ nhiệt', 'khí hậu', 'địa lí 10'],
      level: 'Thông hiểu',
      content: 'Tại trạm khí tượng Láng (Hà Nội), nhiệt độ trung bình tháng 1 (tháng thấp nhất) là $16,4^\\circ\\text{C}$, nhiệt độ trung bình tháng 7 (tháng cao nhất) là $28,9^\\circ\\text{C}$. Hãy tính biên độ nhiệt độ trung bình năm tại trạm Láng (đơn vị: $^\\circ\\text{C}$, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '12,5',
      explanation: '$\\text{Biên độ nhiệt năm} = T_{\\text{tháng cao nhất}} - T_{\\text{tháng thấp nhất}} = 28,9 - 16,4 = 12,5^\\circ\\text{C}$.'
    }
  ],

  essay: [
    // =========================================================================
    // CÂU HỎI TỰ LUẬN KÈM HƯỚNG DẪN CHẤM CHI TIẾT THEO CHUẨN BỘ GD&ĐT
    // =========================================================================
    {
      topicKeywords: ['địa lí tự nhiên', 'nhiệt đới ẩm', 'gió mùa', 'địa lí 12'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức đã học trong chương trình Địa lí 12:\na) Phân tích các biểu hiện của tính chất nhiệt đới ẩm gió mùa qua thành phần khí hậu và mạng lưới sông ngòi ở nước ta.\nb) Vì sao thiên nhiên nước ta mang tính chất nhiệt đới ẩm gió mùa mà không bị khô hạn như các khu vực khác cùng vĩ độ ở Tây Á hay Bắc Phi?',
      essayRubric: 'Ý a (1.5đ): \n- Khí hậu (0.75đ): Lượng bức xạ mặt trời lớn, cán cân bức xạ quanh năm dương; nhiệt độ trung bình năm >20°C (trừ vùng núi cao); lượng mưa lớn (1500 - 2000 mm/năm), độ ẩm không khí cao >80%; hoạt động luân phiên của gió mùa Đông Bắc và gió mùa Tây Nam tạo nên 2 mùa rõ rệt.\n- Sông ngòi (0.75đ): Mạng lưới sông ngòi dày đặc (2360 con sông dài >10 km); nhiều nước (tổng lượng dòng chảy 839 tỉ m³/năm); giàu phù sa (khoảng 200 triệu tấn/năm); chế độ nước theo mùa trùng khớp với mùa mưa và mùa khô.\nÝ b (0.5đ): \n- Nước ta nằm tiếp giáp Biển Đông rộng lớn (khoảng 1 triệu km²), Biển Đông đóng vai trò là nguồn dự trữ nhiệt ẩm dồi dào, các khối khí di chuyển qua biển được tăng cường hơi nước gây mưa lớn, biến đổi tính chất khô hạn thường thấy ở vùng vĩ độ cận nhiệt Tây Á, Bắc Phi.',
      explanation: 'Hướng dẫn chấm chi tiết biểu hiện khí hậu, sông ngòi và vai trò điều hòa của Biển Đông.'
    },
    {
      topicKeywords: ['chuyển dịch cơ cấu', 'kinh tế', 'công nghiệp hóa', 'địa lí 12'],
      level: 'Vận dụng cao',
      content: 'Dựa vào SGK Địa lí 12, hãy trình bày và phân tích xu hướng chuyển dịch cơ cấu kinh tế theo ngành và theo thành phần kinh tế ở nước ta giai đoạn hiện nay. Ý nghĩa của sự chuyển dịch đó đối với quá trình phát triển đất nước?',
      essayRubric: 'Ý 1 (1.0đ): Chuyển dịch cơ cấu theo ngành:\n- Giảm tỉ trọng ngành nông - lâm - thuỷ sản (từ 15,4% năm 2010 xuống 11,9% năm 2024) (0.25đ).\n- Tăng tỉ trọng ngành công nghiệp và xây dựng (đạt 37,6% năm 2024) và ngành dịch vụ (chiếm tỉ trọng cao nhất 42,4% năm 2024) (0.5đ).\n- Trong nội bộ từng ngành: chuyển dịch theo hướng nâng cao giá trị gia tăng, công nghệ cao, kinh tế xanh (0.25đ).\nÝ 2 (0.5đ): Chuyển dịch cơ cấu theo thành phần kinh tế:\n- Kinh tế Nhà nước giữ vai trò chủ đạo, kiểm soát các ngành then chốt (21,1% GDP năm 2024).\n- Kinh tế ngoài Nhà nước là động lực quan trọng nhất (chiếm 50,4% GDP).\n- Khu vực có vốn đầu tư nước ngoài (FDI) tăng nhanh và đóng vai trò tích cực (đạt 20,4% GDP năm 2024).\nÝ 3 (0.5đ): Ý nghĩa:\n- Thúc đẩy tăng trưởng kinh tế bền vững, đẩy mạnh công nghiệp hoá, hiện đại hoá, nâng cao năng lực cạnh tranh quốc gia và giải quyết việc làm cho người lao động.',
      explanation: 'Phân tích chuyển dịch cơ cấu kinh tế theo ngành và thành phần kinh tế theo số liệu chính thống 2024.'
    },
    {
      topicKeywords: ['thiên tai', 'biến đổi khí hậu', 'đồng bằng sông cửu long', 'chuyên đề 12'],
      level: 'Vận dụng cao',
      content: 'Theo Chuyên đề học tập Địa lí 12:\na) Hãy nêu các biểu hiện và nguyên nhân chủ yếu của hiện tượng xâm nhập mặn ở Đồng bằng sông Cửu Long vào mùa khô.\nb) Đề xuất các giải pháp công trình và phi công trình để thích ứng bền vững với xâm nhập mặn và biến đổi khí hậu tại vùng Đồng bằng sông Cửu Long.',
      essayRubric: 'Ý a (1.0đ): \n- Biểu hiện (0.5đ): Nước biển mang nồng độ mặn ≥4‰ lấn sâu vào các nhánh sông Tiền, sông Hậu từ 40 - 70 km, gây thiếu nước ngọt cho hàng triệu người dân và thiệt hại diện tích vườn cây ăn trái, lúa, thuỷ sản.\n- Nguyên nhân (0.5đ): Mùa khô kéo dài 4 - 5 tháng; địa hình đồng bằng thấp trũng; mạng lưới kênh rạch chằng chịt kết hợp triều cường; suy giảm dòng chảy thượng nguồn Mê Công do các đập thuỷ điện trữ nước và biến đổi khí hậu.\nÝ b (1.0đ): Các giải pháp thích ứng:\n- Giải pháp công trình (0.5đ): Xây dựng cống ngăn mặn, âu thuyền giữ ngọt (hệ thống Cái Lớn - Cái Bé), nạo vét kênh mương trữ nước ngọt, nâng cấp hệ thống cấp nước sạch nông thôn.\n- Giải pháp phi công trình (0.5đ): Chuyển đổi mô hình sản xuất nông nghiệp "thuận thiên" theo Nghị quyết 120/NQ-CP (lúa - tôm, nuôi trồng thuỷ sản nước lợ/mặn); thay đổi lịch thời vụ né mặn; áp dụng công nghệ tưới tiết kiệm nước; tăng cường hợp tác trong Ủy hội Mê Công quốc tế.',
      explanation: 'Lời giải chi tiết vấn đề xâm nhập mặn và giải pháp thuận thiên tại Đồng bằng sông Cửu Long.'
    }
  ]
};
