### Database
- Phân biệt SQL và NoSQL:
  - Cấu trúc dữ liệu: SQL (Structured Query Language): Cơ sở dữ liệu quan hệ, sử dụng bảng (tables) với các hàng (rows) và cột (columns). Dữ liệu có cấu trúc cố định. NoSQL: Cơ sở dữ liệu phi quan hệ, lưu trữ dữ liệu dưới dạng tài liệu (documents), cặp khóa-giá trị (key-value), đồ thị (graph), hoặc cột (column). Dữ liệu có thể không cấu trúc hoặc linh hoạt.
  - Mở rộng: SQL: Tối ưu cho các hệ thống có quan hệ và yêu cầu dữ liệu liên kết chặt chẽ, mở rộng theo chiều ngang khó khăn. NoSQL: Phù hợp với các hệ thống phân tán, có thể mở rộng linh hoạt theo chiều ngang.
  - Tính nhất quán: SQL: Dựa trên nguyên lý ACID (Atomicity, Consistency, Isolation, Durability), đảm bảo tính nhất quán dữ liệu. NoSQL: Thường sử dụng nguyên lý BASE (Basically Available, Soft state, Eventually consistent), có thể chấp nhận một số sự không nhất quán trong thời gian ngắn.
  - Đặc điểm ứng dụng: SQL: Thích hợp cho các ứng dụng với dữ liệu có cấu trúc rõ ràng và quan hệ phức tạp. NoSQL: Phù hợp với ứng dụng yêu cầu xử lý dữ liệu lớn, không cấu trúc hoặc thay đổi nhanh chóng (ví dụ: mạng xã hội, phân tích big data).
  - NoSQL không có quan hệ truyền thống như SQL không có ràng buộc giữa các bảng. Tuy nhiên cơ sở dữ liệu dạng đồ thị như Neo4j có thể lưu trữ và quản lý quan hệ các đối tượng dựa vào cạnh(edges) và đỉnh(nodes).
  
- Ưu nhược điểm của dùng index:
  - Ưu điểm: Tăng tốc độ khi Select, join, order by, group by, like.
  - Nhược điểm: Tốn dung lượng lưu trữ và giảm hiệu xuất với insert,update,delete. Nếu số lượng bản ghi chỉ vài trăm thì không nên dùng index vì quét toàn bộ bảng nhanh hơn.
- Phân biệt Partition và Sharding:
  - Patition là chia nhỏ 1 hoặc nhiều bảng nhưng vẫn giữ trong cùng 1 database.
  - Sharding là chia nhỏ database thành nhiều phần để cấu hình trên nhiều node của máy chủ.
