import { CacheInterceptor, CacheModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
    imports: [CacheModule.register({
            ttl: 5,
            max: 100,
        })],
    providers: [{
        // make cache globally available
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
      }],
      exports: [CacheModule]
})
export class GlobalCacheModule {}
