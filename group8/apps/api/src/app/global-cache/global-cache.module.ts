import { CacheInterceptor, CacheModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
    imports: [CacheModule.register({
            store: redisStore,
            host: 'redis',
            port: 6379,
            ttl: null,
            max: null,
        })],
    providers: [{
        // make cache globally available
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
      }],
      exports: [CacheModule]
})
export class GlobalCacheModule {}
