import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
// import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { Cache } from 'cache-manager';
// import { format } from 'pg-format';

@Injectable()
export class MoviesService {

    constructor(private databaseService: DatabaseService, @Inject(CACHE_MANAGER) private cache: Cache) {}

    getMovie(movie_id: number) {
        // console.log(this.cache.store)
        // const query = "SELECT * FROM LINKS WHERE mid = $1";
        const query = "SELECT * FROM MOVIE WHERE mid = $1";
        return this.databaseService.runQuery(query, [movie_id])
    }

    getAllMovies() {
        const query = "SELECT * FROM MOVIE";
        return this.databaseService.runQuery(query, []);
    }

    searchMovies(search_query: string) {
        search_query = "%" + search_query + "%";
        console.log(search_query);
        const sql_query = "SELECT * FROM MOVIE WHERE title like $1";
        console.log(`running search movies on query: ${sql_query}`);
        return this.databaseService.runQuery(sql_query, [search_query]);
    }


}
