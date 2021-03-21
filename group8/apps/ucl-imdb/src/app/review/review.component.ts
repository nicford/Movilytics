import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagesService } from '../services/images.service';
import { MoviesService } from '../services/movies.service';
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { movieRes } from './movieRes.interface';

@Component({
  selector: 'group8-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  

  tagdataToggle = false
  activityToggle = false
  genredistToggle = false
  genreavgToggle = false
  polarityToggle = false
  usersegmentToggle = false

  toggleDict = {
    'tagdataToggle': false,
    'activityToggle': false,
    'genredistToggle': false,
    'genreavgToggle': false,
    'polarityToggle': false,
    'usersegmentToggle': false,
  }


  collapseToggle(elemID: string) {
    this.toggleDict[elemID] = !this.toggleDict[elemID]
  }



  movie
  poster
  tag_data
  lineChartType
  lineChartData
  lineChartLabels
  lineChartOptions
  lineChartColors
  revChartData
  voteChartData
  popularityChartData
  pieChartLabels
  pieChartData
  barChartLabels
  barChartData
  scatterChartData
  scatterChartLabels
  cf_res
  cf_piechart_labels
  cf_piechart_data
  cfChartOptions
  @Input() mid: string

  constructor(private movieService: MoviesService, private activatedRouter: ActivatedRoute, private imageService: ImagesService) {
    this.mid=this.activatedRouter.snapshot.paramMap.get("reviewID");
    console.log(this.mid)

    // REVIEW
    const review_res = this.movieService.getMovieReview(this.mid)
    const $res = review_res.subscribe(resData => {
      this.movie = resData
      this.poster = this.getImage(this.movie.poster_path)
      this.revChartData = [{
        data: [this.movie.revenue, this.movie.budget],
        backgroundColor: ["#006400","#98FB98"]
      }];
      this.voteChartData = [{
        data: [this.movie.vote_average, 10 - this.movie.vote_average],
        backgroundColor: ["#FF8C00","#F0E68C"]
      }];
      this.popularityChartData = [{
        data: [this.movie.popularity],
        backgroundColor: ["#00BFFF"]
      }];

      this.lineChartType = 'line';

      this.lineChartData = [
        {data: this.movie.trend_activty, label: "Activity"}, 
        {data: this.movie.trend_ratings, label: "Ratings"}
      ];
      
      this.lineChartLabels = this.movie.trend_months
      this.lineChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        title: {
          display: true,
          text: 'Activity and Rating Trend',
          position: 'bottom'
        }
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
      this.cfChartOptions = {
        responsive: 'true',
        title: {
          display: true,
          text: 'Collaborative Filtering',
          position: 'bottom'
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
               const label = data.labels[tooltipItem.index];
               const value = data.datasets[0].data[tooltipItem.index];
               return (label + ' :' +  value);
            },
            afterLabel: function(tooltipItem, data){
              const label = data.labels[tooltipItem.index];
              const users = cf_resData[label];
              const texts = [];
              let user = ['Users Segemented: '];
              texts.push("");
              for(let i = 0; i < users.length; i++){
                if(i % 6 == 0){
                  texts.push(user);
                  user = [];
                } else {
                  user.push(users[i]);  
                }
              }
              return  texts;
            }
         }
        }
      }
    }).unsubscribe;
  }

  public scatterChartType = 'scatter';
  
  public barChartLegend = true;

  public revChartLabels: Label = ['Revenue', 'Budget'];
  public voteChartLabel: Label = ['Vote Average', ""]
  public popularityChartLabel : Label = ["Popularity"]

  public doughnutChartType: ChartType = 'doughnut';
  public pieChartType: ChartType = 'pie';
  public barChartType: ChartType = 'bar';

  public voteChartOptions = {
    legend: {
      display: false
    },
    tooltips: {
    	filter: function(item, data) {
        const label = data.labels[item.index];
        if (label) return item;
      }
    },
    title: {
      display: true,
      text: 'Vote Average',
      position: 'bottom'
    }
  }

  public scatterChartOptions = {
    type: 'linear',
    position: 'bottom',
    responsive: 'true',
    title: {
      display: true,
      text: 'Tag Polarity and Net Likes',
      position: 'bottom'
    },
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

  public genreDistributionChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Genre Population Distribution',
      position: 'bottom'
    }
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: 'Average Percentile Difference',
      position: 'bottom'
    }
  };

  public popularityChartOptions ={
    title: {
      display: true,
      text: 'Popularity',
      position: 'bottom'
    },
    legend: {
      display: false
    }
  }

  public revChartOptions ={
    title: {
      display: true,
      text: 'Net Profit',
      position: 'bottom'
    },
    legend: {
      display: false
    }
  }

  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const netProfit = this.movie.revenue - this.movie.budget;
      const txt = '$' + netProfit;

      //Get options from the center object in options
      const sidePadding = 60;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(25 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      ctx.font = fontSizeToUse + 'px Roboto';
      ctx.fillStyle = 'white';

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }];

  public voteAverageChart: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const votePercentile = (this.movie.vote_average / 10) * 100;
      const txt = votePercentile.toFixed(2) + '%';

      //Get options from the center object in options
      const sidePadding = 60;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(20 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      ctx.font = fontSizeToUse + 'px Roboto';
      ctx.fillStyle = 'white';

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }];

  public popularityAverageChart: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const txt = this.movie.popularity;

      //Get options from the center object in options
      const sidePadding = 60;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(20 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      ctx.font = fontSizeToUse + 'px Roboto';
      ctx.fillStyle = 'white';

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }];

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
