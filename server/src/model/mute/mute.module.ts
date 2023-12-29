import { Module } from '@nestjs/common';
import { ModelMuteService } from './mute.service';
import { PostgresMuteModule } from 'src/service/postgres/mute/mute.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';

@Module({
	imports: [PostgresChatModule, PostgresMuteModule, PostgresUserModule],
	providers: [ModelMuteService],
	exports: [ModelMuteService]
})
export class ModelMuteModule {}
