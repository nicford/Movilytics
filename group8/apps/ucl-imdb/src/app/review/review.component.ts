import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Chart from 'chart.js';
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
  tag_data
  lineChartType
  lineChartData
  lineChartLabels
  lineChartOptions
  lineChartColors
  pieChartLabels
  pieChartData
  barChartLabels
  barChartData
  scatterChartData
  scatterChartLabels
  cf_res
  cf_piechart_labels
  cf_piechart_data
  @Input() mid: string

  constructor(private movieService: MoviesService, private activatedRouter: ActivatedRoute, private imageService: ImagesService) {
    this.mid=this.activatedRouter.snapshot.paramMap.get("reviewID");
    console.log(this.mid)

    // REVIEW
    const review_res = this.movieService.getMovieReview(this.mid)
    const $res = review_res.subscribe(resData => {
      this.movie = resData
      this.poster = this.getImage(this.movie.poster_path)
      this.lineChartType = 'line';

      this.lineChartData = [
        {data: this.movie.trend_activty, label: "Activity"}, 
        {data: this.movie.trend_ratings, label: "Ratings"}
      ];

      this.lineChartLabels = this.movie.trend_months
      this.lineChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true
      };
      
      const genre_details_dict = this.movie.genre_pop_and_perc_diff[0];
      this.pieChartLabels = ['Animation', 'Adventure', 'Family', 'Comedy', 'Fantasy', 'Romance', 'Drama', 'Action','Crime','Thriller','Horror','History','Science Fiction', 'Mystery','War','Music','Documentary','Western','TV Movie'];
      this.pieChartData = [
                            genre_details_dict.animation_count, 
                            genre_details_dict.adventure_count, 
                            genre_details_dict.family_count, 
                            genre_details_dict.comedy_count, 
                            genre_details_dict.fantasy_count, 
                            genre_details_dict.romance_count, 
                            genre_details_dict.drama_count,
                            genre_details_dict.action_count,
                            genre_details_dict.crime_count,
                            genre_details_dict.thriller_count,
                            genre_details_dict.horror_count,
                            genre_details_dict.history_count,
                            genre_details_dict.science_fiction_count,
                            genre_details_dict.mystery_count,
                            genre_details_dict.war_count,
                            genre_details_dict.music_count,
                            genre_details_dict.documentary_count,
                            genre_details_dict.western_count,
                            genre_details_dict.tv_movie_count
                          ];

      this.barChartData = [
        {data: [
                genre_details_dict.animation_glob_avg, 
                genre_details_dict.adventure_glob_avg, 
                genre_details_dict.family_glob_avg, 
                genre_details_dict.comedy_glob_avg, 
                genre_details_dict.fantasy_glob_avg, 
                genre_details_dict.romance_glob_avg, 
                genre_details_dict.drama_glob_avg,
                genre_details_dict.action_glob_avg,
                genre_details_dict.crime_glob_avg,
                genre_details_dict.thriller_glob_avg,
                genre_details_dict.horror_glob_avg,
                genre_details_dict.history_glob_avg,
                genre_details_dict.science_fiction_glob_avg,
                genre_details_dict.mystery_glob_avg,
                genre_details_dict.war_glob_avg,
                genre_details_dict.music_glob_avg,
                genre_details_dict.documentary_glob_avg,
                genre_details_dict.western_glob_avg,
                genre_details_dict.tv_movie_glob_avg
        ], label: 'Percentile Difference'},
      ];

      this.scatterChartData = [{data: this.movie.tag_scatter, label: "Tags"}];
      this.scatterChartLabels = this.movie.tag_labels;

    }).unsubscribe;

    // AUDIENCE
    const audience_seg_res = this.movieService.getAudienceSeg(this.mid)
    const $cf_result = audience_seg_res.subscribe(cf_resData => {
      this.cf_res = cf_resData;
      this.cf_piechart_labels = this.cf_res.metadata.genres_array;
      this.cf_piechart_data = this.cf_res.metadata.length_of_each_genre;

    }).unsubscribe;
  }

  // Scatter Chart 
  public scatterChartType = 'scatter';
  public scatterChartOptions = {
    type: 'linear',
    position: 'bottom',
    responsive: 'true',
    tooltips: {
      callbacks: {
         label: function(tooltipItem, data) {
            const label = data.labels[tooltipItem.index];
            return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
         }
      }
   },
   scales: {
      xAxes: [{
        gridLines: {
            zeroLineColor: 'white'
        },
        display: true,
        scaleLabel: {
            display: true,
            labelString: 'Net Likes',
            fontColor: 'white',
            fontSize:12
        },
        ticks: {
          fontColor: "white"
        }
      }],
      yAxes: [{
        gridLines: {
            zeroLineColor: 'white'
        },
        display: true,
        scaleLabel: {
            display: true,
            labelString: 'Polarity',
            fontColor: 'white',
            fontSize:12
        },
        ticks: {
          fontColor: "white"
        }
      }]
   }
  }

  // Bar Chart
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartType = 'bar';
  public barChartLegend = true;

  // Pie Chart 
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
