import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from './firebase.service';

export const uploadFileToStorage = async (path, file) => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
}

export const getFileURL = async (pathFile) => {
        const storageRef = ref(storage, pathFile);
        return await getDownloadURL(storageRef);
}