import { reviewToJSON } from "@lib/services/db";
import { auth, db } from "@lib/services/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read auth record and user profile doc and user reviews
export function useUserData() {
  const [user] = useAuthState(auth);
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/reviews`),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snap) => {
        const _reviews = [];
        snap.forEach((doc) => {
          _reviews.push(reviewToJSON(doc));
        });
        setReviews(_reviews);
      });
    } else {
      setReviews([]);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, reviews };
}
