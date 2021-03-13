import { Body, Controller, Get, Post, Query, } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { searchDto } from '@group8/api-interfaces';


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

    // @Get("search")
    // // @UsePipes(new ValidationPipe({ transform: true }))
    // search(@Query() query: searchDto) {
    //     console.log(query);
    //     return this.movieService.search(query);
    // }

    @Post("search")
    // @UsePipes(new ValidationPipe({ transform: true }))
    search(@Body() query: searchDto) {
        console.log('search initiated:')
        console.log(query);
        return this.movieService.search(query);
    }


    @Get('getReviews')
    getReviews(@Query('mid') movie_id: number) {
        console.log(`getting reviews for movie with id ${movie_id}`);
        return this.movieService.getMovieReviews(movie_id);
    }

    @Get('genrePopulation')
    getGenrePopulation(@Query('mid') movie_id: number) {
        console.log(`getting genre population for movie with id ${movie_id}`);
        
    }
    
}
