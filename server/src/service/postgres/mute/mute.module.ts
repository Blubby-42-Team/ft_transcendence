import { Module } from '@nestjs/common';
import { PostgresMuteService } from './mute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mute } from '../../../model/mute/mute.class';
import { PostgresChatModule } from '../chat/chat.module';
import { PostgresUserModule } from '../user/user.module';

@Module({
	providers: [PostgresMuteService],
	imports: [TypeOrmModule.forFeature([Mute]), PostgresChatModule, PostgresUserModule],
	exports: [PostgresMuteService],
})
export class PostgresMuteModule {}