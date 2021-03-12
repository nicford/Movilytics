import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
// import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { Cache } from 'cache-manager';
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dotenv from "dotenv";
dotenv.config({path: './env/.env'});
// import { format } from 'pg-format';

@Injectable()
export class MoviesService {

  constructor(private databaseService: DatabaseService,
              @Inject(CACHE_MANAGER) private cache: Cache,
              private httpService: HttpService
              ) {
                console.log(__dirname);
                console.log(process.cwd());
                // cons /ole.log(exec('ls -lha'));
              }

  movie_report_sql_query = readFileSync('apps/api/src/app/sql_scripts/fetch_overview.sql').toString();
  
  tmdb_api_endpoint = 'http://api.themoviedb.org/3';
  api_key_suffix = `api_key=${process.env.TMDB_API_KEY}`;

  getMovie(movie_id: number) {
    // console.log(this.cache.store)
    // const query = "SELECT * FROM LINKS WHERE mid = $1";
    const query = 'SELECT * FROM MOVIE WHERE mid = $1';
    return this.databaseService.runQuery(query, [movie_id]);
  }

  getAllMovies() {
    const query = 'SELECT * FROM MOVIE';
    return this.databaseService.runQuery(query, []);
  }

  // TODO: ignore case when searching!!
  search(search_query: string) {
    search_query = '%' + search_query + '%';
    console.log(search_query);
    const sql_query = 'SELECT * FROM MOVIE WHERE title like $1';
    console.log(`running search movies on query: ${sql_query}`);
    return this.databaseService.runQuery(sql_query, [search_query]);
  }

  createMovieReport(movie_id: number) {
    console.log(this.movie_report_sql_query);
    return this.databaseService.runQuery(this.movie_report_sql_query, [movie_id]);
  }

  getMovieReviews(movie_id: number) {
    const movie_review_endpoint = `${this.tmdb_api_endpoint}/movie/${movie_id}/reviews?` + this.api_key_suffix;
    return this.httpService.get(movie_review_endpoint).pipe(
      map(response => response.data),
    );
  }




}
