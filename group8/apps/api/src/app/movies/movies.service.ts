import { CACHE_MANAGER, Get, HttpService, Inject, Injectable } from '@nestjs/common';
// import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { Cache } from 'cache-manager';

import { exec } from 'child_process';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dotenv from "dotenv";
import { searchDto, searchResponse } from '@group8/api-interfaces';
import { sha1 } from 'object-hash';


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
    const search_query_hash = sha1(search_query)
    console.log(search_query_hash)

    if (await this.cache.get(search_query_hash)) {
      console.log('found in cache');
      const cache_hit = await this.cache.get(search_query_hash);
      console.log(`cache hit: ${cache_hit}`);
      return cache_hit;
    }
    
    const query_prepared_parameters: string[] = [];
    const parameters: (string | number | boolean | number[])[] = [];
    let index = 1;
    let value: string | number | boolean | number[];
    Object.keys(search_query).forEach((key) => {
      console.log(key);
      value = search_query[key];
      if (typeof value !== 'undefined' && value) {
        query_prepared_parameters.push(`${key} := $${index}`);
        parameters.push(value);
        index += 1;
      }
    });
    console.log(query_prepared_parameters);
    console.log(parameters);
    const sql_query = `select * from get_movies(${query_prepared_parameters.join(', ')})`;
    console.log(sql_query)
    const response = (await this.databaseService.runQuery(sql_query, parameters)).rows; // convert each parameter to a string before querying the postgres database

    console.log(`adding to cache with key (hash): ${search_query_hash}`)
    this.cache.set(search_query_hash, response);

    // cache extra page incase of more requests
    this.cache_extra_pages(search_query, sql_query, parameters, 4);

    // check if first n pages are in cache. get pages
    // this.cache.set() // query extra pages and add them to cache. Use hash of request parameters and page number for that request as key 
    return response;
  }


  // cache extra pages. when calling this function, don't call await so that this can be done in the background without blocking execution
  async cache_extra_pages(search_query: searchDto, sql_query: string, parameters: any[], number_extra_pages_to_cache: number) {
    console.log('cache extra pages')
    // go through each page and cache them
    number_extra_pages_to_cache++; // increase by one to start at offset one
    for (let i = 1; i < number_extra_pages_to_cache; i++) {
      search_query['result_offset'] = i*search_query['result_limit'];
      console.log(`query: ${search_query['result_offset']}`)
      const response = (await this.databaseService.runQuery(sql_query, parameters)).rows; 
      console.log(`caching ${sha1(search_query)} with value ${response}`)
      this.cache.set(sha1(search_query), response);
    }
    
  }

  

  

  async getMovieReviews(movie_id: number) {
    const movie_review_endpoint = `${this.tmdb_api_endpoint}/movie/${movie_id}/reviews?` + this.api_key_suffix;
    return await this.httpService.get(movie_review_endpoint).pipe(
      map(response => response.data),
    );
  }


  async getTranslations(movie_id: number) {
    console.log('here1')
    const query = 'SELECT * FROM TRANSLATIONS WHERE mid = $1';
    const result = await this.databaseService.runQuery(query, [movie_id]);
    console.log('here2')
    return result;
}


}
