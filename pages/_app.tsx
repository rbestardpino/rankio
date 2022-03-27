import MainWrapper from "@components/MainWrapper";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@lib/createEmotionCache";
import theme from "@lib/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import UserProvider from "providers/UserProvider";
import * as React from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <UserProvider>
          <MainWrapper>
            <Component {...pageProps} />
          </MainWrapper>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
