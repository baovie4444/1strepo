const ROUND_TITLES = {
  1: "Giải mã dòng thời gian",
  2: "Phòng quyết sách",
  3: "Sức mạnh tổng hợp",
  4: "Chớp thời cơ 1975",
  5: "Bẻ gãy luận điệu"
};

const questions = [
  {
    id: "r1q01", round: 1, type: "single",
    prompt: "Mốc nào đánh dấu sự chuyển biến về chất: quân chiến đấu Mỹ từ vai trò cố vấn sang trực tiếp giữ vai trò chủ yếu trên chiến trường miền Nam?",
    options: [
      { id: "A", label: "Mỹ bắt đầu chiến tranh phá hoại miền Bắc bằng không quân, 2/3/1965" },
      { id: "B", label: "Quân Mỹ đổ bộ vào Đà Nẵng ngày 8/3/1965" },
      { id: "C", label: "Mỹ dựng lên chiến lược “Chiến tranh đặc biệt” ở miền Nam, năm 1961" },
      { id: "D", label: "Quân Mỹ mở cuộc hành quân “tìm diệt” đầu tiên ở Vạn Tường, 8/1965" }
    ],
    correct: "B",
    explanation: "Ngày 8/3/1965, quân Mỹ đổ bộ vào Đà Nẵng. Mỹ chuyển sang “Chiến tranh cục bộ”, đưa quân Mỹ và đồng minh trực tiếp tham chiến, đồng thời đánh phá miền Bắc.",
    source: "Giáo trình tr. 99; PDF tr. 100."
  },
  {
    id: "r1q02", round: 1, type: "single",
    prompt: "Cặp hội nghị nào vừa phát động kháng chiến chống Mỹ trên phạm vi toàn quốc, vừa hoàn chỉnh quyết tâm chiến lược trong bối cảnh “Chiến tranh cục bộ”?",
    options: [
      { id: "A", label: "Trung ương 9 (12/1963) và Trung ương 11 (3/1965)" },
      { id: "B", label: "Trung ương 11 (3/1965) và Trung ương 13 (1/1967)" },
      { id: "C", label: "Trung ương 11 và Trung ương 12" },
      { id: "D", label: "Trung ương 12 (12/1965) và Trung ương 13 (1/1967)" }
    ],
    correct: "C",
    explanation: "Hội nghị Trung ương 11 tháng 3/1965 và Trung ương 12 tháng 12/1965 phát động kháng chiến chống Mỹ trên phạm vi toàn quốc và xác định quyết tâm chiến lược.",
    source: "Giáo trình tr. 99-100; PDF tr. 100-101."
  },
  {
    id: "r1q03", round: 1, type: "single",
    prompt: "Nhận định nào diễn đạt đầy đủ nhất quan hệ chiến lược giữa hai miền trong kháng chiến chống Mỹ?",
    options: [
      { id: "A", label: "Miền Nam là tiền tuyến lớn, quyết định trực tiếp; miền Bắc là hậu phương lớn, có vai trò quyết định nhất đối với toàn bộ cách mạng" },
      { id: "B", label: "Miền Bắc quyết định trực tiếp trên chiến trường; miền Nam chỉ tiếp nhận chi viện và phối hợp" },
      { id: "C", label: "Hai miền có nhiệm vụ chiến lược ngang nhau nhưng vận hành độc lập để tránh chiến tranh lan rộng" },
      { id: "D", label: "Miền Nam quyết định toàn bộ; nhiệm vụ xây dựng và bảo vệ miền Bắc chỉ có ý nghĩa hỗ trợ ngắn hạn" }
    ],
    correct: "A",
    explanation: "Bảo vệ miền Bắc và giải phóng miền Nam là hai nhiệm vụ gắn bó mật thiết; miền Bắc xây dựng, bảo vệ và chi viện cho tiền tuyến miền Nam.",
    source: "Giáo trình tr. 100; PDF tr. 101."
  },
  {
    id: "r1q04", round: 1, type: "order",
    prompt: "Chọn lần lượt các sự kiện theo đúng trình tự thời gian.",
    context: "Mỗi lần bấm sẽ thêm một sự kiện vào dòng thời gian của bạn.",
    options: [
      { id: "mau_than", label: "Tổng tiến công và nổi dậy Tết Mậu Thân 1968" },
      { id: "van_tuong", label: "Chiến thắng Vạn Tường, 8/1965" },
      { id: "tw13", label: "Trung ương 13 mở mặt trận ngoại giao, 28/1/1967" },
      { id: "nui_thanh", label: "Chiến thắng Núi Thành, 5/1965" },
      { id: "playme", label: "Chiến thắng Plâyme, 11/1965" }
    ],
    correct: ["nui_thanh", "van_tuong", "playme", "tw13", "mau_than"],
    explanation: "Chuỗi sự kiện cho thấy quá trình giữ thế chủ động, kết hợp thắng lợi quân sự với mở mặt trận ngoại giao rồi tiến tới đòn tiến công chiến lược Mậu Thân.",
    source: "Giáo trình tr. 103-105; PDF tr. 104-106."
  },
  {
    id: "r1q05", round: 1, type: "multi",
    prompt: "Chọn đúng ba hệ quả ở cấp độ chiến lược của Tổng tiến công và nổi dậy Tết Mậu Thân 1968, không đồng nhất chúng với kết quả tác chiến tức thời.",
    options: [
      { id: "A", label: "Làm phá sản chiến lược “Chiến tranh cục bộ”" },
      { id: "B", label: "Đánh mạnh vào ý chí xâm lược của giới cầm quyền Mỹ" },
      { id: "C", label: "Buộc Mỹ chấp nhận đàm phán tại Paris" },
      { id: "D", label: "Giành và giữ chính quyền lâu dài tại phần lớn đô thị miền Nam sau đợt đầu" },
      { id: "E", label: "Làm thay đổi ngay tương quan lực lượng trên chiến trường theo hướng hoàn toàn có lợi cho cách mạng" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Mậu Thân tạo thất bại chiến lược có tính bước ngoặt cho Mỹ nhưng chưa giải phóng hoàn toàn miền Nam. Giáo trình cũng chỉ rõ sai lầm do chậm chuyển hướng sau đợt đầu.",
    source: "Giáo trình tr. 105-106; PDF tr. 106-107."
  },
  {
    id: "r2q01", round: 2, type: "single",
    prompt: "Phương án nào tái hiện đúng cả tính lâu dài lẫn yêu cầu chủ động giành thắng lợi quyết định trong phương châm chiến lược năm 1965?",
    options: [
      { id: "A", label: "Đánh lâu dài, phân tán lực lượng để bảo toàn, chỉ chuyển sang tiến công khi Mỹ tự rút quân" },
      { id: "B", label: "Đánh lâu dài, dựa vào sức mình là chính, càng đánh càng mạnh và tranh thủ thời cơ" },
      { id: "C", label: "Đánh nhanh thắng nhanh, lấy viện trợ quốc tế làm nhân tố quyết định và tránh kéo dài chiến tranh" },
      { id: "D", label: "Đánh lâu dài nhưng không đặt mục tiêu tập trung lực lượng giành thắng lợi quyết định trong thời gian tương đối ngắn" }
    ],
    correct: "B",
    explanation: "Đường lối kết hợp chuẩn bị cho cuộc chiến lâu dài với nỗ lực tạo thế, tập trung lực lượng và tranh thủ thời cơ giành thắng lợi quyết định.",
    source: "Giáo trình tr. 100; PDF tr. 101."
  },
  {
    id: "r2q02", round: 2, type: "multi",
    prompt: "Chọn đủ bốn nội dung chuyển hướng đối với miền Bắc khi chiến tranh lan ra cả nước; hai phương án còn lại là những cách hiểu sai vì tuyệt đối hóa một nhiệm vụ.",
    options: [
      { id: "A", label: "Chuyển hướng xây dựng kinh tế phù hợp điều kiện chiến tranh" },
      { id: "B", label: "Tăng cường lực lượng quốc phòng" },
      { id: "C", label: "Chi viện miền Nam ở mức cao nhất" },
      { id: "D", label: "Chuyển hướng tư tưởng và tổ chức" },
      { id: "E", label: "Giữ nguyên cơ cấu và cách bố trí kinh tế thời bình để bảo đảm chỉ tiêu kế hoạch năm năm" },
      { id: "F", label: "Dồn toàn bộ nguồn lực cho quốc phòng và chi viện, tạm gác xây dựng chủ nghĩa xã hội ở miền Bắc" }
    ],
    correct: ["A", "B", "C", "D"],
    explanation: "Miền Bắc vừa sản xuất, vừa chiến đấu, vừa tiếp tục xây dựng, đồng thời đảm nhiệm vai trò hậu phương lớn.",
    source: "Giáo trình tr. 101; PDF tr. 102."
  },
  {
    id: "r2q03", round: 2, type: "single",
    prompt: "Phương án nào phản ánh đúng phương pháp cách mạng tổng hợp ở miền Nam, xét đồng thời lực lượng, mũi tiến công và địa bàn chiến lược?",
    options: [
      { id: "A", label: "Lấy bộ đội chủ lực làm lực lượng duy nhất; tập trung quân sự tại nông thôn và miền núi" },
      { id: "B", label: "Kết hợp quân sự và chính trị nhưng lấy đô thị làm chiến trường quyết định duy nhất" },
      { id: "C", label: "Kết hợp quân sự với chính trị, thực hiện ba mũi giáp công trên ba vùng chiến lược" },
      { id: "D", label: "Thực hiện ba mũi giáp công nhưng áp dụng một tỷ lệ và một hình thức đấu tranh giống nhau cho mọi vùng" }
    ],
    correct: "C",
    explanation: "Đảng chủ trương giữ vững thế tiến công và sử dụng phương pháp cách mạng tổng hợp, trong đó đấu tranh quân sự giữ vị trí ngày càng quan trọng.",
    source: "Giáo trình tr. 100; PDF tr. 101."
  },
  {
    id: "r2q04", round: 2, type: "single",
    prompt: "Lập luận nào giải thích đúng vị trí của mặt trận ngoại giao được Hội nghị Trung ương 13 mở ra đầu năm 1967?",
    options: [
      { id: "A", label: "Ngoại giao trở thành mặt trận quyết định duy nhất, quân sự và chính trị chuyển sang phục vụ đàm phán" },
      { id: "B", label: "Để kết hợp thắng lợi quân sự, chính trị với sự ủng hộ quốc tế, mở cục diện vừa đánh vừa đàm" },
      { id: "C", label: "Ngoại giao được mở trước khi có thắng lợi quân sự, nhằm đổi việc ngừng chi viện lấy đàm phán" },
      { id: "D", label: "Ngoại giao chủ yếu nhằm thỏa hiệp về chia cắt lâu dài để Mỹ chấm dứt ném bom miền Bắc" }
    ],
    correct: "B",
    explanation: "Mặt trận ngoại giao giúp phát huy sức mạnh tổng hợp và tranh thủ sự ủng hộ quốc tế trên cơ sở những thắng lợi đã giành được.",
    source: "Giáo trình tr. 104; PDF tr. 105."
  },
  {
    id: "r2q05", round: 2, type: "single",
    prompt: "Giáo trình phê bình việc chậm chuyển hướng sau đợt đầu Mậu Thân. Bài học nào bám sát nhất hạn chế đó?",
    options: [
      { id: "A", label: "Tiếp tục đánh vào đô thị để duy trì áp lực, vì mục tiêu chiến lược đúng thì phương thức không cần thay đổi" },
      { id: "B", label: "Kịp thời đánh giá lại tương quan, âm mưu đối phương và chuyển hướng phù hợp" },
      { id: "C", label: "Thu hẹp đấu tranh chính trị để tập trung khôi phục lực lượng quân sự sau tổn thất" },
      { id: "D", label: "Giữ bí mật tuyệt đối về chủ trương và chờ khôi phục hoàn toàn yếu tố bất ngờ mới tiếp tục tiến công" }
    ],
    correct: "B",
    explanation: "Giáo trình nhận định việc tiếp tục tiến công đô thị khi không còn điều kiện và yếu tố bất ngờ là sai lầm về chỉ đạo chiến lược, gây khó khăn và tổn thất.",
    source: "Giáo trình tr. 106; PDF tr. 107."
  },
  {
    id: "r3q01", round: 3, type: "multi",
    prompt: "Trong điều kiện chiến tranh phá hoại, chọn ba biện pháp thể hiện đúng tư duy vừa chiến đấu, vừa sản xuất, vừa làm hậu phương lớn.",
    options: [
      { id: "A", label: "Sơ tán hoặc phân nhỏ cơ sở sản xuất để tiếp tục hoạt động" },
      { id: "B", label: "Duy trì sản xuất, giáo dục, y tế và ổn định đời sống" },
      { id: "C", label: "Bảo đảm giao thông và tăng cường chi viện chiến trường" },
      { id: "D", label: "Giữ các cơ sở công nghiệp tập trung tại đô thị để không làm giảm năng suất trước mắt" },
      { id: "E", label: "Ưu tiên tuyệt đối chi viện quân sự, cắt giảm giáo dục, y tế và ổn định đời sống trong thời chiến" },
      { id: "F", label: "Chỉ vận chuyển bằng đường biển để tránh phân tán nguồn lực cho nhiều tuyến chiến lược" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Miền Bắc duy trì các hoạt động kinh tế - xã hội trong chiến tranh, bảo đảm giao thông và hoàn thành nhiệm vụ chi viện tiền tuyến.",
    source: "Giáo trình tr. 102-103; PDF tr. 103-104."
  },
  {
    id: "r3q02", round: 3, type: "multi",
    prompt: "Chọn ba chủ trương tạo thành một chỉnh thể chống “Việt Nam hóa chiến tranh” và phá chương trình “bình định” giai đoạn 1969-1970.",
    options: [
      { id: "A", label: "Lấy nông thôn làm hướng tiến công chính" },
      { id: "B", label: "Phát triển mạnh chiến tranh nhân dân địa phương" },
      { id: "C", label: "Phát triển ba thứ quân và tăng cường lực lượng tại chỗ" },
      { id: "D", label: "Chuyển hướng tiến công chính vào đô thị vì quân Mỹ đang rút dần khỏi chiến trường" },
      { id: "E", label: "Tập trung lực lượng chủ lực đánh trận lớn, tạm thời giảm hoạt động của chiến tranh nhân dân địa phương" },
      { id: "F", label: "Co lực lượng tại chỗ về bảo vệ căn cứ, nhường địa bàn nông thôn để bảo toàn quân số" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Trung ương 18 và Hội nghị Bộ Chính trị tháng 6/1970 nhấn mạnh phá “bình định”, kết hợp tác chiến chủ lực với chiến tranh nhân dân địa phương.",
    source: "Giáo trình tr. 109; PDF tr. 110."
  },
  {
    id: "r3q03", round: 3, type: "multi",
    prompt: "Chọn đúng ba mắt xích quân sự - phòng thủ chiến lược - ngoại giao đã hợp thành sức ép buộc Mỹ ký Hiệp định Paris.",
    options: [
      { id: "A", label: "Mở cuộc tiến công chiến lược Xuân - Hè 1972" },
      { id: "B", label: "Bảo vệ miền Bắc, đánh bại cuộc tập kích đường không cuối năm 1972" },
      { id: "C", label: "Giữ vững lập trường và tiếp tục đấu tranh trên bàn đàm phán" },
      { id: "D", label: "Chấp nhận dự thảo của Mỹ trước tháng 10/1972 để đổi lấy việc chấm dứt ném bom miền Bắc" },
      { id: "E", label: "Đình chỉ tiến công chiến lược trong khi đàm phán để chứng minh thiện chí đơn phương" },
      { id: "F", label: "Đặt việc Mỹ rút quân sau giải pháp chính trị nội bộ miền Nam, thay vì coi rút quân là điều kiện cốt lõi" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Thắng lợi trên chiến trường, khả năng đứng vững của hậu phương miền Bắc và đấu tranh ngoại giao gắn bó với nhau, buộc Mỹ ký Hiệp định Paris.",
    source: "Giáo trình tr. 107 và 110; PDF tr. 108 và 111."
  },
  {
    id: "r3q04", round: 3, type: "multi",
    prompt: "Sau Hiệp định Paris, chọn ba hành động cho thấy Trung ương không đồng nhất việc Mỹ rút quân với chiến tranh đã kết thúc.",
    options: [
      { id: "A", label: "Chủ động chống các cuộc hành quân lấn chiếm" },
      { id: "B", label: "Xây dựng các quân đoàn chủ lực có khả năng cơ động cao" },
      { id: "C", label: "Hoàn thiện đường Đông Trường Sơn, đường ống xăng dầu và hậu cần" },
      { id: "D", label: "Giới hạn phản ứng ở đấu tranh pháp lý - ngoại giao để tránh bị xem là vi phạm Hiệp định" },
      { id: "E", label: "Chờ tổng tuyển cử và hòa giải chính trị rồi mới củng cố vùng giải phóng" },
      { id: "F", label: "Giảm quy mô chủ lực cơ động để chuyển nhân lực sang khôi phục kinh tế sau chiến tranh" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Trung ương 21 chủ trương giữ vững thế tiến công; đồng thời lực lượng chủ lực, tuyến vận tải và hậu cần chiến lược được tăng cường.",
    source: "Giáo trình tr. 111; PDF tr. 112."
  },
  {
    id: "r4q01", round: 4, type: "single",
    prompt: "Dữ kiện nào làm cho Phước Long trở thành một “đòn thăm dò chiến lược”, chứ không chỉ là thắng lợi mở rộng địa bàn?",
    options: [
      { id: "A", label: "Đối phương không chiếm lại được và quân Mỹ không thể trở lại" },
      { id: "B", label: "Thắng lợi chứng minh Mỹ đã chấm dứt mọi hình thức viện trợ và can dự vào chính quyền Sài Gòn" },
      { id: "C", label: "Thắng lợi tự nó xác nhận tương quan lực lượng trên toàn miền Nam đã hoàn toàn áp đảo ở mọi hướng" },
      { id: "D", label: "Phước Long ở gần Sài Gòn nên có thể thay thế yêu cầu đánh giá phản ứng chính trị - quân sự của Mỹ" }
    ],
    correct: "A",
    explanation: "Phản ứng thực tế sau Phước Long giúp Bộ Chính trị có thêm cơ sở đánh giá so sánh lực lượng và thời cơ giải phóng hoàn toàn miền Nam.",
    source: "Giáo trình tr. 112; PDF tr. 113."
  },
  {
    id: "r4q02", round: 4, type: "single",
    prompt: "Phương án nào thể hiện đúng mối quan hệ giữa kế hoạch cơ bản và phương án thời cơ trong quyết tâm của Bộ Chính trị cuối 1974 - đầu 1975?",
    options: [
      { id: "A", label: "Kế hoạch cơ bản hoàn thành trong năm 1975; nếu chưa thuận lợi thì kéo sang năm 1976" },
      { id: "B", label: "Kế hoạch hai năm 1975-1976, nhưng nếu thời cơ đến thì giải phóng ngay trong năm 1975" },
      { id: "C", label: "Kế hoạch hai năm 1975-1976; chỉ được chuyển sang tổng tiến công sau khi hoàn tất chuẩn bị năm 1975" },
      { id: "D", label: "Kế hoạch hoàn thành trong năm 1976; thắng lợi Phước Long chỉ có ý nghĩa củng cố phòng ngự" }
    ],
    correct: "B",
    explanation: "Quyết sách kết hợp kế hoạch cơ bản hai năm với phương án linh hoạt, sẵn sàng chớp thời cơ ngay trong năm 1975.",
    source: "Giáo trình tr. 112; PDF tr. 113."
  },
  {
    id: "r4q03", round: 4, type: "order",
    prompt: "Chọn lần lượt các chiến dịch theo đúng trình tự thời gian.",
    options: [
      { id: "ho_chi_minh", label: "Chiến dịch Hồ Chí Minh" },
      { id: "hue", label: "Chiến dịch giải phóng Huế" },
      { id: "tay_nguyen", label: "Chiến dịch Tây Nguyên, mở đầu tại Buôn Ma Thuột" },
      { id: "da_nang", label: "Chiến dịch giải phóng Đà Nẵng" }
    ],
    correct: ["tay_nguyen", "hue", "da_nang", "ho_chi_minh"],
    explanation: "Thắng lợi phát triển liên tục từ Tây Nguyên xuống ven biển miền Trung rồi tiến tới chiến dịch giải phóng Sài Gòn - Gia Định.",
    source: "Giáo trình tr. 112-113; PDF tr. 113-114."
  },
  {
    id: "r4q04", round: 4, type: "single",
    prompt: "Hãy phân biệt các nấc điều chỉnh quyết tâm: quyết định nào được Bộ Chính trị đưa ra đúng ngày 18/3/1975?",
    options: [
      { id: "A", label: "Giải phóng miền Nam trước mùa mưa năm 1975" },
      { id: "B", label: "Giải phóng miền Nam trong năm 1975" },
      { id: "C", label: "Mở Chiến dịch Hồ Chí Minh giải phóng Sài Gòn - Gia Định" },
      { id: "D", label: "Chuyển từ kế hoạch hai năm sang hoàn thành trước tháng 4/1975" }
    ],
    correct: "B",
    explanation: "Sự phát triển nhanh của tình hình khiến quyết tâm chiến lược được điều chỉnh kịp thời từ kế hoạch hai năm sang hoàn thành trong năm 1975.",
    source: "Giáo trình tr. 112; PDF tr. 113."
  },
  {
    id: "r4q05", round: 4, type: "single",
    prompt: "Phương án nào ghép đúng thời điểm mở đầu, kết thúc và tổng thời gian của Tổng tiến công và nổi dậy mùa Xuân 1975?",
    options: [
      { id: "A", label: "Từ 8/3 đến 30/4/1975 - 54 ngày đêm" },
      { id: "B", label: "Từ 10/3 đến 2/5/1975 - 55 ngày đêm" },
      { id: "C", label: "Từ 10/3 đến 30/4/1975 - 55 ngày đêm" },
      { id: "D", label: "Từ 21/3 đến 30/4/1975 - 41 ngày đêm" }
    ],
    correct: "C",
    explanation: "Cuộc Tổng tiến công diễn ra trong 55 ngày đêm, từ đòn mở đầu ở Buôn Ma Thuột ngày 10/3 đến ngày 30/4/1975.",
    source: "Giáo trình tr. 113; PDF tr. 114."
  },
  {
    id: "r5q01", round: 5, type: "multi",
    prompt: "Chọn bốn dữ kiện tạo thành chuỗi lập luận lịch sử phản bác nhận định “đấu tranh vũ trang được phát động tùy tiện và không cần thiết”.",
    options: [
      { id: "A", label: "Sau Geneve, Đảng chuyển sang đấu tranh chính trị, đòi thi hành Hiệp định" },
      { id: "B", label: "Mỹ - Diệm cự tuyệt tổng tuyển cử, đàn áp phong trào; Luật 10/59 đẩy bạo lực lên cao" },
      { id: "C", label: "Năm 1965, quân Mỹ trực tiếp tham chiến và Mỹ đánh phá miền Bắc" },
      { id: "D", label: "Đảng mở mặt trận ngoại giao từ năm 1967, hình thành cục diện vừa đánh vừa đàm" },
      { id: "E", label: "Chỉ riêng việc Mỹ can thiệp đã đủ chứng minh mọi hình thức và mọi thời điểm sử dụng vũ lực đều tất yếu" },
      { id: "F", label: "Tổn thất lớn của chiến tranh tự nó là bằng chứng trực tiếp rằng lựa chọn đấu tranh vũ trang là cần thiết" }
    ],
    correct: ["A", "B", "C", "D"],
    explanation: "Đấu tranh vũ trang xuất hiện sau khi con đường thống nhất hòa bình bị cự tuyệt và phong trào chính trị bị đàn áp; đấu tranh chính trị và ngoại giao vẫn được kết hợp trong suốt cuộc chiến.",
    source: "Giáo trình tr. 83, 90-91, 99, 104; PDF tr. 84, 91-92, 100, 105."
  },
  {
    id: "r5q02", round: 5, type: "multi",
    prompt: "Chọn năm dữ kiện bác bỏ tính từ “đơn thuần” trong cách diễn giải chiến tranh Việt Nam chỉ là nội chiến do khác biệt ý thức hệ.",
    options: [
      { id: "A", label: "Mỹ thay chân Pháp, xây dựng và trang bị chính quyền cùng quân đội Sài Gòn" },
      { id: "B", label: "Từ năm 1965, quân Mỹ và quân đồng minh trực tiếp tham chiến" },
      { id: "C", label: "Cách mạng miền Nam có lực lượng tại chỗ; Chính phủ Cách mạng lâm thời tham gia Paris" },
      { id: "D", label: "“Việt Nam hóa” dùng người Việt đánh người Việt để tiếp tục chiến tranh thực dân mới" },
      { id: "E", label: "Geneve và Paris đều khẳng định độc lập, thống nhất và toàn vẹn lãnh thổ Việt Nam" },
      { id: "F", label: "Việc quân Mỹ rút sau Paris chứng tỏ yếu tố nước ngoài trước đó chỉ mang tính phụ trợ, không làm đổi bản chất xung đột" },
      { id: "G", label: "Chỉ cần có người Việt chiến đấu ở hai phía là đủ kết luận đây là nội chiến thuần túy, không cần xét nguồn lực và mục tiêu can thiệp" }
    ],
    correct: ["A", "B", "C", "D", "E"],
    explanation: "Việc người Việt chiến đấu ở hai phía là thực tế đau xót, nhưng không bao quát được sự can thiệp trực tiếp của Mỹ, lực lượng cách mạng tại miền Nam và mục tiêu độc lập, thống nhất.",
    source: "Giáo trình tr. 83, 89-92, 99, 106, 108, 110; PDF tr. 84, 90-93, 100, 107, 109, 111."
  },
  {
    id: "r5q03", round: 5, type: "single",
    prompt: "Lập luận nào tránh được cả hai cách giải thích đơn nhân: tuyệt đối hóa quân sự hoặc tuyệt đối hóa viện trợ quốc tế đối với thắng lợi năm 1975?",
    options: [
      { id: "A", label: "Quân sự tạo kết quả trực tiếp nên có thể xem lãnh đạo, hậu phương và ngoại giao chỉ là điều kiện phụ" },
      { id: "B", label: "Thắng lợi là kết quả của lãnh đạo, toàn dân, hậu phương, lực lượng tại miền Nam, đoàn kết và ủng hộ quốc tế" },
      { id: "C", label: "Hiệp định Paris đã quyết định toàn bộ kết quả; các chiến dịch năm 1975 chỉ thực hiện phần việc còn lại" },
      { id: "D", label: "Viện trợ và phong trào quốc tế tạo ưu thế quyết định; đường lối và nội lực chủ yếu giúp chuyển hóa ưu thế ấy" }
    ],
    correct: "B",
    explanation: "Giáo trình xác định nhiều nguyên nhân gắn bó với nhau, trong đó có lãnh đạo của Đảng, sự hy sinh của nhân dân, hậu phương miền Bắc và sự đoàn kết, ủng hộ quốc tế.",
    source: "Giáo trình tr. 114; PDF tr. 115."
  },
  {
    id: "r5q04", round: 5, type: "multi",
    prompt: "Theo phần “Nguyên nhân thắng lợi” của giáo trình, chọn đúng năm yếu tố được nêu trực tiếp; không chọn cách diễn giải tuyệt đối hóa.",
    options: [
      { id: "A", label: "Sự lãnh đạo đúng đắn, độc lập, tự chủ và sáng tạo của Đảng" },
      { id: "B", label: "Sự đoàn kết, chiến đấu và hy sinh của đồng bào, chiến sĩ cả nước" },
      { id: "C", label: "Sức mạnh của miền Bắc với tư cách hậu phương lớn" },
      { id: "D", label: "Đoàn kết chiến đấu giữa nhân dân Việt Nam, Lào và Campuchia" },
      { id: "E", label: "Sự ủng hộ và giúp đỡ quốc tế" },
      { id: "F", label: "Mâu thuẫn nội bộ nước Mỹ là nguyên nhân trực tiếp và quyết định thay cho thắng lợi trên chiến trường" },
      { id: "G", label: "Ưu thế tuyệt đối về vật chất của cách mạng trong toàn bộ giai đoạn 1965-1975" }
    ],
    correct: ["A", "B", "C", "D", "E"],
    explanation: "Sự giúp đỡ quốc tế là quan trọng nhưng không thay thế vai trò của đường lối, nội lực, tổ chức và sự hy sinh của nhân dân Việt Nam.",
    source: "Giáo trình tr. 114; PDF tr. 115."
  },
  {
    id: "r5q05", round: 5, type: "multi",
    prompt: "Chọn ba căn cứ nối liền tình hình sau Paris với chủ trương của Trung ương 21; hai phương án còn lại đều suy diễn sai nghĩa của Hiệp định.",
    options: [
      { id: "A", label: "Chính quyền Nguyễn Văn Thiệu tiếp tục phá hoại Hiệp định và hành quân lấn chiếm" },
      { id: "B", label: "Trong năm 1973, nhiều vùng giải phóng mới bị lấn chiếm, trong đó có cảng Cửa Việt" },
      { id: "C", label: "Trung ương 21 yêu cầu giữ thế tiến công, phát triển thực lực và chuẩn bị giải phóng miền Nam" },
      { id: "D", label: "Mỹ đã rút quân nên mọi cuộc hành quân lấn chiếm sau đó chỉ là vấn đề nội bộ, không thể là căn cứ tiếp tục đấu tranh" },
      { id: "E", label: "Hiệp định buộc lực lượng cách mạng chỉ chờ cơ chế giám sát quốc tế, kể cả khi vùng giải phóng bị lấn chiếm" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Hiệp định bị phá hoại ngay sau khi ký; vì vậy Trung ương 21 xác định phải chủ động phản công và chuẩn bị tiến tới giải phóng hoàn toàn miền Nam.",
    source: "Giáo trình tr. 111; PDF tr. 112."
  }
];

module.exports = questions.map((question) => {
  const correctIds = Array.isArray(question.correct) ? question.correct : [question.correct];
  const labels = correctIds
    .map((id) => question.options.find((option) => option.id === id)?.label)
    .filter(Boolean);
  return {
    ...question,
    roundTitle: ROUND_TITLES[question.round],
    durationMs: question.type === "single" ? 35_000 : 50_000,
    answerLabel: labels.join(" → ")
  };
});
