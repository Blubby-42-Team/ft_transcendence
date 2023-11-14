import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user/user.model';

@Module({
	imports: [
	TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			password: 'test',
			username: 'test',
			database: 'test',
			synchronize: true,
			logging: true,
			entities: [
				User,
			],
		}),
	],
})
export class PostgresModule {}
