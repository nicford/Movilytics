import { Controller, Get, Param, Query } from '@nestjs/common';
import { AudienceService } from './audience.service';
import {QueryResult} from 'pg'


@Controller('audience')
export class AudienceController {

    constructor(private audienceService: AudienceService) {}

    // localhost:3333/api/audience/segmentUsersByGenre?id=862
    @Get('segmentUsersByGenre')
    async segmentUsersByGenre(@Query('id') movie_id: number){
        const result = await this.audienceService.getSegmentationByGenre(movie_id);
        
        return result;
    }
    
    // localhost:3333/api/audience/genrePopulation?id=
    @Get('genrePopulation')
    async segmantGenre(@Query('id') movie_id: number){
        const result = await this.audienceService.getGenrePopulationAndPercentileDiff(movie_id);

        return result;
    }

}
