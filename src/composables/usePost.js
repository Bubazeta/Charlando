import { getPostsFromFirestore, createPostInFirestore, getPostByIDFromFirestore, updatePostInFirestore } from "@/services/post.service";

const usePost = () => {
	const fetchPosts = (callback) => {
		const unsubscribe = getPostsFromFirestore(callback);
		return unsubscribe;
	}

	const fetchPostByID = async (idPost) => {
		try {
			const post = await getPostByIDFromFirestore(idPost);
			return post;
		} catch (error) {
			console.error(error.message, error.code);
		}
	}

	const createPost = async (post) => {
		try {
			await createPostInFirestore(post);
		} catch (error) {
			console.error(error);
		}
	}

	const updatePost = async (idPost, postData) => {
		try {
			await updatePostInFirestore(idPost, postData);
		} catch (error) {
			console.error(error);
		}
	}

	return {
		fetchPosts,
		createPost,
		fetchPostByID,
		updatePost,
	}
}
export default usePost
