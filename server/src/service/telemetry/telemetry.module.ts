import { TelemetryService } from './telemetry.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
	imports: [],
	controllers: [],
	providers: [
		TelemetryService,
	],
	exports: [
		TelemetryService,
	],
})
export class TelemetryModule { }
