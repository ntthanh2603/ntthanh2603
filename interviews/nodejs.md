## Interview Backend Nestjs

- Phân biệt let, var, const:
  - Var không nên dùng vì có vấn đề về hoisting( bị vấn đề không khai báo mà vẫn dùng được) và block scope( vấn đề không bị giới hạn trong block làm khó kiểm soát).
  - Let nên dùng cho biến có thể thay đổi giá trị. Let có phạm vi trong block {} và phải khai báo trước khi dùng.
  - Const nên dùng cho hằng số hoặc giá trị không thay đổi và phải khai báo trước khi dùng.
- So sáng express và nestjs:

  - Expess: Không bắt buộc cấu trúc, và không ép buộc mô hình, dùng js hoặc ts, nhẹ nhanh hơn trong ứng dụng nhỏ,tùy chỉnh dễ dàng nhưng phải tùy chỉnh code.
  - Nestjs: Có kiến trúc mạnh mẽ, ép buộc theo kiến trúc Module + Controller + Service (giống Angular), phải dùng ts, tối ưu cho ứng dụng lớn, có sẵn module giúp
    mở rộng dễ dàng. Nestjs có hỗ trợ theo MVC bằng template engine như Handlebars, Pug, hoặc EJS để render HTML động.

- Phân biệt module, controller, provider, service, midderware, intercepter, pipe, guard:

  - Module: Nhóm các thành phần liên quan, giúp tổ chức code theo tính năng.
  - Controler: Nhận request từ client, xử lý và trả về response.
  - Provider: Chứa logic nghiệp vụ (business logic), có thể được inject vào nơi khác.
  - Service: Một loại provider, chuyên xử lý logic nghiệp vụ và thao tác dữ liệu.
  - Middleware: Xử lý yêu cầu trước khi vào controller.
  - Interceptor: Thực hiện các tác vụ trước và sau khi xử lý yêu cầu. Bạn có thể sử dụng interceptors để thực hiện các tác vụ như logging, caching, đo lường thời gian thực thi, v.v.
  - Pipe: Xử lý và chuyển đổi data trước khi handle trong controler, dùng validate, transform, xử lý dữ liệu trước khi chúng được xử lý.
  - Guard: Kiểm tra điều kiện và quyền truy cập trước khi vào controller.

- Phân biệt phương thức Get, Post:

  - Get: Dùng để lấy dữ liệu từ server, dữ liệu được đính kèm trên URL(Query, Param), không bảo mật vì có thể bị ghi lại trên trình duyệt, bị giới hạn độ dài dưới 2048 kí tự,
    Trình duyệt có thể lưu cache và dùng để tải file, phân trang, lấy profile user ...
  - Post: Gửi dữ liệu lên server để xử lý, dữ liệu từ client trong body của request, an toàn hơn Get, trình duyệt không lưu cache và không phù hợp để tải file
    (do không tự động hiển thị hộp thoại tải file /download?file=report.pdf và không hỗ trợ tải file trực tiếp từ URL, không hỗ trợ cache gây tải lại file không cần thiết).

- Phân biệt HTTP(HyperText Transfer Protocol) và HTTPS(HTTP Secure):

  - HTTP: Dữ liệu không cần mã hóa, dùng văn bản thuần, làm dễ bị đánh cắp dữ liệu. Không tối ưu SEO vì bảo mật kém.
  - HTTPS: Dữ liệu bị mã hóa bằng TLS/SSL giúp khó bị đánh cắp nhưng chậm hơn chút vì mất thời gian mã hóa và đặc biệt cần chứng chỉ SSL để hoạt động.

- Giải thích cơ chế HTTP only: HttpOnly là một thuộc tính của cookie giúp ngăn trình duyệt truy cập cookie từ JavaScript. Điều này giúp bảo vệ các thông tin nhạy cảm
  (như JWT token) khỏi các cuộc tấn công XSS (Cross-Site Scripting).

- Phòng chống tấn công Cross-Site Scripting (XSS) Kẻ tấn công chèn JavaScript độc hại vào trang web, đánh cắp cookie, dữ liệu hoặc thực thi mã độc.

  - Dùng Helmet giúp thiết lập các CSP (Content Security Policy) để chặn JavaScript độc hại:

    ```
    # import lib: npm install helmet

    import helmet from 'helmet';
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';

    async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Cấu hình Helmet để chống XSS
    app.use(
    helmet({
    contentSecurityPolicy: {
    directives: {
    defaultSrc: ["'self'"], // Chỉ cho hép tài nguyên từ domain chính của trang
    scriptSrc: ["'self'", "https://trusted.cdn.com"],  // Ngăn chặn script lạ
    styleSrc: ["'self'", "https://trusted.styles.com"],
    },
    },
    xXssProtection: true, // Bật bảo vệ X-XSS-Protection cho trình duyệt cũ để ngăn chặn trình duyệt tải và thực thi các script đáng ngờ
    referrerPolicy: { policy: 'no-referrer' }, // Ngăn lộ thông tin referrer giảm nguy cơ leak dữ liệu
    noSniff: true, // Ngăn MIME sniffing. Điều này giúp tránh trường hợp trình duyệt tải JavaScript bị nhúng từ một nguồn không mong muốn.
    })
    );

    await app.listen(3000);
    console.log('Server is running on http://localhost:3000');
    }

    bootstrap();
    ```

  - Escape output chuyển đổi các ký tự đặc biệt thành dạng an toàn trước khi hiển thị. Ví dụ:

    ```
    <script>alert('Hacked!')</script>
    # Nếu ứng dụng hiển thị trực tiếp nội dung này trên trang web, trình duyệt sẽ thực thi đoạn JavaScript này, gây ra XSS.
    # Thay vào đó, nếu ta escape output, trình duyệt sẽ chỉ hiển thị văn bản chứ không thực thi:
    &lt;script&gt;alert('Hacked!')&lt;/script&gt;
    ```

  - Validate input.

- Phòng chống tấn công Cross-Site Request Forgery (CSRF) Kẻ tấn công lừa người dùng thực hiện hành động không mong muốn bằng cách gửi yêu cầu từ một trang giả mạo.

  - Dùng CSRF Token:

    ```
    # Import lib: npm install csurf cookie-parser
    import { NestFactory } from '@nestjs/core';

    import { AppModule } from './app.module';
    import _ as cookieParser from 'cookie-parser';
    import _ as csurf from 'csurf';

    async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Sử dụng cookie-parser để xử lý cookies
    app.use(cookieParser());

    // Cấu hình CSRF protection middleware
    app.use(csurf({ cookie: true }));

    await app.listen(3000);
    }
    bootstrap();

    @Controller('csrf')

    export class CsrfController {
    // Route để gửi CSRF token tới client
    @Get('token')
    getCsrfToken(@Req() req: Request, @Res() res: Response) {
    res.json({ csrfToken: req.csrfToken() });
    }
    # Khi bạn gửi yêu cầu từ phía client (ví dụ như với fetch hoặc axios), bạn cần gửi CSRF token trong header của yêu cầu:
    // Lấy CSRF token từ route '/csrf/token'
    fetch('/csrf/token')
      .then(response => response.json())
      .then(data => {
        const csrfToken = data.csrfToken;

        // Gửi yêu cầu POST với CSRF token trong header
        fetch('/csrf/action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrfToken, // Gửi CSRF token trong header
          },
          body: JSON.stringify({ data: 'some data' }),
        })
          .then(response => response.json())
          .then(result => {
            console.log('Action Result:', result);
          })
          .catch(error => console.error('Error:', error));
      });

    ```

  - Bật CORS.

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
  - Dùng jwt với các thuật toán mạnh(RS256, HS256) và thời gian sống phù hợp với accect token và refreshtoken.
  - Load balencer.

- RESTful API là gì: là phong cách kiến trúc trong lập trình web dựa trên REST (Representational State Transfer) nó dùng HTTP để giao tiếp giữa
  clien và server một cách đơn giản có tổ chức và dễ mở rộng.

- Nêu các HTTP method trong RESTful API: GET, POST, PATCH, PUT, DELETE.

- Phân biệt query và param trong URL:

  - Query là các tham số không bắt buộc được truyền trong URL sau dấu "?" dùng khi cần lọc, tìm kiếm, phân trang. Ví dụ: ?key1=value1&key2=value2.
    Và không ảnh hưởng đến cấu trúc router.
  - Param là các tham số bắt buộc được truyền vào URL dùng để xác định tài nguyên cụ thể. Ví dụ: /resource/:12345678 trong đó 12345678 là user id. Và bắt buộc có trên URL
    nếu thiếu sẽ lỗi.

- Nếu trong Controller có @Get('/abc') và @Get(':id') thì nên đặt cái nào trước và vì sao: Nên đặt @Get('/abc') trước vì nếu bỏ @Get(':id') trước thì sẽ tự động gán id = abc
  nhưng abc lại không phải param.

- Tại sao NestJs lại dùng cơ chế dependency injection(DI): DI là mẫu thiết kế phần mềm phổ biến trong các framework hiện đại vì các lý do:

  - Tăng tính mở rộng và dễ bảo trì. Ví dụ: Nếu bạn thay đổi cách lưu trữ dữ liệu (từ MongoDB sang PostgreSQL), bạn chỉ cần thay đổi cách triển khai dịch vụ tương ứng mà không ảnh hưởng đến các phần khác trong ứng dụng.
  - Dễ dàng kiểm thử: Hỗ trợ kiểm thử đơn vị (Unit Testing): DI giúp dễ dàng "mock" hoặc thay thế các dịch vụ bên ngoài mà không cần thay đổi mã nguồn. Điều này rất quan trọng khi bạn cần kiểm tra các phần cụ thể trong ứng dụng mà không cần đến các phần phụ thuộc ngoài (như cơ sở dữ liệu, API từ bên ngoài, v.v.).
  - Giảm sự phụ thuộc trực tiếp (Loose Coupling): Thay vì mỗi lớp tự tạo các đối tượng mà nó cần, DI cung cấp các đối tượng đó từ bên ngoài. Điều này giúp dễ dàng thay đổi hoặc tái sử dụng các lớp mà không gây ảnh hưởng đến hệ thống. Ví dụ: Một service không cần phải biết chi tiết về cách thức hoạt động của một repository, nó chỉ cần một đối tượng repository được cung cấp bởi DI.
  - Tăng tính linh hoạt và dễ cấu hình: Bạn có thể cung cấp các giá trị, cấu hình và dịch vụ cần thiết một cách linh động mà không cần phải thay đổi code trong lớp đang sử dụng chúng. Điều này giúp cấu hình hệ thống linh động hơn, dễ dàng thay đổi khi cần thiết.
  - Được hỗ trợ mạnh mẽ trong NestJS: Giúp mã dễ đọc, dễ hiểu và không có sự rối loại giữa các thành phần. DI giúp tự động quản lý và tiêm (inject) các phụ thuộc vào các lớp cần thiết, đơn giản hóa việc phát triển và kiểm soát phụ thuộc trong ứng dụng.

- Mã hóa(Encryption): Mã hóa giúp bảo vệ dữ liệu bằng cách chuyển đổi nó thành một dạng không thể đọc được nếu không có khóa giải mã dùng crypto( trong Nodejs) và jsonwebtoken. Các thuật toán mã hóa như: RSA,HMAC-SHA256,RS256,ES256...

- Băm(Hashing): Hash là quá trình chuyển đổi dữ liệu thành một chuỗi cố định, không thể đảo ngược dùng lib(crypto, bcrypt, argon2). Các thuật toán: MD5, SHA-256, SHA-512...

- CORS là gì: CORS (Cross-Origin Resource Sharing) là cơ chế giúp trình duyệt kiểm soát việc một website có thể gửi request đến một domain khác hay không. Nếu không cấu hình đúng, API có thể bị chặn request từ frontend hoặc dễ bị tấn công bảo mật.

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

- Even loop trong nodejs: Event Loop là cơ chế giúp Node.js xử lý non-blocking I/O (I/O bất đồng bộ) bằng cách sử dụng một luồng chính (single-thread) mà không cần nhiều luồng (thread) kết hợp với các callback để xử lý nhiều tác vụ cùng lúc mà không bị chặn.6 giai đoạn của Event Loop: Timers → I/O Callbacks → Idle → Poll → Check → Close Callbacks. Khi Nodejs chạy thì nó sẽ chạy theo luồng sau:

  - 1️⃣ Chạy mã đồng bộ (Synchronous Code Execution).
  - 2️⃣ Xử lý các callback từ các tác vụ bất đồng bộ (Asynchronous Callbacks).
  - 3️⃣ Sử dụng Event Loop để kiểm tra hàng đợi (queue) và thực thi các tác vụ chờ xử lý.
    
- Non-blocking I/O là một mô hình xử lý I/O (Input/Output) trong đó các tác vụ I/O không làm gián đoạn (block) quá trình thực thi của chương trình. Thay vì đợi một tác vụ I/O (như đọc file, truy vấn cơ sở dữ liệu, hoặc gửi yêu cầu HTTP) hoàn thành trước khi tiếp tục thực hiện các tác vụ khác, mô hình non-blocking cho phép chương trình tiếp tục thực thi các tác vụ khác trong khi chờ kết quả của tác vụ I/O.

  - Cách thức hoạt động:
Khi một yêu cầu I/O được thực hiện, hệ thống sẽ không "chặn" hoặc dừng lại để đợi kết quả trả về. Thay vào đó, yêu cầu được gửi đi và chương trình tiếp tục thực thi các tác vụ khác.
Khi tác vụ I/O hoàn thành, một callback (hoặc promise) sẽ được gọi để xử lý kết quả trả về.
Ví dụ, trong Node.js, khi bạn thực hiện một thao tác đọc file, thay vì chương trình dừng lại và đợi file được đọc xong, Node.js sẽ tiếp tục thực thi các tác vụ khác. Khi file đã được đọc xong, callback mà bạn cung cấp sẽ được gọi để xử lý kết quả.

  - Lợi ích:
Tối ưu hóa hiệu suất: Non-blocking I/O giúp tận dụng tối đa tài nguyên hệ thống, vì hệ thống không phải chờ đợi một tác vụ I/O hoàn thành trước khi tiếp tục xử lý các tác vụ khác.
Khả năng xử lý đồng thời: Mặc dù Node.js là đơn luồng, mô hình non-blocking I/O cho phép xử lý hàng nghìn yêu cầu đồng thời mà không gặp phải các vấn đề về tắc nghẽn (blocking).

