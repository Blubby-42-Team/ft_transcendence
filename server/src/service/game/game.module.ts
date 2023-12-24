import { Module } from '@nestjs/common';
import { EmitGateway } from './emit.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { GameService } from './game.service';
import { ModelUserModule } from 'src/model/user/user.module';

@Module({

	imports: [AuthModule, ModelUserModule],
	providers: [
		GameService,
		EmitGateway,
	],
	exports: [GameService, EmitGateway],
})
export class GameModule { }
