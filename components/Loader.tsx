import styles from "@components/Loader.module.css";
import Grid from "@mui/material/Grid";
import logo from "@public/icons/isotipo.svg";
import Image from "next/image";

export default function Loader() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3} padding={2} className={styles.rotate}>
        <Image
          src={logo}
          height={150}
          width={150}
          alt="loader spinning logo"
          className={styles.zoom}
        />
      </Grid>
    </Grid>
  );
}
