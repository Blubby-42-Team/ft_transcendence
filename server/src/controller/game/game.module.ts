/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { ModelGameModule } from 'src/model/game/game.module';
import { GatewayGameService } from './gateway.game.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		ModelGameModule,
		AuthModule,
	],
	controllers: [GameController],
	providers: [
		GatewayGameService,
		GameGateway,
	],
})
export class ControllerGameModule { }
