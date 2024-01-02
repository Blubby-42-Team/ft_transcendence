export const useNotifStore = defineStore('notif', {
	state: () => ({
		_lastId: 0,
		_list: [] as Array<{ id: number, message: string }>,
	}),
	getters: {
		notif: (state) => computed(() => state._list),
	},
	actions: {
		addNotif(message: string){
			if (this._list.length >= 3){
				this._list.shift();
			}
			this._list.push({
				id: this._lastId,
				message: message,
			});
			this._lastId++;
		},
		deleteNotif(id: number){
			this._list = this._list.filter((el) => el.id !== id);
		},
		executeNotif(id: number){
			console.log(id);
		},
	},
})
