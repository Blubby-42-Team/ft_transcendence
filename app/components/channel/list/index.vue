<script lang="ts" setup>

import { EChatType } from "#imports"

const { selectedChannel, channels } = useChannelStore()

const hasSideMenu = useState<boolean>('hasSideMenu', () => false);
const types = useState(() => [
	{ type: [EChatType.friends],                     name: 'Friends', open: true, hasBottom: true,  hasSideMenu: false, icon: 'material-symbols:person' },
	{ type: [EChatType.group],                       name: 'Groups',  open: true, hasBottom: true,  hasSideMenu: true,  icon: 'material-symbols:diversity-4' },
	{ type: [EChatType.public, EChatType.protected], name: 'Chats',   open: true, hasBottom: false, hasSideMenu: true,  icon: 'material-symbols:groups' },
]);

watch(selectedChannel, () => {
	if (!selectedChannel.value){
		hasSideMenu.value = false;
	}
	const newSettings = types.value.find((elem) => selectedChannel.value !== null && elem.type.includes(selectedChannel.value.type)) ?? types.value[0];
	hasSideMenu.value = newSettings.hasSideMenu;
})

</script>

<template>
	<div class="w-full h-full overflow-x-hidden scrollbar scrollbar-w-0 bg-background1">
		<template v-for="ctype in types">
			<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
				:selected="selectedChannel !== null && ctype.type.includes(selectedChannel.type)"
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

			<TransitionExpand>
				<template v-if="ctype.hasBottom && ctype.open">
					<div class="pb-4 border-b-[1px] border-background2"></div>
				</template>
			</TransitionExpand>
		</template>
	</div>
</template>


