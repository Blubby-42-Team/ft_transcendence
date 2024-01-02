import { EmitMessageBrokerGateway } from './message-broker.gateway';
import { MessageBrokerService } from './message-broker.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
	imports: [],
	providers: [
		MessageBrokerService,
		EmitMessageBrokerGateway,
	],
	exports: [
		MessageBrokerService,
		EmitMessageBrokerGateway,
	],
})
export class MessageBrokerModule { }
