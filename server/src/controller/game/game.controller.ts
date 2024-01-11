import { Controller } from '@nestjs/common';
import { ModelGameService } from 'src/model/game/game.service';

@Controller('game')
export class GameController {
	constructor (
		private readonly modelGameService: ModelGameService,
	) {}
}
