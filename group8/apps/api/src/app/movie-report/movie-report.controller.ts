import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieReportService } from './movie-report.service';

@Controller('movie-report')
export class MovieReportController {

    constructor(private movieReportService: MovieReportService) {}

    // movie-report/id
    @Get(":id")
    getReport(@Param('id') movie_id: number) {
        return movie_id;
    }
    
    // movie-report/getMovieReport?mid=
    @Get('getMovieReport')
    getMovieReport(@Query('mid') movie_id: number) {
        return this.movieReportService.createMovieReport(movie_id);
    }
}
