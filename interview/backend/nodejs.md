## Interview Backend Nestjs

- So sáng express và nestjs:

- Phân biệt module, controller, provider, service, midderware, intercepter:

- Phân biệt phương thức Get, Post:

- Phân biệt HTTP và HTTPS:

- Mã hóa(Encryption): Mã hóa giúp bảo vệ dữ liệu bằng cách chuyển đổi nó thành một dạng không thể đọc được nếu không có khóa giải mã dùng crypto( trong Nodejs) và jsonwebtoken. Các thuật toán mã hóa như: RSA,HMAC-SHA256,RS256,ES256...

- Băm(Hashing): Hash là quá trình chuyển đổi dữ liệu thành một chuỗi cố định, không thể đảo ngược dùng lib(crypto, bcrypt, argon2). Các thuật toán: MD5, SHA-256, SHA-512...

- Jwt là gì: Jsonwebtoken là cơ chế xác thực người dùng theo mô hình stateful.

- Thành phần jwt gồm: Header chứa thuật toán ký (HMAC, RSA, ES), Payload chứa dữ liệu (userId, role, exp, ...), Signature được tạo bằng thuật toán ký số. Mỗi phần trong jwt được cách nhau bởi dấu ".".

- Tại sao jwt cần signature mà không để nguyên payload:

  - Dùng signature để đảm bảo payload không bị sửa đổi, nếu sửa đổi chữ ký sẽ không khớp và token bị từ chối.
  - Nếu không có signature bất kỳ ai cũng có thể tạo jwt giả mạo.
  - Ngăn chặn tấn công "Replay Attack": Thêm timestamp(iat, exp) và kiểm tra hạn token kết hợp chữ ký đảm bảo token không bị sửa đổi.

- Tại sao lại dùng async/await
