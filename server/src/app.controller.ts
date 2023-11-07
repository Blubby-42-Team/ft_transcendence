import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TestDto } from '@shared/test.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getello(@Body() test: TestDto): string {
    return this.appService.getHello();
  }
}
