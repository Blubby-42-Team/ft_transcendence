/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ControllerAdminModule } from './admin/admin.module';
import { ControllerUserModule } from './user/user.module';
import { ControllerSettingsModule } from './settings/settings.module';
import { ControllerStatsModule } from './stats/stats.module';
import { ControllerHistoryModule } from './history/history.module';
import { ControllerMessagesModule } from './messages/messages.module';
import { ControllerChatModule } from './chat/chat.module'
import { ControllerPictureModule } from './picture/picture.module';

@Module({
    imports: [
        ControllerUserModule,
        ControllerAdminModule,
        ControllerSettingsModule,
        ControllerStatsModule,
        ControllerHistoryModule,
        ControllerMessagesModule,
        ControllerChatModule,
        ControllerPictureModule
    ],
    controllers: [],
    providers: [],
})
export class ControllerModule {}
