import { Component } from '@angular/core';
import { searchDto } from '@group8/api-interfaces';
import { IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ImagesService } from '../services/images.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  polarizingMovies
  popularMovies
  newMovies 

  constructor(private movieService: MoviesService, private imagesService: ImagesService) {
    this.getPopularMovies()
    this.getPolarizingMovies()
    this.getNewMovies()
  }

  movies 

  slideOptions = {
    initialSlide: 1,
    speed: 400,
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  getPopularMovies() {
    let criteria = "popularity"
    let status_arg = "Released"
    const obs = this.search(criteria, status_arg)
    const $res = obs.subscribe(resData => {
      console.log(resData)
      this.popularMovies = resData
    }).unsubscribe
  }

  getPolarizingMovies() {
    let criteria = "polarity"
    let status_arg = "Released"
    const obs = this.search(criteria, status_arg)
    const $res = obs.subscribe(resData => {
      console.log(resData)
      this.polarizingMovies = resData
    }).unsubscribe
  }

  getNewMovies() {
    let criteria = "popularity"
    let status_arg = "Upcoming"
    let obs = this.search(criteria, status_arg)
    const $res = obs.subscribe(resData => {
      console.log(resData)
      this.newMovies = resData
    }).unsubscribe
  }

  getImage(posterPath: string) {
    return this.imagesService.getPosterPath(posterPath)
  }

  getBackdrop(backdropPath: string) {
    return this.imagesService.getBackdropPath(backdropPath)
  }

  search(criteria: string, released: string) {
    const body: searchDto = {
      sort_by: criteria,
      ascending: "false",
      status_arg: released,
      result_limit: 8,
      result_offset: 0,
      start_year: 1888,
      end_year: 2021,
      allowed_ratings: null,
      keyword: null,
      genres_arg: null,
  };
  const res: Observable<Object> = this.movieService.searchMovies(body);
  return res  
  }
}
