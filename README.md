# Mật lệnh Thống nhất 1965–1975

Trò chơi web nhiều người theo thời gian thực dành cho màn hình máy tính. Một người tạo phòng, người chơi nhập mã năm ký tự và tên để tham gia. Trò chơi chỉ có chế độ cá nhân, không dùng mã QR và không yêu cầu tài khoản.

## Chạy trên máy

```powershell
npm install
npm start
```

Mở `http://localhost:3000` trên các máy cùng truy cập được máy chủ.

### Chơi trong cùng lớp học / cùng Wi-Fi

1. Người tổ chức chạy hai lệnh trên máy của mình.
2. Trên máy tổ chức, mở `http://localhost:3000` và tạo phòng.
3. Người chơi mở địa chỉ mạng nội bộ của máy tổ chức, ví dụ `http://192.168.1.8:3000`.
4. Người chơi nhập mã phòng năm ký tự và tên hiển thị.

Nếu máy khác không mở được trang, hãy cho phép Node.js qua Windows Firewall đối với mạng riêng.

## Luật chơi

- 24 thử thách thuộc 5 vòng: dòng thời gian, quyết sách, sức mạnh tổng hợp, chớp thời cơ năm 1975 và phản bác luận điệu sai trái.
- Có ba dạng câu hỏi: chọn một, chọn nhiều và sắp xếp trình tự.
- Trả lời đúng và nhanh nhận nhiều điểm hơn; điểm chỉ được công bố sau khi khóa câu hỏi.
- Bảng xếp hạng cập nhật đồng thời trên mọi máy.
- Tải lại trang hoặc mất mạng ngắn hạn không làm mất điểm của phiên đang chơi.

## Kiểm thử

```powershell
npm test
npm run test:e2e
```

Ứng dụng hỗ trợ màn hình từ 1024 × 700 trở lên. Phòng chơi được lưu trong bộ nhớ, vì vậy việc khởi động lại máy chủ sẽ kết thúc các phòng đang mở.

## Cấu trúc

- `server.js`: máy chủ Express và Socket.IO.
- `src/questions.js`: nội dung câu hỏi và nguồn giáo trình.
- `src/game-engine.js`: chấm điểm, kiểm tra đáp án và xếp hạng.
- `public/`: giao diện người tổ chức và người chơi.
- `tests/`: kiểm thử chấm điểm, tranh chấp bộ hẹn giờ, kết nối lại và luồng nhiều người chơi.
