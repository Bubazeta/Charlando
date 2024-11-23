import { db } from '@/services/firebase.service'
import {  doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

export const createProfileUserOnFirestore = async (newUser) => {
	try {
		newUser.createdAt = serverTimestamp();
		newUser.updatedAt = serverTimestamp();
		await setDoc(doc(db, 'profileUsers', newUser.uid), { ...newUser })
	} catch (error) {
		console.log(error.message, error.code);
	}
}

export const getProfileUserByUIDFromFirestore = async (userId) => {
	try {
		const docUser = await getDoc(doc(db, 'profileUsers', userId))
		if (docUser.exists()) {
			return docUser.data()
		}
	} catch (error) {
		console.log(error.message, error.code);
	}
}

// OJO -> una version en tiempo real para traer lo datos implementar despues
// export const getProfileUserByUIDFromFirestore = (userId) => {
// 	const docRef = doc(db, 'profileUsers', userId);
// 	onSnapshot(docRef, (docUser) => {
// 		if (docUser.exists()) {
// 			console.log('USUARIO DE LA DB', docUser.data());
// 			// Aquí puedes manejar los datos del usuario
// 		} else {
// 			console.log('No such document!');
// 		}
// 	}, (error) => {
// 		console.log(error.message, error.code);
// 	});
// };



export const updateProfileUserOnFirestore = async (userData) => {
	try {
		userData.updatedAt = serverTimestamp();
		await updateDoc(doc(db, 'profileUsers', userData.uid), userData)
	} catch (error) {
		console.log(error.message, error.code);
	}
}