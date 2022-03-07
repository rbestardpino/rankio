// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const isDevEnvironment = process && process.env.NODE_ENV === "development";

const prodConfig = {
  apiKey: "AIzaSyA2Fcg4cavEX6bzCorr1MQdZA8MMXrxs2s",
  authDomain: "rankio-1bbf9.firebaseapp.com",
  projectId: "rankio-1bbf9",
  storageBucket: "rankio-1bbf9.appspot.com",
  messagingSenderId: "593335153359",
  appId: "1:593335153359:web:3358149c1fc6503242fdba",
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const devConfig = {
  apiKey: "AIzaSyDmXT33MDTYxvdT8T3mUNNcgEGcsCJqB4k",
  authDomain: "rankio-dev.firebaseapp.com",
  projectId: "rankio-dev",
  storageBucket: "rankio-dev.appspot.com",
  messagingSenderId: "521263445223",
  appId: "1:521263445223:web:f567a9def604cfea6bde42",
  measurementId: "G-6TKPP40DQF",
};

// Initialize Firebase
const app = isDevEnvironment
  ? initializeApp(devConfig, "dev")
  : initializeApp(prodConfig, "prod");

export const auth = getAuth(app);
export const db = getFirestore(app);
