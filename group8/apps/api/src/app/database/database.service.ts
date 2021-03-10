import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DatabaseService {

    postgres_config = {
        user: this.configService.get<string>('POSTGRES_USER'),
        host: this.configService.get<string>('POSTGRES_HOST'),
        database: this.configService.get<string>('POSTGRES_DB'),
        password: this.configService.get<string>('POSTGRES_PASSWORD'),
        port: this.configService.get<number>('POSTGRES_PORT'),
    }

    pool: Pool = new Pool(this.postgres_config);

    constructor(private configService: ConfigService) {}

    async runQuery(query: string, parameters = []): Promise<QueryResult | string>{
        const result = await this.pool.query(query, parameters);
        console.log("running run query in database service");
        return result;
    }

    async runSimpleQuery(query: string): Promise<QueryResult | string>{
        const result = await this.pool.query(query);
        console.log("running simple run query in database service");
        console.log(result);
        return result;
    }


}
