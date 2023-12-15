import { Module } from '@nestjs/common';
import { PostgresStatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from '../../../model/stats/stats.class';

@Module({
	providers: [PostgresStatsService],
	imports: [TypeOrmModule.forFeature([Stats])],
	exports: [PostgresStatsService],
})
export class PostgresStatsModule {}