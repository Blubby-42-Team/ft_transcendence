<script lang="ts" setup>

const { selectedChannel, fetchChannelList } = useChannelStore();
const { primaryUser } = useUserStore();
await fetchChannelList(primaryUser.value.id);

const isSideMenuOpen = useState<boolean>('isSideMenuOpen', () => true);
const hasSideMenu = useState<boolean>('hasSideMenu');

</script>

<template>
	<div class="grid h-full grid-rows-[4em_1fr_max-content] overflow-hidden grid-cols-[16em,1fr,auto]">
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

				<template v-if="hasSideMenu">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="isSideMenuOpen = !isSideMenuOpen"
					>
						<Icon name="material-symbols:menu" class="w-full h-full"/>
					</GenericButton>
				</template>

				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1">
					<Icon name="material-symbols:logout" class="w-full h-full"/>
				</GenericButton>

				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1">
					<Icon name="material-symbols:search" class="w-full h-full"/>
				</GenericButton>
				
				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1">
					<Icon name="material-symbols:add" class="w-full h-full"/>
				</GenericButton>
			</Teleport>
		</ClientOnly>
	</div>
</template>