import { Module } from '@nestjs/common';
import { ModelPictureService } from './picture.service';
import { PostgresPictureModule } from 'src/service/postgres/picture/picture.module';

@Module({
	imports: [PostgresPictureModule],
	providers: [ModelPictureService],
	exports: [ModelPictureService]
})
export class ModelPictureModule {}
