import { Content } from '@angular/compiler/src/render3/r3_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { searchDto } from '@group8/api-interfaces';
import { IonContent, IonRange, IonSearchbar, IonSegment, IonSelect } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ImagesService } from '../services/images.service';
import { movieRes } from '../tab2/resData.interface'

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

  movies: movieRes[]
  offset = 0
  
  @ViewChild('content') scrollContent: IonContent;
  @ViewChild("searchBar") searchBar: IonSearchbar;
  @ViewChild("sortCriteria") sortCriteria: IonSelect;
  @ViewChild("sortOrder") sortOrder: IonSelect;
  @ViewChild("segmentRelease") segmentRelease: IonSegment;
  @ViewChild("rangeYear") rangeYear: IonRange;
  @ViewChild("filterRating") filterRating: IonSelect;

  constructor(private movieService: MoviesService, private imagesService: ImagesService, private router: Router) {
    // this.rangeValues = this.rangeValues
    this.templateSearch()
    // console.log('getting movies from frontend');
    // console.log(this.movieService.getMovies());
  }

  ngOnInit() {
  }

  toggleAdvanced() {
    this.advanced = !this.advanced
  }

  selectChange($event) {
    let obs = this.search()
    const $res = obs.subscribe(resData => {
      console.log(resData)
      let temp: movieRes[] = JSON.parse(JSON.stringify(resData))
      this.movies = temp
    }).unsubscribe
  }

  

  searchClear($event) {
    this.searchBar.value = null
  }

  checkSearch($event) {
    if (this.searchBar.value == "") {this.searchClear($event)}
  }

  templateSearch() {
    let obs = this.search()
    const $res = obs.subscribe(resData => {
      let temp: movieRes[] = JSON.parse(JSON.stringify(resData))
      this.movies = temp
    }).unsubscribe
  }

  search(reset:boolean=true) {
    if (reset) {
      this.offset = 0
    }
    let req_ascending = "false"
    let req_sort_by = "popularity";
    let req_keyword = null;

    if (this.sortOrder) {
      req_ascending = (this.sortOrder.value == "true" || this.sortOrder.value == "false")? this.sortOrder.value as string : "false";
    }
    if (this.sortCriteria) {
      req_sort_by= (this.sortCriteria.value)? this.sortCriteria.value as string : "popularity"
    }
    if (this.searchBar) {
      req_keyword = (this.searchBar.value != "")? (this.searchBar.value) : null;
    }
    let req_status_arg = (this.segmentRelease)? this.segmentRelease.value as string : "Released";
    if (req_status_arg == "Both") {req_status_arg = null}
    const req_range_upper = (this.rangeValues)? (this.rangeValues.upper) : "2021";
    const req_range_lower = (this.rangeValues)? (this.rangeValues.lower) : "1888";
    const req_rating = (this.filterRating)? this.filterRating.value as number : 5;

    const req_genres_arg = []
    for (const tagName of this.searchTags) {
      req_genres_arg.push(this.tagsDict[tagName])
    }

    const body: searchDto = {
      sort_by: req_sort_by,
      ascending: req_ascending,
      status_arg: req_status_arg,
      result_limit: 40,
      result_offset: this.offset,
      start_year: req_range_lower,
      end_year: req_range_upper,
      allowed_ratings: null,
      keyword: req_keyword,
      genres_arg: (req_genres_arg.length != 0)? req_genres_arg: null,
  };
    console.log(body);
    const res: Observable<Object> = this.movieService.searchMovies(body);
    return res
  }

  changeTagColor(i:number) {
    const tag: string = this.tags[i]  
    const n = this.tags.length
    if(this.searchTags.includes(tag) && i < n && i >= 0) {
      const tag_index = this.searchTags.indexOf(tag);
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
  }

  bottomButton() {
    this.scrollContent.scrollToTop
  }

  reset() {
    // this.sortCriteria.selectedText
    // this.segmentRelease.select
  }

  loadData($event) {
    this.offset = this.offset + 40
    let obs = this.search(false)
    const $res = obs.subscribe(resData => {
      let incoming: movieRes[] = JSON.parse(JSON.stringify(resData))
      let old: movieRes[] = this.movies
      let temp: movieRes[] = old.concat(incoming)
      this.movies = temp
      $event.target.complete();
    }).unsubscribe
    console.log("To infinity and beyond")
  }

}
