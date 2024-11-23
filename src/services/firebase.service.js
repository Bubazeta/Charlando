// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHvNfG7EPtcNsTP4v3PmBjzkBl-qNYK3U",
  authDomain: "charlando-711ba.firebaseapp.com",
  projectId: "charlando-711ba",
  storageBucket: "charlando-711ba.appspot.com",
  messagingSenderId: "812064349230",
  appId: "1:812064349230:web:a1ddc3355c36cc5a57d3bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);