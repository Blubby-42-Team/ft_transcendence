import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import tracer from './tracer';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { UserRoleType } from './auth/auth.class';
import { Roles } from './auth/role.decorator';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
	await tracer.start();

	const app = await NestFactory.create(AppModule);

	const configService: ConfigService = app.get<ConfigService>(ConfigService);

	const logger: Logger = new Logger('Main');
	
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	app.enableCors({
		origin: ["http://localhost:3000", "https://admin.socket.io"],
		credentials: true
	});

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
