import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from 'src/model/settings/settings.class';
import { Stats } from 'src/model/stats/stats.class';
import { User } from 'src/model/user/user.class';
import { User42 } from 'src/model/user/user42.class';
import { History } from 'src/model/history/history.class';
import { Messages } from 'src/model/messages/messages.class';
import { Chat } from 'src/model/chat/chat.class';

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
						User42,
						Settings,
						Stats,
						History,
						Messages,
						Chat,
					],
				}
			},
		}),
	],
})
export class PostgresModule {}
