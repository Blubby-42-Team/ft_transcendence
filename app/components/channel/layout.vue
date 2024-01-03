<script lang="ts" setup>

import { EChatType } from "#imports";

const { selectedChannel, fetchChannelList, activeType } = useChannelStore();
const { primaryUser } = useUserStore();
await fetchChannelList(primaryUser.value.id);

const isSideMenuOpen = useState<boolean>('isSideMenuOpen', () => true);

const openFindChannel = ref();
const openCreateChannel = ref();
const openChannelSettings = ref();
const openChannelLeave = ref();

</script>

<template>
	<div class="grid h-full grid-rows-[4rem_1fr_max-content] overflow-hidden grid-cols-[16em,1fr,auto]">
		<div class="h-16 col-span-3 p-2 text-lg bg-color1 text-text-light">
			<div class="flex items-center justify-center h-full ">
				{{ selectedChannel?.name }}
			</div>
		</div>

		<ChannelList class="row-[2_/_4] col-[1]"/>

		<slot/>

		<ChannelMembers class="row-[2_/_4] col-[3]"
			:members="selectedChannel?.members ?? []"
		/>

		<ClientOnly>
			<Teleport to="#additionalHeaderButton">
				
				<div class="mx-2 border border-text-light bg-text-light"></div>

				<template v-if="activeType.hasSideMenu">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="isSideMenuOpen = !isSideMenuOpen"
					>
						<Icon name="material-symbols:menu" class="w-full h-full"/>
					</GenericButton>
				</template>

				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
					@click="openFindChannel?.open"
				>
					<Icon name="material-symbols:search" class="w-full h-full"/>
				</GenericButton>
				<GenericModal ref="openFindChannel">
					<ChannelInteractionSearch :closeFunc="openFindChannel?.close"/>
				</GenericModal>
				
				<div class="mx-2 border border-text-light bg-text-light"></div>

				<template v-if="([EChatType.group, EChatType.protected, EChatType.public] as EChatType[]).includes(selectedChannel?.type ?? EChatType.inactive)">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
						@click="openChannelLeave?.open"
					>
						<Icon name="material-symbols:logout" class="w-full h-full"/>
					</GenericButton>
				</template>
				<GenericModal ref="openChannelLeave">
					<ChannelInteractionLeave :closeFunc="openChannelLeave?.close"/>
				</GenericModal>
				
				<template v-if="([EChatType.group, EChatType.protected, EChatType.public] as EChatType[]).includes(selectedChannel?.type ?? EChatType.inactive)">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
						@click="openChannelSettings?.open"
					>
						<Icon name="material-symbols:settings" class="w-full h-full"/>
					</GenericButton>
				</template>
				<GenericModal ref="openChannelSettings">
					<ChannelInteractionSettings :closeFunc="openChannelSettings?.close"/>
				</GenericModal>
				
				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
					@click="openCreateChannel?.open"
				>
					<Icon name="material-symbols:add" class="w-full h-full"/>
				</GenericButton>
				<GenericModal ref="openCreateChannel">
					<ChannelInteractionCreate :closeFunc="openCreateChannel?.close"/>
				</GenericModal>

			</Teleport>
		</ClientOnly>
	</div>
</template>