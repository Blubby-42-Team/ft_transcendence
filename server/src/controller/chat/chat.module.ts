import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { Module } from '@nestjs/common';
import { ModelChatModule } from 'src/model/chat/chat.module';
import { ModelMuteModule } from 'src/model/mute/mute.module';
import { ModelMessageBrokerModule } from 'src/model/message-broker/message-broker.module';
import { MessageBrokerGateway } from './message-broker.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		ModelChatModule,
		ModelMuteModule,
		ModelMessageBrokerModule,
		AuthModule,
	],
	controllers: [
		ChatController,
	],
	providers: [
		ChatService,
		MessageBrokerGateway,
	],
})
export class ControllerChatModule { }
