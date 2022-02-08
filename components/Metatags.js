import Head from "next/head";
import img from "../public/favicon-inverted.ico";

export default function Metatags({
  title = "RankIO",
  description = "A website to track your movies' reviews",
  image = img,
}) {
  return (
    <Head>
      <title>{title}</title>

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
