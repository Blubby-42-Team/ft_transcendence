import { PostgresModule } from './service/postgres/postgres.module'
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
import { ServiceModule } from './service/service.module';
import { ModelModule } from './model/model.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		PostgresModule,
		AdminModule,
		GameModule,
		ServiceModule,
		ModelModule,
		AuthModule,
	],
	controllers: [
		AppController,
		GameController,
	],
	providers: [
		GameService,
		AppService,
		AdminGateway
	],
})
export class AppModule { }
