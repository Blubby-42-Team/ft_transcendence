import { Module, forwardRef } from '@nestjs/common';
import { PostgresChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../../model/chat/chat.class';
import { PostgresUserModule } from '../user/user.module';
import { MessageBrokerModule } from 'src/service/message-broker/message-broker.module';



@Module({
	providers: [PostgresChatService],
	imports: [
		TypeOrmModule.forFeature([Chat]),
		//TODO #79 Need to rework https://docs.nestjs.com/fundamentals/circular-dependency
		forwardRef(() => PostgresUserModule),
		// PostgresUserModule,
		MessageBrokerModule,
	],
	exports: [PostgresChatService],
  })
export class PostgresChatModule {}
