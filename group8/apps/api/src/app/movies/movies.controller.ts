import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {

    constructor(private movieService: MoviesService) {}

    @Get(":movie_id")
    getMovie(@Param('movie_id') movie_id: number) {
        return this.movieService.getMovie(movie_id);
    }

}
