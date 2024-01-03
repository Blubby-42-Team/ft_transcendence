import { SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
	undefined,
})

export class AdminGateway {
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(AdminGateway.name);

	constructor(
		private readonly ConfigService: ConfigService,
	) { }

	async afterInit() {

		const password = this.ConfigService.get<string>('WS_ADMIN_PASSWORD');
		if (password === undefined) {
			this.logger.warn('WS_ADMIN_PASSWORD is not defined, admin ui is disabled');
			return;
		}

		const saltRounds = 12;
		const passHash = await bcrypt.hash(password, saltRounds);

		const username = uuidv4();
		this.logger.log(`Socket.io Admin UI username: ${username}`);

		instrument(this.server, {
			auth: {
				type: "basic",
				username: username,
				password: passHash
			},
			mode: "development",
		});
		this.logger.log(`Socket.io Admin UI enabled`);
	}
}
