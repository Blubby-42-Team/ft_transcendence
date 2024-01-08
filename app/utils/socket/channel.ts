export class SocketClientChannel extends SocketClient {
	constructor() {
		if (process.server){
			return ;
		}
		super('message-broker');
	}

	async subscribeToChannel(channelId: number, callback: () => void){
		const res = await this.request<WS<{listenTo: string}>>('subcribe-to', {
			chatId: channelId,
		})
		.catch((err) => {
			return null;
		});
		if (!res || res.status !== 'ok'){
			throw new Error("Error while subscribing to channel");
		}
		this.on(res?.message?.listenTo, callback);
	}
};