import { TestModule } from './test_tmp/test.module';
import { TestController } from './test_tmp/test.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		TestModule,],
	controllers: [
		TestController, AppController],
	providers: [
		AppService],
})
export class AppModule { }
