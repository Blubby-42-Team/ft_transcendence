import { Module } from '@nestjs/common';

import { GameController }		from './game.controller';
import { GameService }			from './game.service';
import { IdManagerService }		from './idManager.service';
import { InGameGateway }		from './socket/in.gateway';
import { OutGameGateway }		from './socket/out.gateway';

import { ModelUserModule }		from 'src/model/user/user.module';
import { ModelHistoryModule }	from 'src/model/history/history.module';
import { ModelMessagesModule }	from 'src/model/messages/messages.module';
import { AuthModule }			from 'src/auth/auth.module';

@Module({
	controllers: [
		GameController,
	],
	imports: [
		AuthModule,
		ModelUserModule,
		ModelHistoryModule,
		ModelMessagesModule,
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
