import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Tracing } from 'trace_events';


@Injectable()
export class DatabaseService {

    postgres_config = {
        user: this.configService.get<string>('POSTGRES_USER'),
        host: this.configService.get<string>('POSTGRES_HOST'),
        database: this.configService.get<string>('POSTGRES_DB'),
        password: this.configService.get<string>('POSTGRES_PASSWORD'),
        port: this.configService.get<number>('POSTGRES_PORT'),
        test: process.env.POSTGRES_PORT
    }


    constructor(private configService: ConfigService) {}

    runQuery(query: string): string {
        console.log(query);
        console.log(this.postgres_config);
        return "Success";
    }


}
