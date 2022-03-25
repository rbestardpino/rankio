import styles from "@components/Loader.module.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import logo from "@public/icons/isotipo.svg";
import Image from "next/image";

export default function Loader() {
  return (
    <main>
      <Container sx={{ my: 15 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Image
              src={logo}
              alt="loader spinning logo"
              className={styles.rotate}
            ></Image>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
