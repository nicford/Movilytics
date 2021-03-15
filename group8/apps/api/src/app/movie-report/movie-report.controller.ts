import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieReportService } from './movie-report.service';

@Controller('movie-report')
export class MovieReportController {

    constructor(private movieReportService: MovieReportService) {}

    // movie-report/id
    // @Get(":id")
    // getReport(@Param('id') movie_id: number) {
    //     return movie_id;
    // }

     // localhost:3333/api/movie-report/862
     @Get(':id')
     async getMovieReport(@Param('id') movie_id: number) {
         const result = await this.movieReportService.createMovieReport(movie_id);
         return result.rows;
     }
 
   
}
