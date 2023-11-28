import { Module } from '@nestjs/common';
import { PostgresHistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from '../../../model/history/history.class';

@Module({
	providers: [PostgresHistoryService],
	imports: [TypeOrmModule.forFeature([History])],
	exports: [PostgresHistoryService],
})
export class PostgresHistoryModule {}
