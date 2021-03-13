import { Body, Controller, Get, Post, Query, } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { searchDto } from '@group8/api-interfaces';


@Controller('movies')
export class MoviesController {

    constructor(private movieService: MoviesService) {}

    @Get("getAllMovies")
    async getAllMovies() {
        return await this.movieService.getAllMovies();
    }

    @Get("getMovie")
    async getMovie(@Query('id') movie_id: number) {
        return await this.movieService.getMovie(movie_id);
    }

    // @Get("search")
    // // @UsePipes(new ValidationPipe({ transform: true }))
    // search(@Query() query: searchDto) {
    //     console.log(query);
    //     return this.movieService.search(query);
    // }

    @Post("search")
    // @UsePipes(new ValidationPipe({ transform: true }))
    async search(@Body() query: searchDto) {
        console.log('search initiated:')
        console.log(query);
        return await this.movieService.search(query);
    }


    @Get('getReviews')
    async getReviews(@Query('mid') movie_id: number) {
        console.log(`getting reviews for movie with id ${movie_id}`);
        return await this.movieService.getMovieReviews(movie_id);
    }

}
