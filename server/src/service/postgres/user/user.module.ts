import { Module, Post } from '@nestjs/common';
import { PostgresUserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';

@Module({
	providers: [PostgresUserService],
	imports: [TypeOrmModule.forFeature([User])],
	exports: [PostgresUserService],
})
export class PostgresUserModule {}
