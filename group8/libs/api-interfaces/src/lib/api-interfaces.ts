import { IsNotEmpty, IsInt, Contains, IsString, IsOptional, IsArray } from 'class-validator';


export interface Message {
  message: string;
}


export class searchDto {

  @IsInt()
  @IsOptional()
  results_per_page: number;

  @IsInt()
  @IsOptional()
  page_number: number;

  // optional if all movies should be displayed
  @IsString()
  @IsOptional()
  query: string;

  @IsString()
  @IsNotEmpty()
  sortBy: string

  @IsString()
  @IsNotEmpty()
  ascending: string

  @IsInt()
  @IsOptional()
  year: number

  // @IsInt()
  @IsArray()
  @IsOptional()
  allowedRatings: number[]

  @IsArray()
  @IsOptional()
  genres: number[]

  @IsString()
  @IsOptional()
  status: string;   // released, upcoming, both
}


export class searchResponse {
  title: string;

  poster_path: string;

  rating: number;

  tagline: string;

  released: boolean;   // true if released, false if upcoming
}