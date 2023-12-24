import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

import { Module } from '@nestjs/common';
import { ModelMessagesModule } from 'src/model/messages/messages.module';

@Module({
	imports: [
		ModelMessagesModule
	],
	controllers: [
		MessagesController,
	],
	providers: [
		MessagesService,
	],
})
export class ControllerMessagesModule { }
