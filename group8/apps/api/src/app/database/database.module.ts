import { Module } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

import { ConfigModule } from '@nestjs/config';

const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new Pool({
        user: '',
        host: '',
        database: '',
        password: '',
        port: 5432,
    }),
};

@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: ".env"
      })],
    providers: [dbProvider, DatabaseService],
    exports: [dbProvider, DatabaseService],
    
})
export class DatabaseModule {}

