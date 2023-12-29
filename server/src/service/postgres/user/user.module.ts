import { Module, Post, forwardRef } from '@nestjs/common';
import { PostgresUserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { User42 } from 'src/model/user/user42.class';
import { PostgresChatModule } from '../chat/chat.module';
import { PostgresChatService } from '../chat/chat.service';
import { Chat } from 'src/model/chat/chat.class';


@Module({
	providers: [PostgresUserService, PostgresChatService],
	imports: [
		TypeOrmModule.forFeature([User, User42, Chat]),
		//TODO #79 Need to rework https://docs.nestjs.com/fundamentals/circular-dependency
		forwardRef(() => PostgresChatModule),
		// PostgresChatModule,
	],
	exports: [PostgresUserService],
  })
export class PostgresUserModule {}
