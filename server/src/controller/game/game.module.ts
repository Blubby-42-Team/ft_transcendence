/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameModule } from 'src/service/game/game.module';

@Module({
	imports: [GameModule],
	controllers: [GameController],
	providers: [GameGateway],
})
export class ControllerGameModule { }
