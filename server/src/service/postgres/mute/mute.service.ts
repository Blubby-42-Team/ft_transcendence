import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mute } from '../../../model/mute/mute.class';
import { ModelMuteService } from 'src/model/mute/mute.service';
import { PostgresChatService } from '../chat/chat.service';
import { PostgresUserService } from '../user/user.service';


@Injectable()
export class PostgresMuteService {

	constructor (
		@InjectRepository(Mute) private readonly muteRepository: Repository<Mute>,
		private readonly postgresUserService: PostgresUserService,
		private readonly postgresChatService: PostgresChatService,
	) {}
	
	private readonly logger = new Logger(ModelMuteService.name);

	async muteUserById(
		toMuteId: number,
		chatId: number,
		length: number,
	) {
		const mute = new Mute;
		mute.user = await this.postgresUserService.getUserById(toMuteId);
		mute.chat = await this.postgresChatService.getChatByIdSystem(chatId);
		mute.muteUntil = new Date(Date.now() + length * 60000);
		this.muteRepository.save(mute)
		.catch(err => {throw err})
		.then(() => {return 'ok'});
	}

	async isMuted(
		userId: number,
		chatId: number,
	) {
		const res = await this.muteRepository.query(`
			SELECT * FROM mute
			WHERE mute."userId" = $1
			AND mute."chatId" = $2
			`,
			[userId, chatId]
		).catch(err => {throw err})
		if (!res[0])
			return false
		else {
			const muteUntil = new Date(res[0].muteUntil);
			const now = new Date(Date.now());
			if (muteUntil > now)
				return muteUntil.toString();
			else {
				await this.muteRepository.query(`
					DELETE FROM mute
					WHERE mute."userId" = $1
					AND mute."chatId" = $2
					`,
					[userId, chatId]
				).catch(err => {throw err})
				return false
			}
		}
	}
	
}

