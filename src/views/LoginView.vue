<script setup>
import { ref, watchEffect } from 'vue';
import useAuth from '@/composables/useAuth';
import { useRouter } from 'vue-router'

const { userAuthenticated } = useAuth()
const router = useRouter();
const { login } = useAuth();
const userCredentials = ref({
	email: '',
	password: ''
})

const errors = {
	['auth/invalid-credential']: 'Email o contraseña incorrectos'
}
const errorWarning = ref('')

async function handlerSubmitLogin() {
	try {
		const { email, password } = userCredentials.value;
		await login(email, password);
		userCredentials.value = {
			email: '',
			password: ''
		}
	} catch (error) {
		console.warn(error.message);
		if(error.message === 'auth/invalid-credential') {

			errorWarning.value = errors[error.message];
		}

		setTimeout(() => {
			errorWarning.value = '';
		}, 3000)

	}
}

watchEffect(() => {
	if (userAuthenticated.value) router.push({ name: 'post' });
})

</script>

<template>
	<div class=" mx-auto p-8 mt-16 bg-pastel-blue-200 rounded-lg shadow-lg w-[800px] max-w-full m-auto h-full">
		<h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h1>

		<form @submit.prevent="handlerSubmitLogin" class="flex flex-col gap-6 ">
			<!-- EMAIL -->
			<div class="flex flex-col w-full items-center">
				<label for="email"
					class="text-gray-700 font-medium mb-1 text-start w-full max-w-[500px]">Email</label>
				<input v-model="userCredentials.email" type="email" id="email"
					placeholder="Correo Electrónico" required
					class="border border-gray-300 rounded-lg p-2 text-gray-700 max-w-[500px] w-full focus:outline-none focus:border-mint-green-500" />
			</div>

			<!-- PASSWORD -->
			<div class="flex flex-col w-full items-center">
				<label for="password"
					class="text-gray-700 font-medium mb-1 text-start w-full max-w-[500px]">Contraseña</label>
				<input v-model="userCredentials.password" type="password" id="password"
					placeholder="Contraseña" required
					class=" border border-gray-300 rounded-lg p-2 text-gray-700 max-w-[500px] w-full focus:outline-none focus:border-mint-green-500" />
			</div>

			<p v-if="errorWarning.length" class="text-center text-red-700">{{ errorWarning }}</p>

			<!-- BOTÓN DE LOGIN -->
			<div class="flex justify-center">
				<button type="submit"
					class="bg-pastel-blue-500 text-black px-6 py-2 rounded-lg shadow-md hover:bg-mint-green-500 transition-colors font-semibold hover:bg-[#E1D4F5]">
					Iniciar Sesión
				</button>
			</div>
		</form>
	</div>
</template>