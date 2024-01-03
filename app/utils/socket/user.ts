import { UserTelemetryStatus } from "../../../libs/types/user/user";

export class SocketClientUser extends SocketClient {
	private backlogFromBack: Array<{ id: number, callback: (data: { status: UserTelemetryStatus }) => void }> = [];

	constructor() {
		if (process.server){
			return ;
		}
		super('user');
		for (const elem of this.backlogFromBack){
			this.listenForPlayer(elem.id, elem.callback);
			this.askForPlayerStatus(elem.id);
		}
	}

	askForPlayerStatus(id: number){
		this.emit('getStatusOf', {
			id,
		});
	}

	listenForPlayer(id: number, callback: (data: { status: UserTelemetryStatus }) => void){
		this.on(`telemetry.status.${id}`, callback);
	}

	toJSON(){
		return this.socket?.id;
	}
};