import { Module } from '@nestjs/common';
import { EmitGateway } from './emit.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { GameService } from './game.service';

@Module({

	imports: [AuthModule],
	providers: [
		GameService,
		EmitGateway,
	],
	exports: [GameService],
})
export class GameModule { }
