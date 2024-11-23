
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase.service.js";

export const loginUserOnAuth = async (email, password) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        return userCredentials
    } catch (e) {
        throw new Error(e.code)
    }
}

export const logoutUserOnAuth = async () => {
    try {
        await signOut(auth)
    } catch (e) {
        console.error(e.message, e.code)
    }
}

export const registerUserOnAuth = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    } catch (e) {
        console.error(e.message, e.code)
    }
}

export const validateAuth = (callback) => {
    const unsubscribe = onAuthStateChanged(auth, (userCredentials) => {
        callback(userCredentials)
    })
    return unsubscribe;
}