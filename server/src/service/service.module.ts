import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { GameModule } from './game/game.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { MessageBrokerModule } from './message-broker/message-broker.module';

@Module({
	imports: [
		PostgresModule,
		GameModule,
		TelemetryModule,
		MessageBrokerModule,
	],
})
export class ServiceModule {}
