import { SubjectQuestionBank } from './bankTypes';

export const DIA_LI_BANK: SubjectQuestionBank = {
  mcq: [
    {
      topicKeywords: ['mưa', 'khí hậu', 'tự nhiên', 'gió'],
      level: 'Nhận biết',
      content: 'Nơi nào sau đây thường có lượng mưa nhiều nhất?',
      options: [
        { key: 'A', content: 'Khu vực nằm sâu trong nội địa chịu ảnh hưởng của áp cao.' },
        { key: 'B', content: 'Sườn núi khuất gió và các thung lũng kín gió.' },
        { key: 'C', content: 'Sườn núi đón gió ẩm từ biển thổi vào.' },
        { key: 'D', content: 'Khu vực ven biển có dòng biển lạnh chảy qua sát bờ.' }
      ],
      correctOption: 'C',
      explanation: 'Sườn đón gió ẩm làm không khí ẩm bị đẩy lên cao, nhiệt độ giảm, hơi nước ngưng kết gây mưa lớn.'
    },
    {
      topicKeywords: ['vị trí', 'nội chí tuyến', 'nhiệt đới', 'lãnh thổ'],
      level: 'Nhận biết',
      content: 'Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc nên có đặc điểm tự nhiên nào sau đây?',
      options: [
        { key: 'A', content: 'Khoáng sản đa dạng và trữ lượng lớn.' },
        { key: 'B', content: 'Mưa lớn phân bố đều khắp quanh năm.' },
        { key: 'C', content: 'Nền nhiệt độ cao và giàu bức xạ mặt trời.' },
        { key: 'D', content: 'Địa hình chủ yếu là đồi núi thấp.' }
      ],
      correctOption: 'C',
      explanation: 'Vị trí nội chí tuyến bán cầu Bắc mang lại góc nhập xạ lớn, lượng bức xạ dồi dào, nền nhiệt cao quanh năm.'
    },
    {
      topicKeywords: ['đất đai', 'suy thoái', 'đồi núi', 'tài nguyên'],
      level: 'Nhận biết',
      content: 'Ở vùng đồi núi nước ta, biểu hiện rõ nét nhất của sự suy thoái tài nguyên đất là:',
      options: [
        { key: 'A', content: 'Đất bị nhiễm phèn sâu vào mùa khô.' },
        { key: 'B', content: 'Đất bị nhiễm mặn nghiêm trọng.' },
        { key: 'C', content: 'Rửa trôi, xói mòn làm giảm độ phì của đất.' },
        { key: 'D', content: 'Ngập úng kéo dài trên diện rộng.' }
      ],
      correctOption: 'C',
      explanation: 'Ở vùng đồi núi có độ dốc lớn, mất lớp phủ thực vật dẫn đến xói mòn, rửa trôi mạnh làm bạc màu và giảm độ phì.'
    },
    {
      topicKeywords: ['cơ cấu kinh tế', 'chuyển dịch', 'công nghiệp hóa'],
      level: 'Thông hiểu',
      content: 'Cơ cấu kinh tế theo ngành ở nước ta chuyển dịch mạnh theo hướng công nghiệp hóa, hiện đại hóa chủ yếu do:',
      options: [
        { key: 'A', content: 'Dân số đông, tài nguyên khoáng sản giàu có, lao động giá rẻ dồi dào.' },
        { key: 'B', content: 'Chính sách phát triển phù hợp, trình độ lao động tăng, thu hút nhiều nguồn vốn đầu tư.' },
        { key: 'C', content: 'Cơ sở hạ tầng phát triển nhanh, nguồn lao động dồi dào, thị trường tiêu thụ mở rộng.' },
        { key: 'D', content: 'Cơ sở vật chất kĩ thuật hoàn thiện đồng bộ, truyền thống sản xuất lâu đời.' }
      ],
      correctOption: 'B',
      explanation: 'Chuyển dịch cơ cấu ngành kinh tế là kết quả của đường lối đổi mới đúng đắn, nâng cao chất lượng nguồn nhân lực và hội nhập kinh tế quốc tế thu hút vốn đầu tư.'
    },
    {
      topicKeywords: ['cây công nghiệp', 'nông nghiệp', 'trồng trọt'],
      level: 'Thông hiểu',
      content: 'Cây công nghiệp hàng năm ở nước ta hiện nay có đặc điểm nào sau đây?',
      options: [
        { key: 'A', content: 'Phần lớn là các cây có nguồn gốc cận nhiệt đới.' },
        { key: 'B', content: 'Hầu hết sản phẩm dành cho thị trường xuất khẩu.' },
        { key: 'C', content: 'Chủ yếu được phân bố tập trung trên đất badan.' },
        { key: 'D', content: 'Có diện tích chiếm tỉ trọng nhỏ hơn so với cây công nghiệp lâu năm.' }
      ],
      correctOption: 'D',
      explanation: 'Cây công nghiệp hàng năm (mía, lạc, đậu tương, đay, cói...) có diện tích và tỉ trọng nhỏ hơn nhiều so với cây công nghiệp lâu năm (cà phê, cao su, hồ tiêu, chè).'
    },
    {
      topicKeywords: ['cây ăn quả', 'đông nam bộ', 'vùng kinh tế'],
      level: 'Vận dụng',
      content: 'Hiện nay, việc đa dạng hóa cơ cấu cây ăn quả ở vùng Đông Nam Bộ có ý nghĩa chủ yếu nào sau đây?',
      options: [
        { key: 'A', content: 'Hình thành vùng chuyên canh, giải quyết việc làm tại chỗ, nâng cao thu nhập cho người dân.' },
        { key: 'B', content: 'Nâng cao giá trị sản phẩm, sử dụng hợp lí các nguồn tài nguyên và bảo vệ môi trường sinh thái.' },
        { key: 'C', content: 'Phát huy các thế mạnh, tạo ra nhiều nông sản hàng hóa giá trị cao, đáp ứng nhu cầu thị trường.' },
        { key: 'D', content: 'Tạo sản xuất hàng hóa quy mô lớn, cải thiện chất lượng giống, đẩy mạnh xuất khẩu sang EU.' }
      ],
      correctOption: 'C',
      explanation: 'Đa dạng hóa cây trồng nhằm thích ứng nhu cầu thị trường, khai thác tối ưu thế mạnh tự nhiên và kinh tế xã hội, giảm thiểu rủi ro thị trường.'
    },
    {
      topicKeywords: ['trung du và miền núi bắc bộ', 'cây công nghiệp', 'chế biến'],
      level: 'Vận dụng cao',
      content: 'Giải pháp chủ yếu để nâng cao hiệu quả kinh tế của cây công nghiệp ở Trung du và miền núi Bắc Bộ hiện nay là:',
      options: [
        { key: 'A', content: 'Thu hút mạnh vốn đầu tư, đẩy mạnh thâm canh, tăng cường bảo quản sản phẩm thô.' },
        { key: 'B', content: 'Ứng dụng công nghệ cao, đẩy mạnh công nghiệp chế biến, xây dựng thương hiệu và mở rộng thị trường.' },
        { key: 'C', content: 'Mở rộng diện tích tối đa, tăng nhanh năng suất, sản xuất chuyên canh để xuất khẩu thô.' },
        { key: 'D', content: 'Phát triển hệ thống thủy lợi, sử dụng giống mới, đa dạng hóa các loại cây trồng ngắn ngày.' }
      ],
      correctOption: 'B',
      explanation: 'Để nâng cao giá trị gia tăng và hiệu quả kinh tế bền vững, khâu then chốt là chế biến sâu, chuẩn hóa công nghệ, tạo dựng thương hiệu uy tín và tiếp cận thị trường tiêu thụ rộng lớn.'
    },
    {
      topicKeywords: ['xâm nhập mặn', 'đồng bằng sông cửu long', 'thủy lợi'],
      level: 'Vận dụng',
      content: 'Giải pháp căn cơ, chủ yếu để hạn chế tác động tiêu cực của xâm nhập mặn vào mùa khô ở các vùng ven biển nước ta là:',
      options: [
        { key: 'A', content: 'Tập trung nghiên cứu và phát triển các giống cây trồng chịu mặn cao.' },
        { key: 'B', content: 'Xây dựng và hoàn thiện mạng lưới thủy lợi điều tiết ngọt hóa, trữ nước ngọt chủ động.' },
        { key: 'C', content: 'Kêu gọi người dân sử dụng triệt để tiết kiệm nguồn nước ngầm tầng nông.' },
        { key: 'D', content: 'Chuyển đổi toàn bộ đất trồng lúa sang đất nuôi trồng thủy sản nước lợ.' }
      ],
      correctOption: 'B',
      explanation: 'Công trình thủy lợi ngăn mặn, giữ ngọt, điều tiết nguồn nước ngọt từ thượng nguồn là giải pháp căn cơ nhất để đảm bảo an ninh nguồn nước sinh hoạt và sản xuất.'
    },
    {
      topicKeywords: ['du lịch', 'bắc trung bộ', 'dịch vụ'],
      level: 'Vận dụng',
      content: 'Giải pháp chủ yếu để tăng số lượng và thời gian lưu trú của khách du lịch đến với vùng Bắc Trung Bộ hiện nay là:',
      options: [
        { key: 'A', content: 'Hiện đại hóa toàn bộ các sân bay địa phương, đào tạo lại nguồn nhân lực du lịch.' },
        { key: 'B', content: 'Đa dạng hóa sản phẩm du lịch chất lượng cao, phát triển cơ sở vật chất kĩ thuật và tăng cường quảng bá.' },
        { key: 'C', content: 'Ứng dụng công nghệ số, giảm giá vé dịch vụ lưu trú và ăn uống vào mùa cao điểm.' },
        { key: 'D', content: 'Mở rộng các điểm du lịch sinh thái mới, tập trung liên kết tour giá rẻ giữa các tỉnh.' }
      ],
      correctOption: 'B',
      explanation: 'Sản phẩm du lịch đa dạng, cơ sở lưu trú và dịch vụ cao cấp kết hợp xúc tiến quảng bá bài bản là đòn bẩy thu hút và giữ chân du khách.'
    },
    {
      topicKeywords: ['đô thị hóa', 'lao động', 'việc làm'],
      level: 'Thông hiểu',
      content: 'Đô thị hóa có tác động tích cực chủ yếu nào sau đây đối với vấn đề lao động ở nước ta?',
      options: [
        { key: 'A', content: 'Cải thiện mức sống nhanh chóng, thúc đẩy mạnh xuất khẩu lao động đi nước ngoài.' },
        { key: 'B', content: 'Thay đổi hoàn toàn cơ cấu giới tính, thu hút toàn bộ lao động trẻ vào công nghiệp.' },
        { key: 'C', content: 'Tăng nhanh số lượng lao động chưa qua đào tạo tập trung tại các khu vực ngoại thành.' },
        { key: 'D', content: 'Chuyển dịch cơ cấu lao động theo ngành, giảm áp lực việc làm nông thôn và nâng cao chất lượng lao động.' }
      ],
      correctOption: 'D',
      explanation: 'Đô thị hóa tạo ra nhiều việc làm phi nông nghiệp, hút bớt lao động dư thừa ở nông thôn và thúc đẩy đào tạo nâng cao tay nghề người lao động.'
    },
    {
      topicKeywords: ['công nghiệp', 'chế biến thực phẩm', 'đồng bằng sông hồng'],
      level: 'Nhận biết',
      content: 'Công nghiệp sản xuất, chế biến thực phẩm ở Đồng bằng sông Hồng phát triển mạnh mẽ dựa trên thế mạnh nổi bật nào sau đây?',
      options: [
        { key: 'A', content: 'Nguồn nguyên liệu phong phú từ nông - lâm - thủy sản và thị trường tiêu thụ rộng lớn.' },
        { key: 'B', content: 'Nguồn khoáng sản kim loại dồi dào và nguồn nước ngầm trữ lượng lớn.' },
        { key: 'C', content: 'Đội ngũ chuyên gia nước ngoài đông đảo và hệ thống giao thông đường biển thuận lợi.' },
        { key: 'D', content: 'Nguồn năng lượng hạt nhân và địa nhiệt phong phú.' }
      ],
      correctOption: 'A',
      explanation: 'Ngành chế biến thực phẩm Đồng bằng sông Hồng dựa vào vùng nông nghiệp phát triển trù phú và thị trường tiêu thụ đông dân bậc nhất cả nước.'
    },
    {
      topicKeywords: ['kinh tế tri thức', 'đặc điểm', 'thế giới'],
      level: 'Nhận biết',
      content: 'Đặc điểm nào sau đây là đặc trưng cốt lõi của nền kinh tế tri thức trên thế giới hiện nay?',
      options: [
        { key: 'A', content: 'Tri thức và công nghệ cao trở thành lực lượng sản xuất trực tiếp tạo ra của cải.' },
        { key: 'B', content: 'Nông nghiệp và công nghiệp khai khoáng thô đóng vai trò động lực tăng trưởng chính.' },
        { key: 'C', content: 'Chủ yếu dựa vào nguồn tài nguyên thiên nhiên và lao động thủ công giá rẻ.' },
        { key: 'D', content: 'Hạn chế việc ứng dụng công nghệ thông tin và trí tuệ nhân tạo vào sản xuất.' }
      ],
      correctOption: 'A',
      explanation: 'Trong nền kinh tế tri thức, tri thức, trí tuệ con người và công nghệ cao là yếu tố quyết định hàng đầu của tăng trưởng kinh tế.'
    }
  ],
  tf: [
    {
      topicKeywords: ['dân số', 'gdp', 'kinh tế thế giới', 'tây nam á'],
      level: 'Vận dụng',
      content: 'Cho bảng số liệu về Dân số và GDP của một số quốc gia năm 2023:\n- Quốc gia A: Dân số 45,5 triệu người; GDP 250,8 tỉ USD (GDP/người ≈ 5 512 USD).\n- Quốc gia B: Dân số 9,8 triệu người; GDP 513,6 tỉ USD (GDP/người ≈ 52 408 USD).\n- Quốc gia C: Dân số 36,9 triệu người; GDP 1 067,6 tỉ USD (GDP/người ≈ 28 932 USD).\n- Quốc gia D: Dân số 4,4 triệu người; GDP 163,7 tỉ USD (GDP/người ≈ 37 205 USD).\n(Nguồn: Niên giám thống kê quốc tế 2024)\nXét tính đúng/sai của các nhận định:',
      items: [
        { key: 'a', statement: 'Quốc gia B có quy mô GDP lớn gấp hơn 2 lần Quốc gia A mặc dù quy mô dân số ít hơn.', isCorrect: true, explanation: 'Đúng: GDP nước B là 513,6 tỉ USD so với 250,8 tỉ USD của nước A (hơn 2 lần).' },
        { key: 'b', statement: 'Năm 2023, giữa các quốc gia có sự chênh lệch rất lớn về quy mô dân số và quy mô nền kinh tế.', isCorrect: true, explanation: 'Đúng: Dân số dao động từ 4,4 đến 45,5 triệu người; GDP dao động từ 163,7 đến 1 067,6 tỉ USD.' },
        { key: 'c', statement: 'Nguyên nhân chênh lệch GDP/người giữa các nước chủ yếu do sự khác biệt về trình độ phát triển công nghệ và mức độ đa dạng hóa cơ cấu kinh tế.', isCorrect: true, explanation: 'Đúng: Trình độ khoa học công nghệ và cơ cấu kinh tế hiện đại tạo ra năng suất và giá trị thặng dư bình quân đầu người vượt trội.' },
        { key: 'd', statement: 'Quốc gia A có GDP bình quân đầu người cao nhất trong số 4 quốc gia kể trên.', isCorrect: false, explanation: 'Sai: Quốc gia A có GDP/người thấp nhất (~5 512 USD), nước B mới có GDP/người cao nhất (~52 408 USD).' }
      ],
      explanation: 'Nhận định a, b, c là ĐÚNG; d là SAI.'
    },
    {
      topicKeywords: ['tự nhiên', 'tây bắc', 'bắc trung bộ', 'khí hậu'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau:\n"Miền Tây Bắc và Bắc Trung Bộ có địa hình núi cao hiểm trở, cao nguyên và đồng bằng ven biển hẹp. Đặc trưng khí hậu của miền là sự suy giảm ảnh hưởng của gió mùa Đông Bắc do bức chắn địa hình Hoàng Liên Sơn, nền nhiệt trung bình năm tăng dần từ bắc vào nam. Về mùa hạ, khu vực Bắc Trung Bộ chịu ảnh hưởng sâu sắc của gió Tây khô nóng hoạt động mạnh."\n(Nguồn: Địa lí tự nhiên Việt Nam)\nXét tính đúng/sai của các nhận định:',
      items: [
        { key: 'a', statement: 'Sự phân hóa thiên nhiên đai cao ở miền Tây Bắc tạo điều kiện phát triển đa dạng sinh vật từ nhiệt đới, cận nhiệt đến ôn đới núi cao.', isCorrect: true, explanation: 'Đúng: Dãy Hoàng Liên Sơn cao trên 2600m là nơi duy nhất có đầy đủ 3 đai cao sinh vật ở nước ta.' },
        { key: 'b', statement: 'Gió Tây khô nóng hoạt động mạnh ở Bắc Trung Bộ vào đầu mùa hạ do khối khí nhiệt đới ẩm Bắc Ấn Độ Dương vượt qua dãy Trường Sơn Bắc bị biến tính phơn.', isCorrect: true, explanation: 'Đúng: Khối khí Tây Nam từ vịnh Bengan vượt dãy Trường Sơn gây hiện tượng phơn khô nóng.' },
        { key: 'c', statement: 'Miền Tây Bắc và Bắc Trung Bộ có cấu trúc địa hình đơn điệu, chủ yếu là đồng bằng phù sa màu mỡ.', isCorrect: false, explanation: 'Sai: Miền có địa hình núi cao hiểm trở bậc nhất cả nước, sơn nguyên, cao nguyên đá vôi và đồng bằng hẹp.' },
        { key: 'd', statement: 'Giải pháp quan trọng hàng đầu để bảo vệ môi trường tự nhiên ở miền là bảo vệ và trồng rừng phòng hộ đầu nguồn.', isCorrect: true, explanation: 'Đúng: Rừng phòng hộ đầu nguồn giúp hạn chế lũ quét, xói mòn sạt lở đất và điều hòa nguồn nước.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    },
    {
      topicKeywords: ['thương mại', 'nội thương', 'kinh tế số'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau:\n"Hoạt động nội thương ở nước ta ngày càng phát triển năng động. Các phương thức bán buôn, bán lẻ đang chuyển dịch mạnh mẽ sang hình thức hiện đại hóa, số hóa và thương mại điện tử. Mạng lưới trung tâm thương mại, siêu thị và chuỗi cửa hàng tiện ích phủ sóng rộng khắp, kết nối chặt chẽ giữa các trung tâm kinh tế lớn với các vùng phụ cận."\n(Nguồn: Báo cáo phát triển Thương mại Việt Nam, 2024)\nXét tính đúng/sai của các nhận định:',
      items: [
        { key: 'a', statement: 'Thu nhập người dân tăng, hạ tầng Internet phổ cập và thanh toán số là động lực chính thúc đẩy thương mại điện tử bùng nổ.', isCorrect: true, explanation: 'Đúng: Môi trường số và mức sống nâng cao thúc đẩy mạnh mẽ hành vi tiêu dùng trực tuyến.' },
        { key: 'b', statement: 'Đông Nam Bộ và Đồng bằng sông Hồng là hai vùng có quy mô tổng mức bán lẻ hàng hóa và doanh thu dịch vụ tiêu dùng dẫn đầu cả nước.', isCorrect: true, explanation: 'Đúng: Hai vùng kinh tế trọng điểm tập trung dân cư đông đúc và mức chi tiêu tiêu dùng cao nhất.' },
        { key: 'c', statement: 'Phương thức bán lẻ truyền thống (chợ dân sinh, tạp hóa) đã hoàn toàn biến mất khỏi thị trường phân phối hàng hóa nước ta.', isCorrect: false, explanation: 'Sai: Bán lẻ truyền thống vẫn đóng vai trò quan trọng, đặc biệt tại khu vực nông thôn và các đô thị vừa và nhỏ.' },
        { key: 'd', statement: 'Phát triển logistics và hệ thống kho bãi hiện đại là điều kiện then chốt để mở rộng chuỗi cung ứng hàng hóa liên vùng.', isCorrect: true, explanation: 'Đúng: Logistics đồng bộ giúp giảm chi phí lưu thông và đẩy nhanh tốc độ vận chuyển hàng hóa.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    },
    {
      topicKeywords: ['đồng bằng sông cửu long', 'lúa gạo', 'biến đổi khí hậu'],
      level: 'Vận dụng',
      content: 'Cho thông tin sau:\n"Đồng bằng sông Cửu Long là vùng sản xuất lương thực và thủy sản hàng hóa lớn nhất nước ta, đóng góp trên 50% sản lượng lúa và 90% lượng gạo xuất khẩu cả nước. Tuy nhiên, trước tác động của biến đổi khí hậu và suy giảm nguồn nước thượng nguồn, vùng đang tích cực chuyển đổi cơ cấu sản xuất nông nghiệp thích ứng linh hoạt theo Nghị quyết 120/NQ-CP."\n(Nguồn: Niên giám Nông nghiệp Đồng bằng sông Cửu Long, 2024)\nXét tính đúng/sai của các nhận định:',
      items: [
        { key: 'a', statement: 'Đồng bằng sông Cửu Long giữ vị trí số 1 cả nước về diện tích gieo trồng và sản lượng lúa xuất khẩu.', isCorrect: true, explanation: 'Đúng: Vùng là vựa lúa lớn nhất, chiếm tỉ trọng áp đảo trong xuất khẩu gạo quốc gia.' },
        { key: 'b', statement: 'Mô hình kinh tế nông nghiệp "thuận thiên", tôn trọng quy luật tự nhiên là định hướng phát triển bền vững cho vùng.', isCorrect: true, explanation: 'Đúng: Thích ứng tự nhiên (lúa - tôm, lúa - cá, cây ăn trái) giúp giảm thiểu rủi ro xâm nhập mặn.' },
        { key: 'c', statement: 'Phương án tối ưu nhất là ngăn chặn toàn bộ mùa lũ hàng năm để chuyển toàn bộ diện tích sang trồng lúa 4 vụ khép kín.', isCorrect: false, explanation: 'Sai: Ngăn lũ triệt để làm đất cạn kiệt phù sa, bồi đắp hóa chất và phá vỡ hệ sinh thái tự nhiên.' },
        { key: 'd', statement: 'Khó khăn lớn nhất về tự nhiên đối với vùng vào mùa khô là tình trạng thiếu nước ngọt cho sinh hoạt và xâm nhập mặn sâu vào nội đồng.', isCorrect: true, explanation: 'Đúng: Mùa khô kéo dài 4-5 tháng khiến mực nước sông hạ thấp, nước biển xâm nhập sâu 40-70 km.' }
      ],
      explanation: 'Nhận định a, b, d là ĐÚNG; c là SAI.'
    }
  ],
  short: [
    {
      topicKeywords: ['tỉ trọng', 'gdp', 'công nghiệp'],
      level: 'Vận dụng',
      content: 'Năm 2024, GDP theo giá hiện hành của nước ta là 11 510,3 nghìn tỉ đồng, trong đó khu vực công nghiệp và xây dựng đạt 4 318,2 nghìn tỉ đồng. Hãy tính tỉ trọng của khu vực công nghiệp và xây dựng trong cơ cấu GDP của nước ta năm 2024 (đơn vị: %, làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '37,5',
      explanation: '$\\text{Tỉ trọng} = \\frac{4318,2}{11510,3} \\times 100\\% \\approx 37,516\\% \\approx 37,5\\%$.'
    },
    {
      topicKeywords: ['gió phơn', 'nhiệt độ', 'địa hình', 'chênh lệch'],
      level: 'Vận dụng cao',
      content: 'Một dãy núi có độ cao đỉnh là 2 852 m chịu tác động của gió phơn. Biết không khí ẩm lên núi giảm $0,6^\\circ\\text{C}/100\\text{m}$, không khí khô xuống núi tăng $1,0^\\circ\\text{C}/100\\text{m}$. Hãy cho biết tại độ cao 189 m, chênh lệch nhiệt độ giữa sườn khuất gió với sườn đón gió là bao nhiêu $^\\circ\\text{C}$ (làm tròn kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '10,7',
      explanation: 'Chênh lệch độ cao $\\Delta h = 2852 - 189 = 2663\\text{ m}$. Chênh lệch nhiệt độ $\\Delta T = \\frac{2663}{100} \\times (1,0 - 0,6) = 26,63 \\times 0,4 = 10,652 \\approx 10,7^\\circ\\text{C}$.'
    },
    {
      topicKeywords: ['điện', 'tăng trưởng', 'sản lượng', 'gấp lần'],
      level: 'Thông hiểu',
      content: 'Năm 2015, sản lượng điện phát ra của nước ta là 157,9 tỉ kWh; năm 2024 đạt 293,1 tỉ kWh. Hãy cho biết năm 2024 so với năm 2015, sản lượng điện phát ra của nước ta tăng bao nhiêu lần (làm tròn kết quả đến hai chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '1,86',
      explanation: '$\\text{Số lần tăng} = \\frac{293,1}{157,9} \\approx 1,8562 \\approx 1,86\\text{ lần}$.'
    },
    {
      topicKeywords: ['vận tải', 'tốc độ tăng trưởng', 'hành khách'],
      level: 'Vận dụng',
      content: 'Số lượt hành khách vận chuyển bằng đường sắt nước ta năm 2015 là 11,2 triệu lượt, năm 2024 là 20,0 triệu lượt (tăng trưởng 178,6%). Số lượt khách đường bộ năm 2015 là 3 104,7 triệu lượt, năm 2024 là 4 877,3 triệu lượt (tăng trưởng 157,1%). Hãy cho biết tốc độ tăng trưởng của đường sắt cao hơn đường bộ bao nhiêu % (làm tròn đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '21,5',
      explanation: '$\\text{Tốc độ tăng trưởng đường sắt} = \\frac{20,0}{11,2} \\times 100\\% \\approx 178,57\\%$. Đường bộ $= \\frac{4877,3}{3104,7} \\times 100\\% \\approx 157,09\\%$. Chênh lệch: $178,57 - 157,09 = 21,48\\% \\approx 21,5\\%$.'
    },
    {
      topicKeywords: ['cán cân', 'thương mại', 'xuất nhập khẩu'],
      level: 'Thông hiểu',
      content: 'Năm 2023, trị giá nhập khẩu hàng hóa của một quốc gia là 299,5 tỉ USD, trị giá xuất khẩu là 322,7 tỉ USD. Hãy tính cán cân thương mại của quốc gia đó năm 2023 (đơn vị: tỉ USD, lấy kết quả đến một chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '23,2',
      explanation: '$\\text{Cán cân thương mại} = \\text{Xuất khẩu} - \\text{Nhập khẩu} = 322,7 - 299,5 = 23,2\\text{ tỉ USD}$.'
    },
    {
      topicKeywords: ['quy mô', 'dân số', 'mật độ'],
      level: 'Vận dụng',
      content: 'Năm 2024, diện tích thành phố Hà Nội là $3359,8\\text{ km}^2$, mật độ dân số là $2595\\text{ người/km}^2$. Hãy tính quy mô dân số năm 2024 của thành phố Hà Nội theo đơn vị triệu người (làm tròn kết quả đến hai chữ số thập phân). Khi trả lời, chỉ ghi số.',
      key: '8,72',
      explanation: '$\\text{Dân số} = 3359,8 \\times 2595 = 8718681\\text{ người} \\approx 8,72\\text{ triệu người}$.'
    }
  ],
  essay: [
    {
      topicKeywords: ['tự nhiên', 'địa hình', 'khí hậu', 'nhiệt đới ẩm'],
      level: 'Vận dụng cao',
      content: 'Dựa vào kiến thức địa lí tự nhiên Việt Nam:\na) Trình bày các đặc điểm biểu hiện cơ bản của thiên nhiên nhiệt đới ẩm gió mùa ở nước ta.\nb) Phân tích những thuận lợi và khó khăn của khí hậu nhiệt đới ẩm gió mùa đối với sản xuất nông nghiệp.',
      essayRubric: 'Ý a (1.5đ): Trình bày đủ 3 biểu hiện chính: Khí hậu nhiệt đới gió mùa (nhiệt độ cao, độ ẩm lớn, phân hóa 2 mùa gió), Địa hình xâm thực mạnh ở đồi núi và bồi tụ nhanh ở đồng bằng, Đất feralit và sinh vật nhiệt đới ẩm đa dạng.\nÝ b (1.5đ): \n- Thuận lợi: Nền nhiệt ẩm dồi dào cho phép thâm canh tăng vụ, phát triển nền nông nghiệp nhiệt đới với cơ cấu cây trồng, vật nuôi đa dạng (0.75đ).\n- Khó khăn: Thời tiết diễn biến thất thường (hạn hán, bão lũ, rét đậm rét hại), sâu bệnh phát triển gây tổn thất cho mùa màng (0.75đ).',
      explanation: 'Phân tích tổng hợp thiên nhiên nhiệt đới ẩm gió mùa và ảnh hưởng đối với nông nghiệp.'
    },
    {
      topicKeywords: ['kinh tế vùng', 'đồng bằng sông cửu long', 'thích ứng'],
      level: 'Vận dụng cao',
      content: 'Tại sao việc phát triển kinh tế - xã hội ở vùng Đồng bằng sông Cửu Long cần phải gắn liền với phương châm "sống chung với lũ" và thích ứng linh hoạt với tình trạng xâm nhập mặn?',
      essayRubric: 'Ý 1 (1.0đ): Lũ mang lại nguồn lợi tự nhiên to lớn: bồi đắp phù sa màu mỡ, thau chua rửa mặn, cung cấp nguồn thủy sản dồi dào, cân bằng hệ sinh thái đồng bằng.\nÝ 2 (1.0đ): Mùa khô kéo dài kết hợp với biến đổi khí hậu khiến nước mặn xâm nhập sâu vào nội đồng, vì vậy cần chuyển đổi cơ cấu cây trồng, mùa vụ thích ứng linh hoạt để phát triển kinh tế bền vững.',
      explanation: 'Lí giải giải pháp thích ứng bền vững cho vùng ĐBSCL.'
    }
  ]
};
