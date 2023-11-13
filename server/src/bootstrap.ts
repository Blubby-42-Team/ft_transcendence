import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors({
		origin: ["http://localhost:3000", "https://admin.socket.io"],
	});

	await app.listen(3000);
}
