import { ChannelType, IMessage } from "#imports";	

export const useChannelStore = defineStore('channel', {
	state: () => ({
		_channels: {} as { [key: number]: IChannel | undefined },
	}),
	getters: {
		getChannel: (state) => (channelId: number) => computed(() => state._channels?.[channelId] ?? null),
	},
	actions: {
		fetchChannel(channelId: number){
			// TODO
		},
		changeChannelId(newChannel: IChannel){

		},
	}
})
