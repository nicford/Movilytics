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

    
}
