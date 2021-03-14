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
        const user_genre_query = 'SELECT * FROM user_genre_mapping';
        const genre_info_query = 'SELECT genre_name, genre_avg_rating FROM genre_info'

        
        // const result = cf.cFilter(ratings, 2); 
        // console.log(result) // [ 2, 1 ] --> item (Genre in our case) 2 is the most appropriate recommendation followed by item 1
        
        
        const mapping_response = await this.databaseService.runQuery(user_genre_query, [])
        const genre_rating_response = await this.databaseService.runQuery(genre_info_query, [])
        
        const user_item_matrix = [];

        mapping_response.rows.forEach((item) => {
            // console.log(item)
            const row = [];

            Object.keys(item).forEach((key) => {
                if(key != 'user_id'){
                    // console.log(item[key]);
                    var value = item[key];
                    if (value == null){
                        row.push(0);
                    }else{
                        // row.push(value);
                        row.push(1);
                    }
                }
                
            })
            user_item_matrix.push(row)
            // console.log("\n")
        })
        console.log(user_item_matrix)

        const cf_result = cf.cFilter(user_item_matrix, 1); // 1 is user index
        
        console.log(cf_result);


        return genre_rating_response
    }


}
