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
        
        const mapping_response = await this.databaseService.runQuery(user_genre_query, [])
        const genre_rating_response = await this.databaseService.runQuery(genre_info_query, [])
        
        // Get Genre Average //
        const genre_avg_rating_dict = {}

        genre_rating_response.rows.forEach((item) => {
            console.log(item);
        })
        

        // Run CF //
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
        })

        const cf_result = cf.cFilter(user_item_matrix, 1); // 1 is user index
        // console.log(result) // [ 2, 1 ] --> item (Genre in our case) 2 is the most appropriate recommendation followed by item 1

        return genre_rating_response
    }

    async getGenrePopulationAndPercentileDiff(movie_id: number) {
        const genre_population_query = `SELECT * FROM get_genre_population_avg_diff(${movie_id})`;

        const genre_population_response = await this.databaseService.runQuery(genre_population_query, []);

        const rows = genre_population_response.rows[0];
        var processed_population_map = {};
        var local_avg = 0;
        var total_population = 0;

        Object.entries(rows).forEach(([key, value]) => {
            const val = Number(value);

            if(key == 'local_avg') {
                local_avg = val;
            } 
            
            else if (key.endsWith("_count")){
                total_population = total_population + val;
            } 
            
            else if (key.endsWith("_avg")){
                var tmp = ((local_avg - val) / val) * 100; 
                var percentage_difference = tmp.toFixed(2);
                if(isNaN(percentage_difference)) {
                    percentage_difference = "0";
                }
                processed_population_map[key] = percentage_difference;
            }
        })

        Object.entries(rows).forEach(([key, value]) => {
            if(key.endsWith("_count")){
                const val = Number(value);
                var tmp = (val / total_population) * 100;
                var population_percentage = tmp.toFixed(2);
                if(isNaN(population_percentage)) {
                    population_percentage = "0";
                }
                processed_population_map[key] = population_percentage;
            }
        })

        genre_population_response.rows[0] = processed_population_map
        return genre_population_response;
    }


}
