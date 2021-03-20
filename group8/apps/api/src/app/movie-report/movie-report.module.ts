import { HttpModule, Module } from '@nestjs/common';
import { MovieReportController } from './movie-report.controller';
import { MovieReportService } from './movie-report.service';
import { DatabaseModule } from '../database/database.module';
import { AudienceService } from '../audience/audience.service';

@Module({
  imports: [DatabaseModule, HttpModule.register({
    timeout: 5000,
  })],
  controllers: [MovieReportController],
  providers: [MovieReportService, AudienceService]
})
export class MovieReportModule {}
