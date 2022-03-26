import Footer from "@components/Footer";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import { auth } from "@lib/services/firebase";
import { ReactElement } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactElement;
  fallback?: ReactElement;
}

export default function MainWrapper(props: Props) {
  const [_, loading] = useAuthState(auth);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      {props.children}
      <Footer />
      <Toaster />
    </>
  );
}
