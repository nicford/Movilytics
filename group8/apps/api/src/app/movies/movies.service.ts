import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MoviesService {

    constructor(private databaseService: DatabaseService) {}

    cache = {}

    getMovie(movie_id: number) {
        const query = "SELECT * FROM LINKS WHERE mid = $1";
        if (movie_id in this.cache) {
            return this.cache[movie_id];
        }
        const result = this.databaseService.runQuery(query, [movie_id])
        this.cache[movie_id] = result;
        return result;
    }




}
