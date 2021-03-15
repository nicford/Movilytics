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

  tagsDict = {"Family":10751 , "History": 36, "Fantasy": 14, "Comedy": 35, "Documentary": 99,	"TV Movie": 10770,
  "Science Fiction": 878, "War": 10752, "Music": 10402, "Horror": 27, "Action": 28, "Animation": 16, "Crime": 80,
  "Western": 37, "Thriller": 53, "Mystery": 9648, "Adventure": 12, "Romance": 10749, "Drama": 18}
  
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
    this.search()
    // console.log('getting movies from frontend');
    // console.log(this.movieService.getMovies());
  }

  toggleAdvanced() {
    this.advanced = !this.advanced
  }

  selectChange($event) {
    this.search()
  }

  searchClear($event) {
    this.searchBar.value = null
  }

  checkSearch($event) {
    if (this.searchBar.value == "") {this.searchClear($event)}
  }



  search() {
    let req_ascending = "false"
    let req_sort_by = "popularity";

    if (this.sortOrder) {
      req_ascending = (this.sortOrder.value == "true" || this.sortOrder.value == "false")? this.sortOrder.value as string : "false";
    }
    if (this.sortCriteria) {
      req_sort_by= (this.sortCriteria.value)? this.sortCriteria.value as string : "true"
    }
    let req_keyword = (this.searchBar)? this.searchBar.value as string : null;
    let req_status_arg = (this.segmentRelease)? this.segmentRelease.value as string : "Released";
    if (req_status_arg == "Both") {req_status_arg = null}
    let req_range_upper = (this.rangeValues)? (this.rangeValues.upper) : "2021";
    let req_range_lower = (this.rangeValues)? (this.rangeValues.lower) : "1888";
    let req_rating = (this.filterRating)? this.filterRating.value as number : 5;

    let req_genres_arg = []
    for (let tagName of this.searchTags) {
      req_genres_arg.push(this.tagsDict[tagName])
    }

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
      genres_arg: (req_genres_arg.length != 0)? req_genres_arg: null,
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

  goToReview(mid: string) {
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
