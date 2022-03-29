import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import Router from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./Loader";

interface Props {
  children: ReactElement;
  fallback?: ReactElement;
}

export default function MainWrapper(props: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  if (loading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        {props.children}
        <Footer />
        <Toaster />
      </>
    );
}
