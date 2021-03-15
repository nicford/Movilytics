import { CacheInterceptor, CacheModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';


@Global()
@Module({
    imports: [CacheModule.register({
        store: redisStore,
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
        ttl: Number(process.env.CACHE_TIMEOUT) || 60,
        max: Number(process.env.CACHE_MAX) || null,
    })],
    providers: [{
        // make cache globally available
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
      }],
      exports: [CacheModule]
})
export class GlobalCacheModule {}
