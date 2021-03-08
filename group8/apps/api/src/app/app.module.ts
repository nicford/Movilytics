import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';
import { GlobalCacheModule } from './global-cache/global-cache.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [DatabaseModule, MoviesModule, GlobalCacheModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../dist/apps/ucl-imdb')
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
