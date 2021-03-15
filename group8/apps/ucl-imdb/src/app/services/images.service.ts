import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  poster_endpoint = "https://image.tmdb.org/t/p/w500"

  constructor(private http : HttpClient) { }

  getPoster(posterPath: string) {
    const result = this.http.get(this.poster_endpoint + posterPath);
    return result;
  }

  getPosterPath(posterPath: string) {
    const result = this.poster_endpoint + posterPath;
    console.log(result);
    // return result;
  }

}