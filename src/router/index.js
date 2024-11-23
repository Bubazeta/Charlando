import { createRouter, createWebHistory } from 'vue-router'
import PostView from '@/views/PostsView.vue'
import useAuth from '@/composables/useAuth';
const { userAuthenticated } = useAuth();

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'post',
			component: PostView
		},
		{
			path: '/post/edit/:id',
			name: 'editarPost',
			component: () => import('../views/EditarPost.vue'),
			meta: { requiereAutenticacion: true }
		},
		{
			path: '/registro',
			name: 'registro',
			component: () => import('../views/RegistroView.vue') // lazy load (carga peresoza)
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/LoginView.vue')
		},
		{
			path: '/perfil/:id',
			name: 'perfil',
			component: () => import('@/views/ProfileView.vue'),
		},
		{
			path: '/perfil/edit/:id',
			name: 'EditarPerfil',
			component: () => import('@/views/EditProfileUserView.vue'),
			meta: { requiereAutenticacion: true }
		},
		{
			path: '/publicaciones',
			name: 'publicaciones',
			component: () => import('@/views/PostsView.vue')
		}
	]
})

router.beforeEach((to, from, next) => {
	const rutaProtegida = to.matched.some(record => record.meta.requiereAutenticacion);
	const usuarioAutenticado = userAuthenticated.value

	if (rutaProtegida && !usuarioAutenticado) {
		next('/login');
	} else {
		next();
	}
});




export default router
