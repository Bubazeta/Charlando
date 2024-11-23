import { ref } from 'vue';
import { getProfileUserByUIDFromFirestore, createProfileUserOnFirestore, updateProfileUserOnFirestore } from '@/services/profile.service';

const userProfile = ref(null);

const useProfile = () => {

	const createProfile = async (userData) => {
		const newProfile = {
			uid: userData.uid,
			email: userData.email,
			name: userData.name,
			profilePhoto: '',
			bio: '',
			followers: [],
			follows: [],
		}
		await createProfileUserOnFirestore(newProfile);
	}

	const updateProfile = async (newUserData) => {
		try {
			await updateProfileUserOnFirestore(newUserData);
		} catch (e) {
			console.log(e.message, e.code);
		}
	}

	const fetchProfileUserByUID = async (userUID) => {
		const userProfile = await getProfileUserByUIDFromFirestore(userUID);
		return userProfile;
	}

	return {
		userProfile,
		createProfile,
		fetchProfileUserByUID,
		updateProfile,
	}
}

export default useProfile;