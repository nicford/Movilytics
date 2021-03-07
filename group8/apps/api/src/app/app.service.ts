import { Injectable } from '@nestjs/common';
import { Message } from '@group8/api-interfaces';
import { Pool } from 'pg'



@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
