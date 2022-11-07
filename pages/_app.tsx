import "../styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import { CssBaseline } from "@mui/material";
import { Paper } from "@mui/material";

export const ThemeContext = createContext<any>("");

export default function App({ Component, pageProps }: AppProps) {
  const [Theme, setTheme] = useState<"light" | "dark">("light");

  const values = {
    Theme: Theme,
    setTheme: setTheme,
  };
  const darktheme = createTheme({
    palette: {
      mode: Theme,
      ...(Theme === "light"
        ? {
            primary: {
              main: "hsl(233, 11%, 84%)",
            },
            background: {              
              paper: "teal",
              default:'hsl(235, 21%, 11%)'
            },
            text: {
              primary: "red",
            },
          }
        : {
            primary: {
              main: "hsl(220, 98%, 61%)",
            },
            background: {
              paper: "hsl(233, 11%, 84%)",
              default:'hsl(233, 11%, 84%)'
            },
            text: {
              primary: "#fafafa",              
            },
          }),
    },
  });
  return (
    <ThemeProvider theme={darktheme}>
      <ThemeContext.Provider value={values}>
        <CssBaseline />
        {/* <Paper> */}
          <Component {...pageProps} />
        {/* </Paper> */}
      </ThemeContext.Provider>
     </ThemeProvider>
  );
}
