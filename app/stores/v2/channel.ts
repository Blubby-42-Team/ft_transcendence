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
					{
						id: 4,
						name: 'James',
						avatar: '/themes/anime/astolfo.jpg',
					},
					{
						id: 5,
						name: 'Bond',
						avatar: '/amogus.png',
					},
					{
						id: 42,
						name: 'xd',
						avatar: '/themes/anime/astolfo.jpg',
					},
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
					messages: [
						{
							id: 0,
							senderId: 42,
							message: 'Hello world!',
							time: new Date(),
						},
						{
							id: 1,
							senderId: 76,
							message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, vitae aliquam nisl nisl nec nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl. Sed vitae nisl euismod, aliquet nisl sed, aliquet nisl.',
							time: new Date(),
						},
						{
							id: 2,
							senderId: 26,
							message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
							time: new Date(),
						},
						{
							id: 23,
							senderId: 42,
							message: 'Hello world again!',
							time: new Date(),
						},
					],
					members: [4, 26, 69, 76, 42, 12, 36, 24, 18, 1, 2, 3, 5, 6, 7, 8, 9, 10],
				};
			});
		},
	}
})
