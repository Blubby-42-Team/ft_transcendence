<script setup lang="ts">

// const viewnotificationRef = ref();
// const viewnotificationButtonRef = ref();

// const testButton = () => viewnotificationButtonRef;

const { primaryUser } = useUserStore();

async function logout() {
	await fetchLogout();
	navigateTo("/login");
}

</script>

<template>
	<div class="absolute right-0 flex flex-row-reverse h-16 p-3 bg-color1 rounded-bl-xl" id="additionalHeaderButton">
		<GenericNuxtLink to="/profile" class="self-center w-12 h-12 border-none rounded-full hover:border-none" :buttonStyle="1">
			<GenericProfilePicture class="w-full h-full hover:border-none" :imageSrc="primaryUser.avatar"/>
		</GenericNuxtLink>
		<GenericButton class="self-center w-12 h-12 mr-2 rounded-xl" :buttonStyle="1"
			@click="logout"
		>
			<Icon name="material-symbols:logout" class="w-full h-full"/>
		</GenericButton>

		<!-- <div class="mx-8"/> -->
		
		<!-- <GenericButton ref="viewnotificationButtonRef" class="self-center w-12 h-12 mr-2 rounded-full" :buttonStyle="1" :disabled="false" :selected="false"
			@click="viewnotificationRef?.open"
		>
			<Icon name="material-symbols:notifications" class="w-full h-full"/>
		</GenericButton>
		<GenericSideMenu ref="viewnotificationRef" direction="bottom" alignDirection="left" :accessRef="testButton">
			<div class="bg-blue-100">
				<ProfileContextMenu :userId="42"/>
			</div>
		</GenericSideMenu> -->
	</div>
</template>