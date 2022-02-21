import img from "@public/isotipo.png";
import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

export default function Metatags({
  title = "RankIO",
  description = "A website to track your movies' reviews",
  image = img.src,
}: Props) {
  return (
    <Head>
      <title>{title}</title>

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
