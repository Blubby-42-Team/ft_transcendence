<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	}
});

const { addNewChannel, addNewProtectedChannel } = useChannelStore();

const name = ref("");
const password = ref("");
const chatType = ref(EChatType.inactive);

async function add() {
	if (name.value && name.value.length > 0) {
		switch (chatType.value) {
			case EChatType.group:
			case EChatType.public:
				{
					const channelId = await addNewChannel(name.value, chatType.value);
					navigateTo(`/messages/${channelId}`);		
				}
				break;
			case EChatType.protected:
				{
					if (password.value && password.value.length > 0){
						const channelId = await addNewProtectedChannel(name.value, password.value, chatType.value);
						navigateTo(`/messages/${channelId}`);
					}
				}
				break;
			default: break;
		}
		// console.log("searching for user: " + name.value, chatType.value);
		props.closeFunc();
	}
	name.value = "";
	password.value = "";
}

</script>

<template>
	<div class="w-[60vw] max-w-lg bg-background2 rounded-xl text-text">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<input v-model="name" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Find a new channel" />
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
			<GenericButton class="h-16 px-5" :buttonStyle="1" @click="add">Save</GenericButton>
			<GenericButton class="h-16 px-5" :buttonStyle="1" @click="props.closeFunc">Exit</GenericButton>
		</div>
	</div>
</template>