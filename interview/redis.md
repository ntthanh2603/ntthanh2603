# Redis in NestJS with ioredis

## Table of Contents

- [Introduction](#introduction)
- [Setting up Redis with NestJS](#setting-up-redis-with-nestjs)
- [Redis Data Types and Operations](#redis-data-types-and-operations)
  - [Strings](#strings)
  - [Lists](#lists)
  - [Sets](#sets)
  - [Sorted Sets](#sorted-sets)
  - [Hashes](#hashes)
  - [Streams](#streams)
  - [Bitmaps](#bitmaps)
  - [HyperLogLog](#hyperloglog)
  - [Geospatial](#geospatial)
- [Advanced Concepts](#advanced-concepts)
  - [Transactions](#transactions)
  - [Pub/Sub](#pubsub)
  - [Lua Scripting](#lua-scripting)
- [Common Use Cases in NestJS](#common-use-cases-in-nestjs)

## Introduction

Redis (Remote Dictionary Server) is an in-memory data structure store that can be used as a database, cache, message broker, and streaming engine. This document covers the core Redis data types and how to interact with them using the ioredis library in a NestJS application.

## Setting up Redis with NestJS

### Installation

```bash
npm install ioredis @nestjs/common
```

### Module Setup

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

### Service Example

```typescript
// redis.service.ts
import { Injectable, Inject } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

  // Methods will be implemented for each data type
}
```

## Redis Data Types and Operations

### Strings

Strings are the most basic data type in Redis and can store text, serialized objects, or binary data up to 512MB.

#### CRUD Operations

```typescript
// In RedisService
async setString(key: string, value: string, ttl?: number): Promise<'OK'> {
  if (ttl) {
    return this.redis.set(key, value, 'EX', ttl);
  }
  return this.redis.set(key, value);
}

async getString(key: string): Promise<string | null> {
  return this.redis.get(key);
}

async updateString(key: string, value: string, ttl?: number): Promise<'OK'> {
  return this.setString(key, value, ttl);
}

async deleteString(key: string): Promise<number> {
  return this.redis.del(key);
}

// Increment operations
async increment(key: string, by = 1): Promise<number> {
  return this.redis.incrby(key, by);
}

async decrement(key: string, by = 1): Promise<number> {
  return this.redis.decrby(key, by);
}
```

#### Applications in NestJS

- **Caching**: Cache API responses or computed results
- **Rate Limiting**: Track API call counts
- **Session Storage**: Store user session data
- **Configuration**: Store application settings
- **One-time Tokens**: Generate and validate OTP

```typescript
// Example: Rate limiting middleware
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const key = `ratelimit:${ip}`;

    const count = await this.redisService.increment(key);
    if (count === 1) {
      await this.redisService.redis.expire(key, 60); // 1 minute window
    }

    if (count > 100) {
      res.status(429).send("Too Many Requests");
      return;
    }

    next();
  }
}
```

### Lists

Redis Lists are linked lists of string values, allowing you to add elements to the head or tail of the list.

#### CRUD Operations

```typescript
// In RedisService
async addToHead(key: string, value: string | string[]): Promise<number> {
  if (Array.isArray(value)) {
    return this.redis.lpush(key, ...value);
  }
  return this.redis.lpush(key, value);
}

async addToTail(key: string, value: string | string[]): Promise<number> {
  if (Array.isArray(value)) {
    return this.redis.rpush(key, ...value);
  }
  return this.redis.rpush(key, value);
}

async getListRange(key: string, start = 0, stop = -1): Promise<string[]> {
  return this.redis.lrange(key, start, stop);
}

async getListLength(key: string): Promise<number> {
  return this.redis.llen(key);
}

async popFromHead(key: string): Promise<string | null> {
  return this.redis.lpop(key);
}

async popFromTail(key: string): Promise<string | null> {
  return this.redis.rpop(key);
}

async removeFromList(key: string, count: number, value: string): Promise<number> {
  return this.redis.lrem(key, count, value);
}

async trimList(key: string, start: number, stop: number): Promise<'OK'> {
  return this.redis.ltrim(key, start, stop);
}
```

#### Applications in NestJS

- **Task Queues**: Implement simple job processing queues
- **Recent Activity**: Track user activity or latest content
- **Timelines**: Implement social media timelines
- **Leaderboards**: Store last N high scores

```typescript
// Example: Simple task queue
@Injectable()
export class TaskQueueService {
  private readonly queueKey = "tasks:queue";

  constructor(private readonly redisService: RedisService) {}

  async addTask(task: any): Promise<number> {
    return this.redisService.addToTail(this.queueKey, JSON.stringify(task));
  }

  async processNextTask(): Promise<any | null> {
    const taskData = await this.redisService.popFromHead(this.queueKey);
    if (!taskData) return null;

    return JSON.parse(taskData);
  }

  async getQueueSize(): Promise<number> {
    return this.redisService.getListLength(this.queueKey);
  }
}
```

### Sets

Redis Sets are unordered collections of unique strings, allowing for set operations like union, intersection, and difference.

#### CRUD Operations

```typescript
// In RedisService
async addToSet(key: string, member: string | string[]): Promise<number> {
  if (Array.isArray(member)) {
    return this.redis.sadd(key, ...member);
  }
  return this.redis.sadd(key, member);
}

async getSetMembers(key: string): Promise<string[]> {
  return this.redis.smembers(key);
}

async isSetMember(key: string, member: string): Promise<number> {
  return this.redis.sismember(key, member);
}

async removeFromSet(key: string, member: string | string[]): Promise<number> {
  if (Array.isArray(member)) {
    return this.redis.srem(key, ...member);
  }
  return this.redis.srem(key, member);
}

async getSetSize(key: string): Promise<number> {
  return this.redis.scard(key);
}

async getRandomMember(key: string, count?: number): Promise<string | string[]> {
  if (count) {
    return this.redis.srandmember(key, count);
  }
  return this.redis.srandmember(key);
}

// Set operations
async setIntersection(...keys: string[]): Promise<string[]> {
  return this.redis.sinter(...keys);
}

async setUnion(...keys: string[]): Promise<string[]> {
  return this.redis.sunion(...keys);
}

async setDifference(key: string, ...otherKeys: string[]): Promise<string[]> {
  return this.redis.sdiff(key, ...otherKeys);
}
```

#### Applications in NestJS

- **User Tags/Interests**: Store user preferences or tags
- **Unique Visitors**: Track unique page views
- **Access Control**: Store user permissions or roles
- **Relationship Management**: Track followers/following
- **Content Filtering**: Filter duplicate content

```typescript
// Example: User tagging system
@Injectable()
export class UserTagService {
  constructor(private readonly redisService: RedisService) {}

  getUserTagKey(userId: string): string {
    return `user:${userId}:tags`;
  }

  async addUserTags(userId: string, tags: string[]): Promise<number> {
    return this.redisService.addToSet(this.getUserTagKey(userId), tags);
  }

  async getUserTags(userId: string): Promise<string[]> {
    return this.redisService.getSetMembers(this.getUserTagKey(userId));
  }

  async removeUserTags(userId: string, tags: string[]): Promise<number> {
    return this.redisService.removeFromSet(this.getUserTagKey(userId), tags);
  }

  async findUsersWithSimilarTags(
    userId: string,
    otherUserId: string
  ): Promise<string[]> {
    return this.redisService.setIntersection(
      this.getUserTagKey(userId),
      this.getUserTagKey(otherUserId)
    );
  }
}
```

### Sorted Sets

Redis Sorted Sets are similar to Sets but each member has an associated score for sorting. Elements are ordered from lowest to highest score.

#### CRUD Operations

```typescript
// In RedisService
async addToSortedSet(key: string, member: string, score: number): Promise<number> {
  return this.redis.zadd(key, score, member);
}

async addMultipleToSortedSet(key: string, members: Array<[number, string]>): Promise<number> {
  const args: (string | number)[] = [];
  members.forEach(([score, member]) => {
    args.push(score, member);
  });
  return this.redis.zadd(key, ...args);
}

async getSortedSetRange(key: string, start = 0, stop = -1, withScores = false): Promise<string[] | Array<{member: string, score: string}>> {
  if (withScores) {
    const result = await this.redis.zrange(key, start, stop, 'WITHSCORES');
    const parsed: Array<{member: string, score: string}> = [];

    for (let i = 0; i < result.length; i += 2) {
      parsed.push({
        member: result[i],
        score: result[i + 1]
      });
    }

    return parsed;
  }

  return this.redis.zrange(key, start, stop);
}

async getSortedSetRangeByScore(key: string, min: number | string, max: number | string, withScores = false): Promise<string[] | Array<{member: string, score: string}>> {
  if (withScores) {
    const result = await this.redis.zrangebyscore(key, min, max, 'WITHSCORES');
    const parsed: Array<{member: string, score: string}> = [];

    for (let i = 0; i < result.length; i += 2) {
      parsed.push({
        member: result[i],
        score: result[i + 1]
      });
    }

    return parsed;
  }

  return this.redis.zrangebyscore(key, min, max);
}

async removeFromSortedSet(key: string, member: string | string[]): Promise<number> {
  if (Array.isArray(member)) {
    return this.redis.zrem(key, ...member);
  }
  return this.redis.zrem(key, member);
}

async incrementScore(key: string, member: string, by = 1): Promise<string> {
  return this.redis.zincrby(key, by, member);
}

async getSortedSetSize(key: string): Promise<number> {
  return this.redis.zcard(key);
}

async getRank(key: string, member: string): Promise<number | null> {
  return this.redis.zrank(key, member);
}

async getScore(key: string, member: string): Promise<string | null> {
  return this.redis.zscore(key, member);
}
```

#### Applications in NestJS

- **Leaderboards**: Track user rankings based on scores
- **Priority Queues**: Implement task priorities
- **Rate Limiting**: Time-based rate limiting
- **Time Series Data**: Store time-sorted events
- **Rankings**: Implement ranking systems

```typescript
// Example: Leaderboard service
@Injectable()
export class LeaderboardService {
  private readonly leaderboardKey = "game:leaderboard";

  constructor(private readonly redisService: RedisService) {}

  async addScore(userId: string, score: number): Promise<number> {
    return this.redisService.addToSortedSet(this.leaderboardKey, userId, score);
  }

  async incrementScore(userId: string, by = 1): Promise<string> {
    return this.redisService.incrementScore(this.leaderboardKey, userId, by);
  }

  async getTopScores(
    count = 10
  ): Promise<Array<{ userId: string; score: string }>> {
    const result = (await this.redisService.getSortedSetRange(
      this.leaderboardKey,
      0,
      count - 1,
      true
    )) as Array<{ member: string; score: string }>;

    return result.map((item) => ({
      userId: item.member,
      score: item.score,
    }));
  }

  async getUserRank(userId: string): Promise<number | null> {
    return this.redisService.getRank(this.leaderboardKey, userId);
  }
}
```

### Hashes

Redis Hashes store field-value pairs, making them perfect for representing objects.

#### CRUD Operations

```typescript
// In RedisService
async setHashField(key: string, field: string, value: string): Promise<number> {
  return this.redis.hset(key, field, value);
}

async setMultipleHashFields(key: string, fieldValues: Record<string, string>): Promise<number> {
  return this.redis.hset(key, fieldValues);
}

async getHashField(key: string, field: string): Promise<string | null> {
  return this.redis.hget(key, field);
}

async getAllHashFields(key: string): Promise<Record<string, string>> {
  return this.redis.hgetall(key);
}

async getMultiple
```
