import { Module, Post } from '@nestjs/common';
import { PostgresUserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { User42 } from 'src/model/user42/user42.class';

@Module({
	providers: [PostgresUserService],
	imports: [TypeOrmModule.forFeature([User, User42])],
	exports: [PostgresUserService],
})
export class PostgresUserModule {}
