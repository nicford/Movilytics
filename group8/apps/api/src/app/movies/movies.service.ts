import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MoviesService {

    constructor(private databaseService: DatabaseService) {}

    cache = {}

    getMovie(movid_id: number) {
        const query = "SELECT * FROM LINKS WHERE mid = $1";
        if (movid_id in this.cache) {
            return this.cache[movid_id];
        }
        const result = this.databaseService.runQuery(query, [movid_id])
        this.cache[movid_id] = result;
        return result;
    }




}
