import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Footer() {
  const { asPath } = useRouter();
  return (
    <AppBar
      position={asPath === "/" ? "fixed" : "sticky"}
      sx={asPath === "/" ? { top: "auto", bottom: 0 } : {}}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        textAlign="center"
      >
        <Grid item xs mx={1}>
          <List>
            <ListItemText>
              <Typography variant="subtitle2" color="yellow">
                RankIO
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant="caption">
                A website to track your movies&apos; reviews
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant="caption">Copyright (c) 2022 BePi</Typography>
            </ListItemText>
          </List>
        </Grid>
        <Grid item xs mx={1}>
          <List>
            <ListItemText>
              <Link href="https://bepi.tech" passHref>
                <Typography variant="caption" sx={{ cursor: "pointer" }}>
                  About
                </Typography>
              </Link>
            </ListItemText>
            <ListItemText>
              <Link href="https://github.com/bepi-tech/rankio" passHref>
                <Typography variant="caption" sx={{ cursor: "pointer" }}>
                  Source code
                </Typography>
              </Link>
            </ListItemText>
            <ListItemText>
              <Link
                href="https://github.com/bepi-tech/rankio/blob/main/LICENSE"
                passHref
              >
                <Typography variant="caption" sx={{ cursor: "pointer" }}>
                  Legals
                </Typography>
              </Link>
            </ListItemText>
            <ListItemText>
              <Link href="https://www.themoviedb.org/" passHref>
                <Typography variant="caption" sx={{ cursor: "pointer" }}>
                  Movie data by TMDb
                </Typography>
              </Link>
            </ListItemText>
          </List>
        </Grid>
      </Grid>
    </AppBar>
  );
}
