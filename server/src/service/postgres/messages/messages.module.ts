import { Module } from '@nestjs/common';
import { PostgresMessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../../../model/messages/messages.class';
import { MessageBrokerModule } from 'src/service/message-broker/message-broker.module';

@Module({
	providers: [PostgresMessagesService],
	imports: [
		TypeOrmModule.forFeature([Messages]),
		MessageBrokerModule,
	],
	exports: [PostgresMessagesService],
})
export class PostgresMessagesModule {}
