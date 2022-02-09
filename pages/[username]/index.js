import Metatags from "@components/Metatags";
import { UserContext } from "@lib/context";
import { Container, Typography } from "@mui/material";
import { useContext } from "react";

// TODO: whole page
// export async function getServerSideProps({ query: urlQuery }) {
//   const { username } = urlQuery;

//   const userDoc = await getUserWithUsername(username);

//   // If no user, short circuit to 404 page
//   if (!userDoc) {
//     return {
//       notFound: true,
//     };
//   }

//   // JSON serializable data
//   let user = null;
//   let reviews = null;

//   if (userDoc) {
//     user = userDoc.data();
//     reviews = await getNReviewsOf(userDoc.id, 5);
//     if (reviews) {
//       for (const rev of reviews) {
//         rev.movie = await getMovie(rev.movie, {});
//       }
//     }
//   }

//   return {
//     props: { user, reviews: reviews }, // will be passed to the page component as props
//   };
// }

export default function UserProfile() {
  const { user, username, reviews } = useContext(UserContext);
  return (
    <main>
      <Metatags
        title={`${username} | RankIO`}
        description={`${username}'s public profile`}
        image={user?.photoURL}
      ></Metatags>
      <Container sx={{ my: 4 }}>
        <Typography variant="h5">Name: {user?.displayName}</Typography>
        <Typography variant="h5">Username: {username}</Typography>
        <Typography variant="h5">Reviews: {JSON.stringify(reviews)}</Typography>
      </Container>
    </main>
  );
}
