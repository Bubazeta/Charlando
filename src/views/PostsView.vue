<script setup>
import { ref, onBeforeUnmount } from 'vue'
import usePost from '@/composables/usePost'
import useAuth from '@/composables/useAuth';
import { RouterLink } from 'vue-router';
import useProfile from '@/composables/useProfile';
import { formatDate } from '@/helpers/timeFormat'
import useComment from '@/composables/useComment'

const { addComment, fetchComments } = useComment()
const { fetchProfileUserByUID } = useProfile();
const { userAuthenticated } = useAuth();
const { fetchPosts, createPost } = usePost();
const postsList = ref([])
const unsubscribe = ref(null);
const tempPreviewImage = ref(null);
const newPost = ref({
	title: '',
	content: '',
})

/**
 * Función para mapear los posts con los perfiles de los usuarios
 * y los comentarios de cada post con los perfiles de los usuarios
 * @param {Object} posts 
 */
const fetchPostsWithUserProfiles = async (posts) => {
	const postsWithUserData = [];
	for (const post of posts) {
		const profile = ref(null);
		profile.value = await fetchProfileUserByUID(post.authorUID);
		const commentsList = ref([]);
		const unsubscribeComments = fetchComments(post.id, async (commentsListFromDB) => {
			const commentsWithUserData = await Promise.all(commentsListFromDB.map(async (comment) => {
				const authorProfile = await fetchProfileUserByUID(comment.authorUID);
				return {
					...comment,
					authorProfile: authorProfile
				};
			}));
			commentsList.value = commentsWithUserData;
		});
		postsWithUserData.push({
			...post,
			authorProfile: profile.value,
			newComment: ref(''),
			comments: commentsList,
			unsubscribeComments
		});
	}
	postsList.value = postsWithUserData;
	console.log(postsList.value);
};

unsubscribe.value = fetchPosts((posts) => {
	fetchPostsWithUserProfiles(posts);
});

const handleChangeFile = (event) => {
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.addEventListener('load', () => {
		tempPreviewImage.value = reader.result;
		newPost.value.file = reader.result;
	});
	reader.readAsDataURL(file);
}

const handlerSubmitPost = async () => {
	if (userAuthenticated.value.uid) {
		newPost.value.authorUID = userAuthenticated.value.uid
		console.log(newPost.value)
		await createPost(newPost.value)
		tempPreviewImage.value = null
		newPost.value = {
			title: '',
			content: '',
		}
		console.log('Post creado')
	}
}

const crearComentario = async (postID, comment) => {
	if (userAuthenticated.value.uid) {
		const newComment = {
			comment: comment,
			authorUID: userAuthenticated.value.uid,
		};
		console.log('veamos lo que comentamos antes ', newComment);
		await addComment(postID, newComment);
		console.log('Comentario creado');
	}
};

onBeforeUnmount(() => {
	if (typeof unsubscribe.value === 'function') {
		unsubscribe.value();
		console.log('Unsubscribed');
	}
	postsList.value.forEach(post => {
		if (typeof post.unsubscribeComments === 'function') {
			post.unsubscribeComments();
		}
	});
});
</script>

<template>
	<h1 class="text-2xl font-semibold mb-4 text-black">Publicaciones</h1>

	<form v-if="userAuthenticated" @submit.prevent="handlerSubmitPost"
		class="flex flex-col gap-4 bg-pastel-blue-100 p-6 rounded-lg shadow-lg w-[750px] max-w-full">
		<div class="flex flex-col">
			<label for="title" class="text-lg font-medium text-black mb-1">Título</label>
			<input v-model="newPost.title" maxlength="120" type="text" id="title" class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-pastel-blue-400 transition duration-200" placeholder="Introduce un título">
		</div>
		<div class="flex flex-col">
			<label for="content" class="text-lg font-medium text-black mb-1">Contenido</label>
			<textarea v-model="newPost.content" id="content" class="border border-gray-300 rounded-lg p-2 h-28 focus:outline-none focus:border-pastel-blue-400 transition duration-200 resize-none" placeholder="Escribe el contenido aquí"></textarea>
		</div>
		<div class="w-full flex gap-2 items-center">
			<div class="flex-1 flex flex-col">
				<label for="file" class="text-lg font-medium text-black mb-1">Subir foto</label>
				<input @change="handleChangeFile" type="file" id="file" class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-pastel-blue-400 transition duration-200">
			</div>
			<figure v-if="tempPreviewImage">
				<img :src="tempPreviewImage" alt="Imagen para compartir una publicación">
			</figure>
		</div>
		<div class="w-full">
			<button :disabled="!newPost.title.length || !newPost.content.length" class="border border-gray-300 bg-pastel-blue-400 hover:bg-[#B1E1D4] text-black text-[1.09rem] font-semibold w-full p-[.6rem] rounded-lg transition-colors duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
				Enviar
			</button>
		</div>
	</form>

	<ul v-if="postsList.length > 0" class="flex flex-col gap-5 mt-8 w-[750px] max-w-full">
		<li v-for="post in postsList" :key="post.id"
			class="bg-pastel-blue-200 p-4 rounded-lg shadow-md flex flex-col gap-3">
			<!-- DATOS DEL USUARIO QUIEN PUBLICA -->
			<div class="flex items-center bg-pastel-blue-300 rounded-lg shadow-inner gap-4 w-full pt-2 pl-2 ">
				<figure class="w-[80px] h-[80px] max-w-full max-h-full min-w-20 rounded-full overflow-hidden border-2 border-pastel-blue-400 shadow-sm">
					<img :src="post.authorProfile?.profilePhoto || 'https://placehold.co/200x200'" :alt="post.authorProfile.name" class=" object-cover w-full h-full">
				</figure>
				<div class="flex flex-row  w-full gap-2">
					<RouterLink :to="{ name: 'perfil', params: { id: post.authorProfile.uid } }" class="text-purple-700 no-underline hover:text-purple-800 transition-colors font-semibold w-[300px] max-w-full">
						<h2>De: {{ post.authorProfile.name }}</h2>
					</RouterLink>
					<p class="text-sm text-gray-500 text-end pr-2 w-[300px] max-w-full">Creado el:
						{{ formatDate(new Date(post?.createdAt?.seconds) * 1000) }}
					</p>
				</div>
			</div>
			<!-- DATOS DEL POST -->
			<div class="bg-white rounded-lg shadow-sm ">
				<h3 class="text-xl font-semibold text-gray-800 p-2">{{ post.title }}</h3>
				<p class="text-base text-gray-700 pb-2 pl-2">{{ post.content }}</p>
				<figure v-if="post.file" class=" w-[400px]  h-[400px] text-center m-auto">
					<img class="max-w-full max-h-full m-auto border rounded-md" :src="post.file" :alt="post.title">
				</figure>
				
				<form v-if="userAuthenticated" @submit.prevent="(event) => crearComentario(post.id, post.newComment)" class="flex items-center justify-center gap-3 h-14">
					<input v-model="post.newComment" type="text" placeholder="Escribe un comentario..." class="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-blue-400 h-[2.3rem] w-[600px] max-w-full">
					<button type="submit" class="bg-pastel-blue-400 text-black p-2 hover:bg-[#B1E1D4] rounded-lg shadow-md hover:bg-pastel-blue-500 transition-colors w-[90px] max-w-full">
						Comentar
					</button>
				</form>
			</div>

			<!-- SECCIÓN DE COMENTARIOS (Solo Maquetación y Estilos) -->
			<div v-if="post.comments.length" class="bg-pastel-blue-100 rounded-lg shadow-inner p-2">
				<h3 class="text-lg font-semibold text-gray-700 mb-2">Comentarios</h3>
				<ul class="flex flex-col gap-3">
					<li v-for="comment in post.comments" :key="comment.id" class="bg-white rounded-lg p-2 shadow-sm">
						<div class="flex items-center gap-3">
							<figure class="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
								<img :src="comment.authorProfile.profilePhoto || 'https://placehold.co/100x100'" :alt="comment.authorProfile.name" class="w-full h-full object-cover">
							</figure>
							<div class="flex flex-col">
								<span class="font-semibold text-gray-800 text-sm">{{
									comment.authorProfile.name }}</span>
								<span v-if="comment?.createdAt"class="text-gray-500 pl-2 text-xs">
									{{formatDate(new Date(comment?.createdAt?.seconds * 1000)) }}</span>
							</div>
						</div>
						<p class="text-base text-gray-700 mt-2">{{ comment.comment }}</p>
					</li>
				</ul>
			</div>
		</li>
	</ul>
	<p v-else>No hay publicaciones</p>
</template>