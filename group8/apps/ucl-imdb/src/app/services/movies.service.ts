import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { searchDto } from '@group8/api-interfaces';



@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http:HttpClient) {}

  api_domain = "http://localhost:3333";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies() {
    return this.http.get(this.api_domain + '/movies');
  }

  getReviews() {
    return this.http.get(this.api_domain + '/movies');
  }

  searchMovies() {
    const body: searchDto = {
      sortBy: "24123421",
      ascending: "false",
      status: "123",
      results_per_page: 12321,
      page_number: null,
      year: null,
      allowedRatings: null,
      query: null,
      genres: null,
  };
    return this.http.post(this.api_domain + '/search', body, this.httpOptions);
  }
}
