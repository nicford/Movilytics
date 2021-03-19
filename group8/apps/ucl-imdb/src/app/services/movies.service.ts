import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { searchDto } from '@group8/api-interfaces';
@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http:HttpClient) {}

  // api_domain = "http://d5b3a4702c51.ngrok.io/api/movies";
  api_domain = "http://localhost:3333/api/movies";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies() {
    return this.http.get(this.api_domain + '/movies');
  }

  getReviews() {
    return this.http.get(this.api_domain + '/movies');
  }

   searchMovies(body: searchDto) {
    const result = this.http.post(this.api_domain + '/search', body, this.httpOptions);
    return result;
  }

  getSingleMovie(mid: string) {
    const result = this.http.get(this.api_domain + '/getMovie?id=' + mid, this.httpOptions);
    return result
  }
}
