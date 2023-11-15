import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import tracer from './tracer';
import { ConfigService } from '@nestjs/config';

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

	app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()))

	await app.listen(
		configService.get<number>('PORT'),
		configService.get<string>('SERVER_HOST'),
	);
	logger.log(`Server running on ${configService.get<string>('SERVER_HOST')}:${configService.get<number>('PORT')}`);
}
bootstrap();
