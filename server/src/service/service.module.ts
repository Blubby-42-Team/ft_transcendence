import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { GameModule } from './game/game.module';

@Module({
	imports: [
		PostgresModule,
		GameModule,
	],
})
export class ServiceModule {}
