import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "#ffffff",
    },
  },
  typography:{
      fontFamily: 'Nunito'
  }
});

export default theme;

// Modules
declare module "@mui/material/Slider/Slider" {
  interface SliderPropsColorOverrides {
    error: true;
    info: true;
    success: true;
    warning: true;
  }
}
