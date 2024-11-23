import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.service";

export const createCommentInFirestore = async (postID, comment) => {
        try {
                await addDoc(collection(db, 'posts', postID, 'comments'), {
                        ...comment,
                        createdAt: serverTimestamp()
                });
        } catch (error) {
                console.error(error);
                
        }
}


export const getCommentsFromFirestore = (postID, callback) => {
        try {
                const q = query(collection(db, 'posts', postID, 'comments'), orderBy('createdAt', 'desc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                        const commentsList = snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                        }));
                        callback(commentsList);
                });
                return unsubscribe;
        } catch (error) {
                console.error(error.message);
        }
};