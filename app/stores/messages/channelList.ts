export interface IChannel {
	id			: string,
	isGroup		: boolean,
	channelName	: string,
}

export const useChannelListStore = defineStore('channelList', {
	state: (): {
		_channels: Array<IChannel>;
	} => ({
		_channels: [
			{	id: '1',	isGroup: true,		channelName: 'Hello World'	}
		],
	}),
	getters: {
		channels: (state) => computed((): Array<IChannel> => state._channels),
	},
	actions: {

	}
})
