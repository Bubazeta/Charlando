<script setup>
import { ref, watchEffect } from 'vue';
import useAuth from '@/composables/useAuth';
import useProfile from '@/composables/useProfile';
import { useRouter } from 'vue-router'

const { createProfile } = useProfile();
const router = useRouter();
const { userAuthenticated, register } = useAuth();

const newUser = ref({
	name: '',
	email: '',
	password: ''
})

async function handlerSubmitRegister() {
	const { email, password } = newUser.value;
	await register(email, password); // registramos credenciales para la autenticación
	if (userAuthenticated.value) {
		newUser.value.uid = userAuthenticated.value.uid;
		await createProfile(newUser.value); // creamos el perfil del usuario
	}
	newUser.value = {
		name: '',
		email: '',
		password: ''
	}
}

watchEffect(() => {
	if (userAuthenticated.value) router.push({ name: 'post' });
})

</script>

<template>
	<div class="w-[800px] max-w-full mx-auto mt-16 p-8 bg-pastel-blue-200 rounded-lg shadow-lg ">
	  <h1 class="text-3xl font-semibold text-center text-gray-800 mb-8">Crear Cuenta</h1>
  
	  <form @submit.prevent="handlerSubmitRegister" class="flex flex-col gap-6">
		
		<!-- NOMBRE -->
		<div class="flex flex-col items-center">
		  <label for="name" class="text-gray-700 font-medium mb-1 text-start w-full max-w-[500px]">Nombre</label>
		  <input v-model="newUser.name" type="text" id="name" placeholder="Nombre completo" required class="text-start w-full max-w-[500px] border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-mint-green-500"/>
		</div>
  
		<!-- EMAIL -->
		<div class="flex flex-col items-center">
		  <label for="email" class="text-gray-700 font-medium mb-1 text-start w-full max-w-[500px]">Correo Electrónico</label>
		  <input v-model="newUser.email" type="email" id="email" placeholder="Correo Electrónico" required class="text-start w-full max-w-[500px] border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-mint-green-500"/>
		</div>
  
		<!-- CONTRASEÑA -->
		<div class="flex flex-col items-center">
		  <label for="password" class="text-gray-700 font-medium mb-1 text-start w-full max-w-[500px]">Contraseña</label>
		  <input v-model="newUser.password" type="password" id="password" placeholder="Contraseña" required class="text-start w-full max-w-[500px] border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-mint-green-500"/>
		</div>
  
		<!-- BOTÓN DE REGISTRO -->
		<div class="flex justify-center">
		  <button type="submit" class="bg-pastel-blue-500 text-black px-8 py-3 rounded-lg shadow-md hover:bg-mint-green-500 transition-colors font-semibold hover:bg-[#E1D4F5]">
			Registrarse
		  </button>
		</div>
	  </form>
	</div>
  </template>
