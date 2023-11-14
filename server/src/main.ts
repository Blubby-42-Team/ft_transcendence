import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import tracer from './tracer';

async function bootstrap() {
	await tracer.start();

	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	app.enableCors({
		origin: ["http://localhost:3000", "https://admin.socket.io"],
		credentials: true
	});

	app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()))

	await app.listen(3000);
}
bootstrap();
