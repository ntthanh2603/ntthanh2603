# Redis trong NestJS

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cài đặt Redis với NestJS](#cài-đặt-redis-với-nestjs)
- [Kiểu dữ liệu Redis và các thao tác](#kiểu-dữ-liệu-redis-và-các-thao-tác)
  - [Strings (Chuỗi)](#strings-chuỗi)
  - [Lists (Danh sách)](#lists-danh-sách)
  - [Sets (Tập hợp)](#sets-tập-hợp)
  - [Sorted Sets (Tập hợp có thứ tự)](#sorted-sets-tập-hợp-có-thứ-tự)
  - [Hashes (Bảng băm)](#hashes-bảng-băm)
  - [Streams (Luồng dữ liệu)](#streams-luồng-dữ-liệu)
  - [Bitmaps (Bản đồ bit)](#bitmaps-bản-đồ-bit)
  - [HyperLogLog](#hyperloglog)
  - [Geospatial (Dữ liệu không gian địa lý)](#geospatial-dữ-liệu-không-gian-địa-lý)
- [Khái niệm nâng cao](#khái-niệm-nâng-cao)
  - [Transactions (Giao dịch)](#transactions-giao-dịch)
  - [Pub/Sub (Xuất bản/Đăng ký)](#pubsub-xuất-bảnđăng-ký)
  - [Lua Scripting (Lập trình Lua)](#lua-scripting-lập-trình-lua)
- [Các trường hợp sử dụng phổ biến trong NestJS](#các-trường-hợp-sử-dụng-phổ-biến-trong-nestjs)

## Giới thiệu

Redis (Remote Dictionary Server) là một kho lưu trữ cấu trúc dữ liệu trong bộ nhớ có thể được sử dụng làm cơ sở dữ liệu, bộ nhớ đệm, bộ trung gian tin nhắn và công cụ phát trực tuyến. Tài liệu này đề cập đến các kiểu dữ liệu cốt lõi của Redis và cách tương tác với chúng bằng thư viện ioredis trong ứng dụng NestJS.

## Cài đặt Redis với NestJS

### Cài đặt thư viện

```bash
npm install ioredis @nestjs/common
```

### Thiết lập Module

```typescript
// redis.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Redis from "ioredis";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get("REDIS_HOST", "localhost"),
          port: configService.get("REDIS_PORT", 6379),
          password: configService.get("REDIS_PASSWORD", ""),
          db: configService.get("REDIS_DB", 0),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ["REDIS_CLIENT"],
})
export class RedisModule {}
```

### Ví dụ về Service

```typescript
// redis.service.ts
import { Injectable, Inject } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

  // Các phương thức sẽ được triển khai cho từng kiểu dữ liệu
}
```

## Kiểu dữ liệu Redis và các thao tác

### Strings (Chuỗi)

Chuỗi là kiểu dữ liệu cơ bản nhất trong Redis và có thể lưu trữ văn bản, đối tượng tuần tự hóa hoặc dữ liệu nhị phân lên đến 512MB.

#### Các thao tác CRUD

```typescript
// Trong RedisService

/**
 * Lưu trữ một chuỗi vào Redis với khóa đã cho
 * @param key Khóa để lưu trữ giá trị
 * @param value Giá trị cần lưu trữ
 * @param ttl Thời gian sống của khóa (giây) - tùy chọn
 * @returns Promise trả về 'OK' nếu thành công
 */
async setString(key: string, value: string, ttl?: number): Promise<'OK'> {
  if (ttl) {
    return this.redis.set(key, value, 'EX', ttl);
  }
  return this.redis.set(key, value);
}

/**
 * Lấy giá trị chuỗi từ Redis theo khóa
 * @param key Khóa cần truy vấn
 * @returns Promise trả về giá trị chuỗi hoặc null nếu không tìm thấy
 */
async getString(key: string): Promise<string | null> {
  return this.redis.get(key);
}

/**
 * Cập nhật giá trị chuỗi trong Redis
 * @param key Khóa cần cập nhật
 * @param value Giá trị mới
 * @param ttl Thời gian sống mới (giây) - tùy chọn
 * @returns Promise trả về 'OK' nếu thành công
 */
async updateString(key: string, value: string, ttl?: number): Promise<'OK'> {
  return this.setString(key, value, ttl);
}

/**
 * Xóa khóa và giá trị tương ứng khỏi Redis
 * @param key Khóa cần xóa
 * @returns Promise trả về số lượng khóa đã xóa thành công
 */
async deleteString(key: string): Promise<number> {
  return this.redis.del(key);
}

/**
 * Tăng giá trị số nguyên của khóa
 * @param key Khóa cần tăng giá trị
 * @param by Số lượng tăng (mặc định là 1)
 * @returns Promise trả về giá trị sau khi tăng
 */
async increment(key: string, by = 1): Promise<number> {
  return this.redis.incrby(key, by);
}

/**
 * Giảm giá trị số nguyên của khóa
 * @param key Khóa cần giảm giá trị
 * @param by Số lượng giảm (mặc định là 1)
 * @returns Promise trả về giá trị sau khi giảm
 */
async decrement(key: string, by = 1): Promise<number> {
  return this.redis.decrby(key, by);
}
```

#### Ứng dụng trong NestJS

- **Bộ nhớ đệm (Caching)**: Lưu trữ phản hồi API hoặc kết quả tính toán
- **Giới hạn tốc độ (Rate Limiting)**: Giới hạn số lượng request
- **Lưu trữ phiên (Session Storage)**: Lưu trữ dữ liệu phiên đăng nhập người dùng
- **Cấu hình (Configuration)**: Lưu trữ cài đặt ứng dụng
- **Mã thông báo một lần (One-time Tokens)**: Lưu trữ và xác thực OTP

```typescript
// Ví dụ: Middleware giới hạn tốc độ
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const key = `ratelimit:${ip}`;

    const count = await this.redisService.increment(key);
    if (count === 1) {
      await this.redisService.redis.expire(key, 60); // Cửa sổ 1 phút
    }

    if (count > 100) {
      res.status(429).send("Quá nhiều yêu cầu");
      return;
    }

    next();
  }
}
```

### Lists (Danh sách)

Danh sách trong Redis là danh sách liên kết của các giá trị chuỗi, cho phép bạn thêm phần tử vào đầu hoặc cuối danh sách.

#### Các thao tác CRUD

```typescript
// Trong RedisService

/**
 * Thêm một hoặc nhiều giá trị vào đầu danh sách
 * @param key Khóa của danh sách
 * @param value Giá trị hoặc mảng giá trị cần thêm
 * @returns Promise trả về độ dài mới của danh sách
 */
async addToHead(key: string, value: string | string[]): Promise<number> {
  if (Array.isArray(value)) {
    return this.redis.lpush(key, ...value);
  }
  return this.redis.lpush(key, value);
}

/**
 * Thêm một hoặc nhiều giá trị vào cuối danh sách
 * @param key Khóa của danh sách
 * @param value Giá trị hoặc mảng giá trị cần thêm
 * @returns Promise trả về độ dài mới của danh sách
 */
async addToTail(key: string, value: string | string[]): Promise<number> {
  if (Array.isArray(value)) {
    return this.redis.rpush(key, ...value);
  }
  return this.redis.rpush(key, value);
}

/**
 * Lấy một phạm vi phần tử từ danh sách
 * @param key Khóa của danh sách
 * @param start Vị trí bắt đầu (mặc định là 0)
 * @param stop Vị trí kết thúc (mặc định là -1, tức là đến cuối danh sách)
 * @returns Promise trả về mảng các phần tử trong phạm vi
 */
async getListRange(key: string, start = 0, stop = -1): Promise<string[]> {
  return this.redis.lrange(key, start, stop);
}

/**
 * Lấy độ dài của danh sách
 * @param key Khóa của danh sách
 * @returns Promise trả về số lượng phần tử trong danh sách
 */
async getListLength(key: string): Promise<number> {
  return this.redis.llen(key);
}

/**
 * Lấy và xóa phần tử đầu tiên của danh sách
 * @param key Khóa của danh sách
 * @returns Promise trả về phần tử đã xóa hoặc null nếu danh sách trống
 */
async popFromHead(key: string): Promise<string | null> {
  return this.redis.lpop(key);
}

/**
 * Lấy và xóa phần tử cuối cùng của danh sách
 * @param key Khóa của danh sách
 * @returns Promise trả về phần tử đã xóa hoặc null nếu danh sách trống
 */
async popFromTail(key: string): Promise<string | null> {
  return this.redis.rpop(key);
}

/**
 * Xóa các phần tử khỏi danh sách dựa trên giá trị
 * @param key Khóa của danh sách
 * @param count Số lượng cần xóa (0: tất cả, >0: từ đầu, <0: từ cuối)
 * @param value Giá trị cần xóa
 * @returns Promise trả về số lượng phần tử đã xóa
 */
async removeFromList(key: string, count: number, value: string): Promise<number> {
  return this.redis.lrem(key, count, value);
}

/**
 * Cắt bớt danh sách để chỉ giữ lại phạm vi đã chỉ định
 * @param key Khóa của danh sách
 * @param start Vị trí bắt đầu
 * @param stop Vị trí kết thúc
 * @returns Promise trả về 'OK' nếu thành công
 */
async trimList(key: string, start: number, stop: number): Promise<'OK'> {
  return this.redis.ltrim(key, start, stop);
}
```

#### Ứng dụng trong NestJS

- **Hàng đợi công việc (Task Queues)**: Triển khai hàng đợi xử lý công việc đơn giản
- **Hoạt động gần đây (Recent Activity)**: Theo dõi hoạt động người dùng hoặc nội dung mới nhất
- **Dòng thời gian (Timelines)**: Triển khai dòng thời gian mạng xã hội
- **Bảng xếp hạng (Leaderboards)**: Lưu trữ N điểm cao nhất gần đây

```typescript
// Ví dụ: Service hàng đợi công việc đơn giản
@Injectable()
export class TaskQueueService {
  private readonly queueKey = "tasks:queue";

  constructor(private readonly redisService: RedisService) {}

  /**
   * Thêm công việc mới vào hàng đợi
   * @param task Công việc cần thêm
   * @returns Promise trả về độ dài mới của hàng đợi
   */
  async addTask(task: any): Promise<number> {
    return this.redisService.addToTail(this.queueKey, JSON.stringify(task));
  }

  /**
   * Xử lý công việc tiếp theo trong hàng đợi
   * @returns Promise trả về công việc đã lấy hoặc null nếu hàng đợi trống
   */
  async processNextTask(): Promise<any |
