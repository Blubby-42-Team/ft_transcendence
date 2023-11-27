import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from '../../../model/stats/stats.class';
import { ModelStatsService } from 'src/model/stats/stats.service';


@Injectable()
export class PostgresStatsService {

	constructor (
		@InjectRepository(Stats) private readonly statsRepository: Repository<Stats>,
	) {}
	
	private readonly logger = new Logger(ModelStatsService.name);

	/**
	 * Get stats by user id
	 * @param userId id of user
	 * @returns `Promise` stats
	 * @throws `NotFoundException` if stats of user not found
	 * @throws `InternalServerErrorException` if db error
	 */
	async getStatsByUserId(userId: number): Promise<Stats> {
		return this.statsRepository.query(`
			SELECT s.*
			FROM public.user as u
			LEFT JOIN public.stats AS s
			ON u.id = $1`,
			[userId],
		)
		.catch((err) => {
			this.logger.debug(`Failed to get stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to get stats by user id ${userId}`);
		})
		.then((res): Stats => {
			if (res.length === 0) {
				this.logger.debug(`Failed to get stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to get stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to get stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to get stats by user id ${userId}: too many results`);
			}
			return res[0];
		})
	}
	
	async addPlayedMatch(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET played_matchs = played_matchs + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addClassicWon(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET classic_match_won = classic_match_won + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addClassicLose(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET classic_match_lost = classic_match_lost + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addClassicPointWon(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET classic_match_point_won = classic_match_point_won + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addClassicPointLost(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET classic_match_point_lost = classic_match_point_lost + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addRandomWon(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET random_match_won = random_match_won + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addRandomLose(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET random_match_lost = random_match_lost + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addRandomPointWon(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET random_match_point_won = random_match_point_won + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async addRandomPointLost(userId: number) {
		return this.statsRepository.query(`
			UPDATE public.stats
			SET random_match_point_lost = random_match_point_lost + 1
			FROM public.user as u
			WHERE u.id = $1`,
			[userId],
		)
		.catch((err)=> {
			this.logger.debug(`Failed to update stats by userId ${userId}: ${err}`);
			throw new InternalServerErrorException(`Failed to update stats by user id ${userId}`);
		})
		.then((res) => {
			if (res.length === 0) {
				this.logger.debug(`Failed to update stats by userId ${userId}: not found`);
				throw new NotFoundException(`Failed to update stats by user id ${userId}: not found`);
			}
			if (res.length > 1) {
				this.logger.debug(`Failed to update stats by userId ${userId}: too many results`);
				throw new InternalServerErrorException(`Failed to update stats by user id ${userId}: too many results`);
			}
		})
	}

	async ModifyClassicMMR(userId: number) {
		//TODO faire le MMR classique
	}

	async ModifyRandomMMR(userId: number) {
		//TODO faire le MMR Random
	}
}

