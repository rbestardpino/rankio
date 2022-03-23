import Footer from "@components/Footer";
// import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
// import { UserContext } from "@lib/context";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactElement;
  fallback?: ReactElement;
}

export default function MainWrapper(props: Props) {
  // const { fUser, user } = useContext(UserContext);

  // if (fUser && !user) return <Loader />;

  return (
    <>
      <Navbar />
      {props.children}
      <Footer />
      <Toaster />
    </>
  );
}
