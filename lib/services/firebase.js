// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmXT33MDTYxvdT8T3mUNNcgEGcsCJqB4k",
  authDomain: "rankio-dev.firebaseapp.com",
  projectId: "rankio-dev",
  storageBucket: "rankio-dev.appspot.com",
  messagingSenderId: "521263445223",
  appId: "1:521263445223:web:f567a9def604cfea6bde42",
  measurementId: "G-6TKPP40DQF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
