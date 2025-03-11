## Interview Backend Nestjs

- Phân biệt let, var, const:
  - Var không nên dùng vì có vấn đề về hoisting( bị vấn đề không khai báo mà vẫn dùng được) và block scope( vấn đề không bị giới hạn trong block làm khó kiểm soát).
  - Let nên dùng cho biến có thể thay đổi giá trị. Let có phạm vi trong block {} và phải khai báo trước khi dùng.
  - Const nên dùng cho hằng số hoặc giá trị không thay đổi và phải khai báo trước khi dùng.
- So sáng express và nestjs:

- Phân biệt module, controller, provider, service, midderware, intercepter:

- Phân biệt phương thức Get, Post:

- Phân biệt HTTP và HTTPS:

- Phòng chống tấn công Cross-Site Scripting (XSS) Kẻ tấn công chèn JavaScript độc hại vào trang web, đánh cắp cookie, dữ liệu hoặc thực thi mã độc.

- Phòng chống tấn công Cross-Site Request Forgery (CSRF) Kẻ tấn công lừa người dùng thực hiện hành động không mong muốn bằng cách gửi yêu cầu từ một trang giả mạo.

- Phòng chống tấn công Brute Force Attack Thử nhiều lần đăng nhập với mật khẩu đoán được. Cách phòng: Dùng bcrypt để băm mật khẩu, giới hạn request, dùng cơ chế 2FA.

- Phòng chống tấn công Denial of Service (DoS) & Distributed Denial of Service (DDoS) Gửi quá nhiều request khiến server quá tải.

  - Rate limit để giới hạn request từ các IP.
  - Sử dụng CDN & Firewall (Cloudflare, AWS Shield).
  - Dùng throttling queue để kiểm soát request.
  - Giới hạn kích thước request để tránh tấn công bằng payload lớn
    ```
    app.use(express.json({ limit: '1kb' }));
    ```
  - Ẩn lỗi trong môi trường production:
    ```
    app.useGlobalFilters(new HttpExceptionFilter());
    ```

- Tại sao NestJs lại dùng cơ chế dependency injection(DI): DI là mẫu thiết kế phần mềm phổ biến trong các framework hiện đại vì các lý do:

  - Tăng tính mở rộng và dễ bảo trì. Ví dụ: Nếu bạn thay đổi cách lưu trữ dữ liệu (từ MongoDB sang PostgreSQL), bạn chỉ cần thay đổi cách triển khai dịch vụ tương ứng mà không ảnh hưởng đến các phần khác trong ứng dụng.
  - Dễ dàng kiểm thử: Hỗ trợ kiểm thử đơn vị (Unit Testing): DI giúp dễ dàng "mock" hoặc thay thế các dịch vụ bên ngoài mà không cần thay đổi mã nguồn. Điều này rất quan trọng khi bạn cần kiểm tra các phần cụ thể trong ứng dụng mà không cần đến các phần phụ thuộc ngoài (như cơ sở dữ liệu, API từ bên ngoài, v.v.).
  - Giảm sự phụ thuộc trực tiếp (Loose Coupling): Thay vì mỗi lớp tự tạo các đối tượng mà nó cần, DI cung cấp các đối tượng đó từ bên ngoài. Điều này giúp dễ dàng thay đổi hoặc tái sử dụng các lớp mà không gây ảnh hưởng đến hệ thống. Ví dụ: Một service không cần phải biết chi tiết về cách thức hoạt động của một repository, nó chỉ cần một đối tượng repository được cung cấp bởi DI.
  - Tăng tính linh hoạt và dễ cấu hình: Bạn có thể cung cấp các giá trị, cấu hình và dịch vụ cần thiết một cách linh động mà không cần phải thay đổi code trong lớp đang sử dụng chúng. Điều này giúp cấu hình hệ thống linh động hơn, dễ dàng thay đổi khi cần thiết.
  - Được hỗ trợ mạnh mẽ trong NestJS: Giúp mã dễ đọc, dễ hiểu và không có sự rối loại giữa các thành phần. DI giúp tự động quản lý và tiêm (inject) các phụ thuộc vào các lớp cần thiết, đơn giản hóa việc phát triển và kiểm soát phụ thuộc trong ứng dụng.

- Mã hóa(Encryption): Mã hóa giúp bảo vệ dữ liệu bằng cách chuyển đổi nó thành một dạng không thể đọc được nếu không có khóa giải mã dùng crypto( trong Nodejs) và jsonwebtoken. Các thuật toán mã hóa như: RSA,HMAC-SHA256,RS256,ES256...

- Băm(Hashing): Hash là quá trình chuyển đổi dữ liệu thành một chuỗi cố định, không thể đảo ngược dùng lib(crypto, bcrypt, argon2). Các thuật toán: MD5, SHA-256, SHA-512...

- Jwt là gì: Jsonwebtoken là cơ chế xác thực người dùng theo mô hình stateful.

- Thành phần jwt gồm: Header chứa thuật toán ký (HMAC, RSA, ES), Payload chứa dữ liệu (userId, role, exp, ...), Signature được tạo bằng thuật toán ký số. Mỗi phần trong jwt được cách nhau bởi dấu ".".

- Tại sao jwt cần signature mà không để nguyên payload:

  - Dùng signature để đảm bảo payload không bị sửa đổi, nếu sửa đổi chữ ký sẽ không khớp và token bị từ chối.
  - Nếu không có signature bất kỳ ai cũng có thể tạo jwt giả mạo.
  - Ngăn chặn tấn công "Replay Attack": Thêm timestamp(iat, exp) và kiểm tra hạn token kết hợp chữ ký đảm bảo token không bị sửa đổi.

- Tác dụng của async/await:
  - Được sử dụng để giải quyết vấn đề bất đồng bộ (asynchronous programming) một cách dễ đọc và dễ quản lý hơn so với callback hoặc Promise chaining.
  - Tránh callback hell dẫn đến code khó đọc và khó bảo trì.
  - Dùng Promise chaining giúp tránh callback hell nhưng vẫn khó đọc khi có nhiều bước xử lý( Dùng .then() nhiều):

```bash
readFile('file.txt')
	.then(data => db.query('SELECT * FROM users'))
	.then(users => sendEmail(users))
	.then(() => console.log('Done'))
	.catch(err => console.error(err));
```

- Có thể xử lý nhiều tác vụ bất đồng bộ cùng lúc với Promise.all để tăng tốc độ:

```bash
async function fetchData() {
	const [users, orders] = await Promise.all([
			db.query('SELECT * FROM users'),
			db.query('SELECT * FROM orders')
	]);
	console.log(users, orders);
}
```

- Các chống SQL injection với TypeORM: SQL Injection là một lỗ hổng bảo mật cho phép kẻ tấn công chèn mã SQL độc hại vào các truy vấn cơ sở dữ liệu. Để phòng tránh, chúng ta không bao giờ nên xây dựng câu lệnh SQL bằng cách nối chuỗi trực tiếp từ dữ liệu đầu vào:
  - Tách dữ liệu đầu vào khỏi câu lệnh SQL chứ không nối chuỗi trực tiếp:

```
const user = await this.userRepo.query(
	'SELECT * FROM users WHERE email = $1',
	[email]
);
```

- Dùng Query Builder hoặc 1 số hàm như FindOne, FindOneBy ...(của TypeORM):

```
const user = await this.userRepo.createQueryBuilder('user')
	.where('user.email = :email', { email })
	.getOne();
```

- Đảm bảo mật khẩu luôn được băm.
