import { Module, Post } from '@nestjs/common';
import { ModelGameService } from './game.service';
import { GameModule } from 'src/service/game/game.module';
import { PostgresModule } from 'src/service/postgres/postgres.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { UserService } from 'src/controller/user/user.service';
import { ControllerStatsModule } from 'src/controller/stats/stats.module';
import { ControllerHistoryModule } from 'src/controller/history/history.module';

@Module({
	imports: [
		GameModule,
		PostgresUserModule,
		ControllerStatsModule,
		ControllerHistoryModule,
	],
	providers: [
		ModelGameService,
	],
	exports: [ModelGameService],
})
export class ModelGameModule { }
