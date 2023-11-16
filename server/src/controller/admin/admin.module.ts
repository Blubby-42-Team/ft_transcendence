/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AdminService } from './admin.service';
import { ModelUserModule } from 'src/model/user/user.module';
import { AdminGateway } from './admin.gateway';

@Module({
	imports: [ModelUserModule, AuthModule],
	controllers: [AdminController],
	providers: [AdminService, AdminGateway],
})
export class ControllerAdminModule { }
