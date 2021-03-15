import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagesService } from '../services/images.service';
import { MoviesService } from '../services/movies.service';
import { movieRes } from './movieRes.interface';

@Component({
  selector: 'group8-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  movie
  poster
  @Input() mid: string

  constructor(private movieService: MoviesService, private activatedRouter: ActivatedRoute, private imageService: ImagesService) {
    this.mid=this.activatedRouter.snapshot.paramMap.get("reviewID");
    console.log(this.mid)
    const res = this.movieService.getSingleMovie(this.mid)
    const $res = res.subscribe(resData => {
      console.log(resData)
      this.movie = resData[0]
      this.poster = this.getImage(this.movie.poster_path)
    }).unsubscribe
  }

  ngOnInit(): void {
  }

  getImage(posterPath: string) {
    const res = this.imageService.getPosterPath(posterPath)
    return res
    // const $res = res.subscribe(resData => {

    //   return resData? resData : "test"
    // })

  }

}
