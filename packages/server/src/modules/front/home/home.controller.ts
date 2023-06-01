import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller('/')
export class HomeController {
  constructor() {}

  @Get()
  async home() {
    return 'hello world'
  }


}
