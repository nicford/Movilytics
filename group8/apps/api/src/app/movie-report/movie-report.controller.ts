import { Controller, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieReportService } from './movie-report.service';
import { Express } from 'express';
import { Multer } from 'multer';
import { Stream } from 'stream';
import * as csv from 'fast-csv';
import { CSV_ROW } from '@group8/api-interfaces'



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
        return result.rows;
    }

    

    @Post('predict-ratings/:id')
    @UseInterceptors(FileInterceptor('file'))
    async predictRatings(@UploadedFile() file: Express.Multer.File, @Param('id') movie_id: number) {
        if (typeof file === 'undefined' || !file) {
            throw new HttpException('File missing. Please provide a csv file in the reqiured format.', HttpStatus.NO_CONTENT)
        } else if (file.mimetype != 'text/csv') {
            throw new HttpException('Wrong file type: file must be of type text/csv.', HttpStatus.NOT_ACCEPTABLE) 
        }

        const csv_data: CSV_ROW[] = [];
        const stream = new Stream.PassThrough();
        stream.end(file.buffer);

        try {
            await (new Promise( (resolve, reject) => {
                        stream.pipe(csv.parse({headers: true, trim: true}))
                            .on('data', (data: CSV_ROW) => {
                                csv_data.push(data)
                            })
                            .on('error', reject)
                            .on('finish', resolve);
                        }))
        } catch (error) {
            throw new HttpException(`invalid csv: ${error}`, HttpStatus.NOT_ACCEPTABLE);
        }
        
        return this.movieReportService.predictRatings(movie_id, csv_data);
    }

    


    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file'))
    // uploadFile(@UploadedFile() file: Express.Multer.File) {
    //     console.log(file);
    //     return 'got query';
    // }
 
   
}
