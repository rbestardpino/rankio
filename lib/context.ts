import { Review, User } from "@lib/models";
import { User as FUser } from "firebase/auth";
import { createContext } from "react";

export const UserContext = createContext<{
  fUser: FUser | null | undefined;
  user: User | null;
  reviews: Review[];
}>({
  fUser: null,
  user: null,
  reviews: [],
});
