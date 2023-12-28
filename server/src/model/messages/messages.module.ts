/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelMessagesService } from './messages.service';
import { PostgresMessagesModule } from 'src/service/postgres/messages/messages.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';
import { PostgresMuteModule } from 'src/service/postgres/mute/mute.module';

@Module({
	imports: [PostgresMessagesModule, PostgresUserModule, PostgresChatModule, PostgresMuteModule],
	providers: [ModelMessagesService],
	exports: [ModelMessagesService]
})
export class ModelMessagesModule {}
