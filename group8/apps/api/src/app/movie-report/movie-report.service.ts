import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';

@Injectable()
export class MovieReportService {

    constructor(private databaseService: DatabaseService,
                @Inject(CACHE_MANAGER) private cache: Cache,
                private httpService: HttpService) {}

    movie_report_sql_query = readFileSync('apps/api/src/app/sql_scripts/fetch_overview.sql').toString();

    async createMovieReport(movie_id: number) {
        console.log(this.movie_report_sql_query);
        const result = await this.databaseService.runQuery(this.movie_report_sql_query, [movie_id]);
        return result;
    }


}
