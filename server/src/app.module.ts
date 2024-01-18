import { ControllerModule } from './controller/controller.module';
import { ModelModule } from './model/model.module';
import { Module } from '@nestjs/common';
import { ServiceModule } from './service/service.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
	imports: [
		ControllerModule,
		ModelModule,
		ServiceModule,
		AuthModule,
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
			validationSchema: Joi.object({
				/**
				 * Server configuration
				 */
				SERVER_PROTOCOL: Joi.string().default('http'),
				SERVER_HOST: Joi.string().default('localhost'),
				PORT: Joi.number().default(3000),
				CORS_ORIGINS: Joi.string().required(),
				BACK_PREFIX_IMAGE: Joi.string().required(),
				COOKIE_DOMAIN: Joi.string().required(),

				/**
				 * Postgres configuration
				 */
				POSTGRES_HOST: Joi.string().default('localhost'),
				POSTGRES_PORT: Joi.number().default(5432),
				POSTGRES_USER: Joi.string().default('test'),
				POSTGRES_PASSWORD: Joi.string().default('test'),
				POSTGRES_DB: Joi.string().required(),

				/**
				 * 42 API configuration
				 */
				API42_URL: Joi.string().default('https://api.intra.42.fr'),
				API42_APP_ID: Joi.string().required(),
				API42_APP_SECRET: Joi.string().required(),
				API42_APP_REDIRECT: Joi.string().required(),

				/**
				 * JWT configuration
				 */
				JWT_SECRET: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: true,
			},
		}),
	],
})
export class AppModule { }
