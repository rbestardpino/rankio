import Metatags from "@components/Metatags";
import { UserContext } from "@lib/context";
import { signInWithGoogle } from "@lib/services/auth";
import {
  createBatch,
  getSnap,
  getUserDoc,
  getUsernamesDoc,
} from "@lib/services/db";
import {
  BadgeOutlined,
  Google,
  SendOutlined,
  ErrorOutline,
} from "@mui/icons-material";
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useContext, useState, useEffect, useCallback } from "react";

export default function Login() {
  const { user, username } = useContext(UserContext);

  if (user && username) {
    useRouter().push("/");
  }

  return (
    <main>
      <Metatags
        title="RankIO | Sign in"
        description="Sign in to your RankIO account"
      ></Metatags>

      {user && !username ? <UsernameForm /> : <SignIn />}
    </main>
  );
}

// Sign in with Google button
function SignIn() {
  return (
    <Box>
      <Grid container mt={1} spacing={4} textAlign="center">
        <Grid item xs={12}>
          <Typography variant="h4">
            Join RankIO using your Google account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Google />}
            onClick={signInWithGoogle}
          >
            JOIN
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = getUserDoc(user.uid);
    const usernameDoc = getUsernamesDoc(formValue);

    // Commit both docs together as a batch write.
    const batch = createBatch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = getUsernamesDoc(username);
        const snap = await getSnap(ref);
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <Box component="form" onSubmit={onSubmit} autoComplete="off">
      <Grid container mt={1} spacing={4} columns={1}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4">Choose an username</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center" sx={{ mx: 50 }}>
          <TextField
            autoFocus
            color={isValid ? "success" : "error"}
            sx={{ accentColor: "#ff0000" }}
            fullWidth
            id="input-username"
            label="Username"
            variant="standard"
            value={formValue}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            disabled={!isValid}
            color="success"
            type="submit"
            size="large"
            variant="outlined"
            startIcon={isValid ? <SendOutlined /> : <ErrorOutline />}
          >
            {isValid
              ? "CHOOSE"
              : loading
              ? "LOOKING UP..."
              : "USERNAME NOT AVAILABLE"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
