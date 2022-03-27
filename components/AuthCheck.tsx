import Button from "@mui/material/Button";
import { useUserData } from "providers/UserProvider";
import { ReactElement } from "react";

interface Props {
  children: ReactElement;
  fallback?: ReactElement;
}

// Component's children only shown to logged-in users
export default function AuthCheck(props: Props) {
  const { fUser } = useUserData();

  return fUser
    ? props.children
    : props.fallback || (
        <Button href="/" variant="outlined" color="warning">
          You must be signed in
        </Button>
      );
}
