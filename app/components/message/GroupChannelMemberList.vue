<script lang="ts" setup>
const isMembersOpen		= useState('isMembersOpen');
const { members } = useChannelStore()

</script>

<template>
	<template v-if="isMembersOpen">
		<div class="grid h-full grid-rows-[max-content,auto]" :class="(isMembersOpen ? 'w-60' : 'w-14')">
			<div class="flex p-2 bg-color1">
				<div class="flex self-center mr-auto text-3xl place-items-center">Members</div>
				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mr-0"
					@click="() => { isMembersOpen = !isMembersOpen }"
				>
					<Icon name="material-symbols:menu" class="w-full h-full"/>
				</GenericButton>
			</div>
	
			<div class="overflow-x-hidden bg-color2 scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-text scrollbar-thumb-rounded-none scrollbar-track">
				<template v-for="member in members">
					<GenericButton class="w-full p-1" :buttonStyle="2">
						<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
						<div class="self-center pl-2">
							{{ member.name }}
						</div>
						<div class="mr-auto"></div>
					</GenericButton>
				</template>
			</div>
		</div>
	</template>
	<template v-else>
		<GenericButton :buttonStyle="1" class="w-12 h-12 mt-2 mr-2"
			@click="() => { isMembersOpen = !isMembersOpen }"
		>
			<Icon name="material-symbols:menu" class="w-full h-full"/>
		</GenericButton>
	</template>
</template>


