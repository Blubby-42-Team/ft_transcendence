import { io, Socket } from "socket.io-client";
import { UserTelemetryStatus } from "../../../libs/types/user/user";

export class SocketClientUser {
	private socket: Socket | null = null;
	private backlogFromBack: Array<{ id: number, callback: (data: { status: UserTelemetryStatus }) => void }> = [];

	constructor() {
		if (process.server){
			return ;
		}
		const config = useRuntimeConfig();
		this.socket = io(`${config.public.back.ws}/user`, {
			withCredentials: true
		});

		this.socket.on('connect', () => {
			console.log('Socket.io User connected');
		});

		this.socket.on('disconnect', () => {
			console.log('Socket.io User disconnected');
		});

		for (const elem of this.backlogFromBack){
			this.listenForPlayer(elem.id, elem.callback);
			this.askForPlayerStatus(elem.id);
		}
	}

	askForPlayerStatus(id: number){
		if (process.server){
		}
		else if(process.client && this.socket){
			this.socket.emit('getStatusOf', {
				id,
			});
		}
	}

	listenForPlayer(id: number, callback: (data: { status: UserTelemetryStatus }) => void){
		if (process.server){
		}
		else if(process.client && this.socket){
			this.socket.on(`telemetry.status.${id}`, callback);
		}
	}

	toJSON(){
		return this.socket?.id;
	}
};