import { defaultPreferences } from "@lib/preferences";
import { DocumentSnapshot, Timestamp } from "firebase/firestore";

// interfaces
export interface User {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  preferences: {
    ratingSystem: "stars" | "tierlist";
    label1: string;
    label2: string;
    label3: string;
    label4: string;
    label5: string;
    label6: string;
    label7: string;
  };
  bio: string;
}

export interface Review {
  id: string;
  author: string;
  movie: Movie;
  lastEdit: number;
  createdAt: number;
  rating: number;
  review: string;
  personalFav: boolean;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
}

// instantiator with defaults
export function defaultUser(
  user: Pick<User, "uid" | "username" | "displayName" | "photoURL">
): User {
  return {
    uid: user.uid,
    username: user.username,
    displayName: user.displayName,
    photoURL: user.photoURL,
    preferences: defaultPreferences,
    bio: "",
  };
}

export function defaultReview(
  review: Pick<
    Review,
    "author" | "id" | "movie" | "rating" | "review" | "personalFav"
  >
): Review {
  return {
    movie: {
      id: review.movie.id,
      title: review.movie.title,
      poster: review.movie.poster,
      backdrop: review.movie.backdrop,
    },
    rating: review.rating,
    review: review.review,
    author: review.author,
    id: review.movie.id,
    personalFav: review.personalFav,
    lastEdit: 0,
    createdAt: 0,
  };
}

// converters
export function movieFromJSON(movie: any): Movie {
  return {
    id: `${movie.id}`,
    poster: movie.poster,
    title: movie.language === "en" ? movie.original_title : movie.title,
    backdrop: movie.backdrop,
  };
}

export function userFromFirestore(userDoc: DocumentSnapshot): User | null {
  if (!userDoc.exists()) return null;
  const data = userDoc.data();
  return {
    uid: userDoc.id,
    displayName: data.displayName,
    photoURL: data.photoURL,
    preferences: data.preferences,
    username: data.username,
    bio: data.bio,
  };
}

export function userToFirestore(user: User) {
  return {
    displayName: user.displayName,
    username: user.username,
    photoURL: user.photoURL,
    preferences: user.preferences,
    bio: user.bio,
  };
}

export function reviewFromFirestore(reviewDoc: DocumentSnapshot): Review {
  const data = reviewDoc.data();
  return {
    id: reviewDoc.id,
    author: data?.author,
    movie: {
      id: reviewDoc.id,
      title: data?.movie.title,
      poster: data?.movie.poster,
      backdrop: data?.movie.backdrop,
    },
    rating: data?.rating,
    review: data?.review,
    personalFav: data?.personalFav,
    lastEdit: data?.lastEdit?.toMillis() || 0,
    createdAt: data?.createdAt?.toMillis() || 0,
  };
}

export function reviewToFirestore(review: Review) {
  return {
    movie: {
      title: review.movie.title,
      poster: review.movie.poster,
      backdrop: review.movie.backdrop,
    },
    rating: review.rating,
    review: review.review,
    author: review.author,
    personalFav: review.personalFav,
    createdAt: Timestamp.fromMillis(review.createdAt),
  };
}
