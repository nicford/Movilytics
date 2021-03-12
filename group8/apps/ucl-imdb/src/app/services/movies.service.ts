import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const api_domain = "http://localhost:3333"

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http:HttpClient) {}

  getMovies() {
    return this.http.get(api_domain + '/movies');
  }

  getReviews() {
    return this.http.get(api_domain + '/movies');
  }
}
