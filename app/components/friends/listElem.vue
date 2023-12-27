<script lang="ts" setup>

const props = defineProps({
	userId: {
		type: Number,
		required: true,
	},
})

const { getUser } = useUserStore()
const user = getUser(props.userId);

const viewProfile = ref()

</script>

<template>
	<GenericButton class="w-full p-1" :buttonStyle="2" @click="viewProfile?.open">
		<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
		<div class="self-center pl-2">
			{{ user.name }}
		</div>
		<div class="mr-auto"></div>
	</GenericButton>
</template>