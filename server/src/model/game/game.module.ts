import { Module } from '@nestjs/common';
import { ModelGameService } from './game.service';
import { GameModule } from 'src/service/game/game.module';

@Module({
	imports: [GameModule],
	providers: [
		ModelGameService
	],
	exports: [ModelGameService],
})
export class ModelGameModule { }
