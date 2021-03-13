import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
// import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { Cache } from 'cache-manager';

import { exec } from 'child_process';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dotenv from "dotenv";
import { searchDto, searchResponse } from '@group8/api-interfaces';
dotenv.config({path: './env/.env'});


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

  
  
  tmdb_api_endpoint = 'http://api.themoviedb.org/3';
  api_key_suffix = `api_key=${process.env.TMDB_API_KEY}`;

  async getMovie(movie_id: number) {
    // console.log(this.cache.store)
    // const query = "SELECT * FROM LINKS WHERE mid = $1";
    const query = 'SELECT * FROM MOVIES WHERE mid = $1';
    return await this.databaseService.runQuery(query, [movie_id]);
  }


  async getAllMovies() {
    const query = 'SELECT * FROM MOVIES';
    return await this.databaseService.runQuery(query, []);
  }


  // TODO: ignore case when searching!!
  async search(search_query: searchDto) {
    // const keys = Object.keys(search_query);
    // console.log(keys);
    // console.log(search_query.genres);
    //  = [];
    const query_prepared_parameters: string[] = [];
    const parameters: string[] = [];
    let index = 1;
    let value: any;
    Object.keys(search_query).forEach((key) => {
      console.log(key);
      value = search_query[key];
      if (typeof value !== 'undefined' && value) {
        query_prepared_parameters.push(`${key} := $${index}`);
        parameters.push(String(value));
        index += 1;
      }
    });
    console.log(query_prepared_parameters);
    console.log(parameters);
    // console.log(parameters);
    // const parameters: string[] = Array.from(Object.keys(search_query), (key) => { 
    //   console.log(key);
    //   console.log(search_query[key]);
    //   if (search_query[key]) {
    //   return String(search_query[key]);
    // } else {
    //   return search_query[key];
    // }});
    // console.log(parameters);
    const sql_query = `select * from get_movies(${query_prepared_parameters.join(', ')})`;
    console.log(sql_query)
    const response = await this.databaseService.runQuery(sql_query, parameters); // convert each parameter to a string before querying the postgres database
    
    // const response: searchResponse = {
    //   title: "Toy Story",
    //   poster_path: '/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    //   rating: 4.4,
    //   tagline: 'It spans a whole new world of entertainment!',
    //   released: true
    // };
    // search_query = '%' + search_query + '%';
    // console.log(search_query);
    // const sql_query = 'SELECT * FROM MOVIE WHERE title like $1';
    // console.log(`running search movies on query: ${sql_query}`);
    // return this.databaseService.runQuery(sql_query, [search_query]);

    // check if first n pages are in cache. get pages
    // this.cache.set() // query extra pages and add them to cache. Use hash of request parameters and page number for that request as key 
    return response;
  }

  

  async getMovieReviews(movie_id: number) {
    const movie_review_endpoint = `${this.tmdb_api_endpoint}/movie/${movie_id}/reviews?` + this.api_key_suffix;
    return await this.httpService.get(movie_review_endpoint).pipe(
      map(response => response.data),
    );
  }




}
