import Loader from "@components/Loader";
import Metatags from "@components/Metatags";
import { defaultUser, userToFirestore } from "@lib/models";
import { auth, db } from "@lib/services/firebase";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import SendOutlined from "@mui/icons-material/SendOutlined";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import hero_horizontal from "@public/screenshots/hero-horizontal.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUserData } from "providers/UserProvider";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

export default function Login() {
  const { user, fUser, loading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/home");
  }, [user]);

  return loading ? (
    <Loader />
  ) : (
    <main>
      <Metatags />
      <Container sx={{ my: 5 }}>
        {fUser && !user ? <UsernameForm /> : <SignIn />}
      </Container>
    </main>
  );
}

// Sign in with Google button
function SignIn() {
  return (
    <>
      <Backdrop open sx={{ zIndex: -1 }}>
        <Box sx={{ opacity: 0.3 }}>
          <Image
            alt="hero image background"
            src={hero_horizontal}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
          />
        </Box>
      </Backdrop>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={8}>
          <Typography variant="h3" fontWeight="bold">
            Share with your friends your opinion about movies
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="warning"
            size="large"
            variant="contained"
            onClick={async () =>
              await signInWithPopup(auth, new GoogleAuthProvider())
            }
          >
            START SHARING - IT&apos;S FREE
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

// Username form
function UsernameForm() {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fUser } = useUserData();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(db, "users", fUser!.uid);
    const usernameDoc = doc(db, "usernames", username);

    // Commit both docs together as a batch write.
    const batch = writeBatch(db);

    const user = defaultUser({
      username: username,
      uid: fUser!.uid,
      displayName: fUser!.displayName!,
      photoURL: fUser!.photoURL!,
    });
    batch.set(userDoc, userToFirestore(user));
    batch.set(usernameDoc, { uid: fUser!.uid });

    await batch.commit();
  };

  const onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,25}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set username if length is < 3 OR it passes regex
    if (val.length < 3) {
      setUsername(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setUsername(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const snap = await getDoc(doc(db, "usernames", username));
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(username);
  }, [username, checkUsername]);

  return (
    <Box component="form" onSubmit={onSubmit} autoComplete="off">
      <Grid container mt={1} rowSpacing={4} direction="column">
        <Grid item xs textAlign="center">
          <Typography variant="h4">Choose an username</Typography>
        </Grid>
        <Grid item xs textAlign="center" mx={3}>
          <TextField
            autoFocus
            color={isValid ? "success" : "error"}
            sx={{ accentColor: "#ff0000" }}
            fullWidth
            id="input-username"
            label="Username"
            variant="standard"
            value={username}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs textAlign="center">
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
