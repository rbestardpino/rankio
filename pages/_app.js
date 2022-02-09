import Navbar from "@components/Navbar";
import { CacheProvider } from "@emotion/react";
import { UserContext } from "@lib/context";
import createEmotionCache from "@lib/createEmotionCache";
import { useUserData } from "@lib/hooks";
import theme from "@lib/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import PropTypes from "prop-types";
import * as React from "react";
import { Toaster } from "react-hot-toast";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const userData = useUserData();
  // const userReviews = useUserReviews();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <UserContext.Provider value={userData}>
          {/* <UserReviewsContext.Provider value={userReviews}> */}
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
          {/* </UserReviewsContext.Provider> */}
        </UserContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
