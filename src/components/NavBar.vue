<script setup>
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'
import { useRouter } from 'vue-router';
const { userAuthenticated, logout } = useAuth()
const router = useRouter();
async function handlerLogout() {
	await logout()
	router.push({ name: 'login' });
}
</script>

<template>
<nav class="bg-pastel-blue-600 flex justify-between items-center h-16 text-clack px-12 shadow-md">
	<span class="flex gap-4 text-[1.05rem] font-semibold font-sans">Charlando</span>
	<ul class="flex gap-6 text-[1.05rem] font-semibold font-sans">
		<li>
			<RouterLink :to="{ name: 'post' }" class="hover:bg-[#E1D4F5] rounded-lg transition-transform duration-300 ease-out hover:scale-110 p-2 bg-pastel-blue-400 hover:bg-pastel-blue-500 text-black shadow-md hover:shadow-xl">
				Publicaciones
			</RouterLink>
		</li>
		<template v-if="userAuthenticated">
			<li>
				<RouterLink :to="{ name: 'perfil', params: { id: userAuthenticated.uid } }" class="hover:bg-[#E1D4F5] rounded-lg transition-transform duration-300 ease-out hover:scale-110 p-2 bg-pastel-blue-400 hover:bg-pastel-blue-500 text-black shadow-md hover:shadow-xl">
					Perfil
				</RouterLink>
			</li>
			<li>
				<button @click="handlerLogout" class="transition-transform duration-300 ease-out hover:scale-110 hover:text-pastel-blue-200">
					Cerrar sesión
				</button>
			</li>
		</template>
		<template v-else>
			<li>
				<RouterLink :to="{ name: 'login' }" class="hover:bg-[#E1D4F5] rounded-lg transition-transform duration-300 ease-out hover:scale-110 p-2 bg-pastel-blue-400 hover:bg-pastel-blue-500 text-black shadow-md hover:shadow-xl">
					Iniciar sesión
				</RouterLink>
			</li>
			<li>
				<RouterLink :to="{ name: 'registro' }" class="hover:bg-[#E1D4F5] rounded-lg transition-transform duration-300 ease-out hover:scale-110 p-2 bg-pastel-blue-400 hover:bg-pastel-blue-500 text-black shadow-md hover:shadow-xl">
					Registrarse
				</RouterLink>
			</li>
		</template>
	</ul>
</nav>
</template>