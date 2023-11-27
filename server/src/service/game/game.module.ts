import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { EmitGateway } from './emit.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({

	imports: [AuthModule],
	providers: [GameService, EmitGateway],
	exports: [GameService],
})
export class GameModule {}
