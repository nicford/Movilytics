import { Module } from '@nestjs/common';
import { MovieReportController } from './movie-report.controller';
import { MovieReportService } from './movie-report.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MovieReportController],
  providers: [MovieReportService]
})
export class MovieReportModule {}
