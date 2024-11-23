import { onSnapshot, query, orderBy, collection, addDoc, serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase.service';

const postsCollection = collection(db, 'posts');

export const getPostsFromFirestore = (callback) => {
	try {
		const q = query(postsCollection, orderBy('createdAt', 'desc'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const postsList = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			callback(postsList);
		});
		return unsubscribe;
	} catch (error) {
		console.error(error.message);
	}
};

export const getPostByIDFromFirestore = async (idPost) => {
	try {
		const postDoc = await getDoc(doc(postsCollection, idPost));
		if (postDoc.exists()) {
			return {
				id: postDoc.id,
				...postDoc.data()
			};
		}
	} catch (error) {
		console.error(error.message);
	}
}


export const createPostInFirestore = async (post) => {
	post.createdAt = serverTimestamp();
	post.updatedAt = serverTimestamp();
	await addDoc(postsCollection, post);
}


export const updatePostInFirestore = async (idPost, postData) => {
	postData.updatedAt = serverTimestamp();
	await updateDoc(doc(postsCollection, idPost), postData);
	console.log('Post updated successfully');
}