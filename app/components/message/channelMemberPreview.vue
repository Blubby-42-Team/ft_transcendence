<script lang="ts" setup>

import { IPlayer } from '#imports'

const props = defineProps({
	member: {
		type: Object as PropType<IPlayer>,
		required: true,
	},
});

const viewProfile = ref()

</script>

<template>
	<GenericButton class="w-full p-1" :buttonStyle="2" @click="viewProfile?.open">
		<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
		<div class="self-center pl-2">
			{{ props.member.name }}
		</div>
		<div class="mr-auto"></div>
	</GenericButton>
	<GenericContextMenu ref="viewProfile">
		<div class="w-40 p-5 bg-red-500">
			Hell WOrld {{ props.member.name }}
		</div>
	</GenericContextMenu>
</template>