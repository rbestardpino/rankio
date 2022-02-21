import Metatags from "@components/Metatags";
import { UserContext } from "@lib/context";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useContext } from "react";
import { db } from "@lib/services/firebase";
import { query, collection, getDocs, doc, getDoc } from "firebase/firestore";
import {
  Review,
  reviewFromFirestore,
  User,
  userFromFirestore,
} from "@lib/models";

interface Params extends ParsedUrlQuery {
  username: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { username } = context.params as Params;

  const user = userFromFirestore(await getDoc(doc(db, `users/${username}`)));

  if (!user)
    return {
      notFound: true,
    };

  const reviews = (
    await getDocs(query(collection(db, `users/${username}/reviews`)))
  ).docs.map(reviewFromFirestore);

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
        title={`${user?.username} | RankIO`}
        description={`${user?.username}'s public profile`}
        image={user?.photoURL}
      ></Metatags>
      <Container sx={{ my: 4 }}>
        <Typography variant="h5">Name: {user?.displayName}</Typography>
        <Typography variant="h5">Username: {user?.username}</Typography>
        <Typography variant="h5">Reviews: {JSON.stringify(reviews)}</Typography>
      </Container>
    </main>
  );
}
