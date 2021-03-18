import { CACHE_MANAGER, Get, HttpService, Inject, Injectable } from '@nestjs/common';
// import { QueryResult } from 'pg';
import { DatabaseService } from '../database/database.service';
import { Cache } from 'cache-manager';

import { exec } from 'child_process';
import { from, Observable } from 'rxjs';
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

  sort_by_values = [
    "popularity",
    "polarity",
    "title",
    "year",
    "rating"
  ]

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


  // from_cache: true if being called from a cache, false otherwise
  async search(search_query: searchDto, from_cache=false) {
    const search_query_hash = sha1(search_query);
    console.log(`INCOMING SEARCH: hash: ${search_query_hash}`);

    // Only check if in cache if not coming from cache.
    // If coming from a cache function, then we already know there won't be a cache hit
    // if (!from_cache) {
      console.log('checking cache');
      const cache_hit = await this.cache.get(search_query_hash);
      if (cache_hit) {
        console.log('found in cache');
        console.log(`cache hit: ${cache_hit}`);
        return cache_hit;
      }
    // }
    
    // getting parameters and preparing them for SQL query
    const query_prepared_parameters: string[] = [];
    const parameters: (string | number | boolean | number[])[] = [];
    let index = 1;
    let value: string | number | boolean | number[];
    Object.keys(search_query).forEach((key) => {
      value = search_query[key];
      if (typeof value !== 'undefined' && value) {
        query_prepared_parameters.push(`${key} := $${index}`);
        parameters.push(value);
        index += 1;
      }
    });
    console.log(query_prepared_parameters);
    console.log(parameters);
    const sql_query = `SELECT * FROM get_movies(${query_prepared_parameters.join(', ')})`;
    console.log(sql_query)
    const response = (await this.databaseService.runQuery(sql_query, parameters)).rows; // convert each parameter to a string before querying the postgres database

    console.log(`adding to cache with key (hash): ${search_query_hash}`)
    this.cache.set(search_query_hash, response);

    // only cache if coming from a controller, otherwise the recursion will never end
    if (!from_cache) {
      // asynchronously pre-cache some expected search based on the current search
      this.pre_cache_searches(search_query, sql_query, parameters, 5);
    }

    console.log();
    console.log();

    return response;
  }

  async pre_cache_searches(search_query: searchDto, sql_query: string, parameters: any[], number_extra_pages_to_cache: number) {
      await this.cache_extra_pages(search_query, sql_query, parameters, 4);
      if (search_query['result_offset'] < search_query['result_limit']) { // only pre-cache the first 20 results
        await this.cache_sortBy_and_order(search_query, sql_query, parameters);
      }
      
  }


  // cache extra pages. when calling this function, don't call await so that this can be done in the background without blocking execution
  async cache_extra_pages(search_query: searchDto, sql_query: string, parameters: any[], number_extra_pages_to_cache: number) {
    console.log('CACHING EXTRA PAGES!')
    // go through each page and cache them
    const result_limit = search_query['result_limit']
    console.log(`result limit: ${result_limit}`)
    console.log(`offset: ${search_query['result_offset']}`)
    number_extra_pages_to_cache++; // increase by one to start at offset one
    for (let i = 1; i < number_extra_pages_to_cache; i++) {
      search_query['result_offset'] += result_limit;
      console.log(`caching offset: ${search_query['result_offset']}`)
      await this.search(search_query, true);  // values get cached during search. Await, because same search_query object is being used, and can't change while called functions runs
    }
  }

  // cache all sort by options for search query, including ascending/descending ordering for all sort options!
  async cache_sortBy_and_order(search_query: searchDto, sql_query: string, parameters: any[]) {
    console.log('CACHING SORT BY VALUES');
    const current_sortBy_value = search_query['sort_by'];
    for (const sortBy_option of this.sort_by_values) {
      if (current_sortBy_value != sortBy_option) {
        for (const order_option of ["true", "false"]) {
          search_query['sort_by'] = sortBy_option;
          search_query['ascending'] = order_option;
          console.log(`Caching options: ${sortBy_option}, ascending: ${order_option}`);
          await this.search(search_query, true);  // values get cached during search. Await, because same search_query object is being used, and can't change while called functions runs
        }
      }
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
