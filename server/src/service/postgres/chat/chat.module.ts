import { Module, forwardRef } from '@nestjs/common';
import { PostgresChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../../model/chat/chat.class';
import { PostgresUserModule } from '../user/user.module';



@Module({
	providers: [PostgresChatService],
	imports: [TypeOrmModule.forFeature([Chat]), forwardRef(() => PostgresUserModule)],
	exports: [PostgresChatService],
  })
export class PostgresChatModule {}
