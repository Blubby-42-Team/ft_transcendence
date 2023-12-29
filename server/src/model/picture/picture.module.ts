import { Module } from '@nestjs/common';
import { ModelPictureService } from './picture.service';
import { PostgresPictureModule } from 'src/service/postgres/picture/picture.module';
import { PostgresUserModule } from 'src/service/postgres/user/user.module';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';

@Module({
	imports: [PostgresChatModule, PostgresPictureModule, PostgresUserModule],
	providers: [ModelPictureService],
	exports: [ModelPictureService]
})
export class ModelPictureModule {}
