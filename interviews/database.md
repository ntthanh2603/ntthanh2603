### Database

- Ưu nhược điểm của dùng index:
  - Ưu điểm: Tăng tốc độ khi Select, join, order by, group by, like.
  - Nhược điểm: Tốn dung lượng lưu trữ và giảm hiệu xuất với insert,update,delete. Nếu số lượng bản ghi chỉ vài trăm thì không nên dùng index vì quét toàn bộ bảng nhanh hơn.
- Phân biệt Partition và Sharding:
  - Patition là chia nhỏ 1 hoặc nhiều bảng nhưng vẫn giữ trong cùng 1 database.
  - Sharding là chia nhỏ database thành nhiều phần để cấu hình trên nhiều node của máy chủ.
