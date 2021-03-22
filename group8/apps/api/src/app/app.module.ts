import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';
import { GlobalCacheModule } from './global-cache/global-cache.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MovieReportModule } from './movie-report/movie-report.module';
import { AudienceModule } from './audience/audience.module';
import * as cs from 'class-validator';

let staticFilesPath = process.env.STATIC_FILES_PATH;  // for production in kubernetes
if (staticFilesPath == undefined) {
  staticFilesPath = join(__dirname, '../../../dist/apps/ucl-imdb'); // for local development
}

@Module({
  imports: [DatabaseModule, MoviesModule, GlobalCacheModule, ServeStaticModule.forRoot({
    rootPath: staticFilesPath
  }), MovieReportModule, AudienceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
