import Metatags from "@components/Metatags";
import { getNReviewsOf, getUserWithUsername } from "@lib/services/db";
import { getMovie } from "@lib/services/tmdb";
import { Typography } from "@mui/material";

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

export default function UserProfile({ user, reviews }) {
  return (
    <main>
      <Metatags
        title={`${user.username} | RankIO`}
        description={`${user.username}'s public profile`}
        image={user.photoURL}
      ></Metatags>
      <Typography variant="h5">Name: {user.displayName}</Typography>
      <Typography variant="h5">Username: {user.username}</Typography>
      {/* <Typography variant="h5">Reviews: {JSON.stringify(reviews)}</Typography> */}
    </main>
  );
}
