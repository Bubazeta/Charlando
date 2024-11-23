<script setup>
import usePost from '@/composables/usePost';
import { watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { fetchPostByID, updatePost } = usePost();
const post = ref(null);

const handlerSubmitToEdit = async () => {
        await updatePost(post.value.id, post.value);
};

watchEffect(async () => {
        post.value = await fetchPostByID(route.params.id);
        console.log(post.value);
});


</script>

<template>
        <h1>EDITANDO LA PUBLICACIÓN</h1>

        <form v-if="post" @submit.prevent="handlerSubmitToEdit">
                <div class="flex flex-col">
                        <label for="title">Título:</label>
                        <input type="text" id="title" v-model="post.title" class="border border-black">
                </div>
                <div class="flex flex-col">
                        <label for="content">Contenido:</label>
                        <input type="text" id="content" v-model="post.content" class="border border-black">
                </div>
                <div class="w-full">
                        <button type="submit" class="bg-gray-700 text-white p-2 rounded w-full mt-2s">Editar</button>
                </div>
        </form>
</template>