import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss',]
})
export class Tab2Page {

  advanced = false;

  tags = ["Animation", "Adventure", "Family", "Comedy", "Fantasy", "Romance", "Drama",
  "Action", "Crime", "Thriller", "Horror", "History", "Science Fiction", "Mystery", "War",
  "Music", "Documentary", "Western", "TV Movie"];

  tagColors = {"Animation": '#FFA500', "Adventure": "warning", "Family": "light", "Comedy": "warning", "Fantasy": "tertiary", "Romance": "medium", "Drama": "dark",
  "Action": "danger", "Crime": "warning", "Thriller": "danger", "Horror": "danger", "History": "medium", "Science Fiction": "primary", "Mystery": "War",
  "Music": "primary", "Documentary": "medium", "Western": "warning", "TV Movie": "light"};

  constructor() {}

  getChipColor(chipName) {
    return this.tagColors[chipName]
  }

  toggleAdvanced() {
    this.advanced = !this.advanced
  }

}
