import { IsNotEmpty, IsInt, IsBoolean, IsString, IsOptional, IsArray } from 'class-validator';


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
  sortBy: string = null;

  @IsBoolean()
  @IsNotEmpty()
  ascending: string = null;

  @IsInt()
  @IsOptional()
  year: number = null;

  // @IsInt()
  @IsArray()
  @IsOptional()
  allowedRatings: number[] = null;

  @IsArray()
  @IsOptional()
  genres: number[] = null;

  @IsString()
  @IsOptional()
  status: string = null;   // released, upcoming, both
}


export class searchResponse {
  title: string;

  poster_path: string;

  rating: number;

  tagline: string;

  released: boolean;   // true if released, false if upcoming
}