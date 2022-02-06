import { auth } from "@lib/services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as _signOut,
} from "firebase/auth";

export async function signInWithGoogle() {
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOut() {
  await _signOut(auth);
}
