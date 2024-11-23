import { loginUserOnAuth, logoutUserOnAuth, validateAuth, registerUserOnAuth } from '@/services/auth.service.js';
import { onUnmounted, ref } from 'vue';

const userAuthenticated = ref(null);

const useAuth = () => {
	let unsubscribe = null;

	const login = async (email, password) => {
		try {
			await loginUserOnAuth(email, password);
		} catch (e) {
			throw new Error(e.message);
		}
	}

	const logout = async () => {
		await logoutUserOnAuth();
	}

	const register = async (email, password) => {
		await registerUserOnAuth(email, password);
	}

	unsubscribe = validateAuth((userCredential) => userAuthenticated.value = userCredential);

	onUnmounted(() => { unsubscribe() });

	return {
		userAuthenticated,
		login,
		logout,
		register,
	}
}

export default useAuth;












// -------------------------------------------------------------------------------


// import { loginUser, registerUser, logoutUser, validateLogin } from '@/services/auth.service.js';
// import { createPerfilUser, getProfileById } from '@/services/profile.service';
// import useProfile from '@/composables/useProfile';
// import { onUnmounted, ref, onMounted,onBeforeMount } from 'vue';

// const user = ref(null);
// const { get, profileUser } = useProfile();

// const useAuth = () => {
//     const login = async (email, password) => {
//         try {
//             const userCredential = await loginUser(email, password);
//             user.value = {
//                 uid: userCredential.user.uid,
//                 email: userCredential.user.email,
//             };
//             console.log(profileUser.value);
//             // Puedes cargar el perfil del usuario aquí si lo necesitas
//             // const profileUser = await get(userCredential.user.uid);
//             // user.value = profileUser;
//         } catch (e) {
//             console.log(e.message, e.code);
//         }
//     };

//     let isAuthInitialized = false;

//     // Función para inicializar la autenticación y escuchar cambios
//     const initializeAuth = async () => {
//         if (isAuthInitialized) return;
//         isAuthInitialized = true;

//         const unsubscribe = validateLogin((authUser) => {
//             if (authUser) {
//                 user.value = {
//                     uid: authUser.uid,
//                     email: authUser.email,
//                 };
//                 // Puedes cargar el perfil del usuario desde Firestore si es necesario
//                 get(authUser.uid);
//             } else {
//                 user.value = null;
//                 profileUser.value = null;
//             }
//         });

//         // Desuscripción cuando se desmonta el componente
//         onUnmounted(() => {
//             unsubscribe();
//         });
//     };

//     // Inicializa la autenticación al montar el composable
//     onMounted(() => {
//         initializeAuth();
//     });

//     const logout = async () => {
//         await logoutUser();
//         console.log('Sesión cerrada');
//         user.value = null;
//         profileUser.value = null;
//     };

//     const register = async (email, password, name) => {
//         try {
//             const userCredential = await registerUser(email, password);
//             const newUser = {
//                 uid: userCredential.user.uid,
//                 email: userCredential.user.email,
//                 name: name,
//                 profilePhoto: '',
//                 bio: '',
//                 posts: [],
//             };
//             user.value = await createPerfilUser(newUser);
//         } catch (e) {
//             console.log(e.message, e.code, "No se pudo registrar el usuario");
//         }
//     };

//     return { login, user, register, logout };
// };

// export default useAuth;
