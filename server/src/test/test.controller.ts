/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TestGuard } from './test.guard';
import { log } from 'console';

@Controller('/test')
export class TestController {

	@Get()
	@UseGuards(new TestGuard())
	test() {
		return 'Test';
	}

	@Get('/id/:id')
	@UseGuards(new TestGuard())
	test1 (@Param('id') param: string): string {
		return `User ${param}`;
	}

	@Get('nonasync')
	@UseGuards(new TestGuard())
	test2 (): object {
		log("Start")
		const resJson = fetch("https://hub.dummyapis.com/delay?seconds=4")
		.then((res: Response) => {
			return res;
		})
		return resJson;
	}

	@Get('async')
	@UseGuards(new TestGuard())
	async test3 (): Promise<object> {
		log("Start")
		const resJson = await fetch("https://hub.dummyapis.com/delay?seconds=4")
		return resJson;
	}
}

