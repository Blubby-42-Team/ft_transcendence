/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserModule } from 'src/model/user/user.module';
import { AdminController } from './admin.controller';

@Module({
    imports: [UserModule],
    controllers: [AdminController],
    providers: [],
})
export class AdminModule { }
