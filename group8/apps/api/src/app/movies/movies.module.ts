import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { DatabaseModule } from '../database/database.module'
import { MoviesController } from './movies.controller';

@Module({
  providers: [MoviesService],
  imports: [DatabaseModule],
  controllers: [MoviesController],

})
export class MoviesModule {}
