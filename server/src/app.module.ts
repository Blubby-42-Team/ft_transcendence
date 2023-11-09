import { AdminModule } from './admin/admin.module';
import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { AdminGateway } from './admin/admin.gateway';
import { AdminController } from './admin/admin.controller';

@Module({
	imports: [
		AdminModule,
		GameModule,],
	controllers: [
		AppController,
		GameController,
		AdminController,
	],
	providers: [
		GameService, AppService, AdminGateway],
})
export class AppModule { }
