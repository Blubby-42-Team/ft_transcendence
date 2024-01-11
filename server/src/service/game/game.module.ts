import { Module } from '@nestjs/common';
import { InGameGateway } from './socket/in.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { GameService } from './game.service';
import { ModelUserModule } from 'src/model/user/user.module';
import { IdManagerService } from './idManager.service';
import { OutGameGateway } from './socket/out.gateway';
import { ModelHistoryModule } from 'src/model/history/history.module';

@Module({

	imports: [
		AuthModule,
		ModelUserModule,
		ModelHistoryModule
	],
	providers: [
		GameService,
		IdManagerService,
		InGameGateway,
		OutGameGateway,
	],
	exports: [
		GameService,
	],
})
export class GameModule { }
