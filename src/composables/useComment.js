import { createCommentInFirestore, getCommentsFromFirestore } from '@/services/comment.service';

const useComment = () => {
        const addComment = async (postID, comment) => {
                try {
                        await createCommentInFirestore(postID, comment);
                } catch (error) {
                        console.error(error);
                }
        }

        const fetchComments = (postID, callback) => {
                const unsubscribe = getCommentsFromFirestore(postID, callback);
                return unsubscribe;
        }

        return {
                addComment,
                fetchComments,
        }
}

export default useComment;