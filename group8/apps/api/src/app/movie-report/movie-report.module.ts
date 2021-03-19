import { HttpModule, Module } from '@nestjs/common';
import { MovieReportController } from './movie-report.controller';
import { MovieReportService } from './movie-report.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule.register({
    timeout: 5000,
  })],
  controllers: [MovieReportController],
  providers: [MovieReportService]
})
export class MovieReportModule {}
