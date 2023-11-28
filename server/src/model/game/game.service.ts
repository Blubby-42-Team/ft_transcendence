/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameService } from 'src/service/game/game.service';

@Injectable()
export class ModelGameService {

	constructor(
		gameservice: GameService,
	) {}

}