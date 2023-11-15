import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user/user.model';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					type: 'postgres',
					host: configService.get<string>('POSTGRES_HOST'),
					port: configService.get<number>('POSTGRES_PORT'),
					password: configService.get<string>('POSTGRES_PASSWORD'),
					username: configService.get<string>('POSTGRES_USER'),
					database: configService.get<string>('POSTGRES_DB'),
					synchronize: true,
					logging: true,
					entities: [
						User,
					],
				}
			},
		}),
	],
})
export class PostgresModule {}
