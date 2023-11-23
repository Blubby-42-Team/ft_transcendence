/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ControllerAdminModule } from './admin/admin.module';
import { ControllerGameModule } from './game/game.module';
import { ControllerUserModule } from './user/user.module';

@Module({
    imports: [ControllerUserModule, ControllerAdminModule, ControllerGameModule],
    controllers: [],
    providers: [],
})
export class ControllerModule {}
