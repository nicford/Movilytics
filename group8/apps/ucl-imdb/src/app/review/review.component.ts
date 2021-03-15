import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { movieRes } from './movieRes.interface';

@Component({
  selector: 'group8-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  movie
  @Input() mid: string

  constructor(private movieService: MoviesService, private activatedRouter: ActivatedRoute) {
    this.mid=this.activatedRouter.snapshot.paramMap.get("reviewID");
    console.log(this.mid)
    const res = this.movieService.getSingleMovie(this.mid)
    const $res = res.subscribe(resData => {
      console.log(resData)
      this.movie = resData
    }).unsubscribe
  }

  ngOnInit(): void {
  }

}
