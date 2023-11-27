/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ControllerAdminModule } from './admin/admin.module';
import { ControllerGameModule } from './game/game.module';
import { ControllerUserModule } from './user/user.module';
import { ControllerSettingsModule } from './settings/settings.module';
import { ControllerStatsModule } from './stats/stats.module';

@Module({
    imports: [ControllerUserModule, ControllerAdminModule, ControllerGameModule, ControllerSettingsModule, ControllerStatsModule],
    controllers: [],
    providers: [],
})
export class ControllerModule {}
