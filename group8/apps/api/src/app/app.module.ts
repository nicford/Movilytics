import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';
import { GlobalCacheModule } from './global-cache/global-cache.module';


@Module({
  imports: [DatabaseModule, MoviesModule, GlobalCacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
