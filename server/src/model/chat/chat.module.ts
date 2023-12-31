/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelChatService } from './chat.service';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { PostgresMessagesModule } from 'src/service/postgres/messages/messages.module';
import { PostgresPictureModule } from 'src/service/postgres/picture/picture.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [PostgresChatModule,PostgresUserModule, PostgresMessagesModule, ConfigModule],
	providers: [ModelChatService],
	exports: [ModelChatService]
})
export class ModelChatModule {}
