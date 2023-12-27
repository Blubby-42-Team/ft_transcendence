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
			return fetchUser(userId, (response) => {
				this._channelList = [1, 2, 3, 4, 5, 6];
				this._shortChannels = {
					1: {
						id: 1,
						type: ChannelType.Chat,
						name: 'Chat 1',
						avatar: '/themes/anime/astolfo.jpg',
					},
					2: {
						id: 2,
						type: ChannelType.Chat,
						name: 'Chat 2',
						avatar: '/amogus.png'
					},
					3: {
						id: 3,
						type: ChannelType.Group,
						name: 'Group 1',
						avatar: '/amogus.png'
					},
					
					4: {
						id: 4,
						type: ChannelType.Friend,
						name: 'Friend 1',
						avatar: '/themes/anime/astolfo.jpg',
					},
					5: {
						id: 5,
						type: ChannelType.Friend,
						name: 'Friend 2',
						avatar: '/amogus.png'
					},
					6: {
						id: 6,
						type: ChannelType.Chat,
						name: 'Chat 3',
						avatar: '/amogus.png'
					},
				};
				updateShortUser([
					// Generate a list of 100 users randomly without automation
					...Array.from({ length: 100 }, (_, i) => ({
						id: i,
						name: `User ${i}`,
						avatar: '/amogus.png',
					}))
				])
			});
		},
		selectChannel(channelId: number){
			this._selectedChannel = channelId;
			if (channelId === 0){
				return;
			}
			return fetchUser(channelId, (response) => {
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
