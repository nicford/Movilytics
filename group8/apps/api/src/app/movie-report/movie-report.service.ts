import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';

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


    async predictRatings(movie_id, csv_data) {
        console.log(movie_id);
        console.log(csv_data);
        const genre_company_avg = await this.databaseService.runQuery('SELECT * FROM get_genre_company_avg($1)', [movie_id])
        // const genre_avg = genre_company_avg[]
        // const genre_avg = genre_company_avg[]
        console.log(genre_company_avg)
        return genre_company_avg;
    }


}
