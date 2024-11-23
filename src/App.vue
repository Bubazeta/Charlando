<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
	<header>
		<NavBar />
	</header>
	<main class="h-[100dvh - 40px] max-h-full w-full flex flex-col items-center mt-3 pb-[80px]">
		<RouterView />
	</main>
	<footer class="fixed bottom-0 left-0 right-0 bg-slate-950 text-white mt-8 w-full h-[50px]">
		<p class="text-center">By: Hector Daniel Tapia</p>
	</footer>
</template>
