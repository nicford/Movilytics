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

    postgres_config_prod = {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
    }

    

    pool: Pool;

    constructor(private configService: ConfigService) {
        if (process.env.PRODUCTION != undefined) {
            console.log("production database settings");
            this.pool = new Pool(this.postgres_config_prod);
        } else {
            this.pool = new Pool(this.postgres_config);
            console.log("development database settings");
        }
        
    }

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
