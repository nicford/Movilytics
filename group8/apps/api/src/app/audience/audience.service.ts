import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';
import {QueryResult} from 'pg'
const cf = require('collaborative-filter');
const fs = require('fs');

@Injectable()
export class AudienceService {

    constructor(private databaseService: DatabaseService) {}

    async getSegmentationByGenre() {
        const db_updated = false;
        if (db_updated) {
            // select statement is written like below to ensure the order of columns (don't change)
            const user_genre_query = 'select family, history, fantasy, comedy, documentary, tv_movie, science_fiction, war \
                                            music, horror, action, animation, crime, western, thriller, mystery, adventure, romance, drama \
                                    from user_genre_mapping';
            const genre_info_query = 'SELECT genre_name, genre_avg_rating FROM genre_info';        
            
            const mapping_response = await this.databaseService.runQuery(user_genre_query, []);
            const genre_rating_response = await this.databaseService.runQuery(genre_info_query, []);
        
            ///////////////////////
            // <Get Genre Average>
            // Average was precalucated in sql script
            // Sample output of the dictionary:
            // {
            //     family: '2.6565184',
            //     history: '3.516584', ... so on
            // }
            ///////////////////////
            const genre_avg_rating_dict = {};
            
            // store genre average to dict + ensuring no spaces and lowercase
            genre_rating_response.rows.forEach((item) => {
                let key = '';
                if (item['genre_name'] == 'TV Movie'){
                    key = 'tv_movie';
                }
                else if (item['genre_name'] == 'Science Fiction'){
                    key = 'science_fiction';
                }
                else{
                    key = item['genre_name'].toLowerCase();
                }

                genre_avg_rating_dict[key] = item['genre_avg_rating'];
            })

            /////////////////////////////////////////////////////////
            // <Create User_Item Matrix for Collaborative Filtering>
            // Shape of the Matrix: (number of users, number of genres) = (row, col)
            // Example of the matrix:
            //    [
            //      1, 0, 1, 1, 1, 0, 1,
            //      1, 1, 1, 1, 1, 0, 1,
            //      1, 1, 1, 1
            //    ],
            //    [
            //      1, 1, 1, 1, 0, 0, 1,
            //      1, 1, 1, 1, 1, 0, 1,
            //      1, 1, 1, 1
            //    ], ..... so on
            /////////////////////////////////////////////////////////
            const user_item_matrix = [];

            mapping_response.rows.forEach((item) => {
                const row = [];

                Object.keys(item).forEach((key) => {
                    var value = item[key];
                    // console.log(key) // e.g. romance                
                    // console.log(value) // e.g. 3.5548...
                    if (value == null){
                        row.push(0);
                    }
                    else if (value >= genre_avg_rating_dict[key]){
                        row.push(1);
                    }
                    else{
                        row.push(0);
                    }
                })
                user_item_matrix.push(row);
            })
            // console.log(user_item_matrix)

            /////////////////////////////////////////////////////////
            // <Run CF for all users and segment users by Recommended Genre>
            /////////////////////////////////////////////////////////
            // TODO: can be initialised with for loop, but computatinaly better this way?
            // Order of this segmentation dict is important
            const segmentation = {
                'family': [],
                'history': [], 
                'fantasy': [], 
                'comedy': [], 
                'documentary': [], 
                'tv_movie': [], 
                'science_fiction': [], 
                'war' : [],
                'music': [], 
                'horror': [], 
                'action': [], 
                'animation': [], 
                'crime': [], 
                'western': [], 
                'thriller': [], 
                'mystery': [], 
                'adventure': [], 
                'romance': [], 
                'drama': []
            };

            const users_count = mapping_response.rowCount;
            for (let user = 0; user < users_count; user++){
                const cf_result = cf.cFilter(user_item_matrix, user); // 2nd param is a user index (starting from 0)
                const best_genre = cf_result[0] // e.g. cf_result: [ 2, 1 ] --> item (Genre in our case) 2 is the most appropriate recommendation followed by item 1
                if (typeof(best_genre) !== 'undefined'){
                    if (best_genre >= 0){
                        // console.log(best_genre)
                        segmentation[Object.keys(segmentation)[best_genre]].push(user)
                    }
                }
            }
            // console.log(segmentation)

            // Dump the file to json file
            const segmentation_dictionarised = JSON.stringify(segmentation);
            // console.log(segmentation_dictionarised);
            fs.writeFileSync('apps/api/src/app/audience_json_dump/segmentation.json', segmentation_dictionarised)

            return segmentation;
        }
        else { // DB is not updated
            // read json and return the JSON object in controller
            let seg_data = fs.readFileSync('apps/api/src/app/audience_json_dump/segmentation.json');
            let parsed = JSON.parse(seg_data);
            return parsed;
        }
        
    }


    async getGenrePopulationAndPercentileDiff(movie_id: number) {
        const genre_population_query = `SELECT * FROM get_genre_population_avg_diff(${movie_id})`;

        const genre_population_response = await this.databaseService.runQuery(genre_population_query, []);

        const rows = genre_population_response.rows[0];
        const processed_population_map = {};
        let local_avg = 0;
        let total_population = 0;

        Object.entries(rows).forEach(([key, value]) => {
            const val = Number(value);

            if(key == 'local_avg') {
                local_avg = val;
            } 
            
            else if (key.endsWith("_count")){
                total_population = total_population + val;
            } 
            
            else if (key.endsWith("_avg")){
                const tmp = ((local_avg - val) / val) * 100; 
                let percentage_difference = Number(tmp.toFixed(2));
                if(isNaN(percentage_difference)) {
                    percentage_difference = 0;
                }
                processed_population_map[key] = percentage_difference;
            }
        })

        Object.entries(rows).forEach(([key, value]) => {
            if(key.endsWith("_count")){
                const val = Number(value);
                const tmp = (val / total_population) * 100;
                let population_percentage = Number(tmp.toFixed(2));
                if(isNaN(population_percentage)) {
                    population_percentage = 0;
                }
                processed_population_map[key] = population_percentage;
            }
        })

        genre_population_response.rows[0] = processed_population_map
        return genre_population_response;
    }


    async getPersonality(tags){
        const query = `"SELECT * FROM get_personality(${tags})"`;
    }

}
