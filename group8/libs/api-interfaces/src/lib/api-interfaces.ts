import { IsNotEmpty, IsInt, IsBooleanString, IsString, IsOptional, IsArray } from 'class-validator';


export interface Message {
  message: string;
}


export class searchDto {

  @IsOptional()
  @IsInt()
  result_limit = 20; 

  @IsInt()
  @IsOptional()
  result_offset = 5;

  // optional if all movies should be displayed
  @IsString()
  @IsOptional()
  keyword: string = null;

  @IsString()
  @IsNotEmpty()
  sort_by: string = null;

  @IsBooleanString()
  @IsNotEmpty()
  ascending: string = null;  // string

  @IsInt()
  @IsOptional()
  start_year: number = null;

  @IsInt()
  @IsOptional()
  end_year: number = null;

  // @IsInt()
  @IsArray()
  @IsOptional()
  allowed_ratings: number[] = null;

  @IsArray()
  @IsOptional()
  genres_arg: number[] = null;

  @IsString()
  @IsOptional()
  status_arg: string = null;   // released, upcoming, both
}


export class searchResponse {
  title: string;

  poster_path: string;

  rating: number;

  tagline: string;

  released: string;   // true if released, false if upcoming
}


export class CSV_ROW_PREDICT_RATINGS {
  rating: number
  tags: string
}

export class PREDICTED_RATINGS {
  provided_ratings_avg: number;

  tag_rating_avg: number;

  company_rating_avg: number;

  genre_rating_avg: number;

  overall_avg: number;    // average of the four values above

}


export class CSV_ROW_PREDICT_PERSONALITY {
  tag: string
}

export class PREDICTED_PERSONALITY {
  openness: number;

  agreeableness: number;

  emotional_stability: number;

  conscientiousness: number;

  extraversion: number;    // average of the four values above

}