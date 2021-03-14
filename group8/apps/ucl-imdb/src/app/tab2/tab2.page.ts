import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, IonSegment, IonSelect } from '@ionic/angular';

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

  tagColors = {"Animation": '#FFA500', "Adventure": "warning", "Family": "light", "Comedy": "warning", "Fantasy": "tertiary", "Romance": "medium", "Drama": "dark",
  "Action": "danger", "Crime": "warning", "Thriller": "danger", "Horror": "danger", "History": "medium", "Science Fiction": "primary", "Mystery": "War",
  "Music": "primary", "Documentary": "medium", "Western": "warning", "TV Movie": "light"};

  @ViewChild("searchBar") searchBar: IonSearchbar;
  @ViewChild("sortCriteria", { static: true }) sortCriteria: IonSelect;
  @ViewChild("sortOrder", { static: true }) sortOrder: ElementRef;
  @ViewChild("segmentRelease", { static: true }) segmentRelease: IonSegment;
  @ViewChild("filterYear", { static: true }) filterYear: ElementRef;
  @ViewChild("filterRating", { static: true }) filterRating: ElementRef;

  constructor(private movieService: MoviesService) {
    console.log('getting movies from frontend');
    console.log(this.movieService.getMovies());
  }

  getChipColor(chipName) {
    return this.tagColors[chipName]
  }

  toggleAdvanced() {
    this.advanced = !this.advanced
  }

  search() {
    console.log("search input: ", this.searchBar.value);
    // console.log("sort criteria: ",this.sortCriteria.value);
    // console.log("sort order: ",this.sortOrder.value);
    // console.log("select release date: ", this.segmentRelease.value);
    // console.log("filter year: ",this.filterYear.value);
    // console.log("filter rating: ",this.filterRating.value);
  }

}
