import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: "./env/database.env"
  })],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {
}
