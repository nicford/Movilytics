import { Component } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  slideOptions = {
    initialSlide: 1,
    speed: 400,
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

}
