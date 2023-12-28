import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { Module } from '@nestjs/common';
import { ModelChatModule } from 'src/model/chat/chat.module';
import { ModelMuteModule } from 'src/model/mute/mute.module';

@Module({
	imports: [
		ModelChatModule, ModelMuteModule
	],
	controllers: [
		ChatController,
	],
	providers: [
		ChatService,
	],
})
export class ControllerChatModule { }
