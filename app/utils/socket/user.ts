import { io, Socket } from "socket.io-client";
import { UserTelemetryStatus } from "../../../libs/types/user/user";

export class SocketClientUser {
	private socket: Socket | null = null;

	constructor() {
		if (process.server){
			return ;
		}
		const config = useRuntimeConfig();
		this.socket = io(`${config.public.back.ws}/user`);

		this.socket.on('connect', () => {
			console.log('Socket.io User connected');
		});

		this.socket.on('disconnect', () => {
			console.log('Socket.io User disconnected');
		});
	}

	askForPlayerStatus(id: number){
		if (!this.socket){
			return ;
		}
		this.socket.emit('getStatusOf', {
			id,
		});
	}

	listenForPlayer(id: number, callback: (data: { status: UserTelemetryStatus }) => void){
		if (!this.socket){
			return ;
		}
		this.socket.on(`telemetry.status.${id}`, callback);
	}

	toJSON(){
		return this.socket?.id;
	}
};