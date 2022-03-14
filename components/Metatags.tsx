import img from "@public/isotipo.png";
import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  ogEndpoint?: string;
  ogType?: "article" | "profile";
  articleAuthor?: string;
  articleTag?: string;
  articlePublishedTime?: number;
  articleEditedTime?: number;
  profileFirstName?: string;
  profileLastName?: string;
  profileUsername?: string;
}

export default function Metatags({
  title = "RankIO - A website to track your movies' reviews.",
  description = "Join RankIO to share with your friends your opinion about movies. Rank the movies you watch and share them with everyone. Discover what others think of movies you watch.",
  image = img.src,
  ogEndpoint = "/",
  ogType,
  articleAuthor,
  articleTag,
  articlePublishedTime,
  articleEditedTime,
  profileFirstName,
  profileLastName,
  profileUsername,
}: Props) {
  const ogURL = "https://rankio.bepi.tech" + ogEndpoint;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="reviews, ranks, ranks, tierlist, movies, ranking, rankings, movie, TV show, cinema, films, films, personal, letterboxd"
      />
      <meta name="author" content="Rodrigo Bestard Pino" />
      <meta name="copyright" content="BePi" />
      <meta name="robots" content="index" />
      <link rel="canonical" href="http://rankio.bepi.tech/" />

      <meta property="og:site_name" content="RankIO" />
      <meta property="og:type" content={ogType ?? "article"} />
      {ogType === "article" && (
        <>
          <meta property="article:section" content="Cinema" />
          <meta
            property="article:author"
            content={`https://rankio.bepi.tech/${articleAuthor}`}
          />
          <meta
            property="article:publisher"
            content={`https://rankio.bepi.tech/${articleAuthor}`}
          />
          <meta
            property="article:published_time"
            content={new Date(articlePublishedTime!).toISOString()}
          />
          <meta
            property="article:modified_time"
            content={new Date(articleEditedTime!).toISOString()}
          />
          <meta property="article:tag" content={articleTag} />
        </>
      )}
      {ogType === "profile" && (
        <>
          <meta property="profile:first_name" content={profileFirstName} />
          <meta property="profile:last_name" content={profileLastName} />
          <meta property="profile:username" content={profileUsername} />
        </>
      )}
      <meta property="og:url" content={ogURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta
        name="twitter:card"
        content={ogType === "article" ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:site" content="@rbestardpino" />
      <meta name="twitter:creator" content="@rbestardpino" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
