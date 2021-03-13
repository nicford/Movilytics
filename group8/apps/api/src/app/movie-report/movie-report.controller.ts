import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieReportService } from './movie-report.service';

@Controller('movie-report')
export class MovieReportController {

    constructor(private movieReportService: MovieReportService) {}

    // movie-report/id
    @Get(":id")
    async getReport(@Param('id') movie_id: number) {
        return await movie_id;
    }
    
    // movie-report/getMovieReport?mid=
    @Get('getMovieReport')
    async getMovieReport(@Query('mid') movie_id: number) {
        const result = await this.movieReportService.createMovieReport(movie_id);
        return result
    }
}
