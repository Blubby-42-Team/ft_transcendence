import { UserTelemetryStatus } from "../../../libs/types/user/user";

export class SocketClientUser extends SocketClient {
	private backlogFromBack: Array<{ id: number, callback: (status: UserTelemetryStatus) => void }> = [];
	public status: UserTelemetryStatus = UserTelemetryStatus.Online;

	constructor() {
		if (process.server){
			return ;
		}
		super('user');
		for (const elem of this.backlogFromBack){
			this.listenForPlayer(elem.id, elem.callback);
			this.askForPlayerStatus(elem.id);
		}

		this.loop(() => {
			this.emit('telemetry.status', {
				status: this.status,
			});
		});
	}



	async askForPlayerStatus(id: number): Promise<UserTelemetryStatus> {
		if (process.server){
			return UserTelemetryStatus.Offline;
		}
		else {
			const res = await this.request<{ status: UserTelemetryStatus}>('getStatusOf', { id });
			return res?.status ?? UserTelemetryStatus.Offline;
		}
	}



	listenForPlayer(id: number, callback: (status: UserTelemetryStatus) => void){
		this.on(`telemetry.status.${id}`, callback);
	}



	loop(callback: () => void){
		if (process.server){
			return ;
		}
		callback();
		setTimeout(() => this.loop(callback), 5000);
	}



	toJSON(){
		return this.socket?.id;
	}
};