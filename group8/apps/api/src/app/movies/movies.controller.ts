import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { identity } from 'rxjs';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {

    constructor(private movieService: MoviesService) {}

    @Get("getAllMovies")
    getAllMovies() {
        return this.movieService.getAllMovies();
    }

    @Get("getMovie")
    getMovie(@Query('id') movie_id: number) {
        return this.movieService.getMovie(movie_id);
    }

    @Get("searchMovies")
    searchMovies(@Query('query') query: string) {
        console.log(query);
        return this.movieService.searchMovies(query);
    }

    @Get('getMovieReport')
    getMovieReport(@Query('mid') movie_id: number) {
        return this.movieService.createMovieReport(movie_id);
    }

    @Get('getReviews')
    getReviews(@Query('mid') movie_id: number) {
        console.log(`getting reviews for movie with id ${movie_id}`);
        return this.movieService.getMovieReviews(movie_id);
    }


    
}
