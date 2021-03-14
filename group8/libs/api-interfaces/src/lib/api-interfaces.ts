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
  ascending: boolean = null;  // string

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