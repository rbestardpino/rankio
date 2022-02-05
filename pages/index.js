import Metatags from "@components/Metatags";
import { Button, Container } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  return (
    <main>
      <Metatags></Metatags>
      <Container sx={{ mt: 4 }}>
        <Button variant="outlined" color="inherit" href="/rate">
          Rate a movie
        </Button>
      </Container>
    </main>
  );
}
