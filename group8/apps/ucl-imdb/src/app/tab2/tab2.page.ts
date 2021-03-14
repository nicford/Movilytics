import { stringify } from '@angular/compiler/src/util';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { searchDto } from '@group8/api-interfaces';
import { IonContent, IonRange, IonSearchbar, IonSegment, IonSelect } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ImagesService } from '../services/images.service';

import { MoviesService } from "../services/movies.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss',],
  providers: [MoviesService]
})
export class Tab2Page {

  advanced = false;

  tags = ["Animation", "Adventure", "Family", "Comedy", "Fantasy", "Romance", "Drama",
  "Action", "Crime", "Thriller", "Horror", "History", "Science Fiction", "Mystery", "War",
  "Music", "Documentary", "Western", "TV Movie"];
  tagDefaultColor = Array(this.tags.length).fill("none");
  searchTags: string[] = []

  searchRange = {"lower": 1888, "upper": 2021}
  defaultRange: any = this.searchRange;
  private rangeValues: any = {
    upper: 2021,
    lower: 1888
  }

  movies
  
  @ViewChild("searchBar") searchBar: IonSearchbar;
  @ViewChild("sortCriteria") sortCriteria: IonSelect;
  @ViewChild("sortOrder") sortOrder: IonSelect;
  @ViewChild("segmentRelease") segmentRelease: IonSegment;
  @ViewChild("rangeYear") rangeYear: IonRange;
  @ViewChild("filterRating") filterRating: IonSelect;

  constructor(private movieService: MoviesService, private imagesService: ImagesService, private router: Router) {
    this.rangeValues = this.rangeValues
    // console.log('getting movies from frontend');
    // console.log(this.movieService.getMovies());
  }

  toggleAdvanced() {
    this.advanced = !this.advanced
  }


  search() {
    let req_keyword = (this.searchBar.value)? this.searchBar.value as string : null;
    let req_sort_by = (this.sortCriteria.value)? this.sortCriteria.value as string : "popularity";
    let req_ascending = (this.sortOrder.value)? this.sortOrder.value as string : "true";
    let req_status_arg = (this.segmentRelease.value)? this.segmentRelease.value as string : "released";
    let req_range_upper = (this.rangeValues.upper)? (this.rangeValues.upper) : "2021";
    let req_range_lower = (this.rangeValues.lower)? (this.rangeValues.lower) : "1888";
    let req_rating = (this.filterRating.value)? this.filterRating.value as number : 5;
    let req_genres_arg = this.searchTags

    const body: searchDto = {
      sort_by: req_sort_by,
      ascending: req_ascending,
      status_arg: req_status_arg,
      result_limit: 20,
      result_offset: 0,
      start_year: req_range_lower,
      end_year: req_range_upper,
      allowed_ratings: null,
      keyword: req_keyword,
      genres_arg: null,
  };
    console.log(body);
    const res: Observable<Object> = this.movieService.searchMovies(body);
    const $res = res.subscribe(resData => {
      console.log(resData)
      this.movies = resData
    }).unsubscribe
  }

  changeTagColor(i:number) {
    let tag: string = this.tags[i]  
    let n = this.tags.length
    if(this.searchTags.includes(tag) && i < n && i >= 0) {
      let tag_index = this.searchTags.indexOf(tag);
      this.tagDefaultColor[i] = "none"
      this.searchTags.splice(tag_index, 1)
    } else {
      this.searchTags.push(tag)
      this.tagDefaultColor[i] = "primary"
    }
  }

  goToReview(mid: String) {
    this.router.navigate(["tabs/tab2/" + mid]);
  }

  getImage(posterPath: string) {
    const res = this.imagesService.getPosterPath(posterPath)
    return res
    // const $res = res.subscribe(resData => {

    //   return resData? resData : "test"
    // })

  }

}
