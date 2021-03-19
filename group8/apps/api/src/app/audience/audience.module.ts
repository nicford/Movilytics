import { Module } from '@nestjs/common';
import { AudienceService } from './audience.service';
import { AudienceController } from './audience.controller';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  providers: [AudienceService],
  controllers: [AudienceController]
})
export class AudienceModule {}
