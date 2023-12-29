import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mute } from '../../../model/mute/mute.class';
import { ModelMuteService } from 'src/model/mute/mute.service';
import { User } from 'src/model/user/user.class';
import { Chat } from 'src/model/chat/chat.class';


@Injectable()
export class PostgresMuteService {

	constructor (
		@InjectRepository(Mute) private readonly muteRepository: Repository<Mute>,
	) {}
	
	private readonly logger = new Logger(ModelMuteService.name);

	async muteUserById(
		toMute: User,
		chat: Chat,
		length: number,
	) {
		const mute = new Mute;
		mute.user = toMute;
		mute.chat = chat;
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

