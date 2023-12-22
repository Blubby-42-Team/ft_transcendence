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

@Module({
	imports: [ModelUserModule, ModelSettingsModule, ModelStatsModule, ModelHistoryModule, ModelMessagesModule, ModelChatModule, ModelMuteModule],
	controllers: [],
	providers: [],
})
export class ModelModule { }
