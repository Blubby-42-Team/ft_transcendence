import { Module } from '@nestjs/common';
import { PostgresMessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../../../model/messages/messages.class';

@Module({
	providers: [PostgresMessagesService],
	imports: [TypeOrmModule.forFeature([Messages])],
	exports: [PostgresMessagesService],
})
export class PostgresMessagesModule {}
