import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { readFileSync } from 'fs';

@Injectable()
export class MovieReportService {

    constructor(private databaseService: DatabaseService) {}

    movie_report_sql_query = readFileSync('apps/api/src/app/sql_scripts/fetch_overview.sql').toString();
    

    createMovieReport(movie_id: number) {
        console.log(this.movie_report_sql_query);
        return this.databaseService.runQuery(this.movie_report_sql_query, [movie_id]);
      }

}
