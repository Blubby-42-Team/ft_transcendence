import { Module } from '@nestjs/common';
import { PostgresPictureService } from './picture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from '../../../model/picture/picture.class';

@Module({
	providers: [PostgresPictureService],
	imports: [TypeOrmModule.forFeature([Picture])],
	exports: [PostgresPictureService],
})
export class PostgresPictureModule {}