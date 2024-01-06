import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import * as cookieParser from 'cookie-parser';
import { AuthService } from './auth/auth.service';
import { IoAdapter } from '@nestjs/platform-socket.io';

class MyWsAdapter extends IoAdapter {
	private cors: any;

	constructor(app: INestApplication<any>) {
		super(app);
		const configService: ConfigService = app.get<ConfigService>(ConfigService);
		this.cors = configService.get<string>('CORS_ORIGINS')
	}
	create(port: number, options?: any): any {
		options = {
			...options,
			cors: {
				origin: [this.cors, 'https://admin.socket.io'],
				methods: ['GET', 'POST'],
				credentials: true,
			},
		};
		return super.create(port, options);
	}
}

async function bootstrap() {

	const app = await NestFactory.create(AppModule/*, {cors: true}*/);

	const configService: ConfigService = app.get<ConfigService>(ConfigService);

	const logger: Logger = new Logger('Main');
	
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	app.enableCors({
		origin: configService.get<string>('CORS_ORIGINS'),
		credentials: true,
	});

	app.useWebSocketAdapter(new MyWsAdapter(app));

	const reflector = app.get(Reflector);
	const authService = app.get(AuthService);

	app.useGlobalGuards(new AuthGuard(reflector, authService));

	app.use(cookieParser());

	await app.listen(
		configService.get<number>('PORT'),
		configService.get<string>('SERVER_HOST'),
	);
	logger.log(`Server running on ${configService.get<string>('SERVER_HOST')}:${configService.get<number>('PORT')}`);
}
bootstrap();
