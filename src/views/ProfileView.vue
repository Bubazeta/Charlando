<script setup>
import useProfile from '@/composables/useProfile';
import useAuth from '@/composables/useAuth';
import { watchEffect, ref, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router'
import LoaderComp from '@/components/LoaderComp.vue';
import { formatDate } from '@/helpers/timeFormat';

const { userAuthenticated } = useAuth();
const { fetchProfileUserByUID } = useProfile();
const route = useRoute();

const loading = ref(false);
const userProfile = ref(null);

const stop = watchEffect(async () => {
	{
		if (userAuthenticated.value) {
			loading.value = true;
			userProfile.value = await fetchProfileUserByUID(route.params.id);
			loading.value = false;
		}
	}
})

onUnmounted(() => {
	stop();
})

</script>

<template>
	<h1 class="text-3xl font-semibold text-gray-800 mb-6">Perfil</h1>

	<template v-if="!loading">
		<div v-if="userProfile"
			class="w-[800px] max-w-full bg-pastel-blue-200 p-6 rounded-lg shadow-lg flex flex-col items-center gap-6">
			
			<!-- BOTÓN DE EDITAR PERFIL -->
			<RouterLink v-if="userAuthenticated?.uid === userProfile.uid"
				:to="{ name: 'EditarPerfil', params: { id: userAuthenticated.uid } }"
				class="bg-pastel-blue-500 text-black hover:bg-[#B3C7E6] px-4 py-2 rounded-lg shadow-md hover:bg-pastel-blue-600 transition-colors font-medium">
				Editar Perfil
			</RouterLink>

			<!-- FOTO DE PERFIL -->
			<figure
				class="w-40 h-40 rounded-full overflow-hidden border-4 border-pastel-blue-400 shadow-lg">
				<img :src="userProfile.profilePhoto || 'https://placehold.co/200x200'"
					:alt="userProfile.name" class="w-full h-full object-cover" />
			</figure>

			<!-- INFORMACIÓN DEL PERFIL -->
			<div class="text-center flex flex-wrap justify-center items-center w-full max-w-[800px]">
				<h2 class="text-2xl font-bold text-gray-800 max-w-[350px] w-full">{{ userProfile.name }}
				</h2>
				<p class="text-gray-600 max-w-[350px] w-full">{{ userProfile.email }}</p>
				<p class="text-gray-500 mt-2 w-full ">Biografia: {{ userProfile.bio }}</p>
			</div>

			<!-- FECHAS DE CREACIÓN Y ACTUALIZACIÓN -->
			<div v-if="userProfile" class="flex gap-8 mt-4">
				<p class="text-sm text-gray-500">
					Creado en: <span class="font-semibold">{{ formatDate(new
						Date(userProfile?.createdAt?.seconds * 1000)) }}</span>
				</p>
				<p class="text-sm text-gray-500">
					Última actualización: <span class="font-semibold">{{ formatDate(new
						Date(userProfile?.updatedAt?.seconds * 1000)) }}</span>
				</p>
			</div>
		</div>
	</template>

	<!-- CARGANDO -->
	<template v-else>
		<div class="h-[60dvh] w-full flex items-center justify-center">
			<LoaderComp />
		</div>
	</template>
</template>