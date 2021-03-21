import { Controller, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieReportService } from './movie-report.service';
import { Express } from 'express';
import { Multer } from 'multer';
import { Stream } from 'stream';
import * as csv from 'fast-csv';
import { CSV_ROW_PREDICT_PERSONALITY, CSV_ROW_PREDICT_RATINGS } from '@group8/api-interfaces'



@Controller('movie-report')
export class MovieReportController {

    constructor(private movieReportService: MovieReportService) {}

    // movie-report/id
    // @Get(":id")
    // getReport(@Param('id') movie_id: number) {
    //     return movie_id;
    // }

    // localhost:3333/api/movie-report/862
    @Get(':id')
    async getMovieReport(@Param('id') movie_id: number) {
        const result = await this.movieReportService.createMovieReport(movie_id);
        console.log(result);
        console.log("RETURNING IN GET MOVIE REPORT")
        return result;
    }


    async parseCSV<T>(file: Express.Multer.File, csv_data: T[]) {
        const stream = new Stream.PassThrough();
        stream.end(file.buffer);
        await (new Promise((resolve, reject) => {
                stream.pipe(csv.parse({headers: true, trim: true}))
                    .on('data', (data) => {
                        console.log(data);
                        csv_data.push(data);
                    })
                    .on('error', reject)
                    .on('finish', resolve);
                }))
                console.log(`csv data in function: ${csv_data}`)
    }

    

    @Post('predict-ratings/:id')
    @UseInterceptors(FileInterceptor('file'))
    async predictRatings(@UploadedFile() file: Express.Multer.File, @Param('id') movie_id: number) {
        if (typeof file === 'undefined' || !file) {
            throw new HttpException('File missing. Please provide a csv file in the required format.', HttpStatus.NO_CONTENT)
        } else if (file.mimetype != 'text/csv') {
            throw new HttpException('Wrong file type: file must be of type text/csv.', HttpStatus.NOT_ACCEPTABLE) 
        }

        const csv_data: CSV_ROW_PREDICT_RATINGS[] = [];

        try {
            await this.parseCSV<CSV_ROW_PREDICT_RATINGS>(file, csv_data);
        } catch (error) {
            throw new HttpException(`invalid csv: ${error}`, HttpStatus.NOT_ACCEPTABLE);
        }
        console.log(`csv data: ${csv_data}`);
        
        return this.movieReportService.predictRatings(movie_id, csv_data);
    }


    @Post('predict-personality/')
    @UseInterceptors(FileInterceptor('file'))
    async predictPersonality(@UploadedFile() file: Express.Multer.File) {
        if (typeof file === 'undefined' || !file) {
            throw new HttpException('File missing. Please provide a csv file in the required format.', HttpStatus.NO_CONTENT)
        } else if (file.mimetype != 'text/csv') {
            throw new HttpException('Wrong file type: file must be of type text/csv.', HttpStatus.NOT_ACCEPTABLE) 
        }

        const csv_data: CSV_ROW_PREDICT_PERSONALITY[] = [];

        try {
            await this.parseCSV<CSV_ROW_PREDICT_PERSONALITY>(file, csv_data);
        } catch (error) {
            throw new HttpException(`invalid csv: ${error}`, HttpStatus.NOT_ACCEPTABLE);
        }
        console.log(`csv data: ${csv_data}`);
        
        return this.movieReportService.predictPersonality(csv_data);
    }

    
    

   
}
