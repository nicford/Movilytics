import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CSV_ROW, PREDICTED_RATINGS } from '@group8/api-interfaces'

@Injectable()
export class MovieReportService {

    constructor(private databaseService: DatabaseService,
                @Inject(CACHE_MANAGER) private cache: Cache,
                private httpService: HttpService) {}


    async createMovieReport(movie_id: number) {
        const sql_query = "SELECT * FROM get_overview($1)"
        const result = await this.databaseService.runQuery(sql_query, [movie_id]);
        return result;
    }


    async predictRatings(movie_id, csv_data: CSV_ROW[]) {
        const result: PREDICTED_RATINGS = new PREDICTED_RATINGS();
        console.log(movie_id);
        console.log(csv_data);
        // 1. and 2. get genre and company avg from DB, and add them to final result
        const genre_company_avg = await this.databaseService.runQuery('SELECT * FROM get_genre_company_avg($1)', [movie_id])
        const genre_avg: number = genre_company_avg['rows'][0]['genre_avg']
        const company_avg: number = genre_company_avg['rows'][0]['company_avg']
        result.genre_rating_avg = Number(genre_avg);
        result.company_rating_avg = Number(company_avg);
        console.log(genre_avg);
        console.log(company_avg);

        // extract ratings and tag data from provided csv data
        const ratings: number[] = [];
        let tags: string[] = [];
        console.log("printing elements")
        csv_data.forEach(element => {
            ratings.push(Number(element.rating));
            console.log(element.tags.split(/\s*,\s*/g))
            tags = tags.concat(element.tags.split(/\s*,\s*/g));
        });
        console.log(ratings);
        console.log(tags);

        // 3. get tag averages from DB
        const avg_per_tag = await (await this.databaseService.runQuery('SELECT * FROM get_tag_avg($1)', [tags])).rows;
        console.log(avg_per_tag);
        let tag_ratings_sum = 0;
        avg_per_tag.forEach((item) => {
            tag_ratings_sum += Number(item.tag_rating);
        })
        result.tag_rating_avg = tag_ratings_sum / avg_per_tag.length;

        // 4. calculate avg rating from of provided ratings
        const rating_avg = ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        result.provided_ratings_avg = Number(rating_avg);
        console.log(rating_avg)

        // 5. calculate overall avg rating
        const keys = Object.keys(result)
        result.overall_avg = 0
        keys.forEach((key) => {
            console.log(key)
            if (key != 'overall_avg') {
                result.overall_avg += result[key]
            }
        }, 0)
        result.overall_avg = result.overall_avg / (keys.length - 1)

        return result;
    }


}
