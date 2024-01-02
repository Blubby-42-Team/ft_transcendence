<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	}
});


const input = ref("");
const password = ref("");
const chatType = ref(EChatType.inactive);

function search() {
	const userLoginName = input.value;
	input.value = "";
	if (userLoginName && userLoginName.length > 0) {
		console.log("searching for user: " + userLoginName);
		props.closeFunc();
	}
}

</script>

<template>
	<div class="w-[60vw] max-w-lg bg-background2 rounded-xl text-text">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<input v-model="input" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Find a new channel" />
			<div class="col-span-2">
				<input v-model="chatType" type="radio" id="html" :value="EChatType.group">
				<label for="html" class="ml-2">Group (Invite Only)</label>
			</div>
			<div class="col-span-2">
				<input v-model="chatType" type="radio" id="css" :value="EChatType.public">
				<label for="css" class="ml-2">Chat (Public)</label>
			</div>
			<div class="col-span-2">
				<input v-model="chatType" type="radio" id="javascript" :value="EChatType.protected">
				<label for="javascript" class="ml-2">Chat (With Password)</label>
			</div>
			<template v-if="chatType === EChatType.protected">
				<input type="password" v-model="password" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="password" />
			</template>
			<GenericButton class="h-16 px-5" :buttonStyle="1" >Save</GenericButton>
			<GenericButton class="h-16 px-5" :buttonStyle="1" @click="props.closeFunc">Exit</GenericButton>
		</div>
	</div>
</template>