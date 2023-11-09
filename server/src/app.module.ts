import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { AdminGateway } from './admin/admin.gateway';

@Module({
	imports: [
		GameModule,],
	controllers: [
		AppController,
		GameController],
	providers: [
		GameService, AppService, AdminGateway],
})
export class AppModule { }
