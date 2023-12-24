import { Module } from '@nestjs/common';
import { ModelGameService } from './game.service';
import { GameModule } from 'src/service/game/game.module';
import { EmitGateway } from 'src/service/game/emit.gateway';

@Module({
	imports: [GameModule],
	providers: [
		ModelGameService,
		EmitGateway
	],
	exports: [ModelGameService],
})
export class ModelGameModule { }
