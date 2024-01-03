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

	async askForPlayerStatus(id: number): Promise<UserTelemetryStatus> {
		if (process.server){
			return UserTelemetryStatus.Offline;
		}
		else {
			const res = await this.emit<{ status: UserTelemetryStatus}>('getStatusOf', { id });
			return res?.status ?? UserTelemetryStatus.Offline;
		}
	}

	listenForPlayer(id: number, callback: (data: { status: UserTelemetryStatus }) => void){
		this.on(`telemetry.status.${id}`, callback);
	}

	toJSON(){
		return this.socket?.id;
	}
};