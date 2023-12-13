<script lang="ts" setup>

import { IPlayer } from '#imports'

const props = defineProps({
	member: {
		type: Object as PropType<IPlayer>,
		required: true,
	},
});

const viewProfile = ref();

</script>

<template>
	<GenericButton class="w-full p-1" :buttonStyle="2" @click="viewProfile?.open" :id="`openProfileMessage:${props.member.id}`">
		<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
		<div class="self-center pl-2">
			{{ props.member.name }}
		</div>
		<div class="mr-auto"></div>
	</GenericButton>
	<GenericSideMenu ref="viewProfile" direction="left" alignDirection="bottom" :buttonId="`openProfileMessage:${props.member.id}`">
		<MessageProfile/>
	</GenericSideMenu>
</template>