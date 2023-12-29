import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { GameModule } from './game/game.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
	imports: [
		PostgresModule,
		GameModule,
		TelemetryModule,
	],
})
export class ServiceModule {}
