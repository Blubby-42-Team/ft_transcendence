import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { EmitGateway } from './emit.gateway';

@Module({
  providers: [GameService, EmitGateway],
  exports: [GameService],
})
export class GameModule {}
