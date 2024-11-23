
import { getFileURL, uploadFileToStorage } from '@/services/storage.service';

const useStorage = () => {
        const uploadFile = async (file, userUID) => {
                try {
                        const extension = file.name.split('.').pop();
                        const path = `users/${userUID}/profilePhoto/profilePhoto.${extension}`;
                        await uploadFileToStorage(path, file);
                        const fileURL = await getFileURL(path);
                        return fileURL;
                } catch (error) {
                        console.error("Error uploading file: ", error.message);
                }
        }
        
        return {
                uploadFile,
        }
}

export default useStorage;