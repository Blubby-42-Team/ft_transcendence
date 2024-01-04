import { UserTelemetryStatus } from "../../../libs/types/user/user";

export class SocketClientChannel extends SocketClient {
	public status: UserTelemetryStatus = UserTelemetryStatus.Online;

	constructor() {
		if (process.server){
			return ;
		}
		super('message-broker');
	}

	listenForNewMessages(channelId: number, callback: (status: UserTelemetryStatus) => void){
		this.on(`channel-${channelId}`, callback);
	}

	toJSON(){
		return this.socket?.id;
	}
};