import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';
import {QueryResult} from 'pg'


@Injectable()
export class AudienceService {

    constructor(private databaseService: DatabaseService) {}

    // movie_report_sql_query = readFileSync('apps/api/src/app/sql_scripts/fetch_overview.sql').toString();

    async getUserGenreMappingTable() {
        const query = 'SELECT * FROM user_genre_mapping';
        return await this.databaseService.runQuery(query, [])
    }


}
