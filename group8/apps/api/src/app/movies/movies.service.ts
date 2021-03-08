import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
// import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { Cache } from 'cache-manager';

@Injectable()
export class MoviesService {

    constructor(private databaseService: DatabaseService, @Inject(CACHE_MANAGER) private cache: Cache) {}

    getMovie(movie_id: number) {
        console.log(this.cache.store)
        const query = "SELECT * FROM LINKS WHERE mid = $1";
        return this.databaseService.runQuery(query, [movie_id])
    }

   




}
