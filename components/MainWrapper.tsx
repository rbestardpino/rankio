import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactElement;
  fallback?: ReactElement;
}

export default function MainWrapper(props: Props) {
  return (
    <>
      <Navbar />
      {props.children}
      <Footer />
      <Toaster />
    </>
  );
}
