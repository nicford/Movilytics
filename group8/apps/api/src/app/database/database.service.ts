import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';





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

    pool: Pool = new Pool({
            user: this.configService.get<string>('POSTGRES_USER'),
            host: this.configService.get<string>('POSTGRES_HOST'),
            database: this.configService.get<string>('POSTGRES_DB'),
            password: this.configService.get<string>('POSTGRES_PASSWORD'),
            port: this.configService.get<number>('POSTGRES_PORT'),
        });

    constructor(private configService: ConfigService) {}

    async runQuery(query: string) {
        console.log(this.postgres_config);
        const result = await this.pool.query(query);
        return result;
    }
}
