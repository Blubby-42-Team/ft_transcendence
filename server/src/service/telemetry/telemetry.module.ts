import { TelemetryService } from './telemetry.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TelemetryUserEmitGateway } from './telemetry.user.gateway';

@Module({
	imports: [

	],
	controllers: [],
	providers: [
		TelemetryService,
		TelemetryUserEmitGateway,
	],
	exports: [
		TelemetryService,
	],
})
export class TelemetryModule { }
