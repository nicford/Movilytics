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

  // Bart Chart
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  // Pie Chart
  public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartData = [120, 150, 180, 90];
  public pieChartType = 'pie';
  
  // Doughnut Chart
  public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';

  // Radar Chart
  public radarChartLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  public radarChartData = [
    {data: [120, 130, 180, 70], label: '2017'},
    {data: [90, 150, 200, 45], label: '2018'}
  ];
  public radarChartType = 'radar';


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
