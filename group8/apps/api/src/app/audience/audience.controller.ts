import { Controller, Get, Param, Query } from '@nestjs/common';
import { AudienceService } from './audience.service';
import {QueryResult} from 'pg'


@Controller('audience')
export class AudienceController {

    constructor(private audienceService: AudienceService) {}

    // localhost:3333/api/audience/
    @Get()
    async segmentUsers(){
        const result = await this.audienceService.getUserGenreMappingTable()
        
        return result.rows
    }

}
