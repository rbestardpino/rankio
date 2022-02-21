import {
  Review,
  reviewFromFirestore,
  User,
  userFromFirestore,
} from "@lib/models";
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

// Custom hook to read auth record, user profile doc and user reviews
export function useUserData() {
  const [fUser] = useAuthState(auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (fUser) {
      const ref = doc(db, "users", fUser.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUser(userFromFirestore(doc));
      });
    } else {
      setUser(null);
    }

    return unsubscribe;
  }, [fUser]);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (fUser) {
      const q = query(
        collection(db, `users/${fUser.uid}/reviews`),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snap) => {
        const _reviews: Review[] = [];
        snap.forEach((doc) => {
          _reviews.push(reviewFromFirestore(doc));
        });
        setReviews(_reviews);
      });
    } else {
      setReviews([]);
    }

    return unsubscribe;
  }, [fUser]);

  return { fUser, user, reviews };
}
