import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonContent, IonRange, IonSearchbar, IonSegment, IonSelect } from '@ionic/angular';

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

  
  @ViewChild("searchBar") searchBar: IonSearchbar;
  @ViewChild("sortCriteria") sortCriteria: IonSelect;
  @ViewChild("sortOrder") sortOrder: IonSelect;
  @ViewChild("segmentRelease") segmentRelease: IonSegment;
  @ViewChild("rangeYear") filterYear: IonRange;
  @ViewChild("filterRating") filterRating: IonSelect;

  constructor(private movieService: MoviesService) {
    console.log('getting movies from frontend');
    console.log(this.movieService.getMovies());
  }

  toggleAdvanced() {
    this.advanced = !this.advanced
  }

  search() {
    console.log("search input: ", this.searchBar.value);
    console.log("sort criteria: ",this.sortCriteria.value);
    console.log("sort order: ",this.sortOrder.value);
    console.log("select release date: ", this.segmentRelease.value);
    console.log("filter year: ",this.filterYear.value);
    console.log("filter rating: ",this.filterRating.value);
    console.log("tags: ",this.searchTags);
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

}
