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
    prompt: "Sự kiện nào đánh dấu quân Mỹ trực tiếp tham chiến tại miền Nam?",
    options: [
      { id: "A", label: "Mỹ ký Hiệp định Paris" },
      { id: "B", label: "Quân Mỹ đổ bộ vào Đà Nẵng ngày 8/3/1965" },
      { id: "C", label: "Mỹ tuyên bố ngừng ném bom miền Bắc" },
      { id: "D", label: "Chiến thắng Phước Long" }
    ],
    correct: "B",
    explanation: "Ngày 8/3/1965, quân Mỹ đổ bộ vào Đà Nẵng. Mỹ chuyển sang “Chiến tranh cục bộ”, đưa quân Mỹ và đồng minh trực tiếp tham chiến, đồng thời đánh phá miền Bắc.",
    source: "Giáo trình tr. 99; PDF tr. 100."
  },
  {
    id: "r1q02", round: 1, type: "single",
    prompt: "Hai hội nghị nào xác lập đường lối kháng chiến chống Mỹ trên phạm vi cả nước trong năm 1965?",
    options: [
      { id: "A", label: "Trung ương 6 và Trung ương 7" },
      { id: "B", label: "Trung ương 9 và Trung ương 10" },
      { id: "C", label: "Trung ương 11 và Trung ương 12" },
      { id: "D", label: "Trung ương 18 và Trung ương 21" }
    ],
    correct: "C",
    explanation: "Hội nghị Trung ương 11 tháng 3/1965 và Trung ương 12 tháng 12/1965 phát động kháng chiến chống Mỹ trên phạm vi toàn quốc và xác định quyết tâm chiến lược.",
    source: "Giáo trình tr. 99-100; PDF tr. 100-101."
  },
  {
    id: "r1q03", round: 1, type: "single",
    prompt: "Cặp mô tả nào đúng với quan hệ chiến lược giữa hai miền?",
    options: [
      { id: "A", label: "Miền Nam là tiền tuyến lớn; miền Bắc là hậu phương lớn" },
      { id: "B", label: "Miền Bắc là tiền tuyến lớn; miền Nam là hậu phương lớn" },
      { id: "C", label: "Hai miền thực hiện hai cuộc chiến hoàn toàn độc lập" },
      { id: "D", label: "Chỉ miền Nam có nhiệm vụ chống Mỹ" }
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
    prompt: "Những kết quả chiến lược nào gắn với Tổng tiến công và nổi dậy Tết Mậu Thân 1968?",
    options: [
      { id: "A", label: "Làm phá sản chiến lược “Chiến tranh cục bộ”" },
      { id: "B", label: "Đánh mạnh vào ý chí xâm lược của giới cầm quyền Mỹ" },
      { id: "C", label: "Buộc Mỹ chấp nhận đàm phán tại Paris" },
      { id: "D", label: "Giải phóng hoàn toàn miền Nam ngay trong năm 1968" },
      { id: "E", label: "Chấm dứt ngay mọi hoạt động chiến tranh" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Mậu Thân tạo thất bại chiến lược có tính bước ngoặt cho Mỹ nhưng chưa giải phóng hoàn toàn miền Nam. Giáo trình cũng chỉ rõ sai lầm do chậm chuyển hướng sau đợt đầu.",
    source: "Giáo trình tr. 105-106; PDF tr. 106-107."
  },
  {
    id: "r2q01", round: 2, type: "single",
    prompt: "Phương châm chiến lược nào được Đảng xác định khi Mỹ mở rộng chiến tranh năm 1965?",
    options: [
      { id: "A", label: "Chỉ phòng thủ và chờ đối phương xuống thang" },
      { id: "B", label: "Đánh lâu dài, dựa vào sức mình là chính, càng đánh càng mạnh và tranh thủ thời cơ" },
      { id: "C", label: "Chỉ sử dụng đấu tranh ngoại giao" },
      { id: "D", label: "Tìm một trận quyết chiến ngay lập tức trong mọi điều kiện" }
    ],
    correct: "B",
    explanation: "Đường lối kết hợp chuẩn bị cho cuộc chiến lâu dài với nỗ lực tạo thế, tập trung lực lượng và tranh thủ thời cơ giành thắng lợi quyết định.",
    source: "Giáo trình tr. 100; PDF tr. 101."
  },
  {
    id: "r2q02", round: 2, type: "multi",
    prompt: "Những nhiệm vụ lớn nào được xác định cho miền Bắc khi cả nước có chiến tranh?",
    options: [
      { id: "A", label: "Chuyển hướng xây dựng kinh tế phù hợp điều kiện chiến tranh" },
      { id: "B", label: "Tăng cường lực lượng quốc phòng" },
      { id: "C", label: "Chi viện miền Nam ở mức cao nhất" },
      { id: "D", label: "Chuyển hướng tư tưởng và tổ chức" },
      { id: "E", label: "Dừng toàn bộ sản xuất dân sự" },
      { id: "F", label: "Từ bỏ nhiệm vụ xây dựng chủ nghĩa xã hội" }
    ],
    correct: ["A", "B", "C", "D"],
    explanation: "Miền Bắc vừa sản xuất, vừa chiến đấu, vừa tiếp tục xây dựng, đồng thời đảm nhiệm vai trò hậu phương lớn.",
    source: "Giáo trình tr. 101; PDF tr. 102."
  },
  {
    id: "r2q03", round: 2, type: "single",
    prompt: "Phương án nào phản ánh đầy đủ nhất tư tưởng chỉ đạo đối với miền Nam?",
    options: [
      { id: "A", label: "Chỉ dựa vào tác chiến quân sự chính quy" },
      { id: "B", label: "Chỉ đấu tranh chính trị tại đô thị" },
      { id: "C", label: "Kết hợp quân sự với chính trị, thực hiện ba mũi giáp công trên ba vùng chiến lược" },
      { id: "D", label: "Rút toàn bộ lực lượng khỏi nông thôn" }
    ],
    correct: "C",
    explanation: "Đảng chủ trương giữ vững thế tiến công và sử dụng phương pháp cách mạng tổng hợp, trong đó đấu tranh quân sự giữ vị trí ngày càng quan trọng.",
    source: "Giáo trình tr. 100; PDF tr. 101."
  },
  {
    id: "r2q04", round: 2, type: "single",
    prompt: "Vì sao Hội nghị Trung ương 13 quyết định mở mặt trận ngoại giao?",
    options: [
      { id: "A", label: "Để thay thế hoàn toàn đấu tranh quân sự" },
      { id: "B", label: "Để kết hợp thắng lợi quân sự, chính trị với sự ủng hộ quốc tế, mở cục diện vừa đánh vừa đàm" },
      { id: "C", label: "Để ngừng chi viện miền Nam" },
      { id: "D", label: "Để công nhận việc chia cắt lâu dài" }
    ],
    correct: "B",
    explanation: "Mặt trận ngoại giao giúp phát huy sức mạnh tổng hợp và tranh thủ sự ủng hộ quốc tế trên cơ sở những thắng lợi đã giành được.",
    source: "Giáo trình tr. 104; PDF tr. 105."
  },
  {
    id: "r2q05", round: 2, type: "single",
    prompt: "Bài học trực tiếp nào có thể rút ra từ hạn chế trong chỉ đạo sau đợt đầu Mậu Thân 1968?",
    options: [
      { id: "A", label: "Luôn tiếp tục phương thức cũ dù điều kiện đã thay đổi" },
      { id: "B", label: "Kịp thời đánh giá lại tương quan, âm mưu đối phương và chuyển hướng phù hợp" },
      { id: "C", label: "Từ bỏ đấu tranh chính trị" },
      { id: "D", label: "Giải tán lực lượng tại miền Nam" }
    ],
    correct: "B",
    explanation: "Giáo trình nhận định việc tiếp tục tiến công đô thị khi không còn điều kiện và yếu tố bất ngờ là sai lầm về chỉ đạo chiến lược, gây khó khăn và tổn thất.",
    source: "Giáo trình tr. 106; PDF tr. 107."
  },
  {
    id: "r3q01", round: 3, type: "multi",
    prompt: "Chọn ba hành động phù hợp để giữ vững vai trò hậu phương lớn của miền Bắc.",
    options: [
      { id: "A", label: "Sơ tán hoặc phân nhỏ cơ sở sản xuất để tiếp tục hoạt động" },
      { id: "B", label: "Duy trì sản xuất, giáo dục, y tế và ổn định đời sống" },
      { id: "C", label: "Bảo đảm giao thông và tăng cường chi viện chiến trường" },
      { id: "D", label: "Ngừng toàn bộ hoạt động kinh tế" },
      { id: "E", label: "Dừng đưa lực lượng vào miền Nam" },
      { id: "F", label: "Từ bỏ việc xây dựng tiềm lực lâu dài" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Miền Bắc duy trì các hoạt động kinh tế - xã hội trong chiến tranh, bảo đảm giao thông và hoàn thành nhiệm vụ chi viện tiền tuyến.",
    source: "Giáo trình tr. 102-103; PDF tr. 103-104."
  },
  {
    id: "r3q02", round: 3, type: "multi",
    prompt: "Những chủ trương nào được đề ra để chống “Việt Nam hóa chiến tranh” và chương trình “bình định”?",
    options: [
      { id: "A", label: "Lấy nông thôn làm hướng tiến công chính" },
      { id: "B", label: "Phát triển mạnh chiến tranh nhân dân địa phương" },
      { id: "C", label: "Phát triển ba thứ quân và tăng cường lực lượng tại chỗ" },
      { id: "D", label: "Rút toàn bộ lực lượng khỏi nông thôn" },
      { id: "E", label: "Chỉ hoạt động tại đô thị" },
      { id: "F", label: "Tách lực lượng chủ lực khỏi lực lượng địa phương" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Trung ương 18 và Hội nghị Bộ Chính trị tháng 6/1970 nhấn mạnh phá “bình định”, kết hợp tác chiến chủ lực với chiến tranh nhân dân địa phương.",
    source: "Giáo trình tr. 109; PDF tr. 110."
  },
  {
    id: "r3q03", round: 3, type: "multi",
    prompt: "Chọn ba yếu tố đã tạo sức ép tổng hợp dẫn tới Hiệp định Paris.",
    options: [
      { id: "A", label: "Mở cuộc tiến công chiến lược Xuân - Hè 1972" },
      { id: "B", label: "Bảo vệ miền Bắc, đánh bại cuộc tập kích đường không cuối năm 1972" },
      { id: "C", label: "Giữ vững lập trường và tiếp tục đấu tranh trên bàn đàm phán" },
      { id: "D", label: "Chấp nhận chia cắt Việt Nam lâu dài" },
      { id: "E", label: "Dừng mọi hoạt động trước khi có thỏa thuận" },
      { id: "F", label: "Từ bỏ yêu cầu quân Mỹ rút khỏi miền Nam" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Thắng lợi trên chiến trường, khả năng đứng vững của hậu phương miền Bắc và đấu tranh ngoại giao gắn bó với nhau, buộc Mỹ ký Hiệp định Paris.",
    source: "Giáo trình tr. 107 và 110; PDF tr. 108 và 111."
  },
  {
    id: "r3q04", round: 3, type: "multi",
    prompt: "Sau Hiệp định Paris, những hành động nào thể hiện sự chuẩn bị cho giai đoạn quyết định?",
    options: [
      { id: "A", label: "Chủ động chống các cuộc hành quân lấn chiếm" },
      { id: "B", label: "Xây dựng các quân đoàn chủ lực có khả năng cơ động cao" },
      { id: "C", label: "Hoàn thiện đường Đông Trường Sơn, đường ống xăng dầu và hậu cần" },
      { id: "D", label: "Giải thể lực lượng vì chiến tranh đã hoàn toàn kết thúc" },
      { id: "E", label: "Chờ đợi thụ động việc thi hành Hiệp định" },
      { id: "F", label: "Ngừng phát triển vùng giải phóng" }
    ],
    correct: ["A", "B", "C"],
    explanation: "Trung ương 21 chủ trương giữ vững thế tiến công; đồng thời lực lượng chủ lực, tuyến vận tải và hậu cần chiến lược được tăng cường.",
    source: "Giáo trình tr. 111; PDF tr. 112."
  },
  {
    id: "r4q01", round: 4, type: "single",
    prompt: "Vì sao chiến thắng Phước Long ngày 6/1/1975 được xem như một đòn thăm dò chiến lược?",
    options: [
      { id: "A", label: "Đối phương không chiếm lại được và quân Mỹ không thể trở lại" },
      { id: "B", label: "Mỹ lập tức đầu hàng vô điều kiện" },
      { id: "C", label: "Toàn bộ miền Nam đã được giải phóng" },
      { id: "D", label: "Hiệp định Paris được ký tại Phước Long" }
    ],
    correct: "A",
    explanation: "Phản ứng thực tế sau Phước Long giúp Bộ Chính trị có thêm cơ sở đánh giá so sánh lực lượng và thời cơ giải phóng hoàn toàn miền Nam.",
    source: "Giáo trình tr. 112; PDF tr. 113."
  },
  {
    id: "r4q02", round: 4, type: "single",
    prompt: "Bộ Chính trị xác định kế hoạch giải phóng miền Nam như thế nào?",
    options: [
      { id: "A", label: "Chỉ giải phóng trong năm 1976 và không được thay đổi" },
      { id: "B", label: "Kế hoạch hai năm 1975-1976, nhưng nếu thời cơ đến thì giải phóng ngay trong năm 1975" },
      { id: "C", label: "Không xác định thời hạn" },
      { id: "D", label: "Chờ quân Mỹ trở lại rồi mới hành động" }
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
    prompt: "Sau thắng lợi ở Buôn Ma Thuột và Tây Nguyên, Bộ Chính trị quyết định gì ngày 18/3/1975?",
    options: [
      { id: "A", label: "Dừng tiến công để đàm phán lại" },
      { id: "B", label: "Giải phóng miền Nam trong năm 1975" },
      { id: "C", label: "Chỉ củng cố địa bàn Tây Nguyên" },
      { id: "D", label: "Trở lại kế hoạch kéo dài đến năm 1980" }
    ],
    correct: "B",
    explanation: "Sự phát triển nhanh của tình hình khiến quyết tâm chiến lược được điều chỉnh kịp thời từ kế hoạch hai năm sang hoàn thành trong năm 1975.",
    source: "Giáo trình tr. 112; PDF tr. 113."
  },
  {
    id: "r4q05", round: 4, type: "single",
    prompt: "Cuộc Tổng tiến công và nổi dậy mùa Xuân 1975 diễn ra trong bao lâu?",
    options: [
      { id: "A", label: "12 ngày đêm" },
      { id: "B", label: "30 ngày đêm" },
      { id: "C", label: "55 ngày đêm" },
      { id: "D", label: "81 ngày đêm" }
    ],
    correct: "C",
    explanation: "Cuộc Tổng tiến công diễn ra trong 55 ngày đêm, từ ngày 10/3 đến ngày 30/4/1975.",
    source: "Giáo trình tr. 113; PDF tr. 114."
  },
  {
    id: "r5q01", round: 5, type: "multi",
    prompt: "Những dữ kiện nào phản bác luận điệu cho rằng đấu tranh vũ trang được phát động tùy tiện và hoàn toàn không cần thiết?",
    options: [
      { id: "A", label: "Sau Geneve, Đảng chuyển sang đấu tranh chính trị, đòi thi hành Hiệp định" },
      { id: "B", label: "Mỹ - Diệm cự tuyệt tổng tuyển cử, đàn áp phong trào; Luật 10/59 đẩy bạo lực lên cao" },
      { id: "C", label: "Năm 1965, quân Mỹ trực tiếp tham chiến và Mỹ đánh phá miền Bắc" },
      { id: "D", label: "Đảng mở mặt trận ngoại giao từ năm 1967, hình thành cục diện vừa đánh vừa đàm" },
      { id: "E", label: "Phía cách mạng chỉ sử dụng quân sự và từ chối mọi cuộc đàm phán" },
      { id: "F", label: "Mục tiêu của cuộc đấu tranh là mở rộng lãnh thổ sang nước khác" }
    ],
    correct: ["A", "B", "C", "D"],
    explanation: "Đấu tranh vũ trang xuất hiện sau khi con đường thống nhất hòa bình bị cự tuyệt và phong trào chính trị bị đàn áp; đấu tranh chính trị và ngoại giao vẫn được kết hợp trong suốt cuộc chiến.",
    source: "Giáo trình tr. 83, 90-91, 99, 104; PDF tr. 84, 91-92, 100, 105."
  },
  {
    id: "r5q02", round: 5, type: "multi",
    prompt: "Những dữ kiện nào cho thấy cách gọi đây là “nội chiến đơn thuần do khác biệt ý thức hệ” là không đầy đủ?",
    options: [
      { id: "A", label: "Mỹ thay chân Pháp, xây dựng và trang bị chính quyền cùng quân đội Sài Gòn" },
      { id: "B", label: "Từ năm 1965, quân Mỹ và quân đồng minh trực tiếp tham chiến" },
      { id: "C", label: "Cách mạng miền Nam có lực lượng tại chỗ; Chính phủ Cách mạng lâm thời tham gia Paris" },
      { id: "D", label: "“Việt Nam hóa” dùng người Việt đánh người Việt để tiếp tục chiến tranh thực dân mới" },
      { id: "E", label: "Geneve và Paris đều khẳng định độc lập, thống nhất và toàn vẹn lãnh thổ Việt Nam" },
      { id: "F", label: "Không hề có quân đội nước ngoài tham chiến tại Việt Nam" },
      { id: "G", label: "Khác biệt ý thức hệ là nguyên nhân duy nhất của toàn bộ cuộc chiến" }
    ],
    correct: ["A", "B", "C", "D", "E"],
    explanation: "Việc người Việt chiến đấu ở hai phía là thực tế đau xót, nhưng không bao quát được sự can thiệp trực tiếp của Mỹ, lực lượng cách mạng tại miền Nam và mục tiêu độc lập, thống nhất.",
    source: "Giáo trình tr. 83, 89-92, 99, 106, 108, 110; PDF tr. 84, 90-93, 100, 107, 109, 111."
  },
  {
    id: "r5q03", round: 5, type: "single",
    prompt: "Phương án nào phản bác đầy đủ nhất nhận định “thắng lợi năm 1975 chỉ là kết quả của hoạt động quân sự”?",
    options: [
      { id: "A", label: "Chỉ sức mạnh quân sự quyết định mọi kết quả" },
      { id: "B", label: "Thắng lợi là kết quả của lãnh đạo, toàn dân, hậu phương, lực lượng tại miền Nam, đoàn kết và ủng hộ quốc tế" },
      { id: "C", label: "Ngoại giao và hậu phương không có vai trò" },
      { id: "D", label: "Thắng lợi chỉ do một chiến dịch duy nhất" }
    ],
    correct: "B",
    explanation: "Giáo trình xác định nhiều nguyên nhân gắn bó với nhau, trong đó có lãnh đạo của Đảng, sự hy sinh của nhân dân, hậu phương miền Bắc và sự đoàn kết, ủng hộ quốc tế.",
    source: "Giáo trình tr. 114; PDF tr. 115."
  },
  {
    id: "r5q04", round: 5, type: "multi",
    prompt: "Theo giáo trình, những yếu tố nào là nguyên nhân thắng lợi của cuộc kháng chiến chống Mỹ?",
    options: [
      { id: "A", label: "Sự lãnh đạo đúng đắn, độc lập, tự chủ và sáng tạo của Đảng" },
      { id: "B", label: "Sự đoàn kết, chiến đấu và hy sinh của đồng bào, chiến sĩ cả nước" },
      { id: "C", label: "Sức mạnh của miền Bắc với tư cách hậu phương lớn" },
      { id: "D", label: "Đoàn kết chiến đấu giữa nhân dân Việt Nam, Lào và Campuchia" },
      { id: "E", label: "Sự ủng hộ và giúp đỡ quốc tế" },
      { id: "F", label: "Viện trợ quốc tế là nguyên nhân duy nhất" }
    ],
    correct: ["A", "B", "C", "D", "E"],
    explanation: "Sự giúp đỡ quốc tế là quan trọng nhưng không thay thế vai trò của đường lối, nội lực, tổ chức và sự hy sinh của nhân dân Việt Nam.",
    source: "Giáo trình tr. 114; PDF tr. 115."
  },
  {
    id: "r5q05", round: 5, type: "multi",
    prompt: "Những dữ kiện nào phản bác nhận định rằng sau Hiệp định Paris việc tiếp tục đấu tranh là không có căn cứ?",
    options: [
      { id: "A", label: "Chính quyền Nguyễn Văn Thiệu tiếp tục phá hoại Hiệp định và hành quân lấn chiếm" },
      { id: "B", label: "Trong năm 1973, nhiều vùng giải phóng mới bị lấn chiếm, trong đó có cảng Cửa Việt" },
      { id: "C", label: "Trung ương 21 yêu cầu giữ thế tiến công, phát triển thực lực và chuẩn bị giải phóng miền Nam" },
      { id: "D", label: "Tất cả các bên đã thi hành đầy đủ Hiệp định ngay lập tức" },
      { id: "E", label: "Lực lượng cách mạng đã giải thể sau khi Hiệp định được ký" }
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
    durationMs: question.type === "single" ? 25_000 : 40_000,
    answerLabel: labels.join(" → ")
  };
});

