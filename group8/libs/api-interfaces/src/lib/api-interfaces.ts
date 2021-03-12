import { IsNotEmpty, IsInt, Contains } from 'class-validator';


export interface Message {
  message: string;
}


export class searchDto {

  results_per_page: string;

  page_number: number;

  // not required if all movies should be displayed
  query: string;

  @IsNotEmpty()
  sortBy: string

  @IsNotEmpty()
  ascending: string

  @IsInt()
  year: number

  @IsInt()
  allowedRatings: number[]

  genres: number[]

  status: string;   // released, upcoming, both
}

export class searchResponse {
  title: string;

  poster_path: string;

  rating: number;

  tagline: string;

  released: boolean;   // true if released, false if upcoming
}