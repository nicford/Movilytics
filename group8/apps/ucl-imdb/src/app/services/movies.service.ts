import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { searchDto } from '@group8/api-interfaces';
@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http:HttpClient) {}
  
  api_domain = "http://ef6ece8a82bc.ngrok.io/api";
  audience_api_domain = this.api_domain + "/audience"
  review_api_domain = this.api_domain + "/movie-report"
  movies_api_domain = this.api_domain + "/movies"

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies() {
    return this.http.get(this.movies_api_domain);
  }

  getReviews() {
    return this.http.get(this.movies_api_domain);
  }

  searchMovies(body: searchDto) {
    const result = this.http.post(this.movies_api_domain + '/search', body, this.httpOptions);
    return result;
  }

  getSingleMovie(mid: string) {
    const result = this.http.get(this.movies_api_domain + '/getMovie?id=' + mid, this.httpOptions);
    return result
  }

  getMovieReview(mid: string) {
    const result = this.http.get(this.review_api_domain + "/" + mid, this.httpOptions);
    return result
  }

  // TODO: incorporate audience either in movies or movie-report and remove audience controller
  getAudienceSeg(mid: string){
    const result = this.http.get(this.audience_api_domain + '/segmentUsersByGenre?id=' + mid, this.httpOptions);
    return result;
  }

}
