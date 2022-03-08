import Metatags from "@components/Metatags";
import {
  Review,
  reviewFromFirestore,
  User,
  userFromFirestore,
} from "@lib/models";
import { db } from "@lib/services/firebase";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

interface Params extends ParsedUrlQuery {
  username: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { username } = context.params as Params;

  let user;

  try {
    user = userFromFirestore(
      (
        await getDocs(
          query(collection(db, "users"), where("username", "==", username))
        )
      ).docs[0]
    );
  } catch {
    return {
      notFound: true,
    };
  }

  if (!user)
    return {
      notFound: true,
    };

  let reviews: Review[] = [];

  (await getDocs(collection(db, `users/${user.uid}/reviews`))).forEach(
    (doc) => {
      reviews.push(reviewFromFirestore(doc));
    }
  );

  return {
    props: {
      user,
      reviews,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const usernamesSnap = await getDocs(collection(db, "usernames"));

  const paths: { params: { username: string } }[] = [];
  usernamesSnap.forEach((usernameDoc) => {
    paths.push({
      params: {
        username: usernameDoc.id,
      },
    });
  });

  return {
    paths: paths,
    fallback: "blocking",
  };
};

interface Props {
  user: User;
  reviews: Review[];
}

export default function UserProfile({ user, reviews }: Props) {
  return (
    <main>
      <Metatags
        title={`@${user.username}'s profile in RankIO`}
        description={`Discover ${user.username} public profile in RankIO. Read his/her reviews on movies he/she watches and see interesting stats about it.`}
        image={user.photoURL}
        ogEndpoint={`/${user.username}`}
        ogType="profile"
        profileFirstName={user.displayName}
        profileLastName={user.displayName}
        profileUsername={user.username}
      ></Metatags>
      <Container sx={{ my: 4 }}>
        <Typography variant="h5">Name: {user.displayName}</Typography>
        <Typography variant="h5">Username: {user.username}</Typography>
        <Typography variant="h5">Reviews: {JSON.stringify(reviews)}</Typography>
      </Container>
    </main>
  );
}
