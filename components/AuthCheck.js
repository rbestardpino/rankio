import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "@lib/context";
import { Button } from "@mui/material";

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <Button fullWidth href="/login" variant="outlined" color="warning">
          You must be signed in
        </Button>
      );
}
