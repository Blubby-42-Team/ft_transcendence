import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../../../model/history/history.class';
import { EGameType } from '@shared/types/history';
import { PostgresUserModule } from '../user/user.module';
import { User } from 'src/model/user/user.class';


@Injectable()
export class PostgresHistoryService {

	private readonly logger = new Logger(PostgresHistoryService.name);

	constructor (
		@InjectRepository(History) private readonly historyRepository: Repository<History>,
	) {}
	
	/**
	 * Get history by user id
	 * @param userId id of user
	 * @returns `Promise` history
	 * @throws `NotFoundException` if history of user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getHistoryByUserId(userId: number): Promise<History> {
		return new History
	}

	async addHistory(
		userId: number,
		opp_id: number,
		game_type: EGameType,
		player_score: number,
		opp_score: number,
		date: Date,
		duration: number,
	) {
		const player = new User()
		player.id = userId

		const match = new History;
		match.date = date;
		match.player = player
		match.duration = duration;
		match.game_type = game_type;
		match.opp_id = opp_id;
		match.opp_score = opp_score;
		match.player_score = player_score;
		
		return this.historyRepository.save(match)
		.then((res) => {
			return res.id;
		})
	}
}

