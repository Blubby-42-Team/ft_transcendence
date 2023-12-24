/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelChatService } from './chat.service';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';

@Module({
	imports: [PostgresChatModule,PostgresUserModule],
	providers: [ModelChatService],
	exports: [ModelChatService]
})
export class ModelChatModule {}
