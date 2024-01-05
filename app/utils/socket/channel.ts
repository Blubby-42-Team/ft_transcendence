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
		});
		console.log('rere', res);
		if (!res || res.status !== 'ok'){
			throw new Error("Error while subscribing to channel");
		}
		this.on(res?.message?.listenTo, callback);
	}
};