export class SocketClientGame extends SocketClient {
	constructor() {
		if (process.server){
			return ;
		}
		super('game');
	}
};