import {
  Review,
  reviewFromFirestore,
  User,
  userFromFirestore,
} from "@lib/models";
import { auth, db } from "@lib/services/firebase";
import { onIdTokenChanged, User as FUser } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import nookies from "nookies";
import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext<{
  fUser: FUser | null | undefined;
  user: User | null;
  reviews: Review[];
  loading: boolean;
}>({
  fUser: null,
  user: null,
  reviews: [],
  loading: true,
});

interface Props {
  children: ReactElement;
}

export default function UserProvider(props: Props) {
  const [fUser, setFUser] = useState<FUser | null>(null);
  const [loadingF, setLoadingF] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loadingU, setLoadingU] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingR, setLoadingR] = useState(true);

  // Auth useeffect
  useEffect(() => {
    return onIdTokenChanged(auth, async (_user) => {
      if (_user) {
        const token = await _user.getIdToken();
        setFUser(_user);
        nookies.set(undefined, "token", token, { path: "/" });
      } else {
        setFUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
      }
      setLoadingF(false);
    });
  }, []);

  // User doc useeffect
  useEffect(() => {
    let unsubscribe;

    if (fUser) {
      const ref = doc(db, "users", fUser.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setLoadingU(false);
        setUser(userFromFirestore(doc));
      });
    } else {
      setLoadingU(false);
      setUser(null);
    }

    return unsubscribe;
  }, [fUser]);

  // Reviews useeffect
  useEffect(() => {
    let unsubscribe;

    if (fUser) {
      const q = query(
        collection(db, `users/${fUser.uid}/reviews`),
        orderBy("lastEdit", "desc")
      );
      unsubscribe = onSnapshot(q, (snap) => {
        const _reviews: Review[] = [];
        snap.forEach((doc) => {
          _reviews.push(reviewFromFirestore(doc));
        });
        setLoadingR(false);
        setReviews(_reviews);
      });
    } else {
      setLoadingR(false);
      setReviews([]);
    }

    return unsubscribe;
  }, [fUser]);

  return (
    <UserContext.Provider
      value={{
        fUser,
        user,
        reviews,
        loading: loadingF || loadingU || loadingR,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserContext);
}
