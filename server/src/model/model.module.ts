/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ModelUserModule } from './user/user.module';
import { ModelSettingsModule } from './settings/settings.module';
import { ModelStatsModule } from './stats/stats.module';
import { ModelHistoryModule } from './history/history.module';
import { ModelMessagesModule } from './messages/messages.module';
import { ModelChatModule } from './chat/chat.module';
import { ModelMuteModule } from './mute/mute.module';
import { ModelPictureModule } from './picture/picture.module';
import { ModelMessageBrokerModule } from './message-broker/message-broker.module';

@Module({
	imports: [
		ModelUserModule,
		ModelSettingsModule,
		ModelStatsModule,
		ModelHistoryModule,
		ModelMessagesModule,
		ModelChatModule,
   		ModelMuteModule,
		ModelPictureModule,
		ModelMuteModule,
		ModelMessageBrokerModule,
	],
	controllers: [],
	providers: [],
})
export class ModelModule { }
