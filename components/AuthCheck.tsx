import { UserContext } from "@lib/context";
import Button from "@mui/material/Button";
import { ReactElement, useContext } from "react";

interface Props {
  children: ReactElement;
  fallback?: ReactElement;
}

// Component's children only shown to logged-in users
export default function AuthCheck(props: Props) {
  const { fUser } = useContext(UserContext);

  return fUser
    ? props.children
    : props.fallback || (
        <Button fullWidth href="/login" variant="outlined" color="warning">
          You must be signed in
        </Button>
      );
}
