import { Module } from '@nestjs/common';
import { PostgresChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../../model/chat/chat.class';

@Module({
	providers: [PostgresChatService],
	imports: [TypeOrmModule.forFeature([Chat])],
	exports: [PostgresChatService],
})
export class PostgresChatModule {}
