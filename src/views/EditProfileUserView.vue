<script setup>
import useProfile from '@/composables/useProfile';
import useAuth from '@/composables/useAuth';
import { onUnmounted, ref, watch, watchEffect } from 'vue';
import LoaderComp from '@/components/LoaderComp.vue';
import { useRoute, useRouter } from 'vue-router';
import useStorage from '@/composables/useStorage';

const route = useRoute();
const router = useRouter();
const { userAuthenticated } = useAuth();
const { fetchProfileUserByUID, updateProfile } = useProfile();
const { uploadFile } = useStorage();
const userProfile = ref(null);
const loading = ref(false);
const tempPreviewImage = ref(null);
const imgSelected = ref(null);

function handlerChangeFile(event) {
        const file = event.target.files[0];
        imgSelected.value = file;
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
		tempPreviewImage.value = e.target.result;
	});
        reader.readAsDataURL(file); //funcion que convierte el archivo a base64
}

async function handlerSubmitUpdateDataProfile() {
        console.log(userProfile.value);
        // --> SE DESACTIVÓ ESTA CONFIGURACIÓN PORQUE FIREBASE BLOQUEA SUBIR EL ARCHIVO CON CORS AL SERVICIO DE STORAGE
        // if (imgSelected.value &&  tempPreviewImage.value) {
        //         userProfile.value.profilePhoto = await uploadFile(imgSelected.value, userAuthenticated.value.uid);
        // }
        if (imgSelected.value &&  tempPreviewImage.value) {
                userProfile.value.profilePhoto = tempPreviewImage.value;
        }
        await updateProfile(userProfile.value)
        console.log('Perfil actualizado');
        goBack()
}

const goBack = () => {
        router.go(-1);
}

const stop = watchEffect(async () => {
        {
                loading.value = true;
                if (userAuthenticated.value && userAuthenticated.value.uid === route.params.id) {
                        userProfile.value = await fetchProfileUserByUID(userAuthenticated.value.uid);
                } else {
                        userProfile.value = null;
                }
                loading.value = false;
        }
})

onUnmounted(() => {
        stop();
})

</script>

<template>
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Editando el Perfil</h1>
      
        <template v-if="!loading">
          <!-- FORMULARIO DE EDICIÓN DEL PERFIL -->
          <form v-if="userAuthenticated && userProfile" @submit.prevent="handlerSubmitUpdateDataProfile" class="bg-pastel-blue-300 p-6 rounded-lg shadow-lg flex flex-col gap-6 mx-auto w-[800px] max-w-full">
            <!-- FOTO DE PERFIL Y CAMBIO -->
            <div class="flex flex-wrap items-center w-full justify-around m-auto">
              <figure class="w-40 h-40 rounded-full overflow-hidden border-4 border-pastel-blue-400 shadow-lg">
                <img :src="tempPreviewImage || (userProfile.profilePhoto || 'https://placehold.co/200x200')" :alt="userProfile.name" class="w-full h-full object-cover"/>
              </figure>
              <div class="flex flex-col items-center">
                <label for="file" class="bg-mint-green-500 text-black hover:bg-[#B3C7E6] px-4 py-2 rounded-lg shadow-md hover:bg-mint-green-600 transition-colors cursor-pointer font-medium">
                  Cambiar foto
                </label>
                <input type="file" id="file" @change="handlerChangeFile" class="hidden"/>
              </div>
            </div>
            <!-- CAMPOS DE EDICIÓN -->
            <div class="flex flex-col gap-4">
                
              <!-- CAMPO DE NOMBRE -->
              <div class="flex flex-col">
                <label for="name" class="text-gray-800 font-medium mb-1">Nombre</label>
                <input v-model="userProfile.name" type="text" id="name" class="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-mint-green-500" />
              </div>
      
              <!-- CAMPO DE BIO -->
              <div class="flex flex-col">
                <label for="bio" class="text-gray-800 font-medium mb-1">Bio</label>
                <textarea v-model="userProfile.bio" id="bio" rows="3" class="resize-none border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-mint-green-500"></textarea>
              </div>
            </div>
      
            <!-- BOTÓN DE ENVÍO -->
            <div class="w-full">
              <button type="submit" class="bg-pastel-blue-600 text-black font-medium hover:bg-[#B1E1D4] w-full py-2 rounded-lg shadow-md hover:bg-mint-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Enviar
              </button>
            </div>
          </form>
      
          <!-- MENSAJE DE SIN PERMISOS -->
          <div v-else-if="!loading && !userProfile" class="text-center mt-6">
            <p class="text-gray-700">No tienes permisos para editar este perfil.</p>
            <button @click="goBack" class="mt-4 bg-pastel-blue-500 text-black px-4 py-2 rounded-lg shadow-md hover:bg-mint-green-500 transition-colors">
              Volver
            </button>
          </div>
        </template>
      
        <!-- CARGANDO -->
        <template v-else>
          <div class="h-[60dvh] w-full flex items-center justify-center">
            <LoaderComp />
          </div>
        </template>
      </template>