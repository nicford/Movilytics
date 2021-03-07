import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [DatabaseModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
