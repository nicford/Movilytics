import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';
import {QueryResult} from 'pg'
const cf = require('collaborative-filter')

@Injectable()
export class AudienceService {

    constructor(private databaseService: DatabaseService) {}

    // movie_report_sql_query = readFileSync('apps/api/src/app/sql_scripts/fetch_overview.sql').toString();

    async getUserGenreMappingTable() {
        const query = 'SELECT * FROM user_genre_mapping';

        const ratings = [
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 0],
           ];
        
        const result = cf.cFilter(ratings, 2); // 2 is user index
        console.log(result) // [ 2, 1 ] --> item (Genre in our case) 2 is the most appropriate recommendation followed by item 1
        
        return await this.databaseService.runQuery(query, [])
    }


}
