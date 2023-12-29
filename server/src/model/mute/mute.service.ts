import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { PostgresMuteService } from 'src/service/postgres/mute/mute.service';

@Injectable()
export class ModelMuteService {
	constructor (
		private readonly postgresMuteService: PostgresMuteService,
		private readonly postgresUserService: PostgresUserService,
		private readonly postgresChatService: PostgresChatService,
	) {}
	
	private readonly logger = new Logger(ModelMuteService.name);
	
	async muteUserById(
		userId: number,
		toMuteId: number,
		chatId: number,
		length: number,
	) {
		const toMute = await this.postgresUserService.getUserById(userId);
		const chat = await this.postgresChatService.getChatByIdSystem(chatId);
		console.log(await this.postgresChatService.isAdmin(userId, chatId), userId, chatId)
		if (!(await this.postgresChatService.isAdmin(userId, chatId)) || await this.postgresChatService.isOwner(toMuteId, chatId))
			throw new UnauthorizedException("You can't perform this action.");
		if (length < 0)
			throw new UnauthorizedException("Length has to be a positive number of minutes.")
		if (await this.postgresMuteService.isMuted(toMuteId, chatId) !== false)
			throw new UnauthorizedException("User already muted.");
		return this.postgresMuteService.muteUserById(toMute, chat, length);
	}

	async isMuted(
		userId: number,
		chatId: number,
	) {
		await this.postgresUserService.getUserById(userId);
		await this.postgresChatService.getChatByIdSystem(chatId);
		if (!await this.postgresChatService.isInChat(userId, chatId))
			throw new NotFoundException("User is not in this chat.")
		return await this.postgresMuteService.isMuted(userId, chatId)
	}
}