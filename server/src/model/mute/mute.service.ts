import { BadGatewayException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PostgresChatService } from 'src/service/postgres/chat/chat.service';
import { PostgresUserService } from 'src/service/postgres/user/user.service';
import { Mute } from './mute.class';
import { User } from '../user/user.class';
import * as bcrypt from 'bcrypt'

@Injectable()
export class ModelMuteService {
	constructor (
		private readonly postgresMuteService: PostgresMuteService,
	) {}
	
	private readonly logger = new Logger(ModelMuteService.name);
	
	async getTimeByUser(
			userId: number,
		): {
	}
}