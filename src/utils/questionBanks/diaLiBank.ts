import { SubjectQuestionBank } from './bankTypes';

export const DIA_LI_BANK: SubjectQuestionBank = {
  mcq: [
    // =========================================================================
    // ĐỊA LÍ 10 (KIẾN THỨC NỀN TẢNG, PHƯƠNG PHÁP BẢN ĐỒ, TỰ NHIÊN, KĨ NĂNG BẢNG SỐ LIỆU & BIỂU ĐỒ)
    // =========================================================================
    {
      grade: '10',
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
      grade: '10',
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
      grade: '10',
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
      grade: '10',
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
      grade: '10',
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
      grade: '10',
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
      grade: '10',
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
      grade: '10',
      topicKeywords: ['thuỷ quyển', 'nước ngầm', 'băng hà', 'nước ngọt'],
      level: 'Nhận biết',
      content: 'Trong tổng khối lượng nước ngọt trên Trái Đất, nguồn nước ngọt chiếm tỉ lệ thể tích lớn nhất phân bố ở dạng nào?',
      options: [
        { key: 'A', content: 'Băng và tuyết ở hai cực cùng các vùng núi cao (khoảng 68,7%).' },
        { key: 'B', content: 'Nước mặt trong các con sông và hồ nước ngọt.' },
        { key: 'C', content: 'Nước trong khí quyển dưới dạng hơi ẩm.' },
        { key: 'D', content: 'Nước trong cơ thể sinh vật và thực vật.' }
      ],
      correctOption: 'A',
      explanation: 'Nước ngọt chỉ chiếm khoảng 2,5% tổng lượng nước trên Trái Đất, trong đó băng và tuyết ở hai cực chiếm đến 68,7%, nước ngầm chiếm 30,1%, nước mặt sông hồ chỉ chiếm 1,2%.'
    },
    {
      grade: '10',
      topicKeywords: ['thổ nhưỡng', 'đất feralit', 'nhiệt đới', 'oxit sắt'],
      level: 'Thông hiểu',
      content: 'Quá trình hình thành đất đặc trưng cho vùng khí hậu nhiệt đới ẩm gió mùa là quá trình feralit, nguyên nhân chủ yếu là do:',
      options: [
        { key: 'A', content: 'Nhiệt ẩm dồi dào thúc đẩy phong hoá hoá học mạnh, rửa trôi các chất kiềm và tích tụ oxit sắt, nhôm tạo màu đỏ vàng.' },
        { key: 'B', content: 'Nhiệt độ rất thấp làm đóng băng các khoáng chất trong đất.' },
        { key: 'C', content: 'Gió bão thổi mòn toàn bộ lớp đá mẹ trên bề mặt.' },
        { key: 'D', content: 'Không có thảm thực vật che phủ bề mặt đất.' }
      ],
      correctOption: 'A',
      explanation: 'Quá trình feralit diễn ra mạnh trong điều kiện nhiệt ẩm cao: chất bazơ dễ tan bị rửa trôi mạnh, oxit sắt (Fe2O3) và oxit nhôm (Al2O3) bị giữ lại tích tụ tạo nên tầng đất dày có màu đỏ vàng đặc trưng.'
    },
    {
      grade: '10',
      topicKeywords: ['bảng số liệu', 'kĩ năng', 'nhiệt độ', 'lượng mưa', 'trạm khí tượng'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu: NHIỆT ĐỘ TRUNG BÌNH THÁNG TẠI TRẠM KHÍ TƯỢNG HÀ NỘI (°C)\n| Tháng | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |\n| Nhiệt độ | 16,4 | 17,2 | 20,0 | 23,9 | 27,4 | 28,9 | 28,9 | 28,5 | 27,2 | 24,6 | 21,4 | 18,2 |\nTheo bảng số liệu trên, biên độ nhiệt độ năm tại trạm Hà Nội là bao nhiêu?',
      options: [
        { key: 'A', content: '12,5°C.' },
        { key: 'B', content: '14,2°C.' },
        { key: 'C', content: '10,8°C.' },
        { key: 'D', content: '16,4°C.' }
      ],
      correctOption: 'A',
      explanation: 'Biên độ nhiệt độ năm = Nhiệt độ tháng cao nhất (tháng 6, 7 là 28,9°C) - Nhiệt độ tháng thấp nhất (tháng 1 là 16,4°C) = 28,9 - 16,4 = 12,5°C.'
    },
    {
      grade: '10',
      topicKeywords: ['bảng số liệu', 'kĩ năng', 'dân số', 'lương thực', 'thế giới'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu: DÂN SỐ VÀ SẢN LƯỢNG LƯƠNG THỰC THẾ GIỚI GIAI ĐOẠN 2010 - 2022\n| Năm | 2010 | 2015 | 2020 | 2022 |\n| Dân số (triệu người) | 6956,8 | 7379,8 | 7794,8 | 7975,1 |\n| Sản lượng lương thực (triệu tấn) | 2461,5 | 2824,0 | 2996,1 | 3089,4 |\nTheo bảng số liệu, nhận xét nào sau đây đúng về sự thay đổi dân số và sản lượng lương thực thế giới giai đoạn 2010 - 2022?',
      options: [
        { key: 'A', content: 'Sản lượng lương thực và dân số thế giới đều tăng liên tục qua các năm.' },
        { key: 'B', content: 'Dân số tăng nhanh hơn tốc độ tăng của sản lượng lương thực.' },
        { key: 'C', content: 'Sản lượng lương thực có xu hướng giảm nhẹ trong giai đoạn 2020 - 2022.' },
        { key: 'D', content: 'Dân số thế giới giảm liên tục từ năm 2010 đến 2022.' }
      ],
      correctOption: 'A',
      explanation: 'Từ 2010 đến 2022: Dân số tăng liên tục từ 6956,8 triệu lên 7975,1 triệu người; sản lượng lương thực tăng liên tục từ 2461,5 triệu lên 3089,4 triệu tấn.'
    },
    {
      grade: '10',
      topicKeywords: ['biểu đồ', 'kĩ năng', 'cơ cấu', 'dạng biểu đồ', 'nước ngọt'],
      level: 'Vận dụng',
      content: 'Để thể hiện cơ cấu các nguồn nước ngọt trên Trái Đất (băng tuyết, nước ngầm, nước mặt và dạng khác) trong tổng thể tích nước ngọt toàn cầu, dạng biểu đồ nào sau đây là thích hợp nhất?',
      options: [
        { key: 'A', content: 'Biểu đồ tròn.' },
        { key: 'B', content: 'Biểu đồ đường.' },
        { key: 'C', content: 'Biểu đồ miền.' },
        { key: 'D', content: 'Biểu đồ kết hợp cột và đường.' }
      ],
      correctOption: 'A',
      explanation: 'Để thể hiện cơ cấu (tỉ trọng) của một tổng thể các thành phần trong 1 thời điểm cụ thể, biểu đồ tròn là dạng biểu đồ thích hợp và trực quan nhất.'
    },
    {
      grade: '10',
      topicKeywords: ['biểu đồ', 'kĩ năng', 'tốc độ tăng trưởng', 'dạng biểu đồ'],
      level: 'Thông hiểu',
      content: 'Để thể hiện tốc độ tăng trưởng quy mô dân số và sản lượng khai thác dầu mỏ của thế giới giai đoạn 2000 - 2024 (lấy năm 2000 = 100%), dạng biểu đồ nào sau đây là thích hợp nhất?',
      options: [
        { key: 'A', content: 'Biểu đồ đường.' },
        { key: 'B', content: 'Biểu đồ tròn.' },
        { key: 'C', content: 'Biểu đồ miền.' },
        { key: 'D', content: 'Biểu đồ cột chồng.' }
      ],
      correctOption: 'A',
      explanation: 'Từ khóa "tốc độ tăng trưởng" với mốc gốc 100% qua nhiều năm luôn tương ứng với biểu đồ đường (biểu đồ đồ thị).'
    },

    // =========================================================================
    // ĐỊA LÍ 11 (KINH TẾ - XÃ HỘI THẾ GIỚI, KHU VỰC, ASEAN, KĨ NĂNG BẢNG SỐ LIỆU & BIỂU ĐỒ)
    // =========================================================================
    {
      grade: '11',
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
      grade: '11',
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
      grade: '11',
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
      grade: '11',
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
      grade: '11',
      topicKeywords: ['mê công', 'mrc', 'hiệp định', 'ủy hội'],
      level: 'Nhận biết',
      content: 'Ủy hội sông Mê Công quốc tế (MRC) được thành lập dựa trên Hiệp định Hợp tác phát triển bền vững lưu vực sông Mê Công vào năm nào sau đây?',
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
      grade: '11',
      topicKeywords: ['biển đông', 'tài nguyên', 'thủy sản', 'chiến lược'],
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
    {
      grade: '11',
      topicKeywords: ['đông nam á', 'asean', 'kinh tế', 'trụ cột'],
      level: 'Thông hiểu',
      content: 'Mục tiêu tổng quát hàng đầu của Cộng đồng ASEAN (thành lập năm 2015) là:',
      options: [
        { key: 'A', content: 'Xây dựng một cộng đồng gắn kết về chính trị, liên kết về kinh tế và chia sẻ trách nhiệm xã hội.' },
        { key: 'B', content: 'Thành lập một liên minh quân sự chung để đối đầu với các khối nước ngoài.' },
        { key: 'C', content: 'Sử dụng chung một loại hộ chiếu và xoá bỏ quyền tự quyết của các quốc gia thành viên.' },
        { key: 'D', content: 'Đồng nhất cơ cấu sản xuất công nghiệp giữa tất cả 11 quốc gia.' }
      ],
      correctOption: 'A',
      explanation: 'Cộng đồng ASEAN xây dựng dựa trên 3 trụ cột: Cộng đồng Chính trị - An ninh (APSC), Cộng đồng Kinh tế (AEC) và Cộng đồng Văn hoá - Xã hội (ASCC).'
    },
    {
      grade: '11',
      topicKeywords: ['bảng số liệu', 'kĩ năng', 'gdp', 'đông nam á', 'in-đô-nê-xi-a'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu: QUY MÔ GDP CỦA MỘT SỐ QUỐC GIA ĐÔNG NAM Á NĂM 2015 VÀ NĂM 2022 (Tỉ USD)\n| Quốc gia | In-đô-nê-xi-a | Thái Lan | Xin-ga-po | Việt Nam |\n| Năm 2015 | 860,9 | 401,4 | 308,0 | 193,2 |\n| Năm 2022 | 1319,1 | 495,3 | 466,8 | 408,8 |\nTheo bảng số liệu, nhận xét nào sau đây đúng khi so sánh quy mô GDP giữa các quốc gia năm 2022 so với năm 2015?',
      options: [
        { key: 'A', content: 'Việt Nam có tốc độ tăng trưởng GDP nhanh nhất (tăng hơn 2,1 lần).' },
        { key: 'B', content: 'Thái Lan có quy mô GDP lớn nhất khu vực vào năm 2022.' },
        { key: 'C', content: 'Xin-ga-po có quy mô GDP tăng chậm nhất trong 4 quốc gia.' },
        { key: 'D', content: 'In-đô-nê-xi-a có quy mô GDP giảm sút trong giai đoạn trên.' }
      ],
      correctOption: 'A',
      explanation: 'Tốc độ tăng trưởng GDP 2022/2015: Việt Nam = 408,8 / 193,2 ≈ 2,12 lần (tăng nhanh nhất); In-đô-nê-xi-a = 1,53 lần; Thái Lan = 1,23 lần; Xin-ga-po = 1,52 lần.'
    },
    {
      grade: '11',
      topicKeywords: ['biểu đồ', 'kĩ năng', 'quy mô cơ cấu', 'dạng biểu đồ', 'xuất nhập khẩu'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu: TRỊ GIÁ XUẤT KHẨU VÀ NHẬP KHẨU HÀNG HOÁ CỦA LIÊN MINH CHÂU ÂU (EU) NĂM 2015 VÀ NĂM 2023 (Tỉ USD)\n| Năm | Xuất khẩu | Nhập khẩu |\n| 2015 | 1790,5 | 1727,4 |\n| 2023 | 2556,2 | 2511,8 |\nĐể thể hiện quy mô và cơ cấu trị giá xuất - nhập khẩu hàng hoá của EU năm 2015 và 2023, dạng biểu đồ nào sau đây là thích hợp nhất?',
      options: [
        { key: 'A', content: 'Biểu đồ tròn (có bán kính khác nhau).' },
        { key: 'B', content: 'Biểu đồ đường.' },
        { key: 'C', content: 'Biểu đồ miền.' },
        { key: 'D', content: 'Biểu đồ thanh ngang phân tán.' }
      ],
      correctOption: 'A',
      explanation: 'Thể hiện "quy mô và cơ cấu" trong 2 năm cụ thể thì biểu đồ tròn có bán kính khác nhau (bán kính tương ứng với quy mô tổng trị giá) là chuẩn xác nhất.'
    },
    {
      grade: '11',
      topicKeywords: ['biểu đồ', 'kĩ năng', 'chuyển dịch cơ cấu', 'dạng biểu đồ', 'miền'],
      level: 'Thông hiểu',
      content: 'Để thể hiện sự chuyển dịch cơ cấu GDP phân theo ngành kinh tế (Nông nghiệp, Công nghiệp, Dịch vụ) của một quốc gia qua 5 năm liên tục, dạng biểu đồ nào sau đây là thích hợp nhất?',
      options: [
        { key: 'A', content: 'Biểu đồ miền.' },
        { key: 'B', content: 'Biểu đồ cột đơn vị.' },
        { key: 'C', content: 'Biểu đồ tròn.' },
        { key: 'D', content: 'Biểu đồ đường đơn.' }
      ],
      correctOption: 'A',
      explanation: 'Thể hiện "sự chuyển dịch cơ cấu" qua chuỗi thời gian dài (từ 4 năm trở lên) theo cơ cấu 100% thì biểu đồ miền là thích hợp nhất.'
    },

    // =========================================================================
    // ĐỊA LÍ 12 (ĐỊA LÍ VIỆT NAM, VỊ TRÍ, TỰ NHIÊN, DÂN CƯ, KINH TẾ, VÙNG KINH TẾ, SKILLS)
    // =========================================================================
    {
      grade: '12',
      topicKeywords: ['vị trí', 'lãnh thổ', 'hành chính', '34 tỉnh'],
      level: 'Nhận biết',
      content: 'Theo phương án sắp xếp tổ chức đơn vị hành chính cấp tỉnh được cập nhật trong chương trình Địa lí 12, nước ta có bao nhiêu đơn vị hành chính cấp tỉnh?',
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
      grade: '12',
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
      grade: '12',
      topicKeywords: ['dân số', 'dân số vàng', 'già hóa', 'cơ cấu tuổi'],
      level: 'Thông hiểu',
      content: 'Theo số liệu thống kê năm 2024, đặc điểm nổi bật trong cơ cấu dân số theo độ tuổi của nước ta là:',
      options: [
        { key: 'A', content: 'Đang trong thời kì cơ cấu dân số vàng (nhóm 15-64 tuổi chiếm 67,4%) đồng thời có xu hướng già hoá nhanh.' },
        { key: 'B', content: 'Cơ cấu dân số trẻ với tỉ lệ trẻ em dưới 15 tuổi chiếm trên 50%.' },
        { key: 'C', content: 'Tỉ lệ người cao tuổi từ 65 tuổi trở lên chiếm đa số trong tổng dân số.' },
        { key: 'D', content: 'Lực lượng lao động suy giảm nghiêm trọng do mức sinh tăng cao.' }
      ],
      correctOption: 'A',
      explanation: 'Năm 2024, cơ cấu tuổi của nước ta: nhóm dưới 15 tuổi chiếm 23,3%, nhóm 15-64 tuổi chiếm 67,4% (dân số vàng), nhóm 65 tuổi trở lên tăng lên 9,3% (bước vào giai đoạn già hoá).'
    },
    {
      grade: '12',
      topicKeywords: ['đô thị hóa', 'gdp', 'thành thị', 'động lực'],
      level: 'Thông hiểu',
      content: 'Vai trò kinh tế nổi bật của mạng lưới đô thị ở nước ta hiện nay được thể hiện rõ qua đặc điểm nào sau đây?',
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
      grade: '12',
      topicKeywords: ['cơ cấu kinh tế', 'gdp', 'dịch vụ', 'nông nghiệp'],
      level: 'Nhận biết',
      content: 'Trong cơ cấu GDP phân theo ngành kinh tế của nước ta năm 2024, khu vực chiếm tỉ trọng cao nhất là:',
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
      grade: '12',
      topicKeywords: ['nông nghiệp', 'lúa gạo', 'cây công nghiệp', 'chuyển dịch'],
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
      grade: '12',
      topicKeywords: ['thiên tai', 'bão', 'mùa bão', 'quy luật'],
      level: 'Thông hiểu',
      content: 'Quy luật di chuyển của mùa bão dọc theo bờ biển nước ta là:',
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
      grade: '12',
      topicKeywords: ['xâm nhập mặn', 'đồng bằng sông cửu long', '4 phần nghìn'],
      level: 'Vận dụng',
      content: 'Ranh giới đo độ mặn xâm nhập gây hại nghiêm trọng đến sinh hoạt và cây trồng ở Đồng bằng sông Cửu Long thường được xác định ở ngưỡng nồng độ mặn nào sau đây?',
      options: [
        { key: 'A', content: '4‰ (bốn phần nghìn).' },
        { key: 'B', content: '0,1‰ (không phẩy một phần nghìn).' },
        { key: 'C', content: '35‰ (ba mươi lăm phần nghìn).' },
        { key: 'D', content: '50‰ (năm mươi phần nghìn).' }
      ],
      correctOption: 'A',
      explanation: 'Trong quan trắc thuỷ văn và nông nghiệp, ranh giới độ mặn 4‰ được coi là giới hạn nguy hiểm làm cây trồng bị chết và nguồn nước không thể dùng cho sinh hoạt nếu chưa qua xử lí.'
    },
    {
      grade: '12',
      topicKeywords: ['đông nam bộ', 'công nghiệp', 'vùng kinh tế', 'hạ tầng'],
      level: 'Thông hiểu',
      content: 'Vùng Đông Nam Bộ dẫn đầu cả nước về giá trị sản xuất công nghiệp và thu hút vốn FDI nhờ lợi thế nổi bật nào sau đây?',
      options: [
        { key: 'A', content: 'Vị trí địa lí thuận lợi, kết cấu hạ tầng giao thông - cảng biển hiện đại đồng bộ, lực lượng lao động có trình độ kĩ thuật cao và chính sách thu hút đầu tư linh hoạt.' },
        { key: 'B', content: 'Nguồn tài nguyên khoáng sản kim loại màu phong phú nhất cả nước.' },
        { key: 'C', content: 'Diện tích đất phù sa ngọt phì nhiêu rộng lớn nhất.' },
        { key: 'D', content: 'Có trữ lượng than đá bùn lớn nhất Đông Nam Á.' }
      ],
      correctOption: 'A',
      explanation: 'Đông Nam Bộ là đầu tàu kinh tế cả nước nhờ hạ tầng giao thông kết nối hoàn chỉnh (cụm cảng Cái Mép - Thị Vải, sân bay Long Thành, cao tốc), nguồn lao động năng động và các khu công nghiệp tập trung quy mô lớn.'
    },
    {
      grade: '12',
      topicKeywords: ['biển đảo', 'hoàng sa', 'trường sa', 'chủ quyền'],
      level: 'Nhận biết',
      content: 'Hai quần đảo xa bờ Hoàng Sa và Trường Sa thuộc chủ quyền thiêng liêng của Việt Nam lần lượt trực thuộc đơn vị hành chính cấp tỉnh nào của nước ta?',
      options: [
        { key: 'A', content: 'Huyện đảo Hoàng Sa thuộc thành phố Đà Nẵng, huyện đảo Trường Sa thuộc tỉnh Khánh Hoà.' },
        { key: 'B', content: 'Hoàng Sa thuộc tỉnh Quảng Ninh, Trường Sa thuộc tỉnh Bình Thuận.' },
        { key: 'C', content: 'Cả hai huyện đảo đều trực thuộc trực tiếp thành phố Hồ Chí Minh.' },
        { key: 'D', content: 'Hoàng Sa thuộc tỉnh Thừa Thiên Huế, Trường Sa thuộc tỉnh Bà Rịa - Vũng Tàu.' }
      ],
      correctOption: 'A',
      explanation: 'Về mặt hành chính, Huyện đảo Hoàng Sa thuộc thành phố Đà Nẵng và Huyện đảo Trường Sa thuộc tỉnh Khánh Hoà, là cơ sở pháp lý và lịch sử khẳng định chủ quyền lãnh thổ trên biển của Tổ quốc.'
    },
    {
      grade: '12',
      topicKeywords: ['làng nghề', 'truyền thống', 'du lịch', 'nông thôn'],
      level: 'Thông hiểu',
      content: 'Ý nghĩa kinh tế - xã hội quan trọng nhất của việc bảo tồn và phát triển các làng nghề truyền thống ở nước ta là:',
      options: [
        { key: 'A', content: 'Tạo việc làm, tăng thu nhập cho lao động nông thôn lúc nông nhàn, thúc đẩy chuyển dịch cơ cấu kinh tế gắn liền với phát triển du lịch trải nghiệm và bảo tồn bản sắc văn hoá dân tộc.' },
        { key: 'B', content: 'Thay thế hoàn toàn ngành công nghiệp nặng hiện đại.' },
        { key: 'C', content: 'Xoá bỏ các thị trường xuất khẩu hàng hoá nước ngoài.' },
        { key: 'D', content: 'Tập trung 100% dân số cả nước vào làm nghề thủ công.' }
      ],
      correctOption: 'A',
      explanation: 'Phát triển làng nghề giúp giải quyết việc làm tại chỗ cho hàng triệu lao động nông nhàn, nâng cao giá trị hàng thủ công mỹ nghệ xuất khẩu và tạo sản phẩm du lịch văn hoá độc đáo.'
    },
    {
      grade: '12',
      topicKeywords: ['bảng số liệu', 'kĩ năng', 'cơ cấu gdp', 'ngành kinh tế', 'việt nam'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu: CƠ CẤU GDP PHÂN THEO NGÀNH KINH TẾ CỦA NƯỚC TA GIAI ĐOẠN 2010 - 2024 (%)\n| Khu vực kinh tế | 2010 | 2015 | 2020 | 2024 |\n| Nông, lâm, thuỷ sản | 15,4 | 14,0 | 12,7 | 11,9 |\n| Công nghiệp và xây dựng | 33,8 | 34,0 | 36,7 | 37,6 |\n| Dịch vụ | 41,0 | 41,6 | 41,8 | 42,4 |\n| Thuế sản phẩm trừ trợ cấp | 9,8 | 10,4 | 8,8 | 8,1 |\nTheo bảng số liệu trên, nhận xét nào sau đây đúng về sự chuyển dịch cơ cấu GDP của nước ta giai đoạn 2010 - 2024?',
      options: [
        { key: 'A', content: 'Tỉ trọng khu vực Dịch vụ luôn chiếm vị trí cao nhất và có xu hướng tăng liên tục.' },
        { key: 'B', content: 'Tỉ trọng Nông, lâm, thuỷ sản có xu hướng tăng nhanh qua các năm.' },
        { key: 'C', content: 'Tỉ trọng Công nghiệp và xây dựng giảm mạnh từ 2010 đến 2024.' },
        { key: 'D', content: 'Thuế sản phẩm trừ trợ cấp chiếm tỉ trọng lớn thứ hai trong cơ cấu GDP.' }
      ],
      correctOption: 'A',
      explanation: 'Dịch vụ luôn chiếm tỉ trọng lớn nhất (tăng từ 41,0% lên 42,4%); Nông, lâm, thuỷ sản giảm từ 15,4% xuống 11,9%; Công nghiệp - xây dựng tăng từ 33,8% lên 37,6%.'
    },
    {
      grade: '12',
      topicKeywords: ['bảng số liệu', 'kĩ năng', 'lúa', 'diện tích', 'sản lượng'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu: DIỆN TÍCH VÀ SẢN LƯỢNG LÚA CỦA NƯỚC TA NĂM 2015 VÀ NĂM 2024\n| Năm | 2015 | 2024 |\n| Diện tích gieo trồng (nghìn ha) | 7828,0 | 7127,1 |\n| Sản lượng lúa (nghìn tấn) | 45091,0 | 43500,0 |\nTheo bảng số liệu, năng suất lúa bình quân của nước ta năm 2024 so với năm 2015 đã thay đổi như thế nào?',
      options: [
        { key: 'A', content: 'Tăng thêm khoảng 3,4 tạ/ha (từ 57,6 tạ/ha lên 61,0 tạ/ha).' },
        { key: 'B', content: 'Giảm xuống do diện tích gieo trồng bị thu hẹp.' },
        { key: 'C', content: 'Giữ nguyên không thay đổi qua các năm.' },
        { key: 'D', content: 'Tăng gấp đôi nhờ mở rộng diện tích canh tác.' }
      ],
      correctOption: 'A',
      explanation: 'Năng suất 2015 = (45091 * 10) / 7828 ≈ 57,6 tạ/ha. Năng suất 2024 = (43500 * 10) / 7127,1 ≈ 61,0 tạ/ha. Năng suất tăng 3,4 tạ/ha.'
    },
    {
      grade: '12',
      topicKeywords: ['biểu đồ', 'kĩ năng', 'dạng biểu đồ', 'xuất nhập khẩu', 'quy mô cơ cấu'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu về Quy mô và cơ cấu xuất - nhập khẩu hàng hoá của nước ta năm 2015 và 2024 (tổng kim ngạch và cơ cấu % giữa xuất khẩu và nhập khẩu). Để thể hiện quy mô và cơ cấu xuất nhập khẩu của nước ta trong 2 năm trên, dạng biểu đồ nào sau đây là thích hợp nhất?',
      options: [
        { key: 'A', content: 'Biểu đồ tròn có bán kính khác nhau.' },
        { key: 'B', content: 'Biểu đồ đường.' },
        { key: 'C', content: 'Biểu đồ miền.' },
        { key: 'D', content: 'Biểu đồ tán xạ.' }
      ],
      correctOption: 'A',
      explanation: 'Yêu cầu thể hiện cả "quy mô" (tổng kim ngạch) và "cơ cấu" (% xuất - nhập khẩu) trong 2 mốc năm thì biểu đồ tròn có bán kính tỉ lệ với quy mô là tối ưu nhất.'
    },
    {
      grade: '12',
      topicKeywords: ['biểu đồ', 'kĩ năng', 'diện tích sản lượng', 'kết hợp', 'cột đường'],
      level: 'Thông hiểu',
      content: 'Để thể hiện diện tích gieo trồng (nghìn ha) và sản lượng lúa (nghìn tấn) của nước ta giai đoạn 2010 - 2024 với hai đơn vị đo lường khác nhau trên cùng một hệ trục, dạng biểu đồ nào sau đây là thích hợp nhất?',
      options: [
        { key: 'A', content: 'Biểu đồ kết hợp cột và đường (hai trục tung).' },
        { key: 'B', content: 'Biểu đồ tròn.' },
        { key: 'C', content: 'Biểu đồ miền.' },
        { key: 'D', content: 'Biểu đồ phân tán.' }
      ],
      correctOption: 'A',
      explanation: 'Khi thể hiện 2 đối tượng có đơn vị đo lường khác nhau (nghìn ha và nghìn tấn) qua nhiều năm, dạng biểu đồ kết hợp (cột thể hiện diện tích, đường thể hiện sản lượng) với 2 trục tung là chính xác nhất.'
    }
  ],

  tf: [
    // =========================================================================
    // CÂU HỎI ĐÚNG / SAI (4 PHÁT BIỂU a, b, c, d) - ĐỊA LÍ 10, 11, 12
    // =========================================================================
    {
      grade: '10',
      topicKeywords: ['phương pháp bản đồ', 'gis', 'gps', 'địa lí 10'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau về ứng dụng của công nghệ địa lí hiện đại:\n"Hệ thống thông tin địa lí (GIS) và Hệ thống định vị toàn cầu (GPS) là hai công cụ đột phá của cuộc cách mạng khoa học kĩ thuật trong ngành Địa lí. GIS cho phép thu thập, lưu trữ, quản lí, phân tích và hiển thị không gian các dữ liệu địa lí đa tầng; trong khi GPS giúp định vị chính xác vị trí toạ độ trên mặt đất dựa vào tín hiệu từ các chùm vệ tinh."\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'GPS có chức năng cơ bản là xác định toạ độ địa lí (kinh độ, vĩ độ, độ cao) và dẫn đường cho các phương tiện di chuyển.', isCorrect: true, explanation: 'Đúng: Đây là chức năng cốt lõi của hệ thống GPS.' },
        { key: 'b', statement: 'GIS chỉ có khả năng lưu trữ văn bản đơn thuần, không thể chồng xếp và phân tích các lớp bản đồ chuyên đề.', isCorrect: false, explanation: 'Sai: Thế mạnh nổi trội nhất của GIS là phân tích không gian và chồng xếp đa lớp bản đồ (địa hình, thuỷ văn, sử dụng đất...).' },
        { key: 'c', statement: 'Việc kết hợp GPS và GIS giúp ngành khí tượng thuỷ văn theo dõi đường đi của bão và cảnh báo ngập lụt hiệu quả.', isCorrect: true, explanation: 'Đúng: Dữ liệu định vị thời gian thực kết hợp phân tích địa hình giúp mô phỏng vùng ngập lụt chính xác.' },
        { key: 'd', statement: 'Công nghệ GIS chỉ được sử dụng trong lĩnh vực quân sự, hoàn toàn không có ứng dụng trong quy hoạch đô thị và nông nghiệp.', isCorrect: false, explanation: 'Sai: GIS được ứng dụng rộng rãi trong quy hoạch đô thị thông minh, quản lí tài nguyên rừng, đất đai và giao thông.' }
      ],
      explanation: 'Nhận định a, c là ĐÚNG; b, d là SAI.'
    },
    {
      grade: '11',
      topicKeywords: ['mê công', 'mrc', 'an ninh nguồn nước', 'địa lí 11'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau về Ủy hội sông Mê Công (MRC):\n"Lưu vực sông Mê Công có diện tích 810.000 km², bắt nguồn từ cao nguyên Tây Tạng chảy qua 6 quốc gia: Trung Quốc, Mi-an-ma, Lào, Thái Lan, Cam-pu-chia và Việt Nam. Ủy hội sông Mê Công quốc tế được thành lập nhằm thúc đẩy phối hợp quản lí và phát triển bền vững tài nguyên nước, thông qua 5 thủ tục then chốt gồm PDIES, PWUM, PNPCA, PMFM và PWQ."\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Sông Mê Công khi chảy vào lãnh thổ Việt Nam chia thành hai nhánh lớn là sông Tiền và sông Hậu rồi đổ ra Biển Đông.', isCorrect: true, explanation: 'Đúng: Chảy vào ĐBSCL, sông tách thành sông Tiền và sông Hậu (Cửu Long).' },
        { key: 'b', statement: 'Việc xây dựng ồ ạt các đập thuỷ điện trên dòng chính ở thượng nguồn không gây ra bất kì tác động nào đến lưu lượng phù sa và chế độ nước ở hạ lưu.', isCorrect: false, explanation: 'Sai: Các đập thuỷ điện thượng lưu giữ lại lượng lớn phù sa và làm thay đổi chu kì lũ tự nhiên, gia tăng sạt lở bờ sông và xâm nhập mặn ở ĐBSCL.' },
        { key: 'c', statement: 'Thủ tục Trao đổi và chia sẻ thông tin số liệu (PDIES) giúp các quốc gia thành viên minh bạch hoá dữ liệu thuỷ văn và vận hành hồ chứa.', isCorrect: true, explanation: 'Đúng: PDIES được thông qua năm 2001 để chia sẻ số liệu giám sát nguồn nước liên quốc gia.' },
        { key: 'd', statement: 'Việt Nam đóng vai trò tích cực trong Ủy hội Mê Công nhằm bảo vệ an ninh nguồn nước và sinh kế bền vững cho hàng chục triệu người dân Đồng bằng sông Cửu Long.', isCorrect: true, explanation: 'Đúng: ĐBSCL nằm ở cuối nguồn, chịu ảnh hưởng trực tiếp nhất từ mọi can thiệp nguồn nước ở thượng lưu.' }
      ],
      explanation: 'Nhận định a, c, d là ĐÚNG; b là SAI.'
    },
    {
      grade: '12',
      topicKeywords: ['vị trí địa lí', 'lãnh thổ', 'khí hậu', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau về vị trí địa lí và lãnh thổ nước ta:\n"Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, ở khu vực gió mùa châu Á, tiếp giáp Biển Đông rộng lớn. Vị trí địa lí đã quy định đặc điểm cơ bản của thiên nhiên Việt Nam mang tính chất nhiệt đới ẩm gió mùa, có sự phân hoá sâu sắc theo không gian và thời gian. Lãnh thổ nước ta gồm vùng đất liền, vùng biển và vùng trời với 34 đơn vị hành chính cấp tỉnh."\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Nước ta có nền nhiệt độ cao, chan hoà ánh nắng là do nằm trọn vẹn trong vùng nội chí tuyến bán cầu Bắc.', isCorrect: true, explanation: 'Đúng: Vị trí nội chí tuyến quy định góc nhập xạ lớn và bức xạ mặt trời dồi dào quanh năm.' },
        { key: 'b', statement: 'Tính chất gió mùa của khí hậu Việt Nam là do vị trí tiếp giáp giữa lục địa Á - Âu và đại dương Thái Bình Dương/Ấn Độ Dương.', isCorrect: true, explanation: 'Đúng: Vị trí nằm trong khu vực hoạt động của hoàn lưu gió mùa châu Á.' },
        { key: 'c', statement: 'Toàn bộ vùng lãnh hải 12 hải lí của nước ta được coi là vùng biển quốc tế tự do tàu bè nước ngoài đánh bắt hải sản không cần xin phép.', isCorrect: false, explanation: 'Sai: Vùng lãnh hải là lãnh thổ thuộc chủ quyền hoàn toàn, tuyệt đối của Việt Nam, ranh giới ngoài là biên giới quốc gia trên biển.' },
        { key: 'd', statement: 'Sự phân hoá thiên nhiên theo chiều Bắc - Nam qua dãy Bạch Mã chủ yếu là do sự suy giảm tác động của gió mùa Đông Bắc về phía Nam.', isCorrect: true, explanation: 'Đúng: Dãy Bạch Mã ngăn cản gió mùa Đông Bắc, tạo nên ranh giới khí hậu giữa miền Bắc (có mùa đông lạnh) và miền Nam (cận xích đạo nóng quanh năm).' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    },
    {
      grade: '12',
      topicKeywords: ['bảng số liệu', 'dân số', 'cơ cấu tuổi', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu về Cơ cấu dân số theo nhóm tuổi của nước ta giai đoạn 1999 - 2024 (%):\n- Năm 1999: Dưới 15 tuổi = 33,1%; Từ 15 đến 64 tuổi = 61,1%; Từ 65 tuổi trở lên = 5,8%.\n- Năm 2009: Dưới 15 tuổi = 24,5%; Từ 15 đến 64 tuổi = 69,1%; Từ 65 tuổi trở lên = 6,4%.\n- Năm 2019: Dưới 15 tuổi = 24,3%; Từ 15 đến 64 tuổi = 68,0%; Từ 65 tuổi trở lên = 7,7%.\n- Năm 2024: Dưới 15 tuổi = 23,3%; Từ 15 đến 64 tuổi = 67,4%; Từ 65 tuổi trở lên = 9,3%.\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Giai đoạn 1999 - 2024, tỉ trọng nhóm tuổi dưới 15 tuổi giảm liên tục, phản ánh mức sinh ở nước ta có xu hướng giảm.', isCorrect: true, explanation: 'Đúng: Tỉ trọng giảm từ 33,1% xuống 23,3% do hiệu quả của chính sách dân số kế hoạch hoá gia đình.' },
        { key: 'b', statement: 'Năm 2024, nhóm tuổi từ 15 đến 64 tuổi chiếm 67,4% cho thấy nước ta vẫn đang duy trì lợi thế cơ cấu dân số vàng.', isCorrect: true, explanation: 'Đúng: Tỉ lệ lao động chiếm trên 66% tổng dân số là biểu hiện đặc trưng của thời kì dân số vàng.' },
        { key: 'c', statement: 'Tỉ trọng nhóm từ 65 tuổi trở lên tăng nhanh đạt 9,3% năm 2024 là minh chứng cho thấy nước ta chưa bước vào quá trình già hoá dân số.', isCorrect: false, explanation: 'Sai: Tỉ lệ trên 65 tuổi vượt 7% và tiệm cận 10% chứng tỏ nước ta đang già hoá dân số với tốc độ nhanh.' },
        { key: 'd', statement: 'Cơ cấu dân số hiện nay đòi hỏi nước ta phải tập trung nâng cao chất lượng đào tạo nghề cho lao động trẻ và hoàn thiện hệ thống an sinh xã hội cho người cao tuổi.', isCorrect: true, explanation: 'Đúng: Đây là hai chiến lược cốt lõi để tận dụng cơ hội dân số vàng và thích ứng với già hoá dân số.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    },
    {
      grade: '12',
      topicKeywords: ['bảng số liệu', 'thiên tai', 'bão', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu về Số cơn bão và áp thấp nhiệt đới trên Biển Đông ảnh hưởng trực tiếp đến đất liền Việt Nam giai đoạn 2010 - 2024:\n- Năm 2010: Hoạt động Biển Đông = 9 cơn; Ảnh hưởng đất liền = 5 cơn.\n- Năm 2015: Hoạt động Biển Đông = 6 cơn; Ảnh hưởng đất liền = 5 cơn.\n- Năm 2019: Hoạt động Biển Đông = 12 cơn; Ảnh hưởng đất liền = 6 cơn.\n- Năm 2021: Hoạt động Biển Đông = 11 cơn; Ảnh hưởng đất liền = 6 cơn.\n- Năm 2024: Hoạt động Biển Đông = 10 cơn; Ảnh hưởng đất liền = 4 cơn.\nXét tính đúng/sai của các nhận định sau:',
      items: [
        { key: 'a', statement: 'Trung bình hàng năm có từ 10 - 12 cơn bão và áp thấp nhiệt đới hoạt động trên Biển Đông, trong đó khoảng 4 - 6 cơn đổ bộ trực tiếp vào đất liền nước ta.', isCorrect: true, explanation: 'Đúng: Số liệu thống kê phản ánh chính xác tần suất bão trên Biển Đông.' },
        { key: 'b', statement: 'Tất cả các vùng ven biển nước ta từ Bắc vào Nam đều chịu tần suất bão đổ bộ như nhau vào tháng 6 hàng năm.', isCorrect: false, explanation: 'Sai: Tần suất bão có sự phân hoá rõ rệt và chậm dần từ Bắc vào Nam theo các tháng trong năm.' },
        { key: 'c', statement: 'Bão đổ bộ thường kèm theo gió mạnh, mưa lớn, nước dâng và sóng thần gây ngập lụt ven biển, phá huỷ công trình hạ tầng.', isCorrect: true, explanation: 'Đúng: Hậu quả tổng hợp của bão là gió giật, triều cường nước biển dâng và sạt lở ngập úng nghiêm trọng.' },
        { key: 'd', statement: 'Biện pháp công trình hiệu quả nhất trong phòng chống bão là củng cố hệ thống đê biển, trồng rừng ngập mặn chắn sóng và xây dựng khu neo đậu tàu thuyền an toàn.', isCorrect: true, explanation: 'Đúng: Kết hợp giữa công trình đê kè, rừng ngập mặn sinh thái và khu tránh trú bão là giải pháp phòng ngừa căn cơ.' }
      ],
      explanation: 'Nhận định a, c, d là ĐÚNG; b là SAI.'
    }
  ],

  short: [
    // =========================================================================
    // CÂU HỎI TRẢ LỜI NGẮN (TÍNH TOÁN KĨ NĂNG ĐỊA LÍ 10, 11, 12)
    // =========================================================================
    {
      grade: '10',
      topicKeywords: ['nhiệt độ', 'địa hình', 'đai cao', 'địa lí 10'],
      level: 'Vận dụng cao',
      content: 'Tại chân núi (độ cao 150 m), trạm khí tượng ghi nhận nhiệt độ không khí là $28,5^\\circ\\text{C}$. Theo quy luật đai cao trong tầng đối lưu, nhiệt độ không khí trung bình giảm $0,6^\\circ\\text{C}$ khi lên cao $100\\text{ m}$. Hỏi tại đỉnh núi có độ cao $2150\\text{ m}$, nhiệt độ không khí dự kiến là bao nhiêu $^\\circ\\text{C}$ (làm tròn kết quả đến một chữ số thập phân)? Khi trả lời, chỉ ghi số.',
      key: '16,5',
      explanation: 'Độ chênh lệch độ cao: $\\Delta h = 2150 - 150 = 2000\\text{ m}$. Độ giảm nhiệt độ: $\\Delta T = \\frac{2000}{100} \\times 0,6 = 12,0^\\circ\\text{C}$. Nhiệt độ tại đỉnh núi: $T_{\\text{đỉnh}} = 28,5 - 12,0 = 16,5^\\circ\\text{C}$.'
    },
    {
      grade: '10',
      topicKeywords: ['biên độ nhiệt', 'khí hậu', 'địa lí 10'],
      level: 'Thông hiểu',
      content: 'Tại một trạm khí tượng, nhiệt độ trung bình tháng 1 (tháng lạnh nhất) là $16,4^\\circ\\text{C}$, nhiệt độ trung bình tháng 7 (tháng nóng nhất) là $28,9^\\circ\\text{C}$. Hãy tính biên độ nhiệt độ trung bình năm tại trạm khí tượng đó (đơn vị: $^\\circ\\text{C}$, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '12,5',
      explanation: '$\\text{Biên độ nhiệt năm} = T_{\\text{tháng cao nhất}} - T_{\\text{tháng thấp nhất}} = 28,9 - 16,4 = 12,5^\\circ\\text{C}$.'
    },
    {
      grade: '11',
      topicKeywords: ['tốc độ tăng trưởng', 'gdp', 'mỹ la-tinh', 'địa lí 11'],
      level: 'Vận dụng',
      content: 'Quy mô GDP của Bra-xin năm 2000 là $655,5\\text{ tỉ USD}$, năm 2020 đạt $1448,6\\text{ tỉ USD}$. Hãy cho biết tốc độ tăng trưởng GDP của Bra-xin năm 2020 so với năm 2000 là bao nhiêu % (lấy năm 2000 = 100%, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '221,0',
      explanation: '$\\text{Tốc độ tăng trưởng} = \\frac{1448,6}{655,5} \\times 100\\% \\approx 220,99\\% \\approx 221,0\\%$.'
    },
    {
      grade: '11',
      topicKeywords: ['mật độ dân số', 'đông nam á', 'địa lí 11'],
      level: 'Vận dụng',
      content: 'Năm 2022, diện tích của Phi-lip-pin là $300000\\text{ km}^2$, quy mô dân số là $115,6\\text{ triệu người}$ ($115600000\\text{ người}$). Hãy tính mật độ dân số của Phi-lip-pin năm 2022 (đơn vị: người/km², làm tròn đến hàng đơn vị). Khi trả lời, chỉ ghi số.',
      key: '385',
      explanation: '$\\text{Mật độ dân số} = \\frac{115600000}{300000} \\approx 385,3\\text{ người/km}^2 \\approx 385\\text{ người/km}^2$.'
    },
    {
      grade: '12',
      topicKeywords: ['tỉ lệ', 'thành thị', 'đô thị hóa', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Năm 2024, tổng dân số nước ta là 101,3 triệu người, trong đó số dân sinh sống ở khu vực thành thị là 39,0 triệu người. Hãy tính tỉ lệ dân thành thị của nước ta năm 2024 (đơn vị: %, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '38,5',
      explanation: '$\\text{Tỉ lệ dân thành thị} = \\frac{39,0}{101,3} \\times 100\\% \\approx 38,499\\% \\approx 38,5\\%$.'
    },
    {
      grade: '12',
      topicKeywords: ['tỉ trọng', 'lao động', 'dịch vụ', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Năm 2024, tổng số lao động có việc làm trong nền kinh tế nước ta là 52,4 triệu người, trong đó số lao động làm việc trong khu vực Dịch vụ là 21,07 triệu người. Hãy tính tỉ trọng lao động của khu vực Dịch vụ trong tổng số lao động năm 2024 (đơn vị: %, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '40,2',
      explanation: '$\\text{Tỉ trọng lao động dịch vụ} = \\frac{21,07}{52,4} \\times 100\\% \\approx 40,21\\% \\approx 40,2\\%$.'
    },
    {
      grade: '12',
      topicKeywords: ['mật độ', 'dân số', 'đồng bằng sông hồng', 'địa lí 12'],
      level: 'Thông hiểu',
      content: 'Năm 2024, diện tích tự nhiên của vùng Đồng bằng sông Hồng là $21278,6\\text{ km}^2$, quy mô dân số của vùng là $22,0$ triệu người. Hãy tính mật độ dân số của vùng Đồng bằng sông Hồng năm 2024 (đơn vị: người/km², làm tròn đến phần nguyên). Khi trả lời, chỉ ghi số.',
      key: '1034',
      explanation: '$\\text{Mật độ dân số} = \\frac{22000000}{21278,6} \\approx 1033,9\\text{ người/km}^2 \\approx 1034\\text{ người/km}^2$.'
    },
    {
      grade: '12',
      topicKeywords: ['năng suất', 'lúa', 'nông nghiệp', 'địa lí 12'],
      level: 'Vận dụng',
      content: 'Năm 2024, diện tích gieo trồng lúa của nước ta là $7127,1\\text{ nghìn ha}$, tổng sản lượng lúa thu hoạch đạt $43,5\\text{ triệu tấn}$ ($43500\\text{ nghìn tấn}$). Hãy tính năng suất lúa bình quân của cả nước năm 2024 (đơn vị: tạ/ha, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '61,0',
      explanation: 'Đổi $43,5\\text{ triệu tấn} = 435000\\text{ nghìn tạ}$. $\\text{Năng suất lúa} = \\frac{435000}{7127,1} \\approx 61,03\\text{ tạ/ha} \\approx 61,0\\text{ tạ/ha}$.'
    }
  ],

  essay: [
    // =========================================================================
    // CÂU HỎI TỰ LUẬN KÈM HƯỚNG DẪN CHẤM CHI TIẾT THEO CHUẨN BỘ GD&ĐT
    // =========================================================================
    {
      grade: '10',
      topicKeywords: ['khí hậu', 'hoàn lưu', 'gió mùa', 'địa lí 10'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức về Khí quyển trong chương trình Địa lí 10:\na) Trình bày nguyên nhân hình thành và hướng hoạt động của các khối khí gió mùa trên Trái Đất.\nb) Giải thích vì sao cùng nằm ở vĩ độ cận nhiệt đới nhưng khu vực Đông Á và Đông Nam Á lại có lượng mưa dồi dào, thảm thực vật rừng rậm xanh tốt trong khi khu vực Tây Á và Bắc Phi lại là sa mạc khô hạn?',
      essayRubric: 'Ý a (1.0đ): Nguyên nhân và hướng hoạt động của gió mùa:\n- Nguyên nhân (0.5đ): Do sự nóng lên và lạnh đi không đều giữa lục địa và đại dương theo mùa, tạo nên sự chênh lệch khí áp giữa lục địa và đại dương.\n- Hướng gió (0.5đ): Mùa hạ gió thổi từ đại dương vào lục địa mang nhiều hơi ẩm gây mưa; mùa đông gió thổi từ lục địa ra đại dương có tính chất lạnh khô.\nÝ b (1.0đ): Giải thích sự khác biệt cảnh quan:\n- Đông Á, Đông Nam Á (0.5đ): Nằm ở rìa phía đông lục địa Á - Âu giáp Thái Bình Dương và Ấn Độ Dương, chịu tác động mạnh mẽ của hoàn lưu gió mùa và dòng biển nóng, mang lại lượng ẩm lớn (1500 - 2000 mm/năm) phát triển rừng nhiệt đới ẩm.\n- Tây Á, Bắc Phi (0.5đ): Nằm sâu trong lục địa hoặc rìa phía tây lục địa, quanh năm thống trị bởi áp cao cận chí tuyến và khối khí chí tuyến khô, không có gió mùa ẩm hoạt động nên hình thành hoang mạc và bán hoang mạc.',
      explanation: 'Hướng dẫn chấm chi tiết nguyên nhân hình thành gió mùa và sự phân hóa khí hậu cảnh quan theo vĩ độ.'
    },
    {
      grade: '11',
      topicKeywords: ['asean', 'liên kết kinh tế', 'địa lí 11'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức về Hiệp hội các quốc gia Đông Nam Á (ASEAN) trong chương trình Địa lí 11:\na) Phân tích các mục tiêu và ba trụ cột cốt lõi của Cộng đồng ASEAN.\nb) Đánh giá những cơ hội và thách thức của Việt Nam khi hội nhập sâu rộng vào Cộng đồng Kinh tế ASEAN (AEC).',
      essayRubric: 'Ý a (1.0đ): Mục tiêu và ba trụ cột của ASEAN:\n- Mục tiêu (0.5đ): Duy trì hoà bình, ổn định khu vực; thúc đẩy tăng trưởng kinh tế, tiến bộ xã hội và phát triển văn hoá; tăng cường hợp tác trên tinh thần bình đẳng và chia sẻ.\n- Ba trụ cột (0.5đ): Cộng đồng Chính trị - An ninh (APSC), Cộng đồng Kinh tế (AEC) và Cộng đồng Văn hoá - Xã hội (ASCC).\nÝ b (1.0đ): Cơ hội và thách thức đối với Việt Nam:\n- Cơ hội (0.5đ): Mở rộng thị trường xuất khẩu hàng hoá; thu hút vốn FDI và chuyển giao công nghệ tiên tiến; tạo việc làm và nâng cao năng lực cạnh tranh.\n- Thách thức (0.5đ): Cạnh tranh gay gắt từ hàng hoá và doanh nghiệp các nước trong khối; yêu cầu chuẩn hoá chất lượng nguồn nhân lực và nguy cơ chảy máu chất xám; áp lực về bảo vệ môi trường và giải quyết chênh lệch phát triển.',
      explanation: 'Hướng dẫn chấm chi tiết cơ cấu trụ cột ASEAN và cơ hội - thách thức của Việt Nam trong AEC.'
    },
    {
      grade: '12',
      topicKeywords: ['địa lí tự nhiên', 'nhiệt đới ẩm', 'gió mùa', 'địa lí 12'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức đã học trong chương trình Địa lí 12:\na) Phân tích các biểu hiện của tính chất nhiệt đới ẩm gió mùa qua thành phần khí hậu và mạng lưới sông ngòi ở nước ta.\nb) Vì sao thiên nhiên nước ta mang tính chất nhiệt đới ẩm gió mùa mà không bị khô hạn như các khu vực khác cùng vĩ độ ở Tây Á hay Bắc Phi?',
      essayRubric: 'Ý a (1.5đ): \n- Khí hậu (0.75đ): Lượng bức xạ mặt trời lớn, cán cân bức xạ quanh năm dương; nhiệt độ trung bình năm >20°C (trừ vùng núi cao); lượng mưa lớn (1500 - 2000 mm/năm), độ ẩm không khí cao >80%; hoạt động luân phiên của gió mùa Đông Bắc và gió mùa Tây Nam tạo nên 2 mùa rõ rệt.\n- Sông ngòi (0.75đ): Mạng lưới sông ngòi dày đặc (2360 con sông dài >10 km); nhiều nước (tổng lượng dòng chảy 839 tỉ m³/năm); giàu phù sa (khoảng 200 triệu tấn/năm); chế độ nước theo mùa trùng khớp với mùa mưa và mùa khô.\nÝ b (0.5đ): \n- Nước ta nằm tiếp giáp Biển Đông rộng lớn (khoảng 1 triệu km²), Biển Đông đóng vai trò là nguồn dự trữ nhiệt ẩm dồi dào, các khối khí di chuyển qua biển được tăng cường hơi nước gây mưa lớn, biến đổi tính chất khô hạn thường thấy ở vùng vĩ độ cận nhiệt Tây Á, Bắc Phi.',
      explanation: 'Hướng dẫn chấm chi tiết biểu hiện khí hậu, sông ngòi và vai trò điều hòa của Biển Đông.'
    },
    {
      grade: '12',
      topicKeywords: ['chuyển dịch cơ cấu', 'kinh tế', 'công nghiệp hóa', 'địa lí 12'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức Địa lí 12, hãy trình bày và phân tích xu hướng chuyển dịch cơ cấu kinh tế theo ngành và theo thành phần kinh tế ở nước ta giai đoạn hiện nay. Ý nghĩa của sự chuyển dịch đó đối với quá trình phát triển đất nước?',
      essayRubric: 'Ý 1 (1.0đ): Chuyển dịch cơ cấu theo ngành:\n- Giảm tỉ trọng ngành nông - lâm - thuỷ sản (từ 15,4% năm 2010 xuống 11,9% năm 2024) (0.25đ).\n- Tăng tỉ trọng ngành công nghiệp và xây dựng (đạt 37,6% năm 2024) và ngành dịch vụ (chiếm tỉ trọng cao nhất 42,4% năm 2024) (0.5đ).\n- Trong nội bộ từng ngành: chuyển dịch theo hướng nâng cao giá trị gia tăng, công nghệ cao, kinh tế xanh (0.25đ).\nÝ 2 (0.5đ): Chuyển dịch cơ cấu theo thành phần kinh tế:\n- Kinh tế Nhà nước giữ vai trò chủ đạo, kiểm soát các ngành then chốt (21,1% GDP năm 2024).\n- Kinh tế ngoài Nhà nước là động lực quan trọng nhất (chiếm 50,4% GDP).\n- Khu vực có vốn đầu tư nước ngoài (FDI) tăng nhanh và đóng vai trò tích cực (đạt 20,4% GDP năm 2024).\nÝ 3 (0.5đ): Ý nghĩa:\n- Thúc đẩy tăng trưởng kinh tế bền vững, đẩy mạnh công nghiệp hoá, hiện đại hoá, nâng cao năng lực cạnh tranh quốc gia và giải quyết việc làm cho người lao động.',
      explanation: 'Phân tích chuyển dịch cơ cấu kinh tế theo ngành và thành phần kinh tế theo số liệu chính thống 2024.'
    },
    {
      grade: '12',
      topicKeywords: ['thiên tai', 'biến đổi khí hậu', 'đồng bằng sông cửu long', 'địa lí 12'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức về thiên tai và biến đổi khí hậu ở nước ta:\na) Hãy nêu các biểu hiện và nguyên nhân chủ yếu của hiện tượng xâm nhập mặn ở Đồng bằng sông Cửu Long vào mùa khô.\nb) Đề xuất các giải pháp công trình và phi công trình để thích ứng bền vững với xâm nhập mặn và biến đổi khí hậu tại vùng Đồng bằng sông Cửu Long.',
      essayRubric: 'Ý a (1.0đ): \n- Biểu hiện (0.5đ): Nước biển mang nồng độ mặn ≥4‰ lấn sâu vào các nhánh sông Tiền, sông Hậu từ 40 - 70 km, gây thiếu nước ngọt cho hàng triệu người dân và thiệt hại diện tích vườn cây ăn trái, lúa, thuỷ sản.\n- Nguyên nhân (0.5đ): Mùa khô kéo dài 4 - 5 tháng; địa hình đồng bằng thấp trũng; mạng lưới kênh rạch chằng chịt kết hợp triều cường; suy giảm dòng chảy thượng nguồn Mê Công do các đập thuỷ điện trữ nước và biến đổi khí hậu.\nÝ b (1.0đ): Các giải pháp thích ứng:\n- Giải pháp công trình (0.5đ): Xây dựng cống ngăn mặn, âu thuyền giữ ngọt (hệ thống Cái Lớn - Cái Bé), nạo vét kênh mương trữ nước ngọt, nâng cấp hệ thống cấp nước sạch nông thôn.\n- Giải pháp phi công trình (0.5đ): Chuyển đổi mô hình sản xuất nông nghiệp "thuận thiên" theo Nghị quyết 120/NQ-CP (lúa - tôm, nuôi trồng thuỷ sản nước lợ/mặn); thay đổi lịch thời vụ né mặn; áp dụng công nghệ tưới tiết kiệm nước; tăng cường hợp tác trong Ủy hội Mê Công quốc tế.',
      explanation: 'Lời giải chi tiết vấn đề xâm nhập mặn và giải pháp thuận thiên tại Đồng bằng sông Cửu Long.'
    }
  ]
};
