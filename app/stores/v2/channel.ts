import { EChatType, IShortChannel, BackChannelType, IChannel } from "#imports";	



export const useChannelStore = defineStore('channel', {
	state: () => ({
		_selectedChannel: 0,
		_channelList:   [] as Array<number>,
		_channels:      {} as { [key: number]: IChannel | undefined },
		_shortChannels: {} as { [key: number]: IShortChannel | undefined },
	}),
	getters: {
		selectedChannel: (state) => computed(() => state._channels?.[state._selectedChannel] ?? null),
		channels:        (state) => computed(() => state._channelList.map((id) => state._shortChannels[id])),
	},
	actions: {
		fetchChannelList(userId: number){
			return fetchAllChats(userId, (response) => {
				
				for (const chat of response){
					this._shortChannels[chat.id] = {
						id: chat.id,
						type: chat.type,
						name: chat.name,
						avatar: chat.chat_picture,
					};
				};
				this._channelList = response.map((chat) => chat.id);
			});
		},
		selectChannel(userId: number, channelId: number){
			this._selectedChannel = channelId;
			if (channelId === 0 || userId === 0){
				return;
			}
			const { updateShortUser } = useUserStore();
			return fetchChatsById(userId, channelId,
				(response) => {
					updateShortUser(response.users.map((user) => ({
						id: user.userId,
						name: user.userName,
						avatar: user.profile_picture,
					})))

					this._channels[channelId] = {
						id: response.id,
						name: response.name,
						type: response.type,
						avatar: response.chat_picture,
						messages: response.messages.map((message) => ({
							id: message.messageId,
							senderId: message.userId,
							message: message.content,
							time: new Date(message.date),
						})),
						members: response.users.map((user) => user.userId),
					};
				}
			);
		},
	}
})
