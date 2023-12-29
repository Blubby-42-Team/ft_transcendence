import { Module } from '@nestjs/common';
import { PostgresMuteService } from './mute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mute } from '../../../model/mute/mute.class';

@Module({
	providers: [PostgresMuteService],
	imports: [TypeOrmModule.forFeature([Mute])],
	exports: [PostgresMuteService],
})
export class PostgresMuteModule {}