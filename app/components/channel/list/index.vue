<script lang="ts" setup>

import { EChatType } from "#imports"

const { selectedChannel, channels } = useChannelStore()

type test = {
	type: Array<EChatType>,
	name: string,
	open: boolean,
	hasBottom: boolean,
	hasSideMenu: boolean,
	channels: Array<IShortChannel>,
	icon: string,
}

const hasSideMenu = useState<boolean>('hasSideMenu', () => false);
const types = useState((): {[key: string]: test} => ({
	friend: { type: [EChatType.friends],                     name: 'Friends', open: true,  hasBottom: true,  hasSideMenu: false, channels: [] as Array<IShortChannel>, icon: 'material-symbols:person' },
	group:  { type: [EChatType.group],                       name: 'Groups',  open: true,  hasBottom: true,  hasSideMenu: true,  channels: [] as Array<IShortChannel>, icon: 'material-symbols:diversity-4' },
	chats:  { type: [EChatType.public, EChatType.protected], name: 'Chats',   open: true,  hasBottom: false, hasSideMenu: true,  channels: [] as Array<IShortChannel>, icon: 'material-symbols:groups' },
}));

for (const key in types.value){
	types.value[key].channels = channels.value.filter((channel) => channel !== undefined && types.value[key].type.includes(channel.type));
}

watch(channels, () => {
	for (const key in types.value){
		types.value[key].channels = channels.value.filter((channel) => channel !== undefined && types.value[key].type.includes(channel.type));
	}
});

const activeType = computed(() => {
	for (const key in types.value){
		if (selectedChannel.value && types.value[key].type.includes(selectedChannel.value.type)){
			return types.value[key];
		}
	}
	return types.value[0];
})

watch(activeType, () => {
	hasSideMenu.value = activeType.value.hasSideMenu;
})

</script>

<template>
	<div class="w-full h-full overflow-x-hidden scrollbar scrollbar-w-0 bg-background1">
		<template v-for="(ctype, i) in types">
			<template v-if="ctype.channels.length > 0">
				<div class="border-b-[1px] border-background2"></div>
				
				<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
					:selected="activeType?.name === ctype?.name"
					@click="ctype.open = !ctype.open"
				>
					<Icon :name="ctype.icon" class="w-10 h-10"/>
					<div class="pl-2">{{ ctype.name }}</div>
				</GenericButton>
	
				<div class="border-b-[1px] border-background2"></div>
	
				<TransitionExpand>
					<template v-if="ctype.open">
						<div>
							<template v-for="channel in channels.filter((elem) => elem !== undefined && ctype.type.includes(elem?.type))">
								<GenericNuxtLink class="w-full px-3 py-1 place-content-start"
									:buttonStyle="2"
									:selected="channel?.id === selectedChannel?.id"
									:to="`/messages/${channel?.id ?? 0}`"
								>
									<GenericProfilePicture class="w-10 h-10" :imageSrc="channel?.avatar ?? '/pp.png'"/>
									<div class="pl-2">{{ channel?.name }}</div>
								</GenericNuxtLink>
							</template>
						</div>
					</template>
				</TransitionExpand>
			</template>
		</template>
	</div>
</template>


