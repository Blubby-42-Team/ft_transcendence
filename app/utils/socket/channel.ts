export class SocketClientChannel extends SocketClient {
	constructor() {
		if (process.server){
			return ;
		}
		super('message-broker');
	}

	listenForNewMessages(channelId: number, callback: () => void){
		this.on(`channel-${channelId}`, callback);
	}
};