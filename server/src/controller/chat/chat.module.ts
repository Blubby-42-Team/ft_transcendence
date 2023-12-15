import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { Module } from '@nestjs/common';
import { ModelChatModule } from 'src/model/chat/chat.module';

@Module({
	imports: [
		ModelChatModule
	],
	controllers: [
		ChatController,
	],
	providers: [
		ChatService,
	],
})
export class ControllerChatModule { }
