import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MoviesService {

    constructor(private databaseService: DatabaseService) {}

    getMovie(movid_id: number) {
        const query = "SELECT * FROM LINKS WHERE mid = $1";
        return this.databaseService.runQuery(query, [movid_id])
    }


}
