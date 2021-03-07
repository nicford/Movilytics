import { Controller, Get } from '@nestjs/common';

import { Message } from '@group8/api-interfaces';

import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private databaseService: DatabaseService) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }


  @Get("database")
  async testDatabase() {
    return await this.databaseService.runQuery("SELECT * FROM LINKS");
  }
}
