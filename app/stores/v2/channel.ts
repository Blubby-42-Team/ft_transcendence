import { ChannelType, IShortChannel } from "#imports";	



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
			const { updateShortUser } = useUserStore();
			return fetchAllChats(userId, (response) => {
				
				for (const chat of response){
					console.log(chat, );
					const type = (() => {
						switch (chat.type) {
							case EChatType.friends:		return ChannelType.Friend;
							case EChatType.group:		return ChannelType.Group;
							case EChatType.protected:	return ChannelType.Chat;
							case EChatType.public:		return ChannelType.Chat;
							default: return ChannelType.Chat;
						}
					})();
					this._shortChannels[chat.id] = {
						id: chat.id,
						type: type,
						name: chat.name,
						avatar: chat.chat_picture,
					};
				};
				this._channelList = response.map((chat) => chat.id);
				updateShortUser([
					// Generate a list of 100 users randomly without automation
					...Array.from({ length: 100 }, (_, i) => ({
						id: i,
						name: `User ${i}`,
						avatar: '/themes/anime/astolfo.jpg',
					}))
				])
			});
		},
		selectChannel(channelId: number){
			this._selectedChannel = channelId;
			if (channelId === 0){
				return;
			}
			return fetchTest(channelId, (response) => {
				this._channels[channelId] = {
					id: channelId,
					name: 'Chat XD',
					type: ChannelType.Chat,
					avatar: '/themes/anime/astolfo.jpg',
					messages: [],
					members: [4, 26, 69, 76, 42, 12, 36, 24, 18, 1, 2, 3, 5, 6, 7, 8, 9, 10],
				};
				const channel = this._channels[channelId];
				if (!channel){
					return;
				}
				// genreate 100 messages from members list
				for (let i = 0; i < 100; i++){
					channel.messages.push({
						id: i,
						senderId: channel.members[Math.floor(Math.random() * channel.members.length)],
						message: `Message ${i}`,
						time: new Date(),
					});
				}
			});
		},
	}
})
