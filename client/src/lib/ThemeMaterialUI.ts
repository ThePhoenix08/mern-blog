import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#6C63FF",
    },
    error: {
      main: "#F06543",
    },
    success: {
      main: "#4CB944",
    },
  },
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    darkPurple: theme.palette.augmentColor({
      color: {
        main: "#140F2D",
      },
      name: "darkPurple",
    }),
    darkPastelGreen: theme.palette.augmentColor({
      color: {
        main: "#4CB944",
      },
      name: "darkPastelGreen",
    }),
    vanilla: theme.palette.augmentColor({
      color: {
        main: "#F5EE9E",
      },
      name: "vanilla",
    }),
    tomato: theme.palette.augmentColor({
      color: {
        main: "#F06543",
      },
      name: "tomato",
    }),
    babyPowder: theme.palette.augmentColor({
      color: {
        main: "#FFFFFC",
      },
      name: "babyPowder",
    }),
  },
});

export { theme };