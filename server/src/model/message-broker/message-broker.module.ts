import { Module } from '@nestjs/common';
import { ModelMessageBrokerService } from './message-broker.service';
import { MessageBrokerModule } from 'src/service/message-broker/message-broker.module';
import { PostgresChatModule } from 'src/service/postgres/chat/chat.module';

@Module({
	providers: [ModelMessageBrokerService],
	imports: [
		MessageBrokerModule,
		PostgresChatModule,
	],
	exports: [ModelMessageBrokerService],
})
export class ModelMessageBrokerModule {
}
