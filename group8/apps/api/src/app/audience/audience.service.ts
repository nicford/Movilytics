import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';
import {QueryResult} from 'pg'
const cf = require('collaborative-filter');
const fs = require('fs');

@Injectable()
export class AudienceService {

    constructor(private databaseService: DatabaseService) {}
    
    /**
     * 
     * @param movie_id 
     * @returns segmented user_ids by genre
     */
    async getSegmentationByGenre(movie_id: number) {
        
        const genre_info_query = `select genre_name, genre_avg_rating from genre_info as gi, \
                                        (SELECT * FROM genres\
                                        where mid=${movie_id}) as temp\
                                    where temp.genre_id = gi.genre_id`;
        const genre_rating_response = await this.databaseService.runQuery(genre_info_query, []);
        const howmany_genre = genre_rating_response.rows.length;
        
        // if a movie has less than 2 genres, segment users considering all genres
        if (howmany_genre < 2) {
            console.log(`Movie has ${howmany_genre} genre`);
            let seg_data = fs.readFileSync('apps/api/src/app/audience_json_dump/segmentation.json');
            let parsed = JSON.parse(seg_data);
            return parsed;
        }
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

        // Get columns to select from user_genre_mapping
        const genres_array = Object.keys(genre_avg_rating_dict);
        const columns_for_query = genres_array.join(','); // animation,family
        console.log(columns_for_query);
        
        const user_genre_query = 'SELECT ' + columns_for_query + ' FROM user_genre_mapping'
        const mapping_response = await this.databaseService.runQuery(user_genre_query, []);
        
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
        console.log(user_item_matrix)

        /////////////////////////////////////////////////////////
        // <Run CF for all users and segment users by Recommended Genre>
        /////////////////////////////////////////////////////////
        // Order of this segmentation dict is important
        const segmentation = {}
        genres_array.forEach((item) => {
            segmentation[item] = []
        })
        console.log(segmentation) // { animation: [], family: [] }

        // const segmentation = {
        //     'family': [],
        //     'history': [], 
        //     'fantasy': [], 
        //     'comedy': [], 
        //     'documentary': [], 
        //     'tv_movie': [], 
        //     'science_fiction': [], 
        //     'war' : [],
        //     'music': [], 
        //     'horror': [], 
        //     'action': [], 
        //     'animation': [], 
        //     'crime': [], 
        //     'western': [], 
        //     'thriller': [], 
        //     'mystery': [], 
        //     'adventure': [], 
        //     'romance': [], 
        //     'drama': []
        // };

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

        const length_of_each_genre = []
        genres_array.forEach((genre)=>{
            length_of_each_genre.push(segmentation[genre].length)
        })

        // add metadata: number of genre a movie has
        segmentation['metadata'] = {
            'howmany_genre': howmany_genre,
            'genres_array': genres_array,
            'length_of_each_genre': length_of_each_genre
        }
        console.log(segmentation)

        return segmentation;
    }

    /**
     * 
     * @param movie_id 
     * @returns 
     */
    async getGenrePopulationAndPercentileDiff(movie_id: number) {
        const genre_population_query = `SELECT * FROM get_genre_population_avg_diff(${movie_id})`;

        const genre_population_response = await this.databaseService.runQuery(genre_population_query, []);

        const rows = genre_population_response.rows[0];
        const processed_population_map = {};
        const genre_avg = [];
        let counter = 0;
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

            else if (key.endsWith("tag_avg")){
                let tagAvg = Number((val / 5) * 100);
                if(isNaN(tagAvg)) {
                    tagAvg = 0;
                }
                
                let rating_avg = genre_avg[counter]
                if(tagAvg != 0) {
                    rating_avg = Number(((tagAvg + rating_avg) / 2).toFixed(2));
                }
                
                tagAvg = Number(tagAvg.toFixed(2));
                if(isNaN(rating_avg)){
                    rating_avg = 0;
                }

                counter += 1;
                const totalKey = key + '_total';

                processed_population_map[key] = tagAvg;
                processed_population_map[totalKey] = rating_avg;            
            }
            
            else if (key.endsWith("glob_avg")){
                const new_key = key + "_likeliness";
                let likeliness = Number((val / 5 ) * 100);
                genre_avg.push(likeliness);

                likeliness = Number(likeliness.toFixed(2));
                const tmp = ((local_avg - val) / val) * 100; 
                let percentage_difference = Number(tmp.toFixed(2));
                if(isNaN(percentage_difference)) {
                    percentage_difference = 0;
                }
                if(isNaN(likeliness)) {
                    likeliness = 0;
                }
                processed_population_map[key] = percentage_difference;
                processed_population_map[new_key] = likeliness;
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
