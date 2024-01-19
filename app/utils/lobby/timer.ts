import { LobbyStatus } from "#imports";

export class SearchGame {
	public status: Ref<LobbyStatus> = ref(LobbyStatus.NOT_STARTED);
	private timer: ReturnType<typeof setTimeout> | undefined;
	
	constructor(
		private end: () => void,
	){
		// console.log("playbutton");
	};

	play(){
		this.status.value = LobbyStatus.STARTING;
		// console.log("play");
		this.timer = setTimeout(() => {
			this.status.value = LobbyStatus.STARTED;
			this.end();
		}, 5000); // TODO Change to real login with socket
	};

	cancel(){
		this.status.value = LobbyStatus.NOT_STARTED;
		// console.log("cancel");
		if (this.timer){
			clearTimeout(this.timer);
		}
	};
};